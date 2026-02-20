<?php

namespace App\Http\Controllers\Api;

use App\Models\ConversationParticipant;
use Illuminate\Http\Request;

class ConversationParticipantController extends CrudController
{
    protected string $modelClass = ConversationParticipant::class;

    protected array $rules = [
        'conversation_id' => 'required|exists:conversations,id',
        'user_id' => 'required|exists:users,id',
        'last_read_at' => 'sometimes|date',
    ];

    protected function withRelations(): ?array
    {
        return ['conversation','user'];
    }
}
