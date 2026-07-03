<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FeedbackController extends Controller
{
    /**
     * Display the public feedback form.
     */
    public function show(string $token): Response|RedirectResponse
    {
        $ticket = Ticket::where('feedback_token', $token)->first();

        if (! $ticket) {
            abort(404, 'Feedback link tidak valid.');
        }

        return Inertia::render('feedback', [
            'ticket' => [
                'ticket_number' => $ticket->ticket_number,
                'description' => $ticket->description,
                'application' => $ticket->application,
                'category' => $ticket->category,
                'date' => $ticket->date->format('d M Y'),
                'status' => $ticket->status,
                'has_feedback' => $ticket->has_feedback,
                'feedback_rating' => $ticket->feedback_rating,
                'feedback_comment' => $ticket->feedback_comment,
            ],
            'token' => $token,
        ]);
    }

    /**
     * Store the feedback submission.
     */
    public function store(Request $request, string $token): RedirectResponse
    {
        $ticket = Ticket::where('feedback_token', $token)->firstOrFail();

        if ($ticket->has_feedback) {
            return redirect()->route('feedback.show', $token)
                ->with('error', 'Feedback sudah pernah diberikan untuk tiket ini.');
        }

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $ticket->update([
            'feedback_rating' => $validated['rating'],
            'feedback_comment' => $validated['comment'],
            'feedback_submitted_at' => now(),
        ]);

        return redirect()->route('feedback.show', $token)
            ->with('success', 'Terima kasih atas feedback Anda!');
    }
}
