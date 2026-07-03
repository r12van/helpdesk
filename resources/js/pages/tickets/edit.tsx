import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import type { Agent, TicketStatus, Ticket as TicketType } from '@/types';

interface Props {
    ticket: TicketType;
    agents: Agent[];
    categories: string[];
    technicalCategories: string[];
    applications: string[];
    sources: string[];
    statuses: TicketStatus[];
}

export default function EditTicket({
    ticket,
    agents,
    categories,
    technicalCategories,
    applications,
    sources,
    statuses,
}: Props) {
    const { data, setData, put, processing, errors } = useForm({
        type: ticket.type,
        date: ticket.date?.split('T')[0] || '',
        reporter: ticket.reporter || '',
        division: ticket.division || '',
        receiver: ticket.receiver || '',
        source: ticket.source || '',
        category: ticket.category || '',
        application: ticket.application || '',
        description: ticket.description || '',
        location: ticket.location || '',
        problem: ticket.problem || '',
        action_taken: ticket.action_taken || '',
        assigned_to: ticket.assigned_to ? String(ticket.assigned_to) : '',
        status: ticket.status || 'OPEN',
        due_date: ticket.due_date?.split('T')[0] || '',
        start_date: ticket.start_date?.split('T')[0] || '',
        end_date: ticket.end_date?.split('T')[0] || '',
        note: ticket.note || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/tickets/${ticket.id}`);
    };

    const activeCategories =
        data.type === 'technical' ? technicalCategories : categories;

    return (
        <>
            <Head title={`Edit ${ticket.ticket_number}`} />
            <div className="mx-auto w-full max-w-4xl p-4 md:p-6">
                <div className="mb-6">
                    <Link
                        href={`/tickets/${ticket.id}`}
                        className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="mr-1 size-4" /> Back to{' '}
                        {ticket.ticket_number}
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Edit {ticket.ticket_number}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Ticket Type */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Ticket Type</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant={
                                        data.type === 'support'
                                            ? 'default'
                                            : 'outline'
                                    }
                                    onClick={() => setData('type', 'support')}
                                    className="flex-1"
                                >
                                    🎫 Application Support
                                </Button>
                                <Button
                                    type="button"
                                    variant={
                                        data.type === 'technical'
                                            ? 'default'
                                            : 'outline'
                                    }
                                    onClick={() => setData('type', 'technical')}
                                    className="flex-1"
                                >
                                    🔧 Technical Support
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Report Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Report Details</CardTitle>
                            <CardDescription>
                                Informasi pelapor dan sumber laporan
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="date">Date *</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={data.date}
                                    onChange={(e) =>
                                        setData('date', e.target.value)
                                    }
                                />
                                <InputError message={errors.date} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="reporter">Reporter *</Label>
                                <Input
                                    id="reporter"
                                    value={data.reporter}
                                    onChange={(e) =>
                                        setData('reporter', e.target.value)
                                    }
                                />
                                <InputError message={errors.reporter} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="division">Division</Label>
                                <Input
                                    id="division"
                                    value={data.division}
                                    onChange={(e) =>
                                        setData('division', e.target.value)
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="receiver">Receiver</Label>
                                <Input
                                    id="receiver"
                                    value={data.receiver}
                                    onChange={(e) =>
                                        setData('receiver', e.target.value)
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="source">Source</Label>
                                <Select
                                    value={data.source}
                                    onValueChange={(v) => setData('source', v)}
                                >
                                    <SelectTrigger id="source">
                                        <SelectValue placeholder="Pilih sumber" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sources.map((s) => (
                                            <SelectItem key={s} value={s}>
                                                {s}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {data.type === 'technical' && (
                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        value={data.location}
                                        onChange={(e) =>
                                            setData('location', e.target.value)
                                        }
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Ticket Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Ticket Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    value={data.category}
                                    onValueChange={(v) =>
                                        setData('category', v)
                                    }
                                >
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="Pilih kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {activeCategories.map((c) => (
                                            <SelectItem key={c} value={c}>
                                                {c}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {data.type === 'support' && (
                                <div className="space-y-2">
                                    <Label htmlFor="application">
                                        Application
                                    </Label>
                                    <Select
                                        value={data.application}
                                        onValueChange={(v) =>
                                            setData('application', v)
                                        }
                                    >
                                        <SelectTrigger id="application">
                                            <SelectValue placeholder="Pilih aplikasi" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {applications.map((a) => (
                                                <SelectItem key={a} value={a}>
                                                    {a}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="description">
                                    Description *
                                </Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    rows={4}
                                />
                                <InputError message={errors.description} />
                            </div>
                            {data.type === 'technical' && (
                                <>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="problem">
                                            Problem / Root Cause
                                        </Label>
                                        <Textarea
                                            id="problem"
                                            value={data.problem}
                                            onChange={(e) =>
                                                setData(
                                                    'problem',
                                                    e.target.value,
                                                )
                                            }
                                            rows={2}
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="action_taken">
                                            Action Taken
                                        </Label>
                                        <Textarea
                                            id="action_taken"
                                            value={data.action_taken}
                                            onChange={(e) =>
                                                setData(
                                                    'action_taken',
                                                    e.target.value,
                                                )
                                            }
                                            rows={2}
                                        />
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Assignment */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Assignment</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="assigned_to">Assign To</Label>
                                <Select
                                    value={data.assigned_to}
                                    onValueChange={(v) =>
                                        setData('assigned_to', v)
                                    }
                                >
                                    <SelectTrigger id="assigned_to">
                                        <SelectValue placeholder="Pilih agent" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {agents.map((a) => (
                                            <SelectItem
                                                key={a.id}
                                                value={String(a.id)}
                                            >
                                                {a.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status *</Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(v) =>
                                        setData('status', v as TicketStatus)
                                    }
                                >
                                    <SelectTrigger id="status">
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
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="due_date">Due Date</Label>
                                <Input
                                    id="due_date"
                                    type="date"
                                    value={data.due_date}
                                    onChange={(e) =>
                                        setData('due_date', e.target.value)
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="start_date">Start Date</Label>
                                <Input
                                    id="start_date"
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) =>
                                        setData('start_date', e.target.value)
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="end_date">End Date</Label>
                                <Input
                                    id="end_date"
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) =>
                                        setData('end_date', e.target.value)
                                    }
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="note">Note</Label>
                                <Textarea
                                    id="note"
                                    value={data.note}
                                    onChange={(e) =>
                                        setData('note', e.target.value)
                                    }
                                    rows={2}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit */}
                    <div className="flex justify-end gap-3">
                        <Link href={`/tickets/${ticket.id}`}>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

EditTicket.layout = {
    breadcrumbs: [
        { title: 'Tickets', href: '/tickets' },
        { title: 'Edit', href: '#' },
    ],
};
