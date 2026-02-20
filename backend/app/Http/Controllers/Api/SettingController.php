<?php

namespace App\Http\Controllers\Api;

use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends CrudController
{
    protected string $modelClass = Setting::class;

    protected array $rules = [
        'key' => 'required|string|unique:settings,key',
        'value' => 'required',
        'type' => 'sometimes|string',
    ];
}
