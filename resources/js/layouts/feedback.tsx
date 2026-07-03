import type React from 'react';
import AppLogoBig from '@/components/app-logo-big';

export default function FeedbackLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50/50 px-4 py-12 transition-colors duration-300 dark:bg-slate-950">
            {/* Decorative Background Blobs */}
            <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-primary/10 blur-[80px] dark:bg-primary/5" />
            <div className="absolute -right-40 -bottom-40 h-80 w-80 rounded-full bg-purple-500/10 blur-[80px] dark:bg-purple-500/5" />
            <div className="absolute top-1/2 left-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-[100px]" />

            <div className="relative z-10 w-full max-w-lg">
                {/* Brand Header */}
                <div className="mb-8 flex flex-col items-center gap-3">
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
                </div>

                {/* Main Glass Card */}
                <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/70 p-6 shadow-2xl shadow-slate-200/50 backdrop-blur-xl md:p-8 dark:border-slate-800/80 dark:bg-slate-900/70 dark:shadow-black/40">
                    {children}
                </div>

                <p className="mt-6 text-center text-xs font-medium tracking-wide text-muted-foreground/60 uppercase">
                    IT Helpdesk — Disgulkarmat
                </p>
            </div>
        </div>
    );
}
