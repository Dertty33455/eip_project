<?php

namespace App\Http\Controllers\Api;

use App\Models\SubscriptionPricing;
use Illuminate\Http\Request;

class SubscriptionPricingController extends CrudController
{
    protected string $modelClass = SubscriptionPricing::class;

    protected array $rules = [
        'plan' => 'required|string|unique:subscription_pricings,plan',
        'price' => 'required|numeric',
        'currency' => 'required|string',
        'duration' => 'required|integer',
        'is_active' => 'sometimes|boolean',
    ];

    protected function withRelations(): ?array
    {
        return ['subscriptions'];
    }
}
