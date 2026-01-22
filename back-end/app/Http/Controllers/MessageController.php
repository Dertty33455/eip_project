<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index($conversationId)
    {
        $messages = Message::where('conversation_id', $conversationId)
            ->with('sender')
            ->orderBy('created_at')
            ->get();

        return response()->json($messages);
    }

    public function store(Request $request)
    {
        $request->validate([
            'conversation_id' => 'required|exists:conversations,id',
            'sender_user_id' => 'required|exists:users,id',
            'text' => 'required|string',
        ]);

        $conversation = Conversation::findOrFail($request->conversation_id);

        $message = Message::create([
            'conversation_id' => $request->conversation_id,
            'sender_user_id' => $request->sender_user_id,
            'text' => $request->text,
        ]);

        $conversation->update(['last_message_at' => now()]);

        // Update unread count for the other user
        $otherUserId = $conversation->buyer_user_id == $request->sender_user_id
            ? $conversation->seller_user_id
            : $conversation->buyer_user_id;

        $unread = $conversation->unread_count_by_user_id;
        $unread[$otherUserId] = ($unread[$otherUserId] ?? 0) + 1;
        $conversation->update(['unread_count_by_user_id' => $unread]);

        $message->load('sender');

        return response()->json($message, 201);
    }
}
