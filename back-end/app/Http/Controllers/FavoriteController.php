<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function getFavorites($userId)
    {
        $user = User::findOrFail($userId);
        $favorites = $user->favoriteBooks()->pluck('books.id');
        return response()->json($favorites);
    }

    public function toggleFavorite(Request $request, $userId, $bookId)
    {
        $user = User::findOrFail($userId);
        $book = Book::findOrFail($bookId);

        $favorites = $user->favoriteBooks();

        if ($favorites->where('book_id', $bookId)->exists()) {
            $favorites->detach($bookId);
            $book->decrement('favorites_count');
        } else {
            $favorites->attach($bookId);
            $book->increment('favorites_count');
        }

        $updatedFavorites = $user->favoriteBooks()->pluck('books.id');
        return response()->json($updatedFavorites);
    }
}
