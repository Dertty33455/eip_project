<?php

namespace App\Http\Controllers\Api;

use App\Models\AudioProgress;
use Illuminate\Http\Request;

class AudioProgressController extends CrudController
{
    protected string $modelClass = AudioProgress::class;

    protected array $rules = [
        'user_id' => 'required|exists:users,id',
        'audiobook_id' => 'required|exists:audiobooks,id',
        'chapter_id' => 'required|exists:audio_chapters,id',
        'position' => 'sometimes|numeric',
        'completed' => 'sometimes|boolean',
        'speed' => 'sometimes|numeric',
    ];

    protected function withRelations(): ?array
    {
        return ['user','audiobook','chapter'];
    }
}
