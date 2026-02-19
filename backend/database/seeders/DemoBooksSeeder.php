<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Book;
use App\Models\User;
use App\Models\Category;

class DemoBooksSeeder extends Seeder
{
    public function run(): void
    {
        $sellers = User::whereIn('role', ['SELLER', 'ADMIN'])->get();
        $categories = Category::all()->keyBy('slug');

        $demoBooks = [
            [
                'title' => 'Une Si Longue Lettre',
                'author' => 'Mariama Bâ',
                'description' => 'Un classique de la littérature africaine. Roman épistolaire qui explore la condition féminine au Sénégal.',
                'price' => 5500,
                'condition' => 'VERY_GOOD',
                'category_slug' => 'litterature-africaine',
                'location' => 'Dakar',
                'city' => 'Dakar',
                'country' => 'Sénégal',
                'language' => 'Français',
                'published_year' => 1979,
                'pages' => 165,
                'cover_image' => 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
            ],
            [
                'title' => 'Les Soleils des Indépendances',
                'author' => 'Ahmadou Kourouma',
                'description' => "Chef-d'œuvre de la littérature africaine francophone, ce roman raconte la déchéance d'un prince malinké.",
                'price' => 6000,
                'condition' => 'GOOD',
                'category_slug' => 'litterature-africaine',
                'location' => 'Abidjan',
                'city' => 'Abidjan',
                'country' => "Côte d'Ivoire",
                'language' => 'Français',
                'published_year' => 1968,
                'pages' => 196,
                'cover_image' => 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
            ],
            [
                'title' => "L'Enfant Noir",
                'author' => 'Camara Laye',
                'description' => "Autobiographie poétique d'un enfant guinéen, un récit initiatique touchant.",
                'price' => 4500,
                'condition' => 'LIKE_NEW',
                'category_slug' => 'litterature-africaine',
                'location' => 'Conakry',
                'city' => 'Conakry',
                'country' => 'Guinée',
                'language' => 'Français',
                'published_year' => 1953,
                'pages' => 224,
                'cover_image' => 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
            ],
            [
                'title' => 'Père Riche, Père Pauvre',
                'author' => 'Robert Kiyosaki',
                'description' => "Le livre qui a changé la vision de millions de personnes sur l'argent et l'investissement.",
                'price' => 8000,
                'condition' => 'NEW',
                'category_slug' => 'business',
                'location' => 'Lagos',
                'city' => 'Lagos',
                'country' => 'Nigeria',
                'language' => 'Français',
                'published_year' => 1997,
                'pages' => 336,
                'cover_image' => 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400',
            ],
            [
                'title' => "L'Alchimiste",
                'author' => 'Paulo Coelho',
                'description' => "Le voyage initiatique d'un jeune berger andalou à la recherche d'un trésor.",
                'price' => 5000,
                'condition' => 'VERY_GOOD',
                'category_slug' => 'developpement-personnel',
                'location' => 'Accra',
                'city' => 'Accra',
                'country' => 'Ghana',
                'language' => 'Français',
                'published_year' => 1988,
                'pages' => 192,
                'cover_image' => 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400',
            ],
        ];

        foreach ($demoBooks as $index => $data) {
            $seller = $sellers[$index % $sellers->count()];
            $payload = $data;
            $payload['seller_id'] = $seller->id;
            $payload['status'] = 'ACTIVE';
            $payload['category_id'] = $categories[$data['category_slug']]->id ?? null;

            // remove slug helper
            unset($payload['category_slug']);

            Book::create($payload);
        }
    }
}
