<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Book;
use App\Models\User;
use App\Models\Category;

class HistoryCultureBooksSeeder extends Seeder
{
    public function run(): void
    {
        $sellers = User::whereIn('role', ['SELLER', 'ADMIN'])->get();
        $category = Category::where('slug', 'histoire-culture')->first();

        if (!$category || $sellers->isEmpty()) {
            return;
        }

        $books = [
            [
                'title' => 'Une Histoire de France',
                'author' => 'Amin Maalouf',
                'description' => 'Un regard nouveau et poétique sur l\'histoire de la France.',
                'price' => 8500,
                'condition' => 'NEW',
                'location' => 'Dakar',
                'city' => 'Dakar',
                'country' => 'Sénégal',
                'language' => 'Français',
                'published_year' => 2016,
                'pages' => 368,
                'cover_image' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
            ],
            [
                'title' => "L'Afrique Subsaharienne: Histoire et Civilisations",
                'author' => 'Jean-François Bayart',
                'description' => 'Exploration des civilisations africaines à travers les âges.',
                'price' => 9000,
                'condition' => 'VERY_GOOD',
                'location' => 'Lagos',
                'city' => 'Lagos',
                'country' => 'Nigeria',
                'language' => 'Français',
                'published_year' => 2010,
                'pages' => 520,
                'cover_image' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
            ],
            [
                'title' => 'Civilisations',
                'author' => 'Laurent Mauvignier',
                'description' => 'Un roman sur la rencontre des civilisations africaines et européennes.',
                'price' => 7000,
                'condition' => 'GOOD',
                'location' => 'Abidjan',
                'city' => 'Abidjan',
                'country' => "Côte d'Ivoire",
                'language' => 'Français',
                'published_year' => 2021,
                'pages' => 200,
                'cover_image' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
            ],
            [
                'title' => 'Le Patrimoine Culturel Africain',
                'author' => 'Kofi Asare Opoku',
                'description' => 'Étude profonde des richesses culturelles de l\'Afrique.',
                'price' => 8000,
                'condition' => 'LIKE_NEW',
                'location' => 'Accra',
                'city' => 'Accra',
                'country' => 'Ghana',
                'language' => 'Français',
                'published_year' => 2015,
                'pages' => 432,
                'cover_image' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
            ],
            [
                'title' => 'Léopold Sédar Senghor: Vie et Pensée',
                'author' => 'Papa Samba Diop',
                'description' => 'La vie et l\'œuvre du grand penseur sénégalais.',
                'price' => 6500,
                'condition' => 'VERY_GOOD',
                'location' => 'Conakry',
                'city' => 'Conakry',
                'country' => 'Guinée',
                'language' => 'Français',
                'published_year' => 2005,
                'pages' => 368,
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
