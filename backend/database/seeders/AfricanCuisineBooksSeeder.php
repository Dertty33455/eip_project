<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Book;
use App\Models\User;
use App\Models\Category;

class AfricanCuisineBooksSeeder extends Seeder
{
    public function run(): void
    {
        $sellers = User::whereIn('role', ['SELLER', 'ADMIN'])->get();
        $category = Category::where('slug', 'cuisine-africaine')->first();

        if (!$category || $sellers->isEmpty()) {
            return;
        }

        $books = [
            [
                'title' => "La Gastronomie Sénégalaise: Recettes Authentiques",
                'author' => 'Aminata Ba',
                'description' => 'Les recettes traditionnelles du Sénégal, de la thieboudienne au yassa.',
                'price' => 6500,
                'condition' => 'NEW',
                'location' => 'Dakar',
                'city' => 'Dakar',
                'country' => 'Sénégal',
                'language' => 'Français',
                'published_year' => 2022,
                'pages' => 256,
                'cover_image' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
            ],
            [
                'title' => "Cuisine Ivoirienne: Saveurs de l'Afrique",
                'author' => 'Kouadio N\'guessan',
                'description' => 'Les plats emblématiques de la Côte d\'Ivoire et d\'Afrique de l\'Ouest.',
                'price' => 6000,
                'condition' => 'LIKE_NEW',
                'location' => 'Lagos',
                'city' => 'Lagos',
                'country' => 'Nigeria',
                'language' => 'Français',
                'published_year' => 2020,
                'pages' => 224,
                'cover_image' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
            ],
            [
                'title' => 'Cuisine Nigériane: Des Épices et des Saveurs',
                'author' => 'Chioma Adeyemi',
                'description' => 'Exploration des richesses culinaires nigérianes et leurs traditions.',
                'price' => 5500,
                'condition' => 'GOOD',
                'location' => 'Abidjan',
                'city' => 'Abidjan',
                'country' => "Côte d'Ivoire",
                'language' => 'Français',
                'published_year' => 2021,
                'pages' => 280,
                'cover_image' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
            ],
            [
                'title' => "L'Afrique à Table: 100 Recettes Ancestrales",
                'author' => 'Amandine Gahé',
                'description' => 'Un tour d\'Afrique culinaire avec 100 recettes du continent.',
                'price' => 7500,
                'condition' => 'VERY_GOOD',
                'location' => 'Accra',
                'city' => 'Accra',
                'country' => 'Ghana',
                'language' => 'Français',
                'published_year' => 2019,
                'pages' => 368,
                'cover_image' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
            ],
            [
                'title' => 'Les Épices et Herbes de la Cuisine Africaine',
                'author' => 'Ibrahim Diallo',
                'description' => 'Comprendre et utiliser les épices authentiques africaines.',
                'price' => 5000,
                'condition' => 'GOOD',
                'location' => 'Conakry',
                'city' => 'Conakry',
                'country' => 'Guinée',
                'language' => 'Français',
                'published_year' => 2018,
                'pages' => 192,
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
