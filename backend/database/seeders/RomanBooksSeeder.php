<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Book;
use App\Models\User;
use App\Models\Category;

class RomanBooksSeeder extends Seeder
{
    public function run(): void
    {
        $sellers = User::whereIn('role', ['SELLER', 'ADMIN'])->get();
        $category = Category::where('slug', 'roman')->first();

        if (!$category || $sellers->isEmpty()) {
            return;
        }

        $books = [
            [
                'title' => 'Les Misérables',
                'author' => 'Victor Hugo',
                'description' => 'L\'épopée de Jean Valjean et de son destin tourmenté dans la France du XIXe siècle.',
                'price' => 7500,
                'condition' => 'GOOD',
                'location' => 'Dakar',
                'city' => 'Dakar',
                'country' => 'Sénégal',
                'language' => 'Français',
                'published_year' => 1862,
                'pages' => 1463,
                'cover_image' => 'https://images.unsplash.com/photo-1543002588-d83cedbc7d84?w=400',
            ],
            [
                'title' => 'Le Comte de Monte-Cristo',
                'author' => 'Alexandre Dumas',
                'description' => 'L\'histoire captivante d\'Edmond Dantès et sa quête de vengeance et de rédemption.',
                'price' => 6500,
                'condition' => 'VERY_GOOD',
                'location' => 'Abidjan',
                'city' => 'Abidjan',
                'country' => "Côte d'Ivoire",
                'language' => 'Français',
                'published_year' => 1844,
                'pages' => 1276,
                'cover_image' => 'https://images.unsplash.com/photo-150784272343-583f20270319?w=400',
            ],
            [
                'title' => 'Notre-Dame de Paris',
                'author' => 'Victor Hugo',
                'description' => 'Le drame de Quasimodo dans les murs de la cathédrale Notre-Dame de Paris.',
                'price' => 5500,
                'condition' => 'LIKE_NEW',
                'location' => 'Lagos',
                'city' => 'Lagos',
                'country' => 'Nigeria',
                'language' => 'Français',
                'published_year' => 1831,
                'pages' => 1067,
                'cover_image' => 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
            ],
            [
                'title' => 'La Dame aux Camélias',
                'author' => 'Alexandre Dumas fils',
                'description' => 'Une histoire d\'amour passionnée et tragique à Paris au XIXe siècle.',
                'price' => 4500,
                'condition' => 'VERY_GOOD',
                'location' => 'Accra',
                'city' => 'Accra',
                'country' => 'Ghana',
                'language' => 'Français',
                'published_year' => 1848,
                'pages' => 256,
                'cover_image' => 'https://images.unsplash.com/photo-1494726161322-7ad12666bae9?w=400',
            ],
            [
                'title' => 'Jane Eyre',
                'author' => 'Charlotte Brontë',
                'description' => 'Le parcours d\'une jeune orpheline vers l\'indépendance et l\'amour véritable.',
                'price' => 6000,
                'condition' => 'GOOD',
                'location' => 'Conakry',
                'city' => 'Conakry',
                'country' => 'Guinée',
                'language' => 'Français',
                'published_year' => 1847,
                'pages' => 448,
                'cover_image' => 'https://images.unsplash.com/photo-1543946835-38a7f6f3ac1f?w=400',
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
