<?php

namespace App\Http\Controllers\Api;

use App\Models\AudioChapter;
use Illuminate\Http\Request;

class AudioChapterController extends CrudController
{
    protected string $modelClass = AudioChapter::class;

    protected array $rules = [
        'audiobook_id' => 'required|exists:audiobooks,id',
        'title' => 'required|string',
        'chapter_number' => 'required|integer|min:1',
        'duration' => 'sometimes|string',
        'audio_url' => 'sometimes|url',
        'is_free' => 'sometimes|boolean',
    ];

    protected function withRelations(): ?array
    {
        return ['audiobook', 'progress'];
    }
}
