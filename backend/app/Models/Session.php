<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Session extends Model
{
    protected $fillable = [
        'user_id',
        'token',
        'expires_at',
        'user_agent',
        'ip_address',
    ];
}
