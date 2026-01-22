<?php

namespace App\Models;

use App\Models\Book;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = [
        'book_id',
        'seller_user_id',
        'reviewer_user_id',
        'rating',
        'comment',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];
    }

    public function book()
    {
        return $this->belongsTo(Book::class);
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_user_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_user_id');
    }
}
