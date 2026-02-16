<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'order_number',
        'buyer_id',
        'seller_id',
        'status',
        'subtotal',
        'commission',
        'seller_amount',
        'delivery_fee',
        'total_amount',
        'currency',
        'delivery_type',
        'delivery_address',
        'delivery_city',
        'delivery_country',
        'delivery_phone',
        'tracking_number',
        'notes',
        'paid_at',
        'shipped_at',
        'delivered_at',
        'cancelled_at',
    ];
}
