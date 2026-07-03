import type { TicketStatus } from '@/types';
import { Badge } from '@/components/ui/badge';

const statusConfig: Record<TicketStatus, { label: string; className: string }> =
    {
        OPEN: {
            label: 'Open',
            className:
                'bg-blue-500/15 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-800',
        },
        SCHEDULED: {
            label: 'Scheduled',
            className:
                'bg-purple-500/15 text-purple-700 border-purple-200 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-800',
        },
        'ON PROGRESS': {
            label: 'On Progress',
            className:
                'bg-amber-500/15 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-800',
        },
        EVALUATE: {
            label: 'Evaluate',
            className:
                'bg-cyan-500/15 text-cyan-700 border-cyan-200 dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-800',
        },
        REVISION: {
            label: 'Revision',
            className:
                'bg-orange-500/15 text-orange-700 border-orange-200 dark:bg-orange-500/20 dark:text-orange-300 dark:border-orange-800',
        },
        DONE: {
            label: 'Done',
            className:
                'bg-emerald-500/15 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-800',
        },
    };

interface TicketStatusBadgeProps {
    status: TicketStatus;
    className?: string;
}

export function TicketStatusBadge({
    status,
    className = '',
}: TicketStatusBadgeProps) {
    const config = statusConfig[status] || { label: status, className: '' };

    return (
        <Badge
            variant="outline"
            className={`font-medium ${config.className} ${className}`}
        >
            <span className="mr-1.5 inline-block size-1.5 rounded-full bg-current" />
            {config.label}
        </Badge>
    );
}
