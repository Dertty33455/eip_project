<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
        'language',
        'published_year',
        'pages',
        'weight',
        'view_count',
        'seller_id',
        'category_id',
    ];
}
