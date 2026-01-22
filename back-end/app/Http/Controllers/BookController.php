<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\User;
use Illuminate\Http\Request;

class BookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $books = Book::with('seller')->get()->map(function ($book) {
            $seller = $book->seller;
            return [
                'id' => $book->id,
                'title' => $book->title,
                'author' => $book->author,
                'category' => $book->category,
                'description' => $book->description,
                'priceXof' => $book->price_xof,
                'condition' => $book->condition,
                'status' => $book->status,
                'location' => $book->location,
                'photos' => $book->photos,
                'seller' => $seller ? [
                    'id' => $seller->id,
                    'displayName' => $seller->display_name,
                    'rating' => $seller->reviews()->avg('rating') ?? 0,
                    'reviewsCount' => $seller->reviews()->count(),
                    'location' => $seller->location,
                ] : null,
                'publishedAtISO' => $book->published_at ? $book->published_at->toISOString() : null,
                'views' => $book->views,
                'favoritesCount' => $book->favorites_count,
            ];
        });
        return response()->json($books);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'seller_user_id' => 'required|exists:users,id',
            'title' => 'required|string',
            'author' => 'required|string',
            'category' => 'required|string',
            'description' => 'required|string',
            'price_xof' => 'required|integer',
            'condition' => 'required|in:Neuf,Occasion',
            'location' => 'required|string',
            'photos' => 'required|array',
        ]);

        $seller = User::findOrFail($request->seller_user_id);

        $book = Book::create([
            'seller_id' => $request->seller_user_id,
            'title' => $request->title,
            'author' => $request->author,
            'category' => $request->category,
            'description' => $request->description,
            'price_xof' => $request->price_xof,
            'condition' => $request->condition,
            'status' => 'Disponible',
            'location' => $request->location,
            'photos' => $request->photos,
            'published_at' => now(),
        ]);

        return response()->json([
            'id' => $book->id,
            'title' => $book->title,
            'author' => $book->author,
            'category' => $book->category,
            'description' => $book->description,
            'priceXof' => $book->price_xof,
            'condition' => $book->condition,
            'status' => $book->status,
            'location' => $book->location,
            'photos' => $book->photos,
            'seller' => [
                'id' => $seller->id,
                'displayName' => $seller->display_name,
                'rating' => 4.5,
                'reviewsCount' => 0,
                'location' => $seller->location,
            ],
            'publishedAtISO' => $book->published_at->toISOString(),
            'views' => $book->views,
            'favoritesCount' => $book->favorites_count,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $book = Book::with('seller')->findOrFail($id);
        
        // Increment views counter
        $book->increment('views');
        
        $seller = $book->seller;

        return response()->json([
            'id' => $book->id,
            'title' => $book->title,
            'author' => $book->author,
            'category' => $book->category,
            'description' => $book->description,
            'priceXof' => $book->price_xof,
            'condition' => $book->condition,
            'status' => $book->status,
            'location' => $book->location,
            'photos' => $book->photos,
            'seller' => $seller ? [
                'id' => $seller->id,
                'displayName' => $seller->display_name,
                'rating' => $seller->reviews()->avg('rating') ?? 0,
                'reviewsCount' => $seller->reviews()->count(),
                'location' => $seller->location,
            ] : null,
            'publishedAtISO' => $book->published_at ? $book->published_at->toISOString() : null,
            'views' => $book->views,
            'favoritesCount' => $book->favorites_count,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $book = Book::findOrFail($id);

        // Authorization: Only the seller can update their book
        if ($book->seller_id != $request->user()->id) {
            return response()->json(['error' => 'Non autorisé. Vous ne pouvez modifier que vos propres livres.'], 403);
        }

        $request->validate([
            'title' => 'sometimes|string',
            'author' => 'sometimes|string',
            'category' => 'sometimes|string',
            'description' => 'sometimes|string',
            'price_xof' => 'sometimes|integer',
            'condition' => 'sometimes|in:Neuf,Occasion',
            'status' => 'sometimes|in:Disponible,Réservé,Vendu',
            'location' => 'sometimes|string',
            'photos' => 'sometimes|array',
        ]);

        $book->update($request->only(['title', 'author', 'category', 'description', 'price_xof', 'condition', 'status', 'location', 'photos']));

        $seller = $book->seller;

        return response()->json([
            'id' => $book->id,
            'title' => $book->title,
            'author' => $book->author,
            'category' => $book->category,
            'description' => $book->description,
            'priceXof' => $book->price_xof,
            'condition' => $book->condition,
            'status' => $book->status,
            'location' => $book->location,
            'photos' => $book->photos,
            'seller' => [
                'id' => $seller->id,
                'displayName' => $seller->display_name,
                'rating' => 4.5,
                'reviewsCount' => 0,
                'location' => $seller->location,
            ],
            'publishedAtISO' => $book->published_at->toISOString(),
            'views' => $book->views,
            'favoritesCount' => $book->favorites_count,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $book = Book::findOrFail($id);

        // Authorization: Only the seller can delete their book
        if ($book->seller_id != $request->user()->id) {
            return response()->json(['error' => 'Non autorisé. Vous ne pouvez supprimer que vos propres livres.'], 403);
        }

        $book->delete();
        return response()->json(['message' => 'Livre supprimé avec succès']);
    }
}
