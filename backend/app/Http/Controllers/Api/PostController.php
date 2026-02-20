<?php

namespace App\Http\Controllers\Api;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends CrudController
{
    protected string $modelClass = Post::class;

    protected array $rules = [
        'author_id' => 'required|exists:users,id',
        'type' => 'required|string',
        'content' => 'required|string',
        'images' => 'sometimes|array',
        'book_title' => 'sometimes|string',
        'book_author' => 'sometimes|string',
        'rating' => 'sometimes|numeric|min:0|max:5',
        'is_published' => 'sometimes|boolean',
        'is_reported' => 'sometimes|boolean',
        'view_count' => 'sometimes|integer',
    ];

    protected function withRelations(): ?array
    {
        return ['author', 'comments', 'likes', 'shares', 'reports'];
    }
}
