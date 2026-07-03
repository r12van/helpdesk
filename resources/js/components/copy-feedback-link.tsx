import { Check, Copy, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface CopyFeedbackLinkProps {
    feedbackMessage: string | null;
    feedbackUrl: string | null;
    variant?: 'default' | 'outline' | 'ghost';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    showLabel?: boolean;
}

export function CopyFeedbackLink({
    feedbackMessage,
    feedbackUrl,
    variant = 'outline',
    size = 'sm',
    showLabel = true,
}: CopyFeedbackLinkProps) {
    const [copied, setCopied] = useState(false);

    if (!feedbackMessage || !feedbackUrl) return null;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(feedbackMessage);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = feedbackMessage;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant={variant}
                        size={size}
                        onClick={handleCopy}
                        className={
                            copied
                                ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-950'
                        }
                    >
                        {copied ? (
                            <>
                                <Check className="size-4" />
                                {showLabel && (
                                    <span className="ml-1.5">Copied!</span>
                                )}
                            </>
                        ) : (
                            <>
                                <MessageCircle className="size-4" />
                                {showLabel && (
                                    <span className="ml-1.5">
                                        Copy for WhatsApp
                                    </span>
                                )}
                            </>
                        )}
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                    <p className="text-xs">
                        {copied
                            ? 'Link feedback berhasil disalin! Paste di WhatsApp.'
                            : 'Salin pesan feedback untuk dikirim via WhatsApp'}
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
