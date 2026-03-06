<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Follow extends Model
{
    protected $fillable = [
        'follower_id',
        'following_id',
    ];

    public function follower(): BelongsTo
    {
        return $this->belongsTo(User::class, 'follower_id');
    }

    public function following(): BelongsTo
    {
        return $this->belongsTo(User::class, 'following_id');
    }

    protected static function booted()
    {
        static::created(function ($follow) {
            $follow->following->notifications()->create([
                'user_id' => $follow->following_id,
                'type' => 'NEW_FOLLOWER',
                'title' => 'Nouveau follower',
                'message' => $follow->follower->username . ' a commencé à vous suivre.',
                'link' => '/profile/' . $follow->follower->username,
                'metadata' => json_encode(['follower_id' => $follow->follower_id]),
            ]);
        });
    }
}
