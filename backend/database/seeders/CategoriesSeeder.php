<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategoriesSeeder extends Seeder
{
    public function run(): void
    {
        $demoCategories = [
            ['name' => 'Roman', 'slug' => 'roman', 'description' => 'Romans et fiction', 'icon' => '📖'],
            ['name' => 'Littérature Africaine', 'slug' => 'litterature-africaine', 'description' => 'Œuvres d\'auteurs africains', 'icon' => '🌍'],
            ['name' => 'Business & Entrepreneuriat', 'slug' => 'business', 'description' => 'Livres sur les affaires et l\'entrepreneuriat', 'icon' => '💼'],
            ['name' => 'Développement Personnel', 'slug' => 'developpement-personnel', 'description' => 'Croissance personnelle et motivation', 'icon' => '🧠'],
            ['name' => 'Histoire & Culture', 'slug' => 'histoire-culture', 'description' => 'Histoire et patrimoine culturel', 'icon' => '🏛️'],
            ['name' => 'Sciences & Technologie', 'slug' => 'sciences-technologie', 	'description' => 	'Sciences, tech et innovation', 	'icon' =>'🔬'],
            ['name' => 'Éducation & Académique', 'slug' => 'education-academique', 'description' => 'Manuels et ressources éducatives', 'icon' => '🎓'],
            ['name' => 'Jeunesse & BD', 'slug' => 'jeunesse-bd', 'description' => 'Livres jeunesse et bandes dessinées', 'icon' => '🦸'],
            ['name' => 'Religion & Spiritualité', 'slug' => 'religion-spiritualite', 'description' => 'Ouvrages religieux et spirituels', 'icon' => '🕊️'],
            ['name' => 'Art & Photographie', 'slug' => 'art-photographie', 'description' => 'Beaux-arts et photographie', 'icon' => '🎨'],
            ['name' => 'Cuisine Africaine', 'slug' => 'cuisine-africaine', 'description' => 'Recettes et gastronomie africaine', 'icon' => '🍲'],
            ['name' => 'Santé & Bien-être', 	'slug' =>'sante-bien-etre','description'=>'Santé, médecine et bien-être','icon'=>'💚'],
        ];

        foreach ($demoCategories as $category) {
            Category::create($category);
        }
    }
}
