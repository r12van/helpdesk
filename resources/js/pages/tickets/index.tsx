import { Head, Link, router } from '@inertiajs/react';
import {
    CirclePlus,
    Edit,
    Eye,
    Filter,
    Search,
    Star,
    Ticket,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { CopyFeedbackLink } from '@/components/copy-feedback-link';
import { TicketStatusBadge } from '@/components/ticket-status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type {
    Agent,
    PaginatedData,
    TicketFilters,
    TicketStats,
    TicketStatus,
    Ticket as TicketType,
} from '@/types';

interface Props {
    tickets: PaginatedData<TicketType>;
    filters: TicketFilters;
    stats: TicketStats;
    agents: Agent[];
    categories: string[];
    applications: string[];
    statuses: TicketStatus[];
}

export default function TicketsIndex({
    tickets,
    filters,
    stats,
    agents,
    categories,
    applications,
    statuses,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const applyFilter = (key: string, value: string | undefined) => {
        const newFilters = {
            ...filters,
            [key]: value || undefined,
            page: undefined,
        };
        // Remove empty values
        Object.keys(newFilters).forEach((k) => {
            if (!newFilters[k as keyof typeof newFilters])
                delete newFilters[k as keyof typeof newFilters];
        });
        router.get(
            '/tickets',
            newFilters as unknown as Record<string, string>,
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleStatusChange = (
        ticket: TicketType,
        newStatus: TicketStatus,
    ) => {
        router.put(
            `/tickets/${ticket.id}`,
            {
                ...ticket,
                date: ticket.date
                    ? new Date(ticket.date).toISOString().split('T')[0]
                    : undefined,
                status: newStatus,
                assigned_to: ticket.assigned_to || '',
                redirect_back: true,
            },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilter('search', search || undefined);
    };

    const clearFilters = () => {
        setSearch('');
        router.get('/tickets', {}, { preserveState: true });
    };

    const hasFilters = Object.values(filters).some((v) => v);

    return (
        <>
            <Head title="Tickets" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                    <StatCard
                        label="Total Tickets"
                        value={stats.total}
                        color="bg-slate-500"
                        href="/tickets"
                    />
                    <StatCard
                        label="Open"
                        value={stats.open}
                        color="bg-blue-500"
                        href="/tickets?status=OPEN"
                    />
                    <StatCard
                        label="In Progress"
                        value={stats.in_progress}
                        color="bg-amber-500"
                        href="/tickets?status=ON PROGRESS"
                    />
                    <StatCard
                        label="Done"
                        value={stats.done}
                        color="bg-emerald-500"
                        href="/tickets?status=DONE"
                    />
                </div>

                {/* Toolbar */}
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
                        {/* Search */}
                        <form
                            onSubmit={handleSearch}
                            className="relative flex-1 md:max-w-sm"
                        >
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Cari tiket..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </form>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-2">
                            <Select
                                value={filters.status || ''}
                                onValueChange={(v) => applyFilter('status', v)}
                            >
                                <SelectTrigger className="w-[140px]">
                                    <Filter className="mr-1.5 size-3.5" />
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statuses.map((s) => (
                                        <SelectItem key={s} value={s}>
                                            {s}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.type || ''}
                                onValueChange={(v) => applyFilter('type', v)}
                            >
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="support">
                                        Support
                                    </SelectItem>
                                    <SelectItem value="technical">
                                        Technical
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.application || ''}
                                onValueChange={(v) =>
                                    applyFilter('application', v)
                                }
                            >
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Application" />
                                </SelectTrigger>
                                <SelectContent>
                                    {applications.map((a) => (
                                        <SelectItem key={a} value={a}>
                                            {a}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {hasFilters && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFilters}
                                    className="h-9 text-muted-foreground"
                                >
                                    <X className="mr-1 size-3.5" /> Clear
                                </Button>
                            )}
                        </div>
                    </div>

                    <Link href="/tickets/create">
                        <Button className="w-full md:w-auto">
                            <CirclePlus className="mr-1.5 size-4" />
                            New Ticket
                        </Button>
                    </Link>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="w-[140px]">
                                    Ticket #
                                </TableHead>
                                <TableHead className="w-[100px]">
                                    Type
                                </TableHead>
                                <TableHead>Reporter</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="w-[120px]">
                                    Application
                                </TableHead>
                                <TableHead className="w-[120px]">
                                    Assigned To
                                </TableHead>
                                <TableHead className="w-[120px]">
                                    Status
                                </TableHead>
                                <TableHead className="w-[100px]">
                                    Rating
                                </TableHead>
                                <TableHead className="w-[100px]">
                                    Date
                                </TableHead>
                                <TableHead className="w-[140px]">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tickets.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={10}
                                        className="py-12 text-center"
                                    >
                                        <Ticket className="mx-auto mb-3 size-10 text-muted-foreground/40" />
                                        <p className="text-muted-foreground">
                                            Belum ada tiket.
                                        </p>
                                        <Link
                                            href="/tickets/create"
                                            className="mt-2 inline-block text-sm text-primary underline"
                                        >
                                            Buat tiket baru
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tickets.data.map((ticket) => (
                                    <TableRow
                                        key={ticket.id}
                                        className="group cursor-pointer transition-colors hover:bg-muted/30"
                                    >
                                        <TableCell>
                                            <Link
                                                href={`/tickets/${ticket.id}`}
                                                className="font-mono text-sm font-semibold text-primary hover:underline"
                                            >
                                                {ticket.ticket_number}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className="text-xs capitalize"
                                            >
                                                {ticket.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">
                                                {ticket.reporter}
                                            </div>
                                            {ticket.division && (
                                                <div className="text-xs text-muted-foreground">
                                                    {ticket.division}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="max-w-[300px]">
                                            <p className="truncate text-sm">
                                                {ticket.description}
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            {ticket.application && (
                                                <Badge
                                                    variant="secondary"
                                                    className="text-xs"
                                                >
                                                    {ticket.application}
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {ticket.assignee?.name || (
                                                <span className="text-muted-foreground">
                                                    —
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <TicketStatusBadge
                                                status={ticket.status}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {ticket.feedback_rating ? (
                                                <div className="flex items-center gap-1 text-amber-500">
                                                    <Star className="size-3.5 fill-current" />
                                                    <span className="text-sm font-semibold">
                                                        {ticket.feedback_rating}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">
                                                    —
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {new Date(
                                                ticket.date,
                                            ).toLocaleDateString('id-ID', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5">
                                                {ticket.status !== 'DONE' ? (
                                                    <Select
                                                        value={ticket.status}
                                                        onValueChange={(v) =>
                                                            handleStatusChange(
                                                                ticket,
                                                                v as TicketStatus,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="h-7 w-[120px] text-xs">
                                                            <SelectValue placeholder="Status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {statuses.map(
                                                                (s) => (
                                                                    <SelectItem
                                                                        key={s}
                                                                        value={
                                                                            s
                                                                        }
                                                                        className="text-xs"
                                                                    >
                                                                        {s}
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                ) : ticket.status === 'DONE' &&
                                                  !ticket.has_feedback ? (
                                                    <CopyFeedbackLink
                                                        feedbackMessage={
                                                            ticket.feedback_message
                                                        }
                                                        feedbackUrl={
                                                            ticket.feedback_url
                                                        }
                                                        showLabel={false}
                                                        size="sm"
                                                        variant="outline"
                                                    />
                                                ) : (
                                                    <>
                                                        <Link
                                                            href={`/tickets/${ticket.id}`}
                                                        >
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="size-7"
                                                                title="View Detail"
                                                            >
                                                                <Eye className="size-3.5 text-muted-foreground" />
                                                            </Button>
                                                        </Link>
                                                        <Link
                                                            href={`/tickets/${ticket.id}/edit`}
                                                        >
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="size-7"
                                                                title="Edit Ticket"
                                                            >
                                                                <Edit className="size-3.5 text-muted-foreground" />
                                                            </Button>
                                                        </Link>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {tickets.last_page > 1 && (
                    <div className="flex items-center justify-between px-2">
                        <p className="text-sm text-muted-foreground">
                            Showing {tickets.from}–{tickets.to} of{' '}
                            {tickets.total} tickets
                        </p>
                        <div className="flex gap-1">
                            {tickets.links.map((link, i) => (
                                <Button
                                    key={i}
                                    variant={
                                        link.active ? 'default' : 'outline'
                                    }
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() =>
                                        link.url &&
                                        router.get(
                                            link.url,
                                            {},
                                            { preserveState: true },
                                        )
                                    }
                                    className="h-8 min-w-8"
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

function StatCard({
    label,
    value,
    color,
    href,
}: {
    label: string;
    value: number;
    color: string;
    href?: string;
}) {
    const cardContent = (
        <div className="relative h-full cursor-pointer overflow-hidden rounded-xl border border-sidebar-border/70 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted/10 hover:shadow-sm dark:border-sidebar-border">
            <div className={`absolute top-0 left-0 h-1 w-full ${color}`} />
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
        </div>
    );

    if (href) {
        return (
            <Link href={href} className="block h-full w-full">
                {cardContent}
            </Link>
        );
    }

    return cardContent;
}

TicketsIndex.layout = {
    breadcrumbs: [{ title: 'Tickets', href: '/tickets' }],
};
