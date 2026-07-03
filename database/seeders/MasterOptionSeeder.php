<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MasterOptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $options = [
            'status' => ['OPEN', 'SCHEDULED', 'ON PROGRESS', 'EVALUATE', 'REVISION', 'DONE'],
            'category' => ['BUG FIXING (P1)', 'ISSUE DATA (P2)', 'FEATURE REQUEST (P3)', 'LACK OF KNOWLEDGE'],
            'application' => ['SIAGA API', 'CC DAMKAR', 'SIAP DAMKAR', 'DATIN', 'WEBSITE', 'CMS', 'DAMKAR ONE', 'E-SATGAS', 'E-PJLP', 'E-APD', 'E-RISPK'],
            'source' => ['WA', 'Phone', 'Email', 'Walk-in', 'System'],
            'technical_category' => ['Software', 'Hardware', 'Jaringan', 'Lainnya'],
        ];

        foreach ($options as $type => $values) {
            foreach ($values as $value) {
                \App\Models\MasterOption::updateOrCreate([
                    'type' => $type,
                    'value' => $value,
                ]);
            }
        }
    }
}
