<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AudioProgress extends Model
{
    protected $fillable = [
        'user_id',
        'audiobook_id',
        'chapter_id',
        'position',
        'completed',
        'speed',
    ];
}
