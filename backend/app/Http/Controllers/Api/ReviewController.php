<?php

namespace App\Http\Controllers\Api;

use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends CrudController
{
    protected string $modelClass = Review::class;

    protected array $rules = [
        'author_id' => 'required|exists:users,id',
        'type' => 'required|string',
        'book_id' => 'sometimes|exists:books,id',
        'audiobook_id' => 'sometimes|exists:audiobooks,id',
        'seller_id' => 'sometimes|exists:users,id',
        'rating' => 'required|numeric|min:0|max:5',
        'title' => 'sometimes|string',
        'content' => 'sometimes|string',
        'is_verified' => 'sometimes|boolean',
    ];

    protected function withRelations(): ?array
    {
        return ['user','book','audiobook','seller'];
    }
}
