<?php

namespace App\Http\Controllers\Api;

use App\Models\CartItem;
use Illuminate\Http\Request;

class CartItemController extends CrudController
{
    protected string $modelClass = CartItem::class;

    protected array $rules = [
        'cart_id' => 'required|exists:carts,id',
        'book_id' => 'required|exists:books,id',
        'quantity' => 'required|integer|min:1',
    ];

    protected function withRelations(): ?array
    {
        return ['cart','book'];
    }
}
