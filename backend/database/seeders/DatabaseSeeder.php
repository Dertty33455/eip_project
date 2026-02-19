<?php

namespace Database\Seeders;

use App\Models\User;
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
        // User::factory(10)->create();

        User::factory()->create([
            'first_name' => 'Test',
            'last_name' => 'User',
            'username' => 'testuser',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);

        // seed the application with demo data coming from the front‑end seeder logic
        $this->call([
            CategoriesSeeder::class,
            SubscriptionPricingSeeder::class,
            SettingsSeeder::class,
            UsersSeeder::class,
            DemoBooksSeeder::class,
            DemoAudiobooksSeeder::class,
            PostsSeeder::class,
        ]);
    }
}
