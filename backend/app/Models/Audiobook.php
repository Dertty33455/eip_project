<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Audiobook extends Model
{
    protected $fillable = [
        'title',
        'author',
        'narrator',
        'description',
        'cover_image',
        'total_duration',
        'language',
        'published_year',
        'is_popular',
        'is_featured',
        'status',
        'play_count',
        'category_id',
    ];

    /**
     * Append virtual attributes to JSON output.
     * `allRelated` will expose the merged related audiobooks.
     *
     * @var list<string>
     */
    protected $appends = [
        'allRelated',
    ];

    // app/Models/Audiobook.php

    public function category() : BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function chapters(): HasMany
    {
        return $this->hasMany(AudioChapter::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    public function progress(): HasMany
    {
        return $this->hasMany(AudioProgress::class);
    }

    /**
     * Self-referencing many-to-many for related audiobooks.
     * Use the pivot table `audiobook_relations` with columns
     * `audiobook_id` and `related_audiobook_id`.
     */
    public function relatedAudiobooks(): BelongsToMany
    {
        return $this->belongsToMany(self::class, 'audiobook_relations', 'audiobook_id', 'related_audiobook_id');
    }

    /**
     * Inverse relation (when this audiobook appears as related on another).
     */
    public function relatedBy(): BelongsToMany
    {
        return $this->belongsToMany(self::class, 'audiobook_relations', 'related_audiobook_id', 'audiobook_id');
    }

    /**
     * Get all related audiobooks regardless of relation direction.
     */
    public function getAllRelatedAttribute()
    {
        $direct = $this->relatedAudiobooks()->get();
        $inverse = $this->relatedBy()->get();
        $merged = $direct->merge($inverse)->unique('id')->values();
        return $merged;
    }

}
