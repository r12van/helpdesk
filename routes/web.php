<?php

use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Route;

use App\Models\Ticket;
use Inertia\Inertia;

Route::prefix(env('ROUTE_PREFIX', ''))->group(function () {
    Route::inertia('/', 'welcome')->name('home');

    Route::middleware(['auth', 'verified'])->group(function () {
        Route::get('dashboard', function () {
            $stats = [
                'total' => Ticket::count(),
                'open' => Ticket::where('status', 'OPEN')->count(),
                'in_progress' => Ticket::where('status', 'ON PROGRESS')->count(),
                'done' => Ticket::where('status', 'DONE')->count(),
            ];

            $recentTickets = Ticket::with('assignee')
                ->orderByDesc('created_at')
                ->take(5)
                ->get();

            $byCategory = Ticket::whereNotNull('category')
                ->select('category', \DB::raw('count(*) as count'))
                ->groupBy('category')
                ->pluck('count', 'category')
                ->toArray();

            $byApplication = Ticket::whereNotNull('application')
                ->select('application', \DB::raw('count(*) as count'))
                ->groupBy('application')
                ->pluck('count', 'application')
                ->toArray();

            return Inertia::render('dashboard', [
                'stats' => $stats,
                'recentTickets' => $recentTickets,
                'byCategory' => $byCategory,
                'byApplication' => $byApplication,
            ]);
        })->name('dashboard');

        Route::resource('tickets', TicketController::class);

        // Administration routes
        Route::prefix('admin')->name('admin.')->group(function () {
            Route::resource('users', \App\Http\Controllers\Admin\UserController::class);
            Route::resource('options', \App\Http\Controllers\Admin\MasterOptionController::class)->only(['index', 'store', 'destroy']);
        });
    });

    // Public feedback routes (no auth required)
    Route::get('feedback/{token}', [FeedbackController::class, 'show'])->name('feedback.show');
    Route::post('feedback/{token}', [FeedbackController::class, 'store'])->name('feedback.store');

    require __DIR__.'/settings.php';
});
