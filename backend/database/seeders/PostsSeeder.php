<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Post;
use App\Models\User;

class PostsSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::take(3)->get();

        $demoPosts = [
            [
                'type' => 'REVIEW',
                'content' => '📚 Je viens de terminer "Une Si Longue Lettre" de Mariama Bâ et je suis bouleversée! Ce roman explore avec tant de profondeur la condition féminine en Afrique. Un chef-d\'œuvre intemporel que tout le monde devrait lire. ⭐⭐⭐⭐⭐',
                'book_title' => 'Une Si Longue Lettre',
                'book_author' => 'Mariama Bâ',
                'rating' => 5,
            ],
            [
                'type' => 'RECOMMENDATION',
                'content' => '🌟 Recommandation du jour: Si vous cherchez de l\'inspiration entrepreneuriale, lisez "L\'Afrique a-t-elle besoin d\'un programme d\'ajustement culturel?" de Daniel Etounga-Manguelle. Un livre qui change les perspectives!',
                'book_title' => "L'Afrique a-t-elle besoin...",
                'book_author' => 'Daniel Etounga-Manguelle',
            ],
            [
                'type' => 'TEXT',
                'content' => '💡 Question à la communauté: Quels sont vos auteurs africains préférés? Je cherche à découvrir de nouvelles voix littéraires du continent. Partagez vos suggestions! 🌍📖',
            ],
        ];

        foreach ($demoPosts as $i => $p) {
            $payload = $p;
            $payload['author_id'] = $users[$i % $users->count()]->id;
            Post::create($payload);
        }
    }
}
