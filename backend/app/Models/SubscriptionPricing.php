<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SubscriptionPricing extends Model
{
    protected $fillable = [
        'plan',
        'price',
        'currency',
        'duration',
        'is_active',
    ];

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class, 'plan', 'plan');
    }
}
