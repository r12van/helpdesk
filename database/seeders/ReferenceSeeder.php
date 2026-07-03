<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ReferenceSeeder extends Seeder
{
    /**
     * Seed the initial agent user accounts from the Excel References sheet.
     */
    public function run(): void
    {
        $agents = [
            ['name' => 'Ardian', 'email' => 'ardian@helpdesk.local'],
            ['name' => 'Mulyana', 'email' => 'mulyana@helpdesk.local'],
            ['name' => 'Rizvan', 'email' => 'rizvan@helpdesk.local'],
            ['name' => 'Supardi', 'email' => 'supardi@helpdesk.local'],
            ['name' => 'Maulana', 'email' => 'maulana@helpdesk.local'],
            ['name' => 'Rangga', 'email' => 'rangga@helpdesk.local'],
            ['name' => 'Taufik', 'email' => 'taufik@helpdesk.local'],
        ];

        foreach ($agents as $agent) {
            User::firstOrCreate(
                ['email' => $agent['email']],
                [
                    'name' => $agent['name'],
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );
        }
    }
}
