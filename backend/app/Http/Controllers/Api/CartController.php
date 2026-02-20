<?php

namespace App\Http\Controllers\Api;

use App\Models\Cart;
use Illuminate\Http\Request;

class CartController extends CrudController
{
    protected string $modelClass = Cart::class;

    protected array $rules = [
        'session_id' => 'sometimes|string',
        'user_id' => 'sometimes|exists:users,id',
    ];

    protected function withRelations(): ?array
    {
        return ['user','session','items'];
    }
}
