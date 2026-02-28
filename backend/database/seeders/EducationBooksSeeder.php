<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Book;
use App\Models\User;
use App\Models\Category;

class EducationBooksSeeder extends Seeder
{
    public function run(): void
    {
        $sellers = User::whereIn('role', ['SELLER', 'ADMIN'])->get();
        $category = Category::where('slug', 'education-academique')->first();

        if (!$category || $sellers->isEmpty()) {
            return;
        }

        $books = [
            [
                'title' => 'Le Petit Larousse Illustré',
                'author' => 'Larousse',
                'description' => 'Dictionnaire encyclopédique de référence.',
                'price' => 12000,
                'condition' => 'LIKE_NEW',
                'location' => 'Dakar',
                'city' => 'Dakar',
                'country' => 'Sénégal',
                'language' => 'Français',
                'published_year' => 2023,
                'pages' => 1752,
                'cover_image' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
            ],
            [
                'title' => 'Grammaire Française Complète',
                'author' => 'Maurice Grevisse',
                'description' => 'La bible de la grammaire française avec tous les règles.',
                'price' => 8500,
                'condition' => 'VERY_GOOD',
                'location' => 'Lagos',
                'city' => 'Lagos',
                'country' => 'Nigeria',
                'language' => 'Français',
                'published_year' => 2016,
                'pages' => 720,
                'cover_image' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
            ],
            [
                'title' => 'Mathématiques: Les Fondamentaux',
                'author' => 'Jean-Pierre Kahane',
                'description' => 'Les concepts essentiels des mathématiques expliqués simplement.',
                'price' => 7500,
                'condition' => 'GOOD',
                'location' => 'Abidjan',
                'city' => 'Abidjan',
                'country' => "Côte d'Ivoire",
                'language' => 'Français',
                'published_year' => 2015,
                'pages' => 480,
                'cover_image' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
            ],
            [
                'title' => 'Histoire Universelle de l\'Antiquité à nos Jours',
                'author' => 'André Maurois',
                'description' => 'Un panorama complet de l\'histoire mondiale.',
                'price' => 9000,
                'condition' => 'LIKE_NEW',
                'location' => 'Accra',
                'city' => 'Accra',
                'country' => 'Ghana',
                'language' => 'Français',
                'published_year' => 2018,
                'pages' => 528,
                'cover_image' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
            ],
            [
                'title' => 'Sciences Naturelles Intégrées',
                'author' => 'Claude Bernard',
                'description' => 'Biologie, physique et chimie expliquées de manière intégrée.',
                'price' => 8000,
                'condition' => 'VERY_GOOD',
                'location' => 'Conakry',
                'city' => 'Conakry',
                'country' => 'Guinée',
                'language' => 'Français',
                'published_year' => 2019,
                'pages' => 560,
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
