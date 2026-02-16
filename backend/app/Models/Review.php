<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
}
