<?php

namespace App\Http\Controllers\Api;

use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends CrudController
{
    protected string $modelClass = Message::class;

    protected array $rules = [
        'conversation_id' => 'required|exists:conversations,id',
        'sender_id' => 'required|exists:users,id',
        'receiver_id' => 'sometimes|exists:users,id',
        'content' => 'sometimes|string',
        'images' => 'sometimes|array',
        'is_read' => 'sometimes|boolean',
    ];

    protected function withRelations(): ?array
    {
        return ['conversation','sender','receiver'];
    }
}
