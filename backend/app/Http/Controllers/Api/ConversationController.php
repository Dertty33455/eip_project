<?php

namespace App\Http\Controllers\Api;

use App\Models\Conversation;
use Illuminate\Http\Request;

class ConversationController extends CrudController
{
    protected string $modelClass = Conversation::class;

    protected array $rules = [
        'last_message' => 'sometimes|string',
        'last_activity' => 'sometimes|date',
    ];

    protected function withRelations(): ?array
    {
        return ['participants.user','messages'];
    }
}
