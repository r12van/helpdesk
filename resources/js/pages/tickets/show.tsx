import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Clock,
    Edit,
    MapPin,
    MessageCircle,
    Star,
    Trash2,
    User,
} from 'lucide-react';
import { CopyFeedbackLink } from '@/components/copy-feedback-link';
import { TicketStatusBadge } from '@/components/ticket-status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import type { Agent, TicketStatus, Ticket as TicketType } from '@/types';

interface Props {
    ticket: TicketType;
    agents: Agent[];
    statuses: TicketStatus[];
}

export default function ShowTicket({ ticket, agents, statuses }: Props) {
    const handleStatusChange = (newStatus: string) => {
        router.put(
            `/tickets/${ticket.id}`,
            {
                ...ticket,
                status: newStatus,
                assigned_to: ticket.assigned_to,
            },
            {
                preserveScroll: true,
            },
        );
    };

    const handleDelete = () => {
        if (confirm('Yakin ingin menghapus tiket ini?')) {
            router.delete(`/tickets/${ticket.id}`);
        }
    };

    const formatDate = (date: string | null) => {
        if (!date) return '—';
        return new Date(date).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    const formatDateTime = (date: string | null) => {
        if (!date) return '—';
        return new Date(date).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <>
            <Head title={`Ticket ${ticket.ticket_number}`} />
            <div className="mx-auto w-full max-w-5xl p-4 md:p-6">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <Link
                            href="/tickets"
                            className="mb-2 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="mr-1 size-4" /> Back to
                            Tickets
                        </Link>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold tracking-tight">
                                {ticket.ticket_number}
                            </h1>
                            <TicketStatusBadge status={ticket.status} />
                            <Badge variant="outline" className="capitalize">
                                {ticket.type}
                            </Badge>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {ticket.status === 'DONE' && (
                            <CopyFeedbackLink
                                feedbackMessage={ticket.feedback_message}
                                feedbackUrl={ticket.feedback_url}
                            />
                        )}
                        <Link href={`/tickets/${ticket.id}/edit`}>
                            <Button variant="outline" size="sm">
                                <Edit className="mr-1.5 size-3.5" /> Edit
                            </Button>
                        </Link>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDelete}
                        >
                            <Trash2 className="mr-1.5 size-3.5" /> Delete
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 md:col-span-2">
                        {/* Description */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="leading-relaxed whitespace-pre-wrap">
                                    {ticket.description}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Technical Details */}
                        {ticket.type === 'technical' &&
                            (ticket.problem || ticket.action_taken) && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Technical Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {ticket.problem && (
                                            <div>
                                                <p className="mb-1 text-sm font-medium text-muted-foreground">
                                                    Problem / Root Cause
                                                </p>
                                                <p className="whitespace-pre-wrap">
                                                    {ticket.problem}
                                                </p>
                                            </div>
                                        )}
                                        {ticket.action_taken && (
                                            <div>
                                                <p className="mb-1 text-sm font-medium text-muted-foreground">
                                                    Action Taken
                                                </p>
                                                <p className="whitespace-pre-wrap">
                                                    {ticket.action_taken}
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                        {/* Note */}
                        {ticket.note && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Note</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="whitespace-pre-wrap">
                                        {ticket.note}
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Feedback */}
                        {ticket.has_feedback && (
                            <Card className="border-emerald-200 dark:border-emerald-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MessageCircle className="size-5 text-emerald-600" />
                                        User Feedback
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-2 flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`size-5 ${
                                                    star <=
                                                    (ticket.feedback_rating ||
                                                        0)
                                                        ? 'fill-amber-400 text-amber-400'
                                                        : 'text-muted-foreground/30'
                                                }`}
                                            />
                                        ))}
                                        <span className="ml-2 text-sm font-medium">
                                            {ticket.feedback_rating}/5
                                        </span>
                                    </div>
                                    {ticket.feedback_comment && (
                                        <p className="mt-2 text-sm text-muted-foreground italic">
                                            &ldquo;{ticket.feedback_comment}
                                            &rdquo;
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">
                                    Quick Status Change
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Select
                                    value={ticket.status}
                                    onValueChange={handleStatusChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statuses.map((s) => (
                                            <SelectItem key={s} value={s}>
                                                {s}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </CardContent>
                        </Card>

                        {/* Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">
                                    Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <DetailRow
                                    icon={Calendar}
                                    label="Date"
                                    value={formatDate(ticket.date)}
                                />
                                <DetailRow
                                    icon={User}
                                    label="Reporter"
                                    value={ticket.reporter}
                                />
                                {ticket.division && (
                                    <DetailRow
                                        label="Division"
                                        value={ticket.division}
                                    />
                                )}
                                {ticket.receiver && (
                                    <DetailRow
                                        label="Receiver"
                                        value={ticket.receiver}
                                    />
                                )}
                                {ticket.source && (
                                    <DetailRow
                                        label="Source"
                                        value={ticket.source}
                                    />
                                )}
                                {ticket.category && (
                                    <DetailRow
                                        label="Category"
                                        value={ticket.category}
                                    />
                                )}
                                {ticket.application && (
                                    <DetailRow
                                        label="Application"
                                        value={ticket.application}
                                    />
                                )}
                                {ticket.location && (
                                    <DetailRow
                                        icon={MapPin}
                                        label="Location"
                                        value={ticket.location}
                                    />
                                )}
                                <Separator />
                                <DetailRow
                                    icon={User}
                                    label="Assigned To"
                                    value={
                                        ticket.assignee?.name || 'Unassigned'
                                    }
                                />
                                {ticket.due_date && (
                                    <DetailRow
                                        icon={Calendar}
                                        label="Due Date"
                                        value={formatDate(ticket.due_date)}
                                    />
                                )}
                                {ticket.start_date && (
                                    <DetailRow
                                        icon={Clock}
                                        label="Started"
                                        value={formatDateTime(
                                            ticket.start_date,
                                        )}
                                    />
                                )}
                                {ticket.end_date && (
                                    <DetailRow
                                        icon={Clock}
                                        label="Completed"
                                        value={formatDateTime(ticket.end_date)}
                                    />
                                )}
                                {ticket.duration && (
                                    <DetailRow
                                        icon={Clock}
                                        label="Duration"
                                        value={ticket.duration}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

function DetailRow({
    icon: Icon,
    label,
    value,
}: {
    icon?: React.ElementType;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start justify-between gap-2">
            <span className="flex items-center gap-1.5 text-muted-foreground">
                {Icon && <Icon className="size-3.5" />}
                {label}
            </span>
            <span className="text-right font-medium">{value}</span>
        </div>
    );
}

ShowTicket.layout = {
    breadcrumbs: [
        { title: 'Tickets', href: '/tickets' },
        { title: 'Detail', href: '#' },
    ],
};
