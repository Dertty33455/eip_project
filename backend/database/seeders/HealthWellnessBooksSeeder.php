<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Book;
use App\Models\User;
use App\Models\Category;

class HealthWellnessBooksSeeder extends Seeder
{
    public function run(): void
    {
        $sellers = User::whereIn('role', ['SELLER', 'ADMIN'])->get();
        $category = Category::where('slug', 'sante-bien-etre')->first();

        if (!$category || $sellers->isEmpty()) {
            return;
        }

        $books = [
            [
                'title' => 'La Médecine Naturelle Aujourd\'hui',
                'author' => 'Andrew Weil',
                'description' => 'Les bienfaits de la naturopathie et des remèdes naturels.',
                'price' => 7500,
                'condition' => 'NEW',
                'location' => 'Dakar',
                'city' => 'Dakar',
                'country' => 'Sénégal',
                'language' => 'Français',
                'published_year' => 2018,
                'pages' => 384,
                'cover_image' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
            ],
            [
                'title' => 'Yoga et Bien-être: Guide Complet',
                'author' => 'B.K.S. Iyengar',
                'description' => 'Maîtriser le yoga pour la santé physique et mentale.',
                'price' => 6500,
                'condition' => 'LIKE_NEW',
                'location' => 'Lagos',
                'city' => 'Lagos',
                'country' => 'Nigeria',
                'language' => 'Français',
                'published_year' => 2020,
                'pages' => 320,
                'cover_image' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
            ],
            [
                'title' => 'Nutrition et Santé: L\'Assiette Idéale',
                'author' => 'Pierre Dukan',
                'description' => 'Comment manger équilibré pour vivre longtemps et sainement.',
                'price' => 6000,
                'condition' => 'GOOD',
                'location' => 'Abidjan',
                'city' => 'Abidjan',
                'country' => "Côte d'Ivoire",
                'language' => 'Français',
                'published_year' => 2016,
                'pages' => 288,
                'cover_image' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
            ],
            [
                'title' => 'La Santé Mentale: Guide Pratique',
                'author' => 'Daniel Goleman',
                'description' => 'Cultiver son intelligence émotionnelle pour une meilleure santé mentale.',
                'price' => 7000,
                'condition' => 'VERY_GOOD',
                'location' => 'Accra',
                'city' => 'Accra',
                'country' => 'Ghana',
                'language' => 'Français',
                'published_year' => 2017,
                'pages' => 256,
                'cover_image' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
            ],
            [
                'title' => 'Médecine des Plantes Africaines',
                'author' => 'Felicité Tshinga',
                'description' => 'Les vertus thérapeutiques des plantes médicinales africaines.',
                'price' => 5500,
                'condition' => 'GOOD',
                'location' => 'Conakry',
                'city' => 'Conakry',
                'country' => 'Guinée',
                'language' => 'Français',
                'published_year' => 2019,
                'pages' => 336,
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
