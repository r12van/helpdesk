import type { InertiaLinkProps } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { prefixUrl } from './inertia-wrapper';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return prefixUrl(url);
}

export function toAsset(path: string): string {
    if (!path.startsWith('/')) {
        path = '/' + path;
    }
    const prefix = typeof window !== 'undefined' ? (window as any).routePrefix : '';
    if (prefix) {
        return `/${prefix}${path}`;
    }
    return path;
}
