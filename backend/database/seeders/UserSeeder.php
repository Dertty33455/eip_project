<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'username' => 'admin',
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@bookshell.com',
            'password' => bcrypt('AdminPass123!'),
            'role' => 'ADMIN',
            'phone' => '+221771234567',
        ]);

        // Create seller users
        $sellers = [
            [
                'username' => 'seller1',
                'first_name' => 'Ahmad',
                'last_name' => 'Diop',
                'email' => 'ahmad.d@example.com',
                'password' => bcrypt('Seller123!'),
                'role' => 'SELLER',
                'phone' => '+221761234567',
            ],
            [
                'username' => 'seller2', 
                'first_name' => 'Fatou',
                'last_name' => 'Ba',
                'email' => 'fatou.b@example.com',
                'password' => bcrypt('Seller123!'),
                'role' => 'SELLER',
                'phone' => '+221781234567',
            ],
        ];

        foreach ($sellers as $seller) {
            User::create($seller);
        }

        // Create regular users
        $users = [
            [
                'username' => 'user1',
                'first_name' => 'Moussa',
                'last_name' => 'Fall',
                'email' => 'moussa.f@example.com',
                'password' => bcrypt('User123!'),
                'role' => 'USER',
                'phone' => '+221771234568',
            ],
            [
                'username' => 'user2',
                'first_name' => 'Aminata',
                'last_name' => 'Sow',
                'email' => 'aminata.s@example.com', 
                'password' => bcrypt('User123!'),
                'role' => 'USER',
                'phone' => '+221761234568',
            ],
            [
                'username' => 'user3',
                'first_name' => 'Ibrahim',
                'last_name' => 'Ndiaye',
                'email' => 'ibrahim.n@example.com',
                'password' => bcrypt('User123!'),
                'role' => 'USER',
                'phone' => '+221781234568',
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }

        $this->command->info('Users created successfully!');
    }
}
