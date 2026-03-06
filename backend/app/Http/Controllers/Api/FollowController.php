<?php

namespace App\Http\Controllers\Api;

use App\Models\Follow;
use Illuminate\Http\Request;

class FollowController extends CrudController
{
    protected string $modelClass = Follow::class;

    protected array $rules = [
        'follower_id' => 'required|exists:users,id',
        'following_id' => 'required|exists:users,id',
    ];

    protected function withRelations(): ?array
    {
        return ['follower','following'];
    }

    /**
     * Override store to track follow activity.
     */
    public function store(Request $request)
    {
        $response = parent::store($request);

        if ($response->getStatusCode() === 201) {
            $data = $request->validate($this->rules);
            
            \App\Services\ActivityTracker::track(
                userId: (int) $data['follower_id'],
                action: 'user.followed',
                targetType: 'user',
                targetId: (int) $data['following_id'],
                request: $request
            );
        }

        return $response;
    }
}
