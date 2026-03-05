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

    protected $appends = [
        'isFree',
        'audioUrl',
        'order',
    ];

    /**
     * Get the is_free attribute.
     * The first chapter is always free.
     */
    public function getIsFreeAttribute($value): bool
    {
        $chapterNumber = $this->attributes['chapter_number'] ?? 0;
        $actualValue = $value ?? ($this->attributes['is_free'] ?? false);
        return ($chapterNumber <= 1) ?: (bool) $actualValue;
    }

    public function getAudioUrlAttribute(): ?string
    {
        return $this->attributes['audio_url'] ?? null;
    }

    public function getOrderAttribute(): int
    {
        return (int) ($this->attributes['chapter_number'] ?? 0);
    }

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
