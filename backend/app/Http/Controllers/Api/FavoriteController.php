<?php

namespace App\Http\Controllers\Api;

use App\Models\Favorite;
use Illuminate\Http\Request;

class FavoriteController extends CrudController
{
    protected string $modelClass = Favorite::class;

    protected array $rules = [
        'user_id' => 'required|exists:users,id',
        'type' => 'sometimes|string',
        'book_id' => 'sometimes|exists:books,id',
        'audiobook_id' => 'sometimes|exists:audiobooks,id',
    ];

    protected function withRelations(): ?array
    {
        return ['user','book','audiobook'];
    }
}
