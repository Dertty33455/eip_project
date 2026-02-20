<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    /**
     * The audiobook that this chapter belongs to.
     */
    public function audiobook(): BelongsTo
    {
        return $this->belongsTo(Audiobook::class);
    }

    /**
     * Progress entries for this chapter.
     */
    public function progress(): HasMany
    {
        return $this->hasMany(AudioProgress::class, 'chapter_id');
    }
}
