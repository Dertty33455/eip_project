<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
}
