<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Book;
use App\Models\User;
use App\Models\Category;

class SciencesTechBooksSeeder extends Seeder
{
    public function run(): void
    {
        $sellers = User::whereIn('role', ['SELLER', 'ADMIN'])->get();
        $category = Category::where('slug', 'sciences-technologie')->first();

        if (!$category || $sellers->isEmpty()) {
            return;
        }

        $books = [
            [
                'title' => "Une Brève Histoire du Temps",
                'author' => 'Stephen Hawking',
                'description' => 'De la naissance de l\'Univers aux trous noirs.',
                'price' => 7000,
                'condition' => 'GOOD',
                'location' => 'Dakar',
                'city' => 'Dakar',
                'country' => 'Sénégal',
                'language' => 'Français',
                'published_year' => 1988,
                'pages' => 236,
                'cover_image' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
            ],
            [
                'title' => 'Sapiens',
                'author' => 'Yuval Noah Harari',
                'description' => 'Une histoire de l\'humanité: de l\'âge de pierre à nos jours.',
                'price' => 8500,
                'condition' => 'NEW',
                'location' => 'Lagos',
                'city' => 'Lagos',
                'country' => 'Nigeria',
                'language' => 'Français',
                'published_year' => 2011,
                'pages' => 560,
                'cover_image' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
            ],
            [
                'title' => 'Le Code de la Vie',
                'author' => 'Francis Collins',
                'description' => 'Les secrets génétiques et la révolution de la génomique.',
                'price' => 8000,
                'condition' => 'VERY_GOOD',
                'location' => 'Abidjan',
                'city' => 'Abidjan',
                'country' => "Côte d'Ivoire",
                'language' => 'Français',
                'published_year' => 2006,
                'pages' => 432,
                'cover_image' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
            ],
            [
                'title' => 'Intelligence Artificielle: Les Enjeux',
                'author' => 'Nick Bostrom',
                'description' => 'L\'avenir de l\'IA et ses implications pour l\'humanité.',
                'price' => 7500,
                'condition' => 'LIKE_NEW',
                'location' => 'Accra',
                'city' => 'Accra',
                'country' => 'Ghana',
                'language' => 'Français',
                'published_year' => 2014,
                'pages' => 496,
                'cover_image' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
            ],
            [
                'title' => 'Cosmos',
                'author' => 'Carl Sagan',
                'description' => 'L\'univers, la vie et notre place dans le cosmos.',
                'price' => 9000,
                'condition' => 'VERY_GOOD',
                'location' => 'Conakry',
                'city' => 'Conakry',
                'country' => 'Guinée',
                'language' => 'Français',
                'published_year' => 1980,
                'pages' => 568,
                'cover_image' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
            ],
        ];

        foreach ($books as $index => $data) {
            $seller = $sellers[$index % $sellers->count()];
            $payload = [
                ...$data,
                'seller_id' => $seller->id,
                'category_id' => $category->id,
                'status' => 'ACTIVE',
            ];
            Book::create($payload);
        }
    }
}
