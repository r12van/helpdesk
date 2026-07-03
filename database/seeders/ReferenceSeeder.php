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
            ['name' => 'Ahmad Mulyana', 'email' => 'mulyana@pemadam.jakarta.go.id'],
            ['name' => 'Rizvan Primadita', 'email' => 'rizvan@pemadam.jakarta.go.id'],
            ['name' => 'Supardi Putra M', 'email' => 'supardi@pemadam.jakarta.go.id'],
            ['name' => 'M. Taufik Hidayat', 'email' => 'taufik@pemadam.jakarta.go.id'],
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
