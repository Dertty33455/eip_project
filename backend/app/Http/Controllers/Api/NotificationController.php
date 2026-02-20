<?php

namespace App\Http\Controllers\Api;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends CrudController
{
    protected string $modelClass = Notification::class;

    protected array $rules = [
        'user_id' => 'required|exists:users,id',
        'type' => 'required|string',
        'title' => 'required|string',
        'message' => 'required|string',
        'link' => 'sometimes|url',
        'is_read' => 'sometimes|boolean',
        'metadata' => 'sometimes|json',
    ];

    protected function withRelations(): ?array
    {
        return ['user'];
    }
}
