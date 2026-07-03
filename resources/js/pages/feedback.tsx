import { Head, useForm, usePage } from '@inertiajs/react';
import { CheckCircle2, Star } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { FeedbackTicket } from '@/types';

interface Props {
    ticket: FeedbackTicket;
    token: string;
}

export default function Feedback({ ticket, token }: Props) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>()
        .props;
    const [hoveredStar, setHoveredStar] = useState(0);

    const { data, setData, post, processing } = useForm({
        rating: 0,
        comment: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/feedback/${token}`);
    };

    // Already submitted feedback
    if (ticket.has_feedback) {
        return (
            <>
                <Head title="Feedback - Terima Kasih" />
                <div className="text-center">
                    <div className="animate-fade-in mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/30">
                        <CheckCircle2 className="size-8 text-emerald-500 dark:text-emerald-400" />
                    </div>
                    <h1 className="mb-2 text-2xl font-bold tracking-tight">
                        Terima Kasih! 🙏
                    </h1>
                    <p className="mb-6 text-sm text-muted-foreground">
                        Feedback Anda untuk tiket{' '}
                        <strong className="font-mono text-primary">
                            {ticket.ticket_number}
                        </strong>{' '}
                        telah kami terima.
                    </p>

                    <div className="relative rounded-2xl border border-slate-100 bg-slate-50/50 p-6 dark:border-slate-800/50 dark:bg-slate-900/50">
                        <div className="mb-4 flex items-center justify-center gap-1.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`size-7 transition-all ${
                                        star <= (ticket.feedback_rating || 0)
                                            ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.3)]'
                                            : 'text-muted-foreground/20'
                                    }`}
                                />
                            ))}
                        </div>
                        {ticket.feedback_comment && (
                            <div className="relative pt-2">
                                <span className="absolute -top-1 left-2 font-serif text-4xl leading-none text-slate-300/30">
                                    &ldquo;
                                </span>
                                <p className="px-6 text-sm leading-relaxed text-muted-foreground italic">
                                    {ticket.feedback_comment}
                                </p>
                                <span className="absolute right-2 -bottom-4 font-serif text-4xl leading-none text-slate-300/30">
                                    &rdquo;
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </>
        );
    }

    // Show success flash after submission
    if (flash?.success) {
        return (
            <>
                <Head title="Feedback - Terima Kasih" />
                <div className="py-4 text-center">
                    <div className="mx-auto mb-5 flex h-20 w-20 animate-bounce items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/30">
                        <CheckCircle2 className="size-10 text-emerald-500 dark:text-emerald-400" />
                    </div>
                    <h1 className="mb-3 text-3xl font-extrabold tracking-tight">
                        Terima Kasih! 🙏
                    </h1>
                    <p className="mx-auto max-w-sm leading-relaxed text-muted-foreground">
                        {flash.success}
                    </p>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title={`Feedback - ${ticket.ticket_number}`} />
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-extrabold tracking-tight">
                    Berikan Feedback
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Bantu kami meningkatkan kualitas layanan IT Helpdesk
                </p>
            </div>

            {/* Ticket Summary Card */}
            <div className="mb-8 rounded-2xl border border-slate-100 bg-slate-50/40 p-5 dark:border-slate-800/40 dark:bg-slate-900/20">
                <div className="mb-3 flex items-center justify-between">
                    <span className="inline-flex items-center rounded-lg bg-primary/10 px-2.5 py-1 font-mono text-xs font-bold text-primary dark:bg-primary/20">
                        {ticket.ticket_number}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">
                        {ticket.date}
                    </span>
                </div>
                <p className="line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {ticket.description}
                </p>
                {(ticket.application || ticket.category) && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {ticket.application && (
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                {ticket.application}
                            </span>
                        )}
                        {ticket.category && (
                            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                {ticket.category}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Feedback Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Star Rating */}
                <div className="space-y-4">
                    <label className="block text-center text-sm font-semibold tracking-wide text-slate-700 uppercase dark:text-slate-300">
                        Penilaian Anda
                    </label>

                    <div className="flex items-center justify-center gap-3">
                        {[1, 2, 3, 4, 5].map((star) => {
                            const isLit = star <= (hoveredStar || data.rating);
                            return (
                                <button
                                    key={star}
                                    type="button"
                                    onMouseEnter={() => setHoveredStar(star)}
                                    onMouseLeave={() => setHoveredStar(0)}
                                    onClick={() => setData('rating', star)}
                                    className="relative p-1 transition-all duration-200 hover:scale-125 active:scale-90"
                                >
                                    <Star
                                        className={`size-11 transition-all duration-200 ${
                                            isLit
                                                ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]'
                                                : 'text-muted-foreground/20 hover:text-amber-300'
                                        }`}
                                    />
                                </button>
                            );
                        })}
                    </div>

                    {/* Animated & Responsive Label */}
                    <div className="h-8">
                        {(hoveredStar || data.rating) > 0 ? (
                            <p className="scale-100 text-center text-sm font-semibold text-slate-700 transition-all duration-300 dark:text-slate-300">
                                {(hoveredStar || data.rating) === 1 &&
                                    'Sangat Buruk 😞'}
                                {(hoveredStar || data.rating) === 2 &&
                                    'Buruk 😕'}
                                {(hoveredStar || data.rating) === 3 &&
                                    'Cukup 😐'}
                                {(hoveredStar || data.rating) === 4 &&
                                    'Baik 🙂'}
                                {(hoveredStar || data.rating) === 5 &&
                                    'Sangat Baik 😃'}
                            </p>
                        ) : (
                            <p className="text-center text-xs text-muted-foreground italic">
                                Ketuk bintang untuk memberikan nilai
                            </p>
                        )}
                    </div>
                </div>

                {/* Comment */}
                <div className="space-y-2">
                    <label
                        htmlFor="comment"
                        className="text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                        Komentar{' '}
                        <span className="text-xs font-normal text-muted-foreground">
                            (opsional)
                        </span>
                    </label>
                    <Textarea
                        id="comment"
                        placeholder="Tulis komentar atau saran Anda..."
                        value={data.comment}
                        onChange={(e) => setData('comment', e.target.value)}
                        rows={3}
                        className="resize-none rounded-xl border-slate-200 bg-transparent transition-all focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-800"
                    />
                </div>

                <Button
                    type="submit"
                    disabled={processing || data.rating === 0}
                    className="w-full rounded-xl bg-primary py-6 text-sm font-semibold shadow-lg shadow-primary/20 transition-all hover:opacity-95 active:scale-[0.98] disabled:opacity-50 disabled:shadow-none"
                    size="lg"
                >
                    {processing ? 'Mengirim...' : 'Kirim Feedback'}
                </Button>
            </form>
        </>
    );
}
