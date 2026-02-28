<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Book;
use App\Models\User;
use App\Models\Category;

class BusinessBooksSeeder extends Seeder
{
    public function run(): void
    {
        $sellers = User::whereIn('role', ['SELLER', 'ADMIN'])->get();
        $category = Category::where('slug', 'business')->first();

        if (!$category || $sellers->isEmpty()) {
            return;
        }

        $books = [
            [
                'title' => 'Père Riche, Père Pauvre',
                'author' => 'Robert Kiyosaki',
                'description' => 'Les secrets de la richesse financière et l\'intelligence économique.',
                'price' => 8000,
                'condition' => 'NEW',
                'location' => 'Dakar',
                'city' => 'Dakar',
                'country' => 'Sénégal',
                'language' => 'Français',
                'published_year' => 1997,
                'pages' => 336,
                'cover_image' => 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400',
            ],
            [
                'title' => 'Zero to One',
                'author' => 'Peter Thiel',
                'description' => 'Comment créer les entreprises du futur et transformer le monde.',
                'price' => 7500,
                'condition' => 'VERY_GOOD',
                'location' => 'Lagos',
                'city' => 'Lagos',
                'country' => 'Nigeria',
                'language' => 'Français',
                'published_year' => 2014,
                'pages' => 370,
                'cover_image' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
            ],
            [
                'title' => 'The Lean Startup',
                'author' => 'Eric Ries',
                'description' => 'Rédéfinir l\'entrepreneuriat au travers de la méthode agile.',
                'price' => 7000,
                'condition' => 'GOOD',
                'location' => 'Abidjan',
                'city' => 'Abidjan',
                'country' => "Côte d'Ivoire",
                'language' => 'Français',
                'published_year' => 2011,
                'pages' => 336,
                'cover_image' => 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400',
            ],
            [
                'title' => 'Good to Great',
                'author' => 'Jim Collins',
                'description' => 'Comment les entreprises font le saut de bonnes à exceptionnelles.',
                'price' => 8500,
                'condition' => 'LIKE_NEW',
                'location' => 'Accra',
                'city' => 'Accra',
                'country' => 'Ghana',
                'language' => 'Français',
                'published_year' => 2001,
                'pages' => 300,
                'cover_image' => 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
            ],
            [
                'title' => 'The 4-Hour Workweek',
                'author' => 'Timothy Ferriss',
                'description' => 'Travailler moins pour vivre plus et atteindre la liberté.',
                'price' => 6500,
                'condition' => 'GOOD',
                'location' => 'Conakry',
                'city' => 'Conakry',
                'country' => 'Guinée',
                'language' => 'Français',
                'published_year' => 2007,
                'pages' => 624,
                'cover_image' => 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400',
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
