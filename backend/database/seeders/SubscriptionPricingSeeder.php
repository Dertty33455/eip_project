<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SubscriptionPricing;

class SubscriptionPricingSeeder extends Seeder
{
    public function run(): void
    {
        $subscriptionPrices = [
            ['plan' => 'MONTHLY', 'price' => 2500, 'duration' => 30, 'currency' => 'XOF', 'is_active' => true],
            ['plan' => 'QUARTERLY', 'price' => 6000, 'duration' => 90, 'currency' => 'XOF', 'is_active' => true],
            ['plan' => 'YEARLY', 'price' => 20000, 'duration' => 365, 'currency' => 'XOF', 'is_active' => true],
        ];

        foreach ($subscriptionPrices as $sub) {
            SubscriptionPricing::updateOrCreate(
                ['plan' => $sub['plan']],
                $sub
            );
        }
    }
}
