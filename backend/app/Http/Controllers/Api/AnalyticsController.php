<?php

namespace App\Http\Controllers\Api;

use App\Models\Analytics;
use Illuminate\Http\Request;

class AnalyticsController extends CrudController
{
    protected string $modelClass = Analytics::class;

    protected array $rules = [
        'date' => 'required|date',
        'metric' => 'required|string',
        'value' => 'required|numeric',
        'metadata' => 'sometimes|json',
    ];
}
