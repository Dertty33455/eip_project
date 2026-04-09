<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Book;
use App\Models\User;
use App\Models\Category;

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get sellers and categories
        $seller1 = User::where('username', 'seller1')->first();
        $seller2 = User::where('username', 'seller2')->first();
        $categories = Category::all();

        $books = [
            [
                'title' => 'L\'Énigme de la Méduse',
                'author' => 'Ahmad Diop',
                'isbn' => '978-2-123-45678-9',
                'description' => 'Un thriller captivant se déroulant à Dakar.',
                'price' => 8500.00,
                'original_price' => 9500.00,
                'condition' => 'LIKE_NEW',
                'status' => 'AVAILABLE',
                'pages' => 320,
                'language' => 'FR',
                'published_year' => 2023,
                'category_id' => $categories->where('name', 'Roman')->first()->id,
                'seller_id' => $seller1->id,
                'cover_image' => 'https://picsum.photos/seed/book1/400/600.jpg',
                'rating' => 4.5,
                'review_count' => 12,
                'view_count' => 156,
            ],
            [
                'title' => 'Futur Digital',
                'author' => 'Fatou Ba',
                'isbn' => '978-2-456-78912-3',
                'description' => 'Guide complet sur la transformation digitale en Afrique.',
                'price' => 12000.00,
                'original_price' => 15000.00,
                'condition' => 'NEW',
                'status' => 'AVAILABLE',
                'pages' => 450,
                'language' => 'FR',
                'published_year' => 2024,
                'category_id' => $categories->where('name', 'Business')->first()->id,
                'seller_id' => $seller2->id,
                'cover_image' => 'https://picsum.photos/seed/book2/400/600.jpg',
                'rating' => 4.8,
                'review_count' => 8,
                'view_count' => 203,
            ],
            [
                'title' => 'Étoiles du Sahel',
                'author' => 'Ahmad Diop',
                'isbn' => '978-2-789-01234-5',
                'description' => 'Recueil de poésies sur la vie au Sahel.',
                'price' => 6500.00,
                'condition' => 'VERY_GOOD',
                'status' => 'AVAILABLE',
                'pages' => 180,
                'language' => 'FR',
                'published_year' => 2022,
                'category_id' => $categories->where('name', 'Roman')->first()->id,
                'seller_id' => $seller1->id,
                'cover_image' => 'https://picsum.photos/seed/book3/400/600.jpg',
                'rating' => 4.2,
                'review_count' => 6,
                'view_count' => 89,
            ],
            [
                'title' => 'Le Code du Succès',
                'author' => 'Fatou Ba',
                'isbn' => '978-2-345-67890-1',
                'description' => 'Stratégies d\'entrepreneuriat pour les jeunes Africains.',
                'price' => 9500.00,
                'original_price' => 12000.00,
                'condition' => 'GOOD',
                'status' => 'AVAILABLE',
                'pages' => 280,
                'language' => 'FR',
                'published_year' => 2023,
                'category_id' => $categories->where('name', 'Business')->first()->id,
                'seller_id' => $seller2->id,
                'cover_image' => 'https://picsum.photos/seed/book4/400/600.jpg',
                'rating' => 4.6,
                'review_count' => 15,
                'view_count' => 178,
            ],
            [
                'title' => 'Mystères d\'Ancienne',
                'author' => 'Ahmad Diop',
                'isbn' => '978-2-567-89012-4',
                'description' => 'Les secrets des royaumes africains anciens.',
                'price' => 11000.00,
                'condition' => 'LIKE_NEW',
                'status' => 'AVAILABLE',
                'pages' => 420,
                'language' => 'FR',
                'published_year' => 2024,
                'category_id' => $categories->where('name', 'Histoire')->first()->id,
                'seller_id' => $seller1->id,
                'cover_image' => 'https://picsum.photos/seed/book5/400/600.jpg',
                'rating' => 4.9,
                'review_count' => 22,
                'view_count' => 267,
            ],
        ];

        foreach ($books as $book) {
            Book::create($book);
        }

        $this->command->info('Books created successfully!');
    }
}
