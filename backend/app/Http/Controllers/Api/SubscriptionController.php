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
     * Store and initiate subscription payment.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'plan' => 'required|string|exists:subscription_pricings,plan',
            'provider' => 'required|string|in:MTN_MOMO,MOOV_MONEY,WALLET',
            'phoneNumber' => 'required_if:provider,MTN_MOMO,MOOV_MONEY|string',
        ]);

        $pricing = \App\Models\SubscriptionPricing::where('plan', $validated['plan'])->first();
        
        // Create pending subscription
        $subscription = Subscription::create([
            'user_id' => $user->id,
            'plan' => $pricing->plan,
            'status' => 'PENDING',
            'price' => $pricing->price,
            'currency' => $pricing->currency ?? 'XOF',
            'auto_renew' => true,
        ]);

        // Initiate payment
        $payments = app(\App\Services\PaymentService::class);
        $result = $payments->initiateSubscriptionPayment(
            $subscription, 
            $validated['provider'], 
            $validated['phoneNumber'] ?? null
        );

        if (!$result['success']) {
            $subscription->update(['status' => 'FAILED']);
            return response()->json([
                'error' => $result['error'] ?? 'Payment initiation failed',
                'subscription' => $subscription
            ], 400);
        }

        ActivityTracker::track(
            userId: $user->id,
            action: 'subscription.initiated',
            targetType: 'subscription',
            targetId: $subscription->id,
            metadata: [
                'plan' => $subscription->plan,
                'provider' => $validated['provider'],
                'amount' => $subscription->price,
            ],
            request: $request
        );

        return response()->json([
            'message' => 'Subscription initiated',
            'subscription' => $subscription->load(['pricing', 'transactions']),
            'payment' => $result
        ], 201);
    }
}
