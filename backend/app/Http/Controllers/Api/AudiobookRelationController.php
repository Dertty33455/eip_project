<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Audiobook;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AudiobookRelationController extends Controller
{
    /**
     * Attach a related audiobook to an audiobook.
     * POST /audiobooks/{id}/related
     */
    public function store(Request $request, $id)
    {
        $audiobook = Audiobook::find($id);
        if (! $audiobook) {
            return response()->json(['error' => 'Audiobook not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'related_id' => 'required|integer|exists:audiobooks,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $relatedId = (int) $request->input('related_id');
        if ($relatedId === (int) $audiobook->id) {
            return response()->json(['error' => 'Cannot relate audiobook to itself'], 422);
        }

        // prevent duplicate
        $exists = $audiobook->relatedAudiobooks()->wherePivot('related_audiobook_id', $relatedId)->exists();
        if ($exists) {
            return response()->json(['message' => 'Relation already exists'], 200);
        }

        $audiobook->relatedAudiobooks()->attach($relatedId);
        $audiobook->load('relatedAudiobooks','relatedBy');

        return response()->json(['message' => 'Related audiobook added', 'audiobook' => $audiobook], 201);
    }

    /**
     * Detach a related audiobook.
     * DELETE /audiobooks/{id}/related/{relatedId}
     */
    public function destroy($id, $relatedId)
    {
        $audiobook = Audiobook::find($id);
        if (! $audiobook) {
            return response()->json(['error' => 'Audiobook not found'], 404);
        }

        $exists = $audiobook->relatedAudiobooks()->wherePivot('related_audiobook_id', $relatedId)->exists();
        if (! $exists) {
            return response()->json(['message' => 'Relation not found'], 404);
        }

        $audiobook->relatedAudiobooks()->detach($relatedId);
        $audiobook->load('relatedAudiobooks','relatedBy');

        return response()->json(['message' => 'Relation removed', 'audiobook' => $audiobook]);
    }
}
