<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $query = Book::with('category', 'seller');

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
        
        $books = $query->paginate($limit);
        return response()->json($books);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string',
            'author' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'condition' => 'required|string|in:NEW,LIKE_NEW,GOOD,FAIR,POOR',
            'category_id' => 'required|exists:categories,id',
            'seller_id' => 'required|exists:users,id',
            'isbn' => 'sometimes|string|unique:books,isbn',
            'original_price' => 'sometimes|numeric',
            'quantity' => 'sometimes|integer|min:1',
            'location' => 'sometimes|string',
            'city' => 'sometimes|string',
            'country' => 'sometimes|string',
            'images' => 'sometimes|json',
            'cover_image' => 'sometimes|url',
            'language' => 'sometimes|string',
            'published_year' => 'sometimes|integer',
            'pages' => 'sometimes|integer',
            'weight' => 'sometimes|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $book = Book::create($validator->validated());
        return response()->json($book, 201);
    }

    public function show(string $id)
    {
        $book = Book::with(['category', 'seller', 'reviews.user'])->find($id);
        if (!$book) {
            return response()->json(['error' => 'Book not found'], 404);
        }
        return response()->json($book);
    }

    public function update(Request $request, string $id)
    {
        $book = Book::find($id);
        if (!$book) {
            return response()->json(['error' => 'Book not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string',
            'author' => 'sometimes|string',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric',
            'condition' => 'sometimes|string|in:NEW,LIKE_NEW,GOOD,FAIR,POOR',
            'isbn' => 'sometimes|string|unique:books,isbn,' . $id,
            'original_price' => 'sometimes|numeric',
            'quantity' => 'sometimes|integer|min:1',
            'status' => 'sometimes|string',
            'location' => 'sometimes|string',
            'city' => 'sometimes|string',
            'country' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $book->update($validator->validated());
        return response()->json($book);
    }

    public function destroy(string $id)
    {
        $book = Book::find($id);
        if (!$book) {
            return response()->json(['error' => 'Book not found'], 404);
        }

        $book->delete();
        return response()->json(['message' => 'Book deleted successfully']);
    }
}

