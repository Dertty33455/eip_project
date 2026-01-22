<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    public function index($userId)
    {
        $conversations = Conversation::with(['book', 'buyer', 'seller'])
            ->where(function($query) use ($userId) {
                $query->where('buyer_user_id', $userId)
                      ->orWhere('seller_user_id', $userId);
            })
            ->orderBy('last_message_at', 'desc')
            ->get();

        return response()->json($conversations);
    }

    public function getOrCreate(Request $request)
    {
        $request->validate([
            'book_id' => 'required|exists:books,id',
            'buyer_user_id' => 'required|exists:users,id',
            'seller_user_id' => 'required|exists:users,id',
        ]);

        $conversation = Conversation::where('book_id', $request->book_id)
            ->where('buyer_user_id', $request->buyer_user_id)
            ->where('seller_user_id', $request->seller_user_id)
            ->first();

        if (!$conversation) {
            $conversation = Conversation::create([
                'book_id' => $request->book_id,
                'buyer_user_id' => $request->buyer_user_id,
                'seller_user_id' => $request->seller_user_id,
                'last_message_at' => now(),
                'unread_count_by_user_id' => [$request->buyer_user_id => 0, $request->seller_user_id => 0],
            ]);
        }

        $conversation->load(['book', 'buyer', 'seller']);

        return response()->json($conversation);
    }

    public function markRead(Request $request, $conversationId)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $conversation = Conversation::findOrFail($conversationId);
        $unread = $conversation->unread_count_by_user_id;
        $unread[$request->user_id] = 0;
        $conversation->update(['unread_count_by_user_id' => $unread]);

        return response()->json(['message' => 'Marked as read']);
    }
}
