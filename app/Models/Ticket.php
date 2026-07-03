<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Carbon\CarbonImmutable;

/**
 * @property int $id
 * @property string $ticket_number
 * @property string $type
 * @property Carbon $date
 * @property string $reporter
 * @property string|null $division
 * @property string|null $receiver
 * @property string|null $source
 * @property string|null $category
 * @property string|null $application
 * @property string $description
 * @property string|null $location
 * @property string|null $problem
 * @property string|null $action_taken
 * @property string|null $attachment
 * @property int|null $assigned_to
 * @property string $status
 * @property Carbon|null $due_date
 * @property Carbon|null $start_date
 * @property Carbon|null $end_date
 * @property string|null $duration
 * @property string|null $note
 * @property string|null $feedback_token
 * @property int|null $feedback_rating
 * @property string|null $feedback_comment
 * @property Carbon|null $feedback_submitted_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User|null $assignee
 */
class Ticket extends Model
{
    use HasFactory;

    protected $appends = [
        'feedback_url',
        'has_feedback',
        'feedback_message',
    ];

    protected $fillable = [
        'type',
        'date',
        'reporter',
        'division',
        'receiver',
        'source',
        'category',
        'application',
        'description',
        'location',
        'problem',
        'action_taken',
        'attachment',
        'assigned_to',
        'status',
        'due_date',
        'start_date',
        'end_date',
        'duration',
        'note',
        'feedback_rating',
        'feedback_comment',
        'feedback_submitted_at',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'due_date' => 'date',
            'start_date' => 'datetime',
            'end_date' => 'datetime',
            'feedback_submitted_at' => 'datetime',
            'feedback_rating' => 'integer',
        ];
    }

    public const STATUSES = ['OPEN', 'SCHEDULED', 'ON PROGRESS', 'EVALUATE', 'REVISION', 'DONE'];

    public const CATEGORIES = [
        'BUG FIXING (P1)',
        'ISSUE DATA (P2)',
        'FEATURE REQUEST (P3)',
        'LACK OF KNOWLEDGE',
    ];

    public const APPLICATIONS = [
        'SIAGA API',
        'CC DAMKAR',
        'SIAP DAMKAR',
        'DATIN',
        'WEBSITE',
        'CMS',
        'DAMKAR ONE',
        'E-SATGAS',
        'E-PJLP',
        'E-APD',
        'E-RISPK',
    ];

    public const SOURCES = ['WA', 'Phone', 'Email', 'Walk-in', 'System'];

    public const TECHNICAL_CATEGORIES = ['Software', 'Hardware', 'Jaringan', 'Lainnya'];

    /**
     * Boot the model.
     */
    protected static function booted(): void
    {
        static::creating(function (Ticket $ticket) {
            if (empty($ticket->ticket_number)) {
                $ticket->ticket_number = static::generateTicketNumber($ticket->date);
            }
        });

        static::updating(function (Ticket $ticket) {
            // Generate feedback token when status changes to DONE
            if ($ticket->isDirty('status') && $ticket->status === 'DONE' && empty($ticket->feedback_token)) {
                $ticket->feedback_token = Str::random(32);
            }

            // Auto-set end_date when status changes to DONE
            if ($ticket->isDirty('status') && $ticket->status === 'DONE' && empty($ticket->end_date)) {
                $ticket->end_date = now();
            }

            // Auto-set start_date when status changes from OPEN to anything else
            if ($ticket->isDirty('status') && $ticket->getOriginal('status') === 'OPEN' && $ticket->status !== 'OPEN' && empty($ticket->start_date)) {
                $ticket->start_date = now();
            }

            // Calculate duration when end_date is set
            if ($ticket->start_date && $ticket->end_date) {
                $diff = $ticket->start_date->diff($ticket->end_date);
                $parts = [];
                if ($diff->d > 0) $parts[] = $diff->d . 'd';
                if ($diff->h > 0) $parts[] = $diff->h . 'h';
                if ($diff->i > 0) $parts[] = $diff->i . 'm';
                $ticket->duration = implode(' ', $parts) ?: '< 1m';
            }
        });
    }

    /**
     * Generate a unique ticket number in format TJ-YYMM-XXXX
     */
    public static function generateTicketNumber(CarbonImmutable $date = null): string
    {
        $date = $date ?? now();
        $prefix = 'TJ-' . $date->format('ym');

        $lastTicket = static::where('ticket_number', 'like', $prefix . '-%')
            ->orderByDesc('ticket_number')
            ->first();

        if ($lastTicket) {
            $lastNumber = (int) Str::afterLast($lastTicket->ticket_number, '-');
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }

        return $prefix . '-' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
    }

    /**
     * Get the user this ticket is assigned to.
     */
    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * Get the feedback URL for this ticket.
     */
    public function getFeedbackUrlAttribute(): ?string
    {
        if (! $this->feedback_token) {
            return null;
        }

        return url('/feedback/' . $this->feedback_token);
    }

    /**
     * Check if feedback has been submitted.
     */
    public function getHasFeedbackAttribute(): bool
    {
        return $this->feedback_submitted_at !== null;
    }

    /**
     * Get WhatsApp-ready feedback message.
     */
    public function getFeedbackMessageAttribute(): ?string
    {
        if (! $this->feedback_url) {
            return null;
        }

        return "Halo, tiket support Anda *{$this->ticket_number}* telah selesai dikerjakan.\n\nMohon berikan feedback melalui link berikut:\n{$this->feedback_url}\n\nTerima kasih! 🙏";
    }

    /**
     * Scope: filter by status.
     */
    public function scopeStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope: filter by type.
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }
}
