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

    protected static function booted()
    {
        static::created(function ($order) {
            // Notify seller
            $order->seller->notifications()->create([
                'user_id' => $order->seller_id,
                'type' => 'NEW_ORDER',
                'title' => 'Nouvelle commande',
                'message' => 'Vous avez reçu une nouvelle commande #' . $order->order_number,
                'link' => '/orders/' . $order->id,
                'metadata' => json_encode(['order_id' => $order->id]),
            ]);
        });

        static::updated(function ($order) {
            if ($order->isDirty('status')) {
                // Notify buyer of status change
                $order->buyer->notifications()->create([
                    'user_id' => $order->buyer_id,
                    'type' => 'ORDER_STATUS_UPDATE',
                    'title' => 'Mise à jour de votre commande',
                    'message' => 'Le statut de votre commande #' . $order->order_number . ' est maintenant : ' . $order->status,
                    'link' => '/orders/' . $order->id,
                    'metadata' => json_encode(['order_id' => $order->id, 'status' => $order->status]),
                ]);
            }
        });
    }
}
