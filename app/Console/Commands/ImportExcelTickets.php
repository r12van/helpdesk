<?php

namespace App\Console\Commands;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Console\Command;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class ImportExcelTickets extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'helpdesk:import {file=../Application Support Log.xlsx}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import helpdesk tickets from the Excel support log';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $filePath = $this->argument('file');
        
        // Resolve absolute path if relative
        if (!file_exists($filePath)) {
            // Try in the project root's parent folder
            $workspacePath = base_path('../Application Support Log.xlsx');
            if (file_exists($workspacePath)) {
                $filePath = $workspacePath;
            } else {
                $this->error("Excel file not found at: {$filePath}");
                return 1;
            }
        }

        $this->info("Loading Excel file: {$filePath}...");
        $spreadsheet = IOFactory::load($filePath);

        // Fetch users map for assignee lookup
        $users = User::pluck('id', 'name')->toArray();

        // 1. Import "Support Ticket SI" Sheet
        $this->importSupportTickets($spreadsheet, $users);

        // 2. Import "Technical Support" Sheet
        $this->importTechnicalSupport($spreadsheet, $users);

        $this->info("Import completed successfully!");
        return 0;
    }

    private function importSupportTickets($spreadsheet, $users)
    {
        $sheet = $spreadsheet->getSheet(0); // First sheet: Support Ticket SI
        $highestRow = $sheet->getHighestRow();
        
        $this->info("Importing Support Tickets SI (Rows: {$highestRow})...");
        
        $count = 0;
        // Data starts at row 6
        for ($row = 6; $row <= $highestRow; $row++) {
            $dateVal = $sheet->getCell("A{$row}")->getValue();
            $reporter = $sheet->getCell("B{$row}")->getValue();
            $description = $sheet->getCell("H{$row}")->getValue();
            
            // Skip empty rows
            if (empty($reporter) && empty($description) && empty($dateVal)) {
                continue;
            }

            // Parse Date
            $date = $this->parseExcelDate($sheet->getCell("A{$row}"));
            if (!$date) {
                $date = now()->format('Y-m-d');
            }

            $assigneeName = $sheet->getCell("J{$row}")->getValue();
            $assignedTo = null;
            if ($assigneeName && isset($users[$assigneeName])) {
                $assignedTo = $users[$assigneeName];
            }

            // Status mapping
            $excelStatus = strtoupper(trim($sheet->getCell("K{$row}")->getValue() ?? ''));
            $status = 'OPEN';
            if ($excelStatus === 'DONE') $status = 'DONE';
            elseif ($excelStatus === 'ON PROGRESS' || $excelStatus === 'PROGRESS') $status = 'ON PROGRESS';
            elseif ($excelStatus === 'SCHEDULED') $status = 'SCHEDULED';
            elseif ($excelStatus === 'EVALUATE') $status = 'EVALUATE';
            elseif ($excelStatus === 'REVISION') $status = 'REVISION';

            // Due date
            $dueDate = $this->parseExcelDate($sheet->getCell("L{$row}"));
            
            // Start & End dates
            $startDate = $this->parseExcelDateTime($sheet->getCell("M{$row}"));
            $endDate = $this->parseExcelDateTime($sheet->getCell("N{$row}"));

            $ticketData = [
                'type' => 'support',
                'date' => $date,
                'reporter' => $reporter ?? 'Unknown',
                'division' => $sheet->getCell("C{$row}")->getValue() ?: $sheet->getCell("B{$row}")->getValue(),
                'receiver' => $sheet->getCell("D{$row}")->getValue(),
                'source' => $sheet->getCell("E{$row}")->getValue() ?: 'WA',
                'category' => $sheet->getCell("F{$row}")->getValue() ?: 'BUG FIXING (P1)',
                'application' => $sheet->getCell("G{$row}")->getValue() ?: 'CC DAMKAR',
                'description' => $description ?? 'Tidak ada deskripsi',
                'assigned_to' => $assignedTo,
                'status' => $status,
                'due_date' => $dueDate,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'duration' => $sheet->getCell("O{$row}")->getValue(),
                'note' => $sheet->getCell("P{$row}")->getValue(),
            ];

            // Avoid duplicates by checking date, reporter, and description
            $exists = Ticket::where('type', 'support')
                ->where('reporter', $ticketData['reporter'])
                ->where('description', $ticketData['description'])
                ->exists();

            if (!$exists) {
                Ticket::create($ticketData);
                $count++;
            }
        }

        $this->info("Imported {$count} support tickets.");
    }

    private function importTechnicalSupport($spreadsheet, $users)
    {
        // Try to find the Technical Support sheet (index 2 usually)
        $sheet = null;
        foreach ($spreadsheet->getAllSheets() as $s) {
            if (Str::contains(strtolower($s->getTitle()), 'technical')) {
                $sheet = $s;
                break;
            }
        }

        if (!$sheet) {
            $this->warn("Technical Support sheet not found, skipping.");
            return;
        }

        $highestRow = $sheet->getHighestRow();
        $this->info("Importing Technical Support (Rows: {$highestRow})...");

        $count = 0;
        // Data starts at row 2
        for ($row = 2; $row <= $highestRow; $row++) {
            $waktuLaporan = $sheet->getCell("A{$row}")->getValue();
            $reporter = $sheet->getCell("C{$row}")->getValue();
            $laporan = $sheet->getCell("D{$row}")->getValue();

            // Skip empty rows
            if (empty($reporter) && empty($laporan) && empty($waktuLaporan)) {
                continue;
            }

            // Parse Date
            $date = $this->parseExcelDate($sheet->getCell("A{$row}"));
            if (!$date) {
                $date = now()->format('Y-m-d');
            }

            // Status mapping
            $excelStatus = strtolower(trim($sheet->getCell("G{$row}")->getValue() ?? ''));
            $status = 'OPEN';
            if ($excelStatus === 'done' || $excelStatus === 'selesai') {
                $status = 'DONE';
            } elseif (Str::contains($excelStatus, 'progress') || Str::contains($excelStatus, 'jalan')) {
                $status = 'ON PROGRESS';
            }

            // Start & End dates
            $startDate = $this->parseExcelDateTime($sheet->getCell("A{$row}"));
            $endDate = $this->parseExcelDateTime($sheet->getCell("H{$row}"));

            $ticketData = [
                'type' => 'technical',
                'date' => $date,
                'location' => $sheet->getCell("B{$row}")->getValue(),
                'reporter' => $reporter ?? 'Unknown',
                'description' => $laporan ?? 'Tidak ada deskripsi',
                'category' => $sheet->getCell("E{$row}")->getValue() ?: 'Lainnya',
                'problem' => $sheet->getCell("F{$row}")->getValue(),
                'status' => $status,
                'end_date' => $endDate,
                'start_date' => $startDate,
                'action_taken' => $sheet->getCell("H{$row}")->getValue(), // Action taken is in column I or H? Excel printout: Action/Tindakan is Column I
                'note' => $sheet->getCell("J{$row}")->getValue(),
            ];

            // Let's adjust action_taken and notes based on the columns
            // Waktu Laporan(A) | Lokasi(B) | Pelapor(C) | Laporan(D) | Kategori(E) | Masalah(F) | Status(G) | Waktu Selesai(H) | Tindakan(I) | Notes(J)
            $ticketData['action_taken'] = $sheet->getCell("I{$row}")->getValue();

            // Check if ticket already exists
            $exists = Ticket::where('type', 'technical')
                ->where('reporter', $ticketData['reporter'])
                ->where('description', $ticketData['description'])
                ->exists();

            if (!$exists) {
                Ticket::create($ticketData);
                $count++;
            }
        }

        $this->info("Imported {$count} technical support tickets.");
    }

    private function parseExcelDate($cell)
    {
        $value = $cell->getValue();
        if (empty($value)) return null;

        try {
            if (\PhpOffice\PhpSpreadsheet\Shared\Date::isDateTime($cell)) {
                return Carbon::instance(\PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($value))->format('Y-m-d');
            }
            // Fallback to text parsing
            return Carbon::parse($value)->format('Y-m-d');
        } catch (\Exception $e) {
            return null;
        }
    }

    private function parseExcelDateTime($cell)
    {
        $value = $cell->getValue();
        if (empty($value)) return null;

        try {
            if (\PhpOffice\PhpSpreadsheet\Shared\Date::isDateTime($cell)) {
                return Carbon::instance(\PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($value));
            }
            return Carbon::parse($value);
        } catch (\Exception $e) {
            return null;
        }
    }
}
