<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Roman', 'slug' => 'roman', 'description' => 'Romans de fiction'],
            ['name' => 'Science-Fiction', 'slug' => 'science-fiction', 'description' => 'Livres de science-fiction'],
            ['name' => 'Fantasy', 'slug' => 'fantasy', 'description' => 'Livres de fantasy'],
            ['name' => 'Biographie', 'slug' => 'biographie', 'description' => 'Biographies et mémoires'],
            ['name' => 'Business', 'slug' => 'business', 'description' => 'Livres sur le business'],
            ['name' => 'Éducation', 'slug' => 'education', 'description' => 'Livres éducatifs'],
            ['name' => 'Enfants', 'slug' => 'enfants', 'description' => 'Livres pour enfants'],
            ['name' => 'Histoire', 'slug' => 'histoire', 'description' => 'Livres d\'histoire'],
            ['name' => 'Religion', 'slug' => 'religion', 'description' => 'Livres religieux'],
            ['name' => 'Académique', 'slug' => 'academique', 'description' => 'Livres académiques'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }

        $this->command->info('Categories created successfully!');
    }
}
