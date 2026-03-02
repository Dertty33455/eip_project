<?php

namespace App\Http\Controllers\Api;

use App\Models\Conversation;
use App\Services\ActivityTracker;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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

    /**
     * Override store to track conversation started activity.
     */
    public function store(Request $request)
    {
        $response = parent::store($request);

        $user = Auth::user();
        if ($user && $response->getStatusCode() === 201) {
            $data = json_decode($response->getContent(), true);
            $conversationId = $data['id'] ?? null;

            ActivityTracker::track(
                userId: $user->id,
                action: 'conversation.started',
                targetType: 'conversation',
                targetId: $conversationId ? (int) $conversationId : null,
                request: $request
            );
        }

        return $response;
    }
}
