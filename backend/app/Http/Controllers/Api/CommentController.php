<?php

namespace App\Http\Controllers\Api;

use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends CrudController
{
    protected string $modelClass = Comment::class;

    protected array $rules = [
        'post_id' => 'required|exists:posts,id',
        'author_id' => 'required|exists:users,id',
        'content' => 'required|string',
        'parent_id' => 'sometimes|exists:comments,id',
        'is_reported' => 'sometimes|boolean',
    ];

    protected function withRelations(): ?array
    {
        return ['author', 'replies'];
    }
}
