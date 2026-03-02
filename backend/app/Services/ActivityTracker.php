<?php

namespace App\Services;

use App\Models\UserActivity;
use Illuminate\Http\Request;

class ActivityTracker
{
    /**
     * Record a user activity.
     *
     * @param int         $userId     The authenticated user ID.
     * @param string      $action     Action key, e.g. "post.liked", "audio.played".
     * @param string|null $targetType The type of the resource, e.g. "post", "book".
     * @param int|null    $targetId   The ID of the targeted resource.
     * @param array|null  $metadata   Additional context data.
     * @param Request|null $request   HTTP request (to capture IP address).
     * @return UserActivity
     */
    public static function track(
        int $userId,
        string $action,
        ?string $targetType = null,
        ?int $targetId = null,
        ?array $metadata = null,
        ?Request $request = null
    ): UserActivity {
        return UserActivity::create([
            'user_id'     => $userId,
            'action'      => $action,
            'target_type' => $targetType,
            'target_id'   => $targetId,
            'metadata'    => $metadata,
            'ip_address'  => $request?->ip(),
        ]);
    }
}
