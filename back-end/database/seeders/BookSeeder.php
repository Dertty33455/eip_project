<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create some demo users if not exist
        $user1 = User::firstOrCreate(
            ['email' => 'alice@example.com'],
            [
                'name' => 'Alice',
                'display_name' => 'Alice Johnson',
                'password' => bcrypt('password'),
                'joined_at' => now()->subDays(30),
            ]
        );

        $user2 = User::firstOrCreate(
            ['email' => 'bob@example.com'],
            [
                'name' => 'Bob',
                'display_name' => 'Bob Smith',
                'password' => bcrypt('password'),
                'joined_at' => now()->subDays(20),
            ]
        );

        // Create demo books
        Book::create([
            'title' => 'The Great Gatsby',
            'author' => 'F. Scott Fitzgerald',
            'category' => 'Fiction',
            'description' => 'A classic American novel about the Jazz Age.',
            'price_xof' => 15990,
            'condition' => 'Occasion',
            'status' => 'Disponible',
            'location' => 'New York',
            'photos' => json_encode(['https://example.com/gatsby.jpg']),
            'seller_id' => $user1->id,
            'published_at' => now()->subDays(10),
        ]);

        Book::create([
            'title' => 'To Kill a Mockingbird',
            'author' => 'Harper Lee',
            'category' => 'Fiction',
            'description' => 'A powerful story about racial injustice in the American South.',
            'price_xof' => 12500,
            'condition' => 'Neuf',
            'status' => 'Disponible',
            'location' => 'Alabama',
            'photos' => json_encode(['https://example.com/mockingbird.jpg']),
            'seller_id' => $user2->id,
            'published_at' => now()->subDays(5),
        ]);

        Book::create([
            'title' => '1984',
            'author' => 'George Orwell',
            'category' => 'Science Fiction',
            'description' => 'A dystopian novel about totalitarianism.',
            'price_xof' => 10000,
            'condition' => 'Occasion',
            'status' => 'Disponible',
            'location' => 'London',
            'photos' => json_encode(['https://example.com/1984.jpg']),
            'seller_id' => $user1->id,
            'published_at' => now()->subDays(2),
        ]);

        Book::create([
            'title' => 'Harry Potter and the Philosopher\'s Stone',
            'author' => 'J.K. Rowling',
            'category' => 'Fantasy',
            'description' => 'The first book in the Harry Potter series.',
            'price_xof' => 14000,
            'condition' => 'Neuf',
            'status' => 'Disponible',
            'location' => 'London',
            'photos' => json_encode(['https://example.com/hp1.jpg']),
            'seller_id' => $user2->id,
            'published_at' => now()->subDays(1),
        ]);
    }
}
