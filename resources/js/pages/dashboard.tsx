import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    CirclePlus,
    Clock,
    CheckCircle2,
    AlertCircle,
    Ticket,
} from 'lucide-react';
import { TicketStatusBadge } from '@/components/ticket-status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes';
import type { TicketStats, Ticket as TicketType } from '@/types';

interface Props {
    stats: TicketStats;
    recentTickets: TicketType[];
    byCategory: Record<string, number>;
    byApplication: Record<string, number>;
}

export default function Dashboard() {
    const { stats, recentTickets, byCategory, byApplication } = usePage<{
        props: Props;
    }>().props as unknown as Props;

    // Fallback for when no data is passed yet
    const safeStats = stats || { total: 0, open: 0, in_progress: 0, done: 0 };
    const safeRecent = recentTickets || [];
    const safeByCategory = byCategory || {};
    const safeByApp = byApplication || {};

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                {/* Welcome */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Dashboard
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            IT Helpdesk Ticketing System — Disgulkarmat
                        </p>
                    </div>
                    <Link href="/tickets/create">
                        <Button>
                            <CirclePlus className="mr-1.5 size-4" /> New Ticket
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                    <DashboardCard
                        icon={Ticket}
                        label="Total Tickets"
                        value={safeStats.total}
                        iconColor="text-slate-600 dark:text-slate-400"
                        bgColor="bg-slate-100 dark:bg-slate-800"
                        href="/tickets"
                    />
                    <DashboardCard
                        icon={AlertCircle}
                        label="Open"
                        value={safeStats.open}
                        iconColor="text-blue-600 dark:text-blue-400"
                        bgColor="bg-blue-100 dark:bg-blue-900/40"
                        href="/tickets?status=OPEN"
                    />
                    <DashboardCard
                        icon={Clock}
                        label="In Progress"
                        value={safeStats.in_progress}
                        iconColor="text-amber-600 dark:text-amber-400"
                        bgColor="bg-amber-100 dark:bg-amber-900/40"
                        href="/tickets?status=ON PROGRESS"
                    />
                    <DashboardCard
                        icon={CheckCircle2}
                        label="Done"
                        value={safeStats.done}
                        iconColor="text-emerald-600 dark:text-emerald-400"
                        bgColor="bg-emerald-100 dark:bg-emerald-900/40"
                        href="/tickets?status=DONE"
                    />
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Recent Tickets */}
                    <Card className="md:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Recent Tickets</CardTitle>
                            <Link
                                href="/tickets"
                                className="flex items-center gap-1 text-sm text-primary hover:underline"
                            >
                                View All <ArrowRight className="size-3.5" />
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {safeRecent.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <Ticket className="mb-3 size-10 text-muted-foreground/30" />
                                    <p className="text-muted-foreground">
                                        Belum ada tiket
                                    </p>
                                    <Link
                                        href="/tickets/create"
                                        className="mt-2 text-sm text-primary underline"
                                    >
                                        Buat tiket pertama
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {safeRecent.map((ticket) => (
                                        <Link
                                            key={ticket.id}
                                            href={`/tickets/${ticket.id}`}
                                            className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-xs font-semibold text-primary">
                                                        {ticket.ticket_number}
                                                    </span>
                                                    <Badge
                                                        variant="outline"
                                                        className="text-[10px] capitalize"
                                                    >
                                                        {ticket.type}
                                                    </Badge>
                                                </div>
                                                <p className="mt-0.5 truncate text-sm">
                                                    {ticket.description}
                                                </p>
                                                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span>
                                                        {ticket.reporter}
                                                    </span>
                                                    {ticket.application && (
                                                        <>
                                                            <span>·</span>
                                                            <span>
                                                                {
                                                                    ticket.application
                                                                }
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <TicketStatusBadge
                                                status={ticket.status}
                                                className="ml-3 shrink-0"
                                            />
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Breakdown */}
                    <div className="space-y-6">
                        {/* By Category */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">
                                    By Category
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {Object.keys(safeByCategory).length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        No data
                                    </p>
                                ) : (
                                    <div className="space-y-2">
                                        {Object.entries(safeByCategory).map(
                                            ([category, count]) => (
                                                <div
                                                    key={category}
                                                    className="flex items-center justify-between text-sm"
                                                >
                                                    <span className="truncate">
                                                        {category}
                                                    </span>
                                                    <Badge variant="secondary">
                                                        {count}
                                                    </Badge>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* By Application */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">
                                    By Application
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {Object.keys(safeByApp).length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        No data
                                    </p>
                                ) : (
                                    <div className="space-y-2">
                                        {Object.entries(safeByApp).map(
                                            ([app, count]) => (
                                                <div
                                                    key={app}
                                                    className="flex items-center justify-between text-sm"
                                                >
                                                    <span className="truncate">
                                                        {app}
                                                    </span>
                                                    <Badge variant="secondary">
                                                        {count}
                                                    </Badge>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

function DashboardCard({
    icon: Icon,
    label,
    value,
    iconColor,
    bgColor,
    href,
}: {
    icon: React.ElementType;
    label: string;
    value: number;
    iconColor: string;
    bgColor: string;
    href?: string;
}) {
    const cardContent = (
        <CardContent className="flex items-center gap-4 p-4">
            <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${bgColor}`}
            >
                <Icon className={`size-5 ${iconColor}`} />
            </div>
            <div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
            </div>
        </CardContent>
    );

    if (href) {
        return (
            <Card className="cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted/10 hover:shadow-md">
                <Link href={href} className="block h-full w-full">
                    {cardContent}
                </Link>
            </Card>
        );
    }

    return <Card>{cardContent}</Card>;
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
