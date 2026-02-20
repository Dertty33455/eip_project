<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

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

    public function buyer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function invoice(): HasOne
    {
        return $this->hasOne(Invoice::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}
