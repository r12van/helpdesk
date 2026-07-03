import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import AppLogoBig from '@/components/app-logo-big';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { home } from '@/routes';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className="flex w-full max-w-md flex-col gap-6">
                <Link
                    href={home()}
                    className="flex items-center gap-2 self-center font-medium"
                >
                    <div className="flex items-center justify-center gap-4">
                        <AppLogoBig className="size-40 fill-current text-black dark:text-white" />
                        <div className="flex flex-col items-start gap-1">
                            <h1 className="text-lg font-bold tracking-tight">
                                IT Helpdesk — Disgulkarmat
                            </h1>
                            <p className="text-left text-sm text-muted-foreground">
                                Bantuan teknis oleh Bidang Jasinfo
                            </p>
                        </div>
                    </div>
                </Link>

                <div className="flex flex-col gap-6">
                    <Card className="rounded-xl">
                        <CardHeader className="px-10 pt-8 pb-0 text-center">
                            <CardTitle className="text-xl">{title}</CardTitle>
                            <CardDescription>{description}</CardDescription>
                        </CardHeader>
                        <CardContent className="px-10 py-8">
                            {children}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
