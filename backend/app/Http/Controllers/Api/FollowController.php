<?php

namespace App\Http\Controllers\Api;

use App\Models\Follow;
use Illuminate\Http\Request;

class FollowController extends CrudController
{
    protected string $modelClass = Follow::class;

    protected array $rules = [
        'follower_id' => 'required|exists:users,id',
        'following_id' => 'required|exists:users,id',
    ];

    protected function withRelations(): ?array
    {
        return ['follower','following'];
    }
}
