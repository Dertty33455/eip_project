<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Post extends Model
{
    protected $casts = [
        'images' => 'array',
    ];

    protected $fillable = [
        'author_id',
        'type',
        'content',
        'images',
        'book_title',
        'book_author',
        'rating',
        'is_published',
        'is_reported',
        'view_count',
    ];

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function likes(): HasMany
    {
        return $this->hasMany(Like::class);
    }

    public function shares(): HasMany
    {
        return $this->hasMany(Share::class);
    }

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }
}
