<?php

namespace Database\Seeders;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Shared\Date as ExcelDate;

class ExcelDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $filePath = base_path('../Application Support Log.xlsx');

        if (!file_exists($filePath)) {
            $this->command->warn("Excel file not found at: {$filePath}");
            return;
        }

        $spreadsheet = IOFactory::load($filePath);

        // 1. Import Support Ticket SI (Sheet 0)
        $sheetSupport = $spreadsheet->getSheet(0);
        $highestRowSupport = $sheetSupport->getHighestRow();

        $this->command->info("Seeding Support Tickets...");

        // Row 5 is header, data starts at row 6
        for ($row = 6; $row <= $highestRowSupport; $row++) {
            $dateVal = $sheetSupport->getCell("A{$row}")->getValue();
            $reporter = trim($sheetSupport->getCell("B{$row}")->getFormattedValue());
            $description = trim($sheetSupport->getCell("H{$row}")->getFormattedValue());

            // Skip empty rows
            if (empty($dateVal) && empty($reporter) && empty($description)) {
                continue;
            }

            $date = $this->parseExcelDate($dateVal);
            if (!$date) {
                continue;
            }

            $assigneeName = trim($sheetSupport->getCell("J{$row}")->getFormattedValue());
            $assignedTo = null;
            if (!empty($assigneeName)) {
                $user = User::firstOrCreate(
                    ['name' => $assigneeName],
                    [
                        'email' => Str::slug($assigneeName) . '@example.com',
                        'password' => Hash::make('password'),
                        'email_verified_at' => now(),
                    ]
                );
                $assignedTo = $user->id;
            }

            // Normalize Status
            $statusRaw = strtoupper(trim($sheetSupport->getCell("K{$row}")->getFormattedValue()));
            $status = in_array($statusRaw, Ticket::STATUSES) ? $statusRaw : 'OPEN';

            Ticket::create([
                'type' => 'support',
                'date' => $date,
                'reporter' => $reporter ?: 'Unknown',
                'division' => $sheetSupport->getCell("C{$row}")->getFormattedValue() ?: null,
                'receiver' => $sheetSupport->getCell("D{$row}")->getFormattedValue() ?: null,
                'source' => $sheetSupport->getCell("E{$row}")->getFormattedValue() ?: null,
                'category' => $sheetSupport->getCell("F{$row}")->getFormattedValue() ?: null,
                'application' => $sheetSupport->getCell("G{$row}")->getFormattedValue() ?: null,
                'description' => $description ?: 'No description provided',
                'attachment' => $sheetSupport->getCell("I{$row}")->getFormattedValue() ?: null,
                'assigned_to' => $assignedTo,
                'status' => $status,
                'due_date' => $this->parseExcelDate($sheetSupport->getCell("L{$row}")->getValue()),
                'start_date' => $this->parseExcelDateTime($sheetSupport->getCell("M{$row}")->getValue()),
                'end_date' => $this->parseExcelDateTime($sheetSupport->getCell("N{$row}")->getValue()),
                'duration' => $sheetSupport->getCell("O{$row}")->getFormattedValue() ?: null,
                'note' => $sheetSupport->getCell("P{$row}")->getFormattedValue() ?: null,
            ]);
        }

        // 2. Import Technical Support (Sheet 2)
        $sheetTechnical = $spreadsheet->getSheet(2);
        $highestRowTechnical = $sheetTechnical->getHighestRow();

        $this->command->info("Seeding Technical Tickets...");

        // Row 1 is header, data starts at row 2
        for ($row = 2; $row <= $highestRowTechnical; $row++) {
            $dateVal = $sheetTechnical->getCell("A{$row}")->getValue();
            $reporter = trim($sheetTechnical->getCell("C{$row}")->getFormattedValue());
            $description = trim($sheetTechnical->getCell("D{$row}")->getFormattedValue());

            if (empty($dateVal) && empty($reporter) && empty($description)) {
                continue;
            }

            $date = $this->parseExcelDate($dateVal);
            if (!$date) {
                continue;
            }

            // Normalize Status ('Done' -> 'DONE', 'Belum ditangani' -> 'OPEN')
            $statusRaw = trim($sheetTechnical->getCell("G{$row}")->getFormattedValue());
            $status = 'OPEN';
            if (strcasecmp($statusRaw, 'Done') === 0 || strcasecmp($statusRaw, 'Selesai') === 0) {
                $status = 'DONE';
            } elseif (strcasecmp($statusRaw, 'Belum ditangani') === 0) {
                $status = 'OPEN';
            }

            Ticket::create([
                'type' => 'technical',
                'date' => $date,
                'reporter' => $reporter ?: 'Unknown',
                'location' => $sheetTechnical->getCell("B{$row}")->getFormattedValue() ?: null,
                'category' => $sheetTechnical->getCell("E{$row}")->getFormattedValue() ?: null,
                'problem' => $sheetTechnical->getCell("F{$row}")->getFormattedValue() ?: null,
                'status' => $status,
                'description' => $description ?: 'No description provided',
                'end_date' => $this->parseExcelDateTime($sheetTechnical->getCell("H{$row}")->getValue()),
                'action_taken' => $sheetTechnical->getCell("I{$row}")->getFormattedValue() ?: null,
                'note' => $sheetTechnical->getCell("J{$row}")->getFormattedValue() ?: null,
            ]);
        }
    }

    private function parseExcelDate($value)
    {
        if (empty($value)) {
            return null;
        }

        try {
            if (is_numeric($value)) {
                return CarbonImmutable::instance(ExcelDate::excelToDateTimeObject($value))->startOfDay();
            }
            return CarbonImmutable::parse($value)->startOfDay();
        } catch (\Exception $e) {
            return null;
        }
    }

    private function parseExcelDateTime($value)
    {
        if (empty($value)) {
            return null;
        }

        try {
            if (is_numeric($value)) {
                return CarbonImmutable::instance(ExcelDate::excelToDateTimeObject($value));
            }
            return CarbonImmutable::parse($value);
        } catch (\Exception $e) {
            return null;
        }
    }
}
