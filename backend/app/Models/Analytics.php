<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Analytics extends Model
{
    protected $fillable = [
        'date',
        'metric',
        'value',
        'metadata',
    ];
}
