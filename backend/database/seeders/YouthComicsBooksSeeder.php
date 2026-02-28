<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Book;
use App\Models\User;
use App\Models\Category;

class YouthComicsBooksSeeder extends Seeder
{
    public function run(): void
    {
        $sellers = User::whereIn('role', ['SELLER', 'ADMIN'])->get();
        $category = Category::where('slug', 'jeunesse-bd')->first();

        if (!$category || $sellers->isEmpty()) {
            return;
        }

        $books = [
            [
                'title' => 'Tintin au Congo',
                'author' => 'Hergé',
                'description' => 'Les aventures du jeune reporter Tintin et son chien Milou.',
                'price' => 5500,
                'condition' => 'VERY_GOOD',
                'location' => 'Dakar',
                'city' => 'Dakar',
                'country' => 'Sénégal',
                'language' => 'Français',
                'published_year' => 1930,
                'pages' => 62,
                'cover_image' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
            ],
            [
                'title' => "Astérix et Obélix",
                'author' => 'Albert Uderzo',
                'description' => 'Les aventures hilarantes des Gaulois dans un petit village.',
                'price' => 6000,
                'condition' => 'LIKE_NEW',
                'location' => 'Lagos',
                'city' => 'Lagos',
                'country' => 'Nigeria',
                'language' => 'Français',
                'published_year' => 1959,
                'pages' => 48,
                'cover_image' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
            ],
            [
                'title' => 'Le Petit Prince',
                'author' => 'Antoine de Saint-Exupéry',
                'description' => 'Un conte philosophique sur le prince d\'une petite planète.',
                'price' => 4500,
                'condition' => 'GOOD',
                'location' => 'Abidjan',
                'city' => 'Abidjan',
                'country' => "Côte d'Ivoire",
                'language' => 'Français',
                'published_year' => 1943,
                'pages' => 96,
                'cover_image' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
            ],
            [
                'title' => 'Les Enfants du Capitaine Grant',
                'author' => 'Jules Verne',
                'description' => 'Une aventure extraordinaire autour du monde pour sauver un capitaine.',
                'price' => 5000,
                'condition' => 'VERY_GOOD',
                'location' => 'Accra',
                'city' => 'Accra',
                'country' => 'Ghana',
                'language' => 'Français',
                'published_year' => 1865,
                'pages' => 528,
                'cover_image' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
            ],
            [
                'title' => "L'Île au Trésor",
                'author' => 'Robert Louis Stevenson',
                'description' => 'Une quête palpitante pour trouver un trésor caché.',
                'price' => 4800,
                'condition' => 'GOOD',
                'location' => 'Conakry',
                'city' => 'Conakry',
                'country' => 'Guinée',
                'language' => 'Français',
                'published_year' => 1881,
                'pages' => 320,
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
