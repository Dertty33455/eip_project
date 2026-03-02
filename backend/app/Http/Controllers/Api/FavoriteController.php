<?php

namespace App\Http\Controllers\Api;

use App\Models\Favorite;
use App\Services\ActivityTracker;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends CrudController
{
    protected string $modelClass = Favorite::class;

    protected array $rules = [
        'user_id' => 'required|exists:users,id',
        'type' => 'sometimes|string',
        'book_id' => 'sometimes|exists:books,id',
        'audiobook_id' => 'sometimes|exists:audiobooks,id',
    ];

    protected function withRelations(): ?array
    {
        return ['user','book','audiobook'];
    }

    /**
     * Override store to track book/audiobook favorited activity.
     */
    public function store(Request $request)
    {
        $response = parent::store($request);

        $user = Auth::user();
        if ($user && $response->getStatusCode() === 201) {
            // Determine target type and ID
            $bookId = $request->input('book_id');
            $audiobookId = $request->input('audiobook_id');

            if ($bookId) {
                $targetType = 'book';
                $targetId = (int) $bookId;
            } elseif ($audiobookId) {
                $targetType = 'audiobook';
                $targetId = (int) $audiobookId;
            } else {
                $targetType = $request->input('type', 'unknown');
                $targetId = null;
            }

            ActivityTracker::track(
                userId: $user->id,
                action: 'book.favorited',
                targetType: $targetType,
                targetId: $targetId,
                request: $request
            );
        }

        return $response;
    }
}
