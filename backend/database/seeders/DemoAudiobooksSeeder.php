<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Audiobook;
use App\Models\AudioChapter;
use App\Models\Category;

class DemoAudiobooksSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::all()->keyBy('slug');

        $demoAudiobooks = [
            [
                'title' => "Contes et Légendes d'Afrique",
                'author' => 'Tradition Orale',
                'narrator' => 'Mamadou Konaté',
                'description' => 'Une collection de contes traditionnels africains, racontés avec passion.',
                'cover_image' => 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=400',
                'total_duration' => 7200,
                'language' => 'Français',
                'is_popular' => true,
                'is_featured' => true,
                'category_slug' => 'histoire-culture',
                'status' => 'PUBLISHED',
            ],
            [
                'title' => 'Les Secrets du Leadership Africain',
                'author' => 'Dr. Kwame Asante',
                'narrator' => 'Issa Touré',
                'description' => 'Découvrez les principes de leadership inspirés des grandes figures africaines.',
                'cover_image' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
                'total_duration' => 10800,
                'language' => 'Français',
                'is_popular' => true,
                'category_slug' => 'business',
                'status' => 'PUBLISHED',
            ],
            [
                'title' => 'Méditation et Sagesse Ubuntu',
                'author' => 'Nadia Mbeki',
                'narrator' => 'Nadia Mbeki',
                'description' => 'Un guide audio pour la méditation basée sur la philosophie Ubuntu.',
                'cover_image' => 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
                'total_duration' => 5400,
                'language' => 'Français',
                'is_featured' => true,
                'category_slug' => 'developpement-personnel',
                'status' => 'PUBLISHED',
            ],
        ];

        foreach ($demoAudiobooks as $a) {
            $payload = $a;
            $payload['category_id'] = $categories[$a['category_slug']]->id ?? null;
            unset($payload['category_slug']);

            $created = Audiobook::create($payload);

            $chaptersCount = rand(3, 7);
            for ($i = 1; $i <= $chaptersCount; $i++) {
                AudioChapter::create([
                    'audiobook_id' => $created->id,
                    'title' => "Chapitre {$i}",
                    'chapter_number' => $i,
                    'duration' => rand(600, 1800),
                    'audio_url' => "/audio/sample-chapter-{$i}.mp3",
                    'is_free' => $i === 1,
                ]);
            }
        }
    }
}
