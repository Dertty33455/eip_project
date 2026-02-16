<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AudioChapter extends Model
{
    protected $fillable = [
        'audiobook_id',
        'title',
        'chapter_number',
        'duration',
        'audio_url',
        'is_free',
    ];
}
