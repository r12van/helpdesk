import { Head, Link, router } from '@inertiajs/react';
import { CirclePlus, Edit, Search, Trash2, User, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { PaginatedData } from '@/types';

interface UserType {
    id: number;
    name: string;
    email: string;
    created_at: string;
}

interface Props {
    users: PaginatedData<UserType>;
    filters: {
        search?: string;
    };
}

export default function AdminUsersIndex({ users, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/users',
            { search: search || undefined },
            { preserveState: true },
        );
    };

    const clearSearch = () => {
        setSearch('');
        router.get('/admin/users', {});
    };

    const handleDeleteUser = (id: number, name: string) => {
        if (confirm(`Yakin ingin menghapus user "${name}"?`)) {
            router.delete(`/admin/users/${id}`);
        }
    };

    return (
        <>
            <Head title="User Management" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold tracking-tight">
                            User Management
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola pengguna dan agen helpdesk di sistem.
                        </p>
                    </div>
                    <Link href="/admin/users/create">
                        <Button className="w-full sm:w-auto">
                            <CirclePlus className="mr-1.5 size-4" /> New User /
                            Agent
                        </Button>
                    </Link>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-3">
                    <form
                        onSubmit={handleSearch}
                        className="relative max-w-sm flex-1"
                    >
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Cari user (nama atau email)..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pr-8 pl-9"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="size-4" />
                            </button>
                        )}
                    </form>
                </div>

                {/* Users Table */}
                <div className="overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="w-[80px]">
                                    Avatar
                                </TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead className="w-[180px]">
                                    Terdaftar Pada
                                </TableHead>
                                <TableHead className="w-[120px] text-right">
                                    Aksi
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="py-12 text-center text-muted-foreground"
                                    >
                                        <User className="mx-auto mb-3 size-10 text-muted-foreground/30" />
                                        <p>Tidak ada pengguna ditemukan.</p>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.data.map((user) => (
                                    <TableRow
                                        key={user.id}
                                        className="group hover:bg-muted/30"
                                    >
                                        <TableCell>
                                            <div className="flex size-9 items-center justify-center rounded-full bg-neutral-100 font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                                                {user.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-semibold text-neutral-900 dark:text-neutral-100">
                                            {user.name}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {user.email}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {new Date(
                                                user.created_at,
                                            ).toLocaleDateString('id-ID', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Link
                                                    href={`/admin/users/${user.id}/edit`}
                                                >
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="size-8"
                                                        title="Edit User"
                                                    >
                                                        <Edit className="size-4 text-muted-foreground" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="size-8 text-destructive hover:bg-destructive/10"
                                                    onClick={() =>
                                                        handleDeleteUser(
                                                            user.id,
                                                            user.name,
                                                        )
                                                    }
                                                    title="Hapus User"
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {users.last_page > 1 && (
                    <div className="flex items-center justify-between px-2">
                        <p className="text-sm text-muted-foreground">
                            Showing {users.from}–{users.to} of {users.total}{' '}
                            users
                        </p>
                        <div className="flex gap-1">
                            {users.links.map((link, i) => (
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

AdminUsersIndex.layout = {
    breadcrumbs: [
        { title: 'Administration', href: '#' },
        { title: 'User Management', href: '/admin/users' },
    ],
};
