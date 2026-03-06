<?php

namespace App\Http\Controllers\Api;

use App\Models\CartItem;
use App\Models\Cart;
use Illuminate\Http\Request;

class CartItemController extends CrudController
{
    protected string $modelClass = CartItem::class;

    public function getCart(Request $request)
    {
        $user = $request->user();
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);
        $cart->load('items.book');
        return response()->json($cart);
    }

    public function addToCart(Request $request)
    {
        $user = $request->user();
        $bookId = $request->input('book_id') ?? $request->input('bookId');
        $quantity = $request->input('quantity', 1);

        if (!$bookId) {
            return response()->json(['message' => 'L\'ID du livre est requis.'], 422);
        }

        $cart = Cart::firstOrCreate(['user_id' => $user->id]);

        $cartItem = $cart->items()->where('book_id', $bookId)->first();

        if ($cartItem) {
            $cartItem->quantity += $quantity;
            $cartItem->save();
        } else {
            $cart->items()->create([
                'book_id' => $bookId,
                'quantity' => $quantity,
            ]);
        }

        return response()->json([
            'message' => 'Livre ajouté au panier avec succès.',
            'cart' => $cart->load('items.book')
        ]);
    }

    public function updateQuantity(Request $request, $id)
    {
        $user = $request->user();
        $quantity = $request->input('quantity');

        if ($quantity < 1) {
            return $this->removeItem($request, $id);
        }

        $cartItem = CartItem::whereHas('cart', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->findOrFail($id);

        $cartItem->update(['quantity' => $quantity]);

        return response()->json([
            'message' => 'Quantité mise à jour.',
            'cart' => $cartItem->cart->load('items.book')
        ]);
    }

    public function removeItem(Request $request, $id)
    {
        $user = $request->user();
        
        $cartItem = CartItem::whereHas('cart', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->findOrFail($id);

        $cart = $cartItem->cart;
        $cartItem->delete();

        return response()->json([
            'message' => 'Livre retiré du panier.',
            'cart' => $cart->load('items.book')
        ]);
    }

    protected function withRelations(): ?array
    {
        return ['cart','book'];
    }
}
