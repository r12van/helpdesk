<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\User;
use App\Models\MasterOption;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TicketController extends Controller
{
    /**
     * Display a listing of tickets.
     */
    public function index(Request $request): Response
    {
        $query = Ticket::with('assignee')
            ->orderByDesc('date')
            ->orderByDesc('created_at');

        // Filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('application')) {
            $query->where('application', $request->application);
        }

        if ($request->filled('assigned_to')) {
            $query->where('assigned_to', $request->assigned_to);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('ticket_number', 'like', "%{$search}%")
                    ->orWhere('reporter', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('application', 'like', "%{$search}%");
            });
        }

        $tickets = $query->paginate(15)->withQueryString();

        // Stats
        $stats = [
            'total' => Ticket::count(),
            'open' => Ticket::where('status', 'OPEN')->count(),
            'in_progress' => Ticket::where('status', 'ON PROGRESS')->count(),
            'done' => Ticket::where('status', 'DONE')->count(),
        ];

        return Inertia::render('tickets/index', [
            'tickets' => $tickets,
            'filters' => $request->only(['status', 'type', 'category', 'application', 'assigned_to', 'search']),
            'stats' => $stats,
            'agents' => User::select('id', 'name')->orderBy('name')->get(),
            'categories' => MasterOption::getValues('category', Ticket::CATEGORIES),
            'applications' => MasterOption::getValues('application', Ticket::APPLICATIONS),
            'statuses' => MasterOption::getValues('status', Ticket::STATUSES),
        ]);
    }

    /**
     * Show the form for creating a new ticket.
     */
    public function create(): Response
    {
        return Inertia::render('tickets/create', [
            'agents' => User::select('id', 'name')->orderBy('name')->get(),
            'categories' => MasterOption::getValues('category', Ticket::CATEGORIES),
            'technicalCategories' => MasterOption::getValues('technical_category', Ticket::TECHNICAL_CATEGORIES),
            'applications' => MasterOption::getValues('application', Ticket::APPLICATIONS),
            'sources' => MasterOption::getValues('source', Ticket::SOURCES),
            'statuses' => MasterOption::getValues('status', Ticket::STATUSES),
        ]);
    }

    /**
     * Store a newly created ticket.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'type' => 'required|in:support,technical',
            'date' => 'required|date',
            'reporter' => 'required|string|max:255',
            'division' => 'nullable|string|max:255',
            'receiver' => 'nullable|string|max:255',
            'source' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
            'application' => 'nullable|string|max:255',
            'description' => 'required|string',
            'location' => 'nullable|string|max:255',
            'problem' => 'nullable|string',
            'action_taken' => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id',
            'status' => 'required|in:' . implode(',', MasterOption::getValues('status', Ticket::STATUSES)),
            'due_date' => 'nullable|date',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'note' => 'nullable|string',
            'attachment' => 'nullable|file|max:10240',
        ]);

        if ($request->hasFile('attachment')) {
            $validated['attachment'] = $request->file('attachment')->store('attachments', 'public');
        }

        $ticket = Ticket::create($validated);

        return redirect()->route('tickets.show', $ticket)
            ->with('success', "Ticket {$ticket->ticket_number} berhasil dibuat!");
    }

    /**
     * Display the specified ticket.
     */
    public function show(Ticket $ticket): Response
    {
        $ticket->load('assignee');

        return Inertia::render('tickets/show', [
            'ticket' => array_merge($ticket->toArray(), [
                'feedback_url' => $ticket->feedback_url,
                'feedback_message' => $ticket->feedback_message,
                'has_feedback' => $ticket->has_feedback,
            ]),
            'agents' => User::select('id', 'name')->orderBy('name')->get(),
            'statuses' => MasterOption::getValues('status', Ticket::STATUSES),
        ]);
    }

    /**
     * Show the form for editing the specified ticket.
     */
    public function edit(Ticket $ticket): Response
    {
        $ticket->load('assignee');

        return Inertia::render('tickets/edit', [
            'ticket' => $ticket,
            'agents' => User::select('id', 'name')->orderBy('name')->get(),
            'categories' => MasterOption::getValues('category', Ticket::CATEGORIES),
            'technicalCategories' => MasterOption::getValues('technical_category', Ticket::TECHNICAL_CATEGORIES),
            'applications' => MasterOption::getValues('application', Ticket::APPLICATIONS),
            'sources' => MasterOption::getValues('source', Ticket::SOURCES),
            'statuses' => MasterOption::getValues('status', Ticket::STATUSES),
        ]);
    }

    /**
     * Update the specified ticket.
     */
    public function update(Request $request, Ticket $ticket): RedirectResponse
    {
        $validated = $request->validate([
            'type' => 'required|in:support,technical',
            'date' => 'required|date',
            'reporter' => 'required|string|max:255',
            'division' => 'nullable|string|max:255',
            'receiver' => 'nullable|string|max:255',
            'source' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
            'application' => 'nullable|string|max:255',
            'description' => 'required|string',
            'location' => 'nullable|string|max:255',
            'problem' => 'nullable|string',
            'action_taken' => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id',
            'status' => 'required|in:' . implode(',', MasterOption::getValues('status', Ticket::STATUSES)),
            'due_date' => 'nullable|date',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'note' => 'nullable|string',
            'attachment' => 'nullable|file|max:10240',
        ]);

        if ($request->hasFile('attachment')) {
            // Delete old attachment
            if ($ticket->attachment) {
                Storage::disk('public')->delete($ticket->attachment);
            }
            $validated['attachment'] = $request->file('attachment')->store('attachments', 'public');
        }

        $ticket->update($validated);

        if ($request->input('redirect_back')) {
            return redirect()->back()
                ->with('success', "Ticket {$ticket->ticket_number} berhasil diupdate!");
        }

        return redirect()->route('tickets.show', $ticket)
            ->with('success', "Ticket {$ticket->ticket_number} berhasil diupdate!");
    }

    /**
     * Remove the specified ticket.
     */
    public function destroy(Ticket $ticket): RedirectResponse
    {
        if ($ticket->attachment) {
            Storage::disk('public')->delete($ticket->attachment);
        }

        $ticketNumber = $ticket->ticket_number;
        $ticket->delete();

        return redirect()->route('tickets.index')
            ->with('success', "Ticket {$ticketNumber} berhasil dihapus!");
    }
}
