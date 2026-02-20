<?php

namespace App\Http\Controllers\Api;

use App\Models\Wallet;
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
}
