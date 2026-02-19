<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Book extends Model
{
    protected $fillable = [
        'title',
        'author',
        'isbn',
        'description',
        'price',
        'original_price',
        'condition',
        'status',
        'quantity',
        'location',
        'city',
        'country',
        'images',
        'cover_image',
        'rating',
        'review_count',
        'language',
        'published_year',
        'pages',
        'weight',
        'view_count',
        'seller_id',
        'category_id',
    ];

    /**
     * The attributes that should be appended to arrays.
     *
     * @var list<string>
     */
    protected $appends = [
        'coverImage',
        'reviewCount',
        'publicationYear',
        'pageCount',
        'originalPrice',
        'stock',
    ];

    /**
     * Get the category that owns the book.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the seller (user) that owns the book.
     */
    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    /**
     * Get the reviews for the book.
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Get the book's cover image in camelCase format.
     */
    public function getCoverImageAttribute()
    {
        return $this->attributes['cover_image'] ?? null;
    }

    /**
     * Get the book's review count in camelCase format.
     */
    public function getReviewCountAttribute()
    {
        return $this->attributes['review_count'] ?? 0;
    }

    /**
     * Get the book's publication year in camelCase format.
     */
    public function getPublicationYearAttribute()
    {
        return $this->attributes['published_year'] ?? null;
    }

    /**
     * Get the book's page count in camelCase format.
     */
    public function getPageCountAttribute()
    {
        return $this->attributes['pages'] ?? null;
    }

    /**
     * Get the book's original price in camelCase format.
     */
    public function getOriginalPriceAttribute()
    {
        return $this->attributes['original_price'] ?? null;
    }

    /**
     * Get stock status (alias for quantity).
     */
    public function getStockAttribute()
    {
        return $this->attributes['quantity'] ?? 0;
    }
}

