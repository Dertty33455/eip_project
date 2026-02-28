<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Book;
use App\Models\User;
use App\Models\Category;

class DeveloppementPersonnelBooksSeeder extends Seeder
{
    public function run(): void
    {
        $sellers = User::whereIn('role', ['SELLER', 'ADMIN'])->get();
        $category = Category::where('slug', 'developpement-personnel')->first();

        if (!$category || $sellers->isEmpty()) {
            return;
        }

        $books = [
            [
                'title' => "L'Alchimiste",
                'author' => 'Paulo Coelho',
                'description' => 'Un voyage initiatique à la découverte du destin personnel.',
                'price' => 5000,
                'condition' => 'VERY_GOOD',
                'location' => 'Dakar',
                'city' => 'Dakar',
                'country' => 'Sénégal',
                'language' => 'Français',
                'published_year' => 1988,
                'pages' => 192,
                'cover_image' => 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400',
            ],
            [
                'title' => "Habitudes Atomiques",
                'author' => 'James Clear',
                'description' => 'Comment les petits changements produisent de remarquables résultats.',
                'price' => 7500,
                'condition' => 'NEW',
                'location' => 'Lagos',
                'city' => 'Lagos',
                'country' => 'Nigeria',
                'language' => 'Français',
                'published_year' => 2018,
                'pages' => 408,
                'cover_image' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
            ],
            [
                'title' => 'Influence et Manipulation',
                'author' => 'Robert Cialdini',
                'description' => 'Les principes psychologiques qui influencent le comportement humain.',
                'price' => 6500,
                'condition' => 'GOOD',
                'location' => 'Abidjan',
                'city' => 'Abidjan',
                'country' => "Côte d'Ivoire",
                'language' => 'Français',
                'published_year' => 1984,
                'pages' => 320,
                'cover_image' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
            ],
            [
                'title' => 'La Puissance de la Pensée Positive',
                'author' => 'Norman Vincent Peale',
                'description' => 'Comment cultiver une attitude positive pour transformer sa vie.',
                'price' => 5500,
                'condition' => 'LIKE_NEW',
                'location' => 'Accra',
                'city' => 'Accra',
                'country' => 'Ghana',
                'language' => 'Français',
                'published_year' => 1952,
                'pages' => 288,
                'cover_image' => 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400',
            ],
            [
                'title' => "4000 Semaines",
                'author' => 'Oliver Burkeman',
                'description' => 'Vivre une vie significative dans un temps limité.',
                'price' => 6000,
                'condition' => 'VERY_GOOD',
                'location' => 'Conakry',
                'city' => 'Conakry',
                'country' => 'Guinée',
                'language' => 'Français',
                'published_year' => 2021,
                'pages' => 496,
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
