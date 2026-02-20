<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Audiobook;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AudiobookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Audiobook::with('category', 'chapters')->query();

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('author', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($category = $request->query('category_id')) {
            $query->where('category_id', $category);
        }

        $limit = (int) $request->query('limit', 12);
        $limit = max(1, min($limit, 100)); // Between 1 and 100

        // include counts for reviews and favorites
        $audiobooks = $query->withCount('reviews', 'favorites')->paginate($limit);
        return response()->json($audiobooks);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string',
            'author' => 'required|string',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'narrator' => 'sometimes|string',
            'cover_image' => 'sometimes|url',
            'language' => 'sometimes|string',
            'published_year' => 'sometimes|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $audiobook = Audiobook::create($validator->validated());
        return response()->json($audiobook, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $audiobook = Audiobook::with([
            'category',
            'chapters',
            'reviews.user',
            'favorites',
            'progress.user',
            'relatedAudiobooks',
        ])->withCount('reviews', 'favorites')->findOrFail($id);
        if (!$audiobook) {
            return response()->json(['error' => 'Audiobook not found'], 404);
        }
        return response()->json($audiobook);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $audiobook = Audiobook::find($id);
        if (!$audiobook) {
            return response()->json(['error' => 'Audiobook not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string',
            'author' => 'sometimes|string',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric',
            'narrator' => 'sometimes|string',
            'duration' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $audiobook->update($validator->validated());
        return response()->json($audiobook);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $audiobook = Audiobook::find($id);
        if (!$audiobook) {
            return response()->json(['error' => 'Audiobook not found'], 404);
        }

        $audiobook->delete();
        return response()->json(['message' => 'Audiobook deleted successfully']);
    }
}
