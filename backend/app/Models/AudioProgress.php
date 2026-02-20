<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function audiobook(): BelongsTo
    {
        return $this->belongsTo(Audiobook::class);
    }

    public function chapter(): BelongsTo
    {
        return $this->belongsTo(AudioChapter::class, 'chapter_id');
    }
}
