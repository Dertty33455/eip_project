<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
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
}
