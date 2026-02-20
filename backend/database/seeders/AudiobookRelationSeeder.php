<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AudiobookRelationSeeder extends Seeder
{
    public function run(): void
    {
        // Example pairs - adjust ids to match your seeded audiobooks
        $pairs = [
            [1,2],
            [1,3],
            [2,3],
        ];

        foreach ($pairs as [$a,$b]) {
            // insert only if not exists and not same
            if ($a === $b) continue;
            $exists = DB::table('audiobook_relations')
                ->where('audiobook_id', $a)
                ->where('related_audiobook_id', $b)
                ->exists();
            if (! $exists) {
                DB::table('audiobook_relations')->insert([
                    'audiobook_id' => $a,
                    'related_audiobook_id' => $b,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
