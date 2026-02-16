<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'wallet_id',
        'type',
        'status',
        'amount',
        'fee',
        'net_amount',
        'currency',
        'provider',
        'provider_ref',
        'description',
        'metadata',
        'order_id',
        'subscription_id',
    ];
}
