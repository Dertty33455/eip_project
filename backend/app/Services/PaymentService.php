<?php

namespace App\Services;

use App\Models\Transaction;
use App\Models\Wallet;
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

        return true;
    }
}
