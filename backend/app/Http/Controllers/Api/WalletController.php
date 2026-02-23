<?php

namespace App\Http\Controllers\Api;

use App\Models\Wallet;
use App\Services\PaymentService;
use Illuminate\Http\Request;

class WalletController extends CrudController
{
    protected string $modelClass = Wallet::class;

    protected array $rules = [
        'user_id' => 'required|exists:users,id',
        'balance' => 'required|numeric',
        'currency' => 'required|string',
        'is_active' => 'sometimes|boolean',
    ];

    protected function withRelations(): ?array
    {
        return ['user','transactions'];
    }

    // deposit endpoint for wallet
    public function deposit(Request $request, PaymentService $payments)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'provider' => 'required|in:MTN_MOMO,MOOV_MONEY',
            'phoneNumber' => 'required|string',
        ]);

        $user = $request->user();
        $wallet = $user->wallet()->firstOrCreate([
            'currency' => 'XOF',
        ], [
            'balance' => 0,
        ]);

        $result = $payments->createDeposit($wallet, $request->amount, $request->provider, $request->phoneNumber);

        if (! $result['success']) {
            return response()->json(['error' => $result['error']], 500);
        }

        return response()->json(['transactionId' => $result['transaction']->id]);
    }

    public function withdraw(Request $request, PaymentService $payments)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'provider' => 'required|in:MTN_MOMO,MOOV_MONEY',
            'phoneNumber' => 'required|string',
        ]);

        $user = $request->user();
        $wallet = $user->wallet;
        if (! $wallet) {
            return response()->json(['error' => 'Portefeuille introuvable'], 400);
        }

        $result = $payments->createWithdrawal($wallet, $request->amount, $request->provider, $request->phoneNumber);
        if (! $result['success']) {
            return response()->json(['error' => $result['error']], 500);
        }

        return response()->json(['transactionId' => $result['transaction']->id]);
    }
}
