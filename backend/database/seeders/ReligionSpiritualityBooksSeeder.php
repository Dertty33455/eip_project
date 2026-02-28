<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Book;
use App\Models\User;
use App\Models\Category;

class ReligionSpiritualityBooksSeeder extends Seeder
{
    public function run(): void
    {
        $sellers = User::whereIn('role', ['SELLER', 'ADMIN'])->get();
        $category = Category::where('slug', 'religion-spiritualite')->first();

        if (!$category || $sellers->isEmpty()) {
            return;
        }

        $books = [
            [
                'title' => 'La Bible',
                'author' => 'Collectif',
                'description' => 'Le livre sacré du christianisme.',
                'price' => 6000,
                'condition' => 'NEW',
                'location' => 'Dakar',
                'city' => 'Dakar',
                'country' => 'Sénégal',
                'language' => 'Français',
                'published_year' => 2023,
                'pages' => 1200,
                'cover_image' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
            ],
            [
                'title' => 'Le Coran',
                'author' => 'Collectif',
                'description' => 'Le livre sacré de l\'Islam.',
                'price' => 6500,
                'condition' => 'LIKE_NEW',
                'location' => 'Lagos',
                'city' => 'Lagos',
                'country' => 'Nigeria',
                'language' => 'Français',
                'published_year' => 2020,
                'pages' => 1008,
                'cover_image' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
            ],
            [
                'title' => 'Introduction au Bouddhisme',
                'author' => 'Dalaï-Lama',
                'description' => 'Les principes fondamentaux de la philosophie bouddhiste.',
                'price' => 5500,
                'condition' => 'GOOD',
                'location' => 'Abidjan',
                'city' => 'Abidjan',
                'country' => "Côte d'Ivoire",
                'language' => 'Français',
                'published_year' => 2001,
                'pages' => 256,
                'cover_image' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
            ],
            [
                'title' => 'La Méditation et la Spiritualité',
                'author' => 'Thich Nhat Hanh',
                'description' => 'Comment trouver la paix intérieure par la méditation.',
                'price' => 5000,
                'condition' => 'VERY_GOOD',
                'location' => 'Accra',
                'city' => 'Accra',
                'country' => 'Ghana',
                'language' => 'Français',
                'published_year' => 2015,
                'pages' => 320,
                'cover_image' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
            ],
            [
                'title' => 'Les Mystères de la Kabbale',
                'author' => 'Yehuda Berg',
                'description' => 'Exploration de la sagesse ésotérique juive.',
                'price' => 7000,
                'condition' => 'GOOD',
                'location' => 'Conakry',
                'city' => 'Conakry',
                'country' => 'Guinée',
                'language' => 'Français',
                'published_year' => 2008,
                'pages' => 432,
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
