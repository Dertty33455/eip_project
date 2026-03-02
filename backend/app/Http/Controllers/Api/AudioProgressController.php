<?php

namespace App\Http\Controllers\Api;

use App\Models\AudioProgress;
use App\Services\ActivityTracker;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AudioProgressController extends CrudController
{
    protected string $modelClass = AudioProgress::class;

    protected array $rules = [
        'user_id' => 'required|exists:users,id',
        'audiobook_id' => 'required|exists:audiobooks,id',
        'chapter_id' => 'required|exists:audio_chapters,id',
        'position' => 'sometimes|numeric',
        'completed' => 'sometimes|boolean',
        'speed' => 'sometimes|numeric',
    ];

    protected function withRelations(): ?array
    {
        return ['user','audiobook','chapter'];
    }

    /**
     * Override store to track audio play activity.
     */
    public function store(Request $request)
    {
        $response = parent::store($request);

        // Track audio played activity
        $user = Auth::user();
        if ($user && $response->getStatusCode() === 201) {
            $data = $request->validated() ?? $request->all();

            ActivityTracker::track(
                userId: $user->id,
                action: 'audio.played',
                targetType: 'audiobook',
                targetId: (int) ($data['audiobook_id'] ?? null),
                metadata: ['chapter_id' => $data['chapter_id'] ?? null],
                request: $request
            );
        }

        return $response;
    }
}
