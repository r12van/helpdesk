export type Ticket = {
    id: number;
    ticket_number: string;
    type: 'support' | 'technical';
    date: string;
    reporter: string;
    division: string | null;
    receiver: string | null;
    source: string | null;
    category: string | null;
    application: string | null;
    description: string;
    location: string | null;
    problem: string | null;
    action_taken: string | null;
    attachment: string | null;
    assigned_to: number | null;
    status: TicketStatus;
    due_date: string | null;
    start_date: string | null;
    end_date: string | null;
    duration: string | null;
    note: string | null;
    feedback_token: string | null;
    feedback_rating: number | null;
    feedback_comment: string | null;
    feedback_submitted_at: string | null;
    feedback_url: string | null;
    feedback_message: string | null;
    has_feedback: boolean;
    assignee: Agent | null;
    created_at: string;
    updated_at: string;
};

export type TicketStatus =
    'OPEN' | 'SCHEDULED' | 'ON PROGRESS' | 'EVALUATE' | 'REVISION' | 'DONE';

export type Agent = {
    id: number;
    name: string;
};

export type PaginatedData<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type TicketFilters = {
    status?: string;
    type?: string;
    category?: string;
    application?: string;
    assigned_to?: string;
    search?: string;
};

export type TicketStats = {
    total: number;
    open: number;
    in_progress: number;
    done: number;
};

export type FeedbackTicket = {
    ticket_number: string;
    description: string;
    application: string | null;
    category: string | null;
    date: string;
    status: string;
    has_feedback: boolean;
    feedback_rating: number | null;
    feedback_comment: string | null;
};
