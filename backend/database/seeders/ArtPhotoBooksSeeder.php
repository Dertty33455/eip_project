<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Book;
use App\Models\User;
use App\Models\Category;

class ArtPhotoBooksSeeder extends Seeder
{
    public function run(): void
    {
        $sellers = User::whereIn('role', ['SELLER', 'ADMIN'])->get();
        $category = Category::where('slug', 'art-photographie')->first();

        if (!$category || $sellers->isEmpty()) {
            return;
        }

        $books = [
            [
                'title' => 'Histoire de l\'Art Moderne',
                'author' => 'Élie Faure',
                'description' => 'Un voyage à travers les mouvements artistiques modernes.',
                'price' => 9500,
                'condition' => 'LIKE_NEW',
                'location' => 'Dakar',
                'city' => 'Dakar',
                'country' => 'Sénégal',
                'language' => 'Français',
                'published_year' => 2010,
                'pages' => 480,
                'cover_image' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
            ],
            [
                'title' => 'La Photographie Créative',
                'author' => 'Bryan Peterson',
                'description' => 'Maîtriser le langage visuel et la composition photographique.',
                'price' => 8500,
                'condition' => 'VERY_GOOD',
                'location' => 'Lagos',
                'city' => 'Lagos',
                'country' => 'Nigeria',
                'language' => 'Français',
                'published_year' => 2015,
                'pages' => 400,
                'cover_image' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
            ],
            [
                'title' => 'Van Gogh: Sa Vie et Son Œuvre',
                'author' => 'Bernard Leconte',
                'description' => 'La biographie captivante du maître impressionniste.',
                'price' => 7500,
                'condition' => 'GOOD',
                'location' => 'Abidjan',
                'city' => 'Abidjan',
                'country' => "Côte d'Ivoire",
                'language' => 'Français',
                'published_year' => 2018,
                'pages' => 320,
                'cover_image' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
            ],
            [
                'title' => 'Les Maîtres de la Renaissance',
                'author' => 'Michael Levey',
                'description' => 'Étude des grands artistes de la Renaissance italienne.',
                'price' => 10000,
                'condition' => 'LIKE_NEW',
                'location' => 'Accra',
                'city' => 'Accra',
                'country' => 'Ghana',
                'language' => 'Français',
                'published_year' => 2017,
                'pages' => 528,
                'cover_image' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
            ],
            [
                'title' => 'La Photographie de Rue',
                'author' => 'Henri Cartier-Bresson',
                'description' => 'Le maître de la photographie de rue et ses techniques.',
                'price' => 8000,
                'condition' => 'VERY_GOOD',
                'location' => 'Conakry',
                'city' => 'Conakry',
                'country' => 'Guinée',
                'language' => 'Français',
                'published_year' => 2012,
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
