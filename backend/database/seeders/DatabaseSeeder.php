<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Book;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Clear existing data first
        User::query()->delete();
        Category::query()->delete();
        Book::query()->delete();
        
        $this->call([
            UserSeeder::class,
            CategorySeeder::class,
            BookSeeder::class,
        ]);
    }
}
