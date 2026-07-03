import { Head, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    Plus,
    Trash2,
    Sliders,
    Tag,
    Wrench,
    Laptop,
    Share2,
} from 'lucide-react';
import { useState } from 'react';
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import InputError from '@/components/input-error';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface OptionItem {
    id: number;
    type:
        'status' | 'category' | 'application' | 'source' | 'technical_category';
    value: string;
}

interface Props {
    statuses: OptionItem[];
    categories: OptionItem[];
    applications: OptionItem[];
    sources: OptionItem[];
    technicalCategories: OptionItem[];
}

export default function AdminOptionsIndex({
    statuses,
    categories,
    applications,
    sources,
    technicalCategories,
}: Props) {
    const tabs = [
        {
            id: 'status',
            label: 'Ticket Status',
            items: statuses,
            desc: 'Daftar status tiket dalam sistem.',
            icon: Sliders,
        },
        {
            id: 'category',
            label: 'Categories (Support)',
            items: categories,
            desc: 'Kategori tiket untuk jenis Application Support.',
            icon: Tag,
        },
        {
            id: 'technical_category',
            label: 'Categories (Technical)',
            items: technicalCategories,
            desc: 'Kategori tiket untuk jenis Technical Support.',
            icon: Wrench,
        },
        {
            id: 'application',
            label: 'Applications',
            items: applications,
            desc: 'Daftar aplikasi yang didukung.',
            icon: Laptop,
        },
        {
            id: 'source',
            label: 'Sources',
            items: sources,
            desc: 'Sumber pelaporan tiket (e.g. WhatsApp, Email).',
            icon: Share2,
        },
    ];

    const [activeTab, setActiveTab] = useState(tabs[0].id);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            type: activeTab,
            value: '',
        });

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        setData('type', tabId);
        reset('value');
        clearErrors();
    };

    const handleAddOption = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/options', {
            onSuccess: () => {
                reset('value');
            },
        });
    };

    const handleDeleteOption = (id: number, value: string, type: string) => {
        if (
            type === 'status' &&
            ['OPEN', 'DONE'].includes(value.toUpperCase())
        ) {
            alert(
                'Status OPEN dan DONE adalah status sistem inti yang tidak dapat dihapus!',
            );
            return;
        }

        if (confirm(`Yakin ingin menghapus opsi "${value}"?`)) {
            router.delete(`/admin/options/${id}`, {
                preserveScroll: true,
            });
        }
    };

    const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];

    return (
        <>
            <Head title="Master Options Management" />
            <div className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Master Options
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola pilihan dropdown status, kategori, aplikasi, dan
                        sumber tiket.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 lg:items-start">
                    {/* Tab Navigation Menu */}
                    <aside className="w-full lg:col-span-1">
                        <nav className="flex flex-row gap-1 overflow-x-auto rounded-xl border border-neutral-200/50 bg-neutral-100/50 p-1 lg:flex-col lg:gap-1 lg:overflow-x-visible lg:border-0 lg:bg-transparent lg:p-0 dark:border-neutral-800/50 dark:bg-neutral-900/50">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleTabChange(tab.id)}
                                        className={cn(
                                            'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium whitespace-nowrap transition-all duration-200',
                                            'lg:w-full lg:whitespace-normal',
                                            isActive
                                                ? 'border border-neutral-200/50 bg-white font-semibold text-foreground shadow-xs dark:border-neutral-700/30 dark:bg-neutral-800 dark:text-neutral-100'
                                                : 'border border-transparent text-muted-foreground hover:bg-neutral-200/40 hover:text-foreground dark:hover:bg-neutral-800/40',
                                        )}
                                    >
                                        <Icon
                                            className={cn(
                                                'size-4 shrink-0',
                                                isActive
                                                    ? 'text-primary dark:text-neutral-200'
                                                    : 'text-muted-foreground/70',
                                            )}
                                        />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* Active Tab Panel */}
                    <div className="space-y-6 lg:col-span-3">
                        <Card>
                            <CardHeader>
                                <CardTitle>{currentTab.label}</CardTitle>
                                <CardDescription>
                                    {currentTab.desc}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {activeTab === 'status' && (
                                    <Alert
                                        variant="default"
                                        className="border-amber-200/60 bg-amber-50/50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-200"
                                    >
                                        <AlertCircle className="size-4" />
                                        <AlertTitle>
                                            Peringatan Sistem
                                        </AlertTitle>
                                        <AlertDescription>
                                            Status <strong>OPEN</strong> dan{' '}
                                            <strong>DONE</strong> adalah status
                                            sistem inti yang diperlukan oleh
                                            alur kerja otomatis (seperti set
                                            tanggal mulai/selesai dan pengiriman
                                            link feedback). Kedua status ini{' '}
                                            <strong>tidak dapat dihapus</strong>
                                            .
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {/* Add Form */}
                                <form
                                    onSubmit={handleAddOption}
                                    className="flex flex-col gap-3 sm:flex-row sm:items-end"
                                >
                                    <div className="flex-1 space-y-2">
                                        <Label htmlFor="option-value">
                                            Tambah Pilihan Baru
                                        </Label>
                                        <Input
                                            id="option-value"
                                            placeholder={
                                                activeTab === 'status'
                                                    ? 'E.g. IN PROGRESS (akan diubah ke uppercase)'
                                                    : 'E.g. Software, Website'
                                            }
                                            value={data.value}
                                            onChange={(e) =>
                                                setData('value', e.target.value)
                                            }
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="sm:w-auto"
                                    >
                                        <Plus className="mr-1.5 size-4" />{' '}
                                        Tambah
                                    </Button>
                                </form>
                                <InputError message={errors.value} />

                                {/* Options List Table */}
                                <div className="overflow-hidden rounded-xl border border-neutral-200 bg-background dark:border-neutral-800">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/50">
                                                <TableHead className="px-4 py-3 font-semibold text-foreground">
                                                    Nama Pilihan
                                                </TableHead>
                                                <TableHead className="w-[100px] px-4 py-3 text-right font-semibold text-foreground">
                                                    Aksi
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {currentTab.items.length === 0 ? (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={2}
                                                        className="py-12 text-center text-muted-foreground"
                                                    >
                                                        Belum ada pilihan untuk
                                                        kategori ini.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                currentTab.items.map((item) => {
                                                    const isCoreStatus =
                                                        item.type ===
                                                            'status' &&
                                                        [
                                                            'OPEN',
                                                            'DONE',
                                                        ].includes(
                                                            item.value.toUpperCase(),
                                                        );

                                                    return (
                                                        <TableRow
                                                            key={item.id}
                                                            className="group transition-colors duration-150 hover:bg-muted/30"
                                                        >
                                                            <TableCell className="flex items-center gap-2 px-4 py-3 font-medium">
                                                                <span className="text-foreground">
                                                                    {item.value}
                                                                </span>
                                                                {isCoreStatus && (
                                                                    <Badge
                                                                        variant="secondary"
                                                                        className="rounded-full border-blue-200/50 bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 hover:bg-blue-50 dark:border-blue-800/30 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-950/40"
                                                                    >
                                                                        System
                                                                        Core
                                                                    </Badge>
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="px-4 py-3 text-right">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="size-8 text-muted-foreground transition-colors duration-150 hover:bg-destructive/10 hover:text-destructive disabled:opacity-30 dark:hover:bg-destructive/20"
                                                                    disabled={
                                                                        isCoreStatus
                                                                    }
                                                                    onClick={() =>
                                                                        handleDeleteOption(
                                                                            item.id,
                                                                            item.value,
                                                                            item.type,
                                                                        )
                                                                    }
                                                                    title={
                                                                        isCoreStatus
                                                                            ? 'Status sistem tidak dapat dihapus'
                                                                            : 'Hapus pilihan'
                                                                    }
                                                                >
                                                                    <Trash2 className="size-4" />
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

AdminOptionsIndex.layout = {
    breadcrumbs: [
        { title: 'Administration', href: '#' },
        { title: 'Master Options', href: '/admin/options' },
    ],
};
