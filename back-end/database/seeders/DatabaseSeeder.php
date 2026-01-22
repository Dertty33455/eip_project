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

        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'display_name' => 'Test User',
                'password' => bcrypt('password'),
                'joined_at' => now(),
            ]
        );

        $this->call([
            BookSeeder::class,
            ConversationSeeder::class,
            OrderSeeder::class,
        ]);
    }
}
