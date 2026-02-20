<?php

namespace App\Http\Controllers\Api;

use App\Models\Report;
use Illuminate\Http\Request;

class ReportController extends CrudController
{
    protected string $modelClass = Report::class;

    protected array $rules = [
        'reporter_id' => 'required|exists:users,id',
        'target_id' => 'sometimes|exists:users,id',
        'post_id' => 'sometimes|exists:posts,id',
        'comment_id' => 'sometimes|exists:comments,id',
        'reason' => 'required|string',
        'description' => 'sometimes|string',
        'status' => 'sometimes|string',
        'resolved_by' => 'sometimes|exists:users,id',
        'resolved_at' => 'sometimes|date',
    ];

    protected function withRelations(): ?array
    {
        return ['reporter','target','post','comment','resolver'];
    }
}
