<?php

namespace App\Http\Controllers\Api;

use App\Models\Like;
use Illuminate\Http\Request;

class LikeController extends CrudController
{
    protected string $modelClass = Like::class;

    protected array $rules = [
        'user_id' => 'required|exists:users,id',
        'post_id' => 'sometimes|exists:posts,id',
        'comment_id' => 'sometimes|exists:comments,id',
    ];

    protected function withRelations(): ?array
    {
        return ['user','post','comment'];
    }
}
