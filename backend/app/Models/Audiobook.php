<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
}
