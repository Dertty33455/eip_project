<?php

namespace App\Http\Controllers\Api;

use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends CrudController
{
    protected string $modelClass = Transaction::class;

    protected array $rules = [
        'wallet_id' => 'required|exists:wallets,id',
        'type' => 'required|string',
        'status' => 'sometimes|string',
        'amount' => 'required|numeric',
        'fee' => 'sometimes|numeric',
        'net_amount' => 'sometimes|numeric',
        'currency' => 'sometimes|string',
        'provider' => 'sometimes|string',
        'provider_ref' => 'sometimes|string',
        'description' => 'sometimes|string',
        'metadata' => 'sometimes|json',
        'order_id' => 'sometimes|exists:orders,id',
        'subscription_id' => 'sometimes|exists:subscriptions,id',
    ];

    protected function withRelations(): ?array
    {
        return ['wallet','order','subscription'];
    }
}
