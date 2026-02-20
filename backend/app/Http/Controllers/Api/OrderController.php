<?php

namespace App\Http\Controllers\Api;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends CrudController
{
    protected string $modelClass = Order::class;

    protected array $rules = [
        'order_number' => 'required|string|unique:orders,order_number',
        'buyer_id' => 'required|exists:users,id',
        'seller_id' => 'required|exists:users,id',
        'status' => 'sometimes|string',
        'subtotal' => 'sometimes|numeric',
        'commission' => 'sometimes|numeric',
        'seller_amount' => 'sometimes|numeric',
        'delivery_fee' => 'sometimes|numeric',
        'total_amount' => 'sometimes|numeric',
        'currency' => 'sometimes|string',
        'delivery_type' => 'sometimes|string',
        'delivery_address' => 'sometimes|string',
        'delivery_city' => 'sometimes|string',
        'delivery_country' => 'sometimes|string',
        'delivery_phone' => 'sometimes|string',
        'tracking_number' => 'sometimes|string',
        'notes' => 'sometimes|string',
        'paid_at' => 'sometimes|date',
        'shipped_at' => 'sometimes|date',
        'delivered_at' => 'sometimes|date',
        'cancelled_at' => 'sometimes|date',
    ];

    protected function withRelations(): ?array
    {
        return ['buyer','seller','items','invoice','transactions'];
    }
}
