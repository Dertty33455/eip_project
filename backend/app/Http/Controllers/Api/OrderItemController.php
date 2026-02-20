<?php

namespace App\Http\Controllers\Api;

use App\Models\OrderItem;
use Illuminate\Http\Request;

class OrderItemController extends CrudController
{
    protected string $modelClass = OrderItem::class;

    protected array $rules = [
        'order_id' => 'required|exists:orders,id',
        'book_id' => 'required|exists:books,id',
        'quantity' => 'required|integer|min:1',
        'price' => 'sometimes|numeric',
        'total_price' => 'sometimes|numeric',
    ];

    protected function withRelations(): ?array
    {
        return ['order','book'];
    }
}
