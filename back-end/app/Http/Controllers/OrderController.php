<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index($userId)
    {
        $orders = Order::with(['book', 'buyer', 'seller'])
            ->where(function($query) use ($userId) {
                $query->where('buyer_user_id', $userId)
                      ->orWhere('seller_user_id', $userId);
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $request->validate([
            'book_id' => 'required|exists:books,id',
            'buyer_user_id' => 'required|exists:users,id',
            'payment_method' => 'required|in:Mobile Money,Cash,Carte',
        ]);

        $book = Book::findOrFail($request->book_id);

        // Verify book availability
        if ($book->status !== 'Disponible') {
            return response()->json([
                'error' => 'Ce livre n\'est plus disponible.',
                'current_status' => $book->status
            ], 400);
        }

        // Verify user is not buying their own book
        if ($book->seller_id == $request->buyer_user_id) {
            return response()->json(['error' => 'Vous ne pouvez pas acheter votre propre livre.'], 400);
        }

        $order = Order::create([
            'book_id' => $request->book_id,
            'buyer_user_id' => $request->buyer_user_id,
            'seller_user_id' => $book->seller_id,
            'amount_xof' => $book->price_xof,
            'payment_method' => $request->payment_method,
            'status' => 'En cours',
        ]);

        $book->update(['status' => 'Réservé']);

        $order->load(['book', 'buyer', 'seller']);

        return response()->json($order, 201);
    }
}
