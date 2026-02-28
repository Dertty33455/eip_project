<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Book;
use App\Models\User;
use App\Models\Category;

class AfricanLiteratureBooksSeeder extends Seeder
{
    public function run(): void
    {
        $sellers = User::whereIn('role', ['SELLER', 'ADMIN'])->get();
        $category = Category::where('slug', 'litterature-africaine')->first();

        if (!$category || $sellers->isEmpty()) {
            return;
        }

        $books = [
            [
                'title' => 'Une Si Longue Lettre',
                'author' => 'Mariama Bâ',
                'description' => 'Un classique de la littérature africaine. Roman épistolaire qui explore la condition féminine au Sénégal.',
                'price' => 5500,
                'condition' => 'VERY_GOOD',
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
                'location' => 'Conakry',
                'city' => 'Conakry',
                'country' => 'Guinée',
                'language' => 'Français',
                'published_year' => 1953,
                'pages' => 224,
                'cover_image' => 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
            ],
            [
                'title' => 'Chaka',
                'author' => 'Léopold Sédar Senghor',
                'description' => 'Épopée historique du roi zoulou Chaka racontée en vers libres.',
                'price' => 5500,
                'condition' => 'VERY_GOOD',
                'location' => 'Lagos',
                'city' => 'Lagos',
                'country' => 'Nigeria',
                'language' => 'Français',
                'published_year' => 1956,
                'pages' => 208,
                'cover_image' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
            ],
            [
                'title' => 'Tout s\'écoule',
                'author' => 'Mongo Beti',
                'description' => 'Roman de dénonciation du colonialisme français en Afrique de l\'Ouest.',
                'price' => 5000,
                'condition' => 'GOOD',
                'location' => 'Accra',
                'city' => 'Accra',
                'country' => 'Ghana',
                'language' => 'Français',
                'published_year' => 1971,
                'pages' => 288,
                'cover_image' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
            ],
            [
                'title' => 'L\'Étrange Destin de Wangari Maathai',
                'author' => 'Wangari Maathai',
                'description' => 'Autobiographie d\'une femme écologiste kenyane qui a changé le monde.',
                'price' => 6500,
                'condition' => 'LIKE_NEW',
                'location' => 'Dakar',
                'city' => 'Dakar',
                'country' => 'Sénégal',
                'language' => 'Français',
                'published_year' => 2003,
                'pages' => 320,
                'cover_image' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
            ],
            [
                'title' => "Benita N'guema dans les bras de l'Afrique",
                'author' => 'Werewere-Liking',
                'description' => 'Quête identitaire et voyage spirituel à travers l\'Afrique.',
                'price' => 5500,
                'condition' => 'GOOD',
                'location' => 'Lagos',
                'city' => 'Lagos',
                'country' => 'Nigeria',
                'language' => 'Français',
                'published_year' => 1988,
                'pages' => 256,
                'cover_image' => 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
            ],
            [
                'title' => 'La Poissonière du Nil',
                'author' => 'Nagib Mahfouz',
                'description' => 'Histoire émouvante de vie et d\'amour dans le Caire du XXe siècle.',
                'price' => 6000,
                'condition' => 'VERY_GOOD',
                'location' => 'Conakry',
                'city' => 'Conakry',
                'country' => 'Guinée',
                'language' => 'Français',
                'published_year' => 1957,
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
