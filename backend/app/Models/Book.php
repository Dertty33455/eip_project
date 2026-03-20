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
        'audio_preview',
        'audio_duration',
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
        'audioPreview',
        'audioDuration',
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

    /**
     * Get the book's audio preview URL in camelCase format.
     */
    public function getAudioPreviewAttribute()
    {
        return $this->attributes['audio_preview'] ?? null;
    }

    /**
     * Get the book's audio duration in camelCase format.
     */
    public function getAudioDurationAttribute()
    {
        return $this->attributes['audio_duration'] ?? null;
    }

    /**
     * Items for orders that include this book.
     */
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Items in carts that contain this book.
     */
    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Favorites that reference this book.
     */
    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }
}

