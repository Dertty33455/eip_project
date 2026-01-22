<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get existing users and books
        $alice = User::where('email', 'alice@example.com')->first();
        $bob = User::where('email', 'bob@example.com')->first();
        $testUser = User::where('email', 'test@example.com')->first();

        $gatsby = Book::where('title', 'The Great Gatsby')->first();
        $mockingbird = Book::where('title', 'To Kill a Mockingbird')->first();

        if (!$alice || !$bob || !$testUser || !$gatsby || !$mockingbird) {
            return; // Skip if required data doesn't exist
        }

        // Create completed order
        Order::create([
            'book_id' => $gatsby->id,
            'buyer_user_id' => $testUser->id,
            'seller_user_id' => $alice->id,
            'amount_xof' => $gatsby->price_xof,
            'payment_method' => 'Cash',
            'status' => 'Terminé',
            'created_at' => now()->subDays(5),
            'updated_at' => now()->subDays(3),
        ]);

        // Create pending order
        Order::create([
            'book_id' => $mockingbird->id,
            'buyer_user_id' => $testUser->id,
            'seller_user_id' => $bob->id,
            'amount_xof' => $mockingbird->price_xof,
            'payment_method' => 'Cash',
            'status' => 'En cours',
            'created_at' => now()->subHours(6),
            'updated_at' => now()->subHours(6),
        ]);

        // Create delivered order
        Order::create([
            'book_id' => $mockingbird->id, // Using same book for demo
            'buyer_user_id' => $bob->id,
            'seller_user_id' => $alice->id,
            'amount_xof' => 10000,
            'payment_method' => 'Mobile Money',
            'status' => 'Livré',
            'created_at' => now()->subDays(1),
            'updated_at' => now()->subHours(12),
        ]);
    }
}
