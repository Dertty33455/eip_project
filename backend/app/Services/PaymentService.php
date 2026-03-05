<?php

namespace App\Services;

use App\Models\Transaction;
use App\Models\Wallet;
use App\Models\Subscription;
use Illuminate\Support\Facades\Log;

class PaymentService
{
    protected MtnMomoService $mtn;
    protected MoovMoneyService $moov;

    public function __construct(MtnMomoService $mtn, MoovMoneyService $moov)
    {
        $this->mtn = $mtn;
        $this->moov = $moov;
    }

    /**
     * Create a deposit transaction and initiate provider request.
     * Returns array with success, transaction and optional error.
     */
    public function createDeposit(Wallet $wallet, float $amount, string $provider, string $phone): array
    {
        $tx = Transaction::create([
            'wallet_id' => $wallet->id,
            'type' => 'DEPOSIT',
            'status' => 'PENDING',
            'amount' => $amount,
            'net_amount' => $amount,
            'currency' => 'XOF',
            'provider' => $provider,
        ]);

        if ($provider === 'MTN_MOMO') {
            $result = $this->mtn->requestToPay($amount, 'XOF', $phone, $tx->id);
        } else {
            $result = $this->moov->initiatePayment($amount, 'XOF', $phone, $tx->id);
        }

        if (! $result['success']) {
            $tx->update(['status' => 'FAILED']);
            return ['success' => false, 'error' => $result['error'] ?? 'Erreur', 'transaction' => $tx];
        }

        $tx->update(['provider_ref' => $result['referenceId']]);
        return ['success' => true, 'transaction' => $tx];
    }

    public function createWithdrawal(Wallet $wallet, float $amount, string $provider, string $phone): array
    {
        if ($wallet->balance < $amount) {
            return ['success' => false, 'error' => 'Solde insuffisant'];
        }

        $tx = Transaction::create([
            'wallet_id' => $wallet->id,
            'type' => 'WITHDRAWAL',
            'status' => 'PENDING',
            'amount' => $amount,
            'net_amount' => $amount,
            'currency' => 'XOF',
            'provider' => $provider,
        ]);

        // deduct immediately
        $wallet->decrement('balance', $amount);

        if ($provider === 'MTN_MOMO') {
            $result = $this->mtn->transfer($amount, 'XOF', $phone, $tx->id);
        } else {
            $result = $this->moov->transfer($amount, 'XOF', $phone, $tx->id);
        }

        if (! $result['success']) {
            // refund
            $wallet->increment('balance', $amount);
            $tx->update(['status' => 'FAILED']);
            return ['success' => false, 'error' => $result['error'] ?? 'Erreur', 'transaction' => $tx];
        }

        $tx->update(['provider_ref' => $result['referenceId']]);
        return ['success' => true, 'transaction' => $tx];
    }

    public function handleWebhook(string $provider, string $referenceId, string $status, array $data = []): bool
    {
        $tx = Transaction::where('provider_ref', $referenceId)->first();
        if (! $tx) {
            Log::error('Webhook transaction not found', ['ref' => $referenceId]);
            return false;
        }

        $mapping = [
            'SUCCESSFUL' => 'COMPLETED',
            'SUCCESS' => 'COMPLETED',
            'COMPLETED' => 'COMPLETED',
            'FAILED' => 'FAILED',
            'REJECTED' => 'FAILED',
            'CANCELLED' => 'CANCELLED',
        ];
        $newStatus = $mapping[$status] ?? $tx->status;

        $tx->status = $newStatus;
        $tx->metadata = json_encode($data);
        $tx->save();

        if ($tx->type === 'DEPOSIT' && $newStatus === 'COMPLETED') {
            $tx->wallet->increment('balance', $tx->net_amount);
        }

        if ($tx->type === 'WITHDRAWAL' && $newStatus === 'FAILED') {
            $tx->wallet->increment('balance', $tx->amount);
        }

        if ($newStatus === 'COMPLETED') {
            $this->onPaymentSuccess($tx);
        }

        return true;
    }

    /**
     * Initiate payment for a subscription.
     */
    public function initiateSubscriptionPayment(Subscription $subscription, string $provider, ?string $phone = null): array
    {
        $amount = $subscription->price;
        $wallet = $subscription->user->wallet;

        if (! $wallet) {
            $wallet = Wallet::create(['user_id' => $subscription->user_id, 'balance' => 0]);
        }

        $tx = Transaction::create([
            'wallet_id' => $wallet->id,
            'subscription_id' => $subscription->id,
            'type' => 'SUB_PAYMENT',
            'status' => 'PENDING',
            'amount' => $amount,
            'net_amount' => $amount,
            'currency' => $subscription->currency ?? 'XOF',
            'provider' => $provider,
        ]);

        if ($provider === 'WALLET') {
            if ($wallet->balance < $amount) {
                $tx->update(['status' => 'FAILED']);
                return ['success' => false, 'error' => 'Solde insuffisant'];
            }
            $wallet->decrement('balance', $amount);
            $tx->update(['status' => 'COMPLETED']);
            $this->activateSubscription($subscription);
            return ['success' => true, 'transaction' => $tx];
        }

        if ($provider === 'MTN_MOMO') {
            $result = $this->mtn->requestToPay($amount, 'XOF', $phone, $tx->id);
        } else {
            $result = $this->moov->initiatePayment($amount, 'XOF', $phone, $tx->id);
        }

        if (! $result['success']) {
            $tx->update(['status' => 'FAILED']);
            return ['success' => false, 'error' => $result['error'] ?? 'Erreur', 'transaction' => $tx];
        }

        $tx->update(['provider_ref' => $result['referenceId']]);
        return ['success' => true, 'transaction' => $tx, 'referenceId' => $result['referenceId']];
    }

    /**
     * Handle actions after a successful transaction.
     */
    protected function onPaymentSuccess(Transaction $tx): void
    {
        if ($tx->subscription_id && $tx->status === 'COMPLETED') {
            $this->activateSubscription($tx->subscription);
        }
    }

    /**
     * Activate a subscription.
     */
    public function activateSubscription(Subscription $subscription): void
    {
        $pricing = $subscription->pricing;
        $duration = $pricing ? $pricing->duration : 30; // default 30 days

        $subscription->update([
            'status' => 'ACTIVE',
            'start_date' => now(),
            'end_date' => now()->addDays($duration),
        ]);

        // deactivate other active subscriptions for this user
        Subscription::where('user_id', $subscription->user_id)
            ->where('id', '!=', $subscription->id)
            ->where('status', 'ACTIVE')
            ->update(['status' => 'EXPIRED']);
    }
}
