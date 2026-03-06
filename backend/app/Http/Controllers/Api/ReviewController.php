<?php

namespace App\Http\Controllers\Api;

use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends CrudController
{
    protected string $modelClass = Review::class;

    protected array $rules = [
        'author_id' => 'required|exists:users,id',
        'type' => 'required|string',
        'book_id' => 'sometimes|exists:books,id',
        'audiobook_id' => 'sometimes|exists:audiobooks,id',
        'seller_id' => 'sometimes|exists:users,id',
        'rating' => 'required|numeric|min:0|max:5',
        'title' => 'sometimes|string',
        'content' => 'sometimes|string',
        'is_verified' => 'sometimes|boolean',
    ];

    protected function withRelations(): ?array
    {
        return ['user','book','audiobook','seller'];
    }

    /**
     * Override store to track review activity.
     */
    public function store(Request $request)
    {
        $response = parent::store($request);

        if ($response->getStatusCode() === 201) {
            $data = $request->validate($this->rules);
            $action = ($data['type'] === 'AUDIOBOOK' || isset($data['audiobook_id'])) 
                ? 'audiobook.reviewed' 
                : 'book.reviewed';

            \App\Services\ActivityTracker::track(
                userId: (int) $data['author_id'],
                action: $action,
                targetType: isset($data['audiobook_id']) ? 'audiobook' : 'book',
                targetId: (int) ($data['audiobook_id'] ?? $data['book_id'] ?? null),
                metadata: ['rating' => $data['rating']],
                request: $request
            );
        }

        return $response;
    }
}
