<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subscription extends Model
{
    protected $fillable = [
        'user_id',
        'plan',
        'status',
        'price',
        'currency',
        'start_date',
        'end_date',
        'cancelled_at',
        'auto_renew',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function pricing(): BelongsTo
    {
        return $this->belongsTo(SubscriptionPricing::class, 'plan', 'plan');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}
