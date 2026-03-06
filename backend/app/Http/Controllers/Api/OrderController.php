<?php

namespace App\Http\Controllers\Api;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends CrudController
{
    protected string $modelClass = Order::class;

    protected array $rules = [
        'order_number' => 'required|string|unique:orders,order_number',
        'buyer_id' => 'required|exists:users,id',
        'seller_id' => 'required|exists:users,id',
        'status' => 'sometimes|string',
        'subtotal' => 'sometimes|numeric',
        'commission' => 'sometimes|numeric',
        'seller_amount' => 'sometimes|numeric',
        'delivery_fee' => 'sometimes|numeric',
        'total_amount' => 'sometimes|numeric',
        'currency' => 'sometimes|string',
        'delivery_type' => 'sometimes|string',
        'delivery_address' => 'sometimes|string',
        'delivery_city' => 'sometimes|string',
        'delivery_country' => 'sometimes|string',
        'delivery_phone' => 'sometimes|string',
        'tracking_number' => 'sometimes|string',
        'notes' => 'sometimes|string',
        'paid_at' => 'sometimes|date',
        'shipped_at' => 'sometimes|date',
        'delivered_at' => 'sometimes|date',
        'cancelled_at' => 'sometimes|date',
    ];

    public function checkout(Request $request)
    {
        $user = $request->user();
        $cart = \App\Models\Cart::where('user_id', $user->id)->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['message' => 'Le panier est vide.'], 400);
        }

        $request->validate([
            'delivery_address' => 'required|string',
            'delivery_city' => 'required|string',
            'delivery_phone' => 'required|string',
            'payment_method' => 'required|in:MTN_MOMO,MOOV_MONEY,WALLET',
        ]);

        $itemsBySeller = $cart->items->groupBy(function ($item) {
            return $item->book->seller_id;
        });

        $orders = [];
        $totalToPay = 0;

        foreach ($itemsBySeller as $sellerId => $items) {
            $subtotal = $items->sum(function ($item) {
                return $item->book->price * $item->quantity;
            });

            // Basic calculation for the demo
            $commission = $subtotal * 0.10;
            $totalAmount = $subtotal + ($subtotal * 0.05); // including fees

            $order = Order::create([
                'order_number' => 'ORD-' . strtoupper(uniqid()),
                'buyer_id' => $user->id,
                'seller_id' => $sellerId,
                'status' => 'PENDING',
                'subtotal' => $subtotal,
                'commission' => $commission,
                'seller_amount' => $subtotal - $commission,
                'total_amount' => $totalAmount,
                'currency' => 'XOF',
                'delivery_address' => $request->delivery_address,
                'delivery_city' => $request->delivery_city,
                'delivery_country' => $request->delivery_country ?? 'Sénégal',
                'delivery_phone' => $request->delivery_phone,
            ]);

            foreach ($items as $item) {
                $order->items()->create([
                    'book_id' => $item->book_id,
                    'quantity' => $item->quantity,
                    'price' => $item->book->price,
                    'total_price' => $item->book->price * $item->quantity,
                ]);
            }

            $orders[] = $order;
            $totalToPay += $totalAmount;
        }

        if ($request->payment_method === 'WALLET') {
            $wallet = $user->wallet;
            if (!$wallet || $wallet->balance < $totalToPay) {
                return response()->json(['message' => 'Solde insuffisant dans le portefeuille.'], 400);
            }

            $wallet->balance -= $totalToPay;
            $wallet->save();

            foreach ($orders as $order) {
                $order->update(['status' => 'CONFIRMED', 'paid_at' => now()]);
                
                \App\Models\Transaction::create([
                    'wallet_id' => $wallet->id,
                    'type' => 'DEBIT',
                    'status' => 'COMPLETED',
                    'amount' => $order->total_amount,
                    'fee' => 0,
                    'net_amount' => $order->total_amount,
                    'currency' => 'XOF',
                    'provider' => 'WALLET',
                    'provider_ref' => $order->order_number,
                    'description' => "Paiement commande {$order->order_number}",
                    'order_id' => $order->id,
                ]);
            }
        }

        $cart->items()->delete();

        return response()->json([
            'message' => 'Commande(s) créée(s) avec succès.',
            'orders' => $orders
        ]);
    }

    protected function withRelations(): ?array
    {
        return ['buyer','seller','items','invoice','transactions'];
    }
}
