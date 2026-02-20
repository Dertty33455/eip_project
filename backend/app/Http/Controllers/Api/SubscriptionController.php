<?php

namespace App\Http\Controllers\Api;

use App\Models\Subscription;
use Illuminate\Http\Request;

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
}
