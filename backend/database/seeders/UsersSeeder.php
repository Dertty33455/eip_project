<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Wallet;

class UsersSeeder extends Seeder
{
    public function run(): void
    {
        // administration user
        $admin = User::updateOrCreate(
            ['email' => 'admin@afribook.com'],
            [
                'phone' => '+22500000000',
                'password' => Hash::make('Admin@123'),
                'first_name' => 'Admin',
                'last_name' => 'AfriBook',
                'username' => 'admin',
                'role' => 'ADMIN',
                'status' => 'ACTIVE',
                'is_email_verified' => true,
                'is_phone_verified' => true,
                'bio' => 'Administrateur de la plateforme AfriBook',
                'location' => 'Abidjan, Côte d\'Ivoire',
                'country' => "Côte d'Ivoire",
            ]
        );

        Wallet::updateOrCreate(
            ['user_id' => $admin->id],
            ['balance' => 0, 'currency' => 'XOF', 'is_active' => true]
        );

        // demo users
        $demoPassword = Hash::make('Demo@123');

        $demoUsers = [
            [
                'email' => 'kofi@example.com',
                'phone' => '+22501234567',
                'first_name' => 'Kofi',
                'last_name' => 'Mensah',
                'username' => 'kofi_mensah',
                'bio' => 'Passionné de littérature africaine et de développement personnel. 📚',
                'location' => 'Accra, Ghana',
                'country' => 'Ghana',
                'role' => 'SELLER',
                'is_verified_seller' => true,
            ],
            [
                'email' => 'aminata@example.com',
                'phone' => '+22507654321',
                'first_name' => 'Aminata',
                'last_name' => 'Diallo',
                'username' => 'aminata_d',
                'bio' => 'Lectrice avide, j\'aime partager mes découvertes littéraires. ✨',
                'location' => 'Dakar, Sénégal',
                'country' => 'Sénégal',
                'role' => 'USER',
            ],
            [
                'email' => 'chidi@example.com',
                'phone' => '+22509876543',
                'first_name' => 'Chidi',
                'last_name' => 'Okonkwo',
                'username' => 'chidi_books',
                'bio' => 'Libraire passionné, je vends des livres rares et d\'occasion.',
                'location' => 'Lagos, Nigeria',
                'country' => 'Nigeria',
                'role' => 'SELLER',
                'is_verified_seller' => true,
            ],
        ];

        foreach ($demoUsers as $data) {
            $user = User::updateOrCreate(
                ['email' => $data['email']],
                array_merge($data, [
                    'password' => $demoPassword,
                    'status' => 'ACTIVE',
                    'is_email_verified' => true,
                    'is_phone_verified' => true,
                ])
            );

            Wallet::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'balance' => rand(5000, 55000),
                    'currency' => 'XOF',
                    'is_active' => true,
                ]
            );
        }
    }
}
