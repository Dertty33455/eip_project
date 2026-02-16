<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = [
        'post_id',
        'author_id',
        'content',
        'parent_id',
        'is_reported',
    ];
}
