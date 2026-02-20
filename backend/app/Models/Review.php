<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    protected $fillable = [
        'author_id',
        'type',
        'book_id',
        'audiobook_id',
        'seller_id',
        'rating',
        'title',
        'content',
        'is_verified',
    ];

    /**
     * The attributes that should be appended to arrays.
     *
     * @var list<string>
     */
    protected $appends = [
        'comment',
    ];

    /**
     * Get the user who wrote this review.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }

    public function audiobook(): BelongsTo
    {
        return $this->belongsTo(Audiobook::class);
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    /**
     * Get the review comment in camelCase format (alias for content).
     */
    public function getCommentAttribute()
    {
        return $this->attributes['content'] ?? null;
    }
}
