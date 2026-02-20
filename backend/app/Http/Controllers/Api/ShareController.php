<?php

namespace App\Http\Controllers\Api;

use App\Models\Share;
use Illuminate\Http\Request;

class ShareController extends CrudController
{
    protected string $modelClass = Share::class;

    protected array $rules = [
        'user_id' => 'required|exists:users,id',
        'post_id' => 'required|exists:posts,id',
        'platform' => 'sometimes|string',
    ];

    protected function withRelations(): ?array
    {
        return ['user','post'];
    }
}
