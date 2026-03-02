<?php

namespace App\Http\Controllers\Api;

use App\Models\Subscription;
use App\Services\ActivityTracker;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SubscriptionController extends CrudController
{
    protected string $modelClass = Subscription::class;

    protected array $rules = [
        'user_id' => 'required|exists:users,id',
        'plan' => 'required|string',
        'status' => 'sometimes|string',
        'price' => 'sometimes|numeric',
        'currency' => 'sometimes|string',
        'start_date' => 'sometimes|date',
        'end_date' => 'sometimes|date',
        'cancelled_at' => 'sometimes|date',
        'auto_renew' => 'sometimes|boolean',
    ];

    protected function withRelations(): ?array
    {
        return ['user','pricing','transactions'];
    }

    /**
     * Override store to track subscription creation.
     */
    public function store(Request $request)
    {
        $response = parent::store($request);

        $user = Auth::user();
        if ($user && $response->getStatusCode() === 201) {
            $data = json_decode($response->getContent(), true);
            $subscriptionId = $data['id'] ?? null;

            ActivityTracker::track(
                userId: $user->id,
                action: 'subscription.created',
                targetType: 'subscription',
                targetId: $subscriptionId ? (int) $subscriptionId : null,
                metadata: [
                    'plan' => $request->input('plan'),
                    'price' => $request->input('price'),
                    'currency' => $request->input('currency'),
                ],
                request: $request
            );
        }

        return $response;
    }
}
