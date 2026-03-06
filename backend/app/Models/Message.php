<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    protected $fillable = [
        'conversation_id',
        'sender_id',
        'receiver_id',
        'content',
        'images',
        'is_read',
    ];

    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    protected static function booted()
    {
        static::created(function ($message) {
            $message->receiver->notifications()->create([
                'user_id' => $message->receiver_id,
                'type' => 'NEW_MESSAGE',
                'title' => 'Nouveau message',
                'message' => $message->sender->username . ' vous a envoyé un message.',
                'link' => '/messages/' . $message->conversation_id,
                'metadata' => json_encode(['conversation_id' => $message->conversation_id, 'sender_id' => $message->sender_id]),
            ]);
        });
    }
}
