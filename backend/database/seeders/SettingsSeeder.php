<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'commission_rate', 'value' => '0.05', 'type' => 'number'],
            ['key' => 'free_chapters', 'value' => '1', 'type' => 'number'],
            ['key' => 'platform_name', 'value' => 'AfriBook', 'type' => 'string'],
            ['key' => 'currency', 'value' => 'XOF', 'type' => 'string'],
            ['key' => 'min_withdrawal', 'value' => '1000', 'type' => 'number'],
            ['key' => 'max_withdrawal', 'value' => '500000', 'type' => 'number'],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
