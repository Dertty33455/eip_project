<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubscriptionPricing extends Model
{
    protected $fillable = [
        'plan',
        'price',
        'currency',
        'duration',
        'is_active',
    ];
}
