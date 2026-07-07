import React from 'react';
import { Link as OriginalLink, router as originalRouter } from '../../../node_modules/@inertiajs/react';

export * from '../../../node_modules/@inertiajs/react';

// Custom wrapper helper to prepend the subfolder prefix
export function prefixUrl(url: string | any): string | any {
    if (typeof url !== 'string') {
        if (url && typeof url.url === 'string') {
            url = url.url;
        } else {
            return url;
        }
    }
    
    // Check if it's an absolute URL, mailto, tel, or external link
    if (
        url.startsWith('http://') || 
        url.startsWith('https://') || 
        url.startsWith('//') || 
        url.startsWith('mailto:') || 
        url.startsWith('tel:') ||
        url.startsWith('#')
    ) {
        return url;
    }
    
    const prefix = typeof window !== 'undefined' ? (window as any).routePrefix : '';
    if (!prefix) {
        return url;
    }
    
    // Normalize path to start with /
    const normalizedUrl = url.startsWith('/') ? url : '/' + url;
    
    // Check if it already starts with the prefix
    if (normalizedUrl.startsWith(`/${prefix}/`) || normalizedUrl === `/${prefix}`) {
        return url;
    }
    
    return `/${prefix}${normalizedUrl === '/' ? '' : normalizedUrl}`;
}

// Custom Link Component
export const Link = React.forwardRef<any, any>(({ href, ...props }, ref) => {
    return <OriginalLink {...props} ref={ref} href={prefixUrl(href)} />;
});

Link.displayName = 'Link';

// Custom Router Wrapper
export const router = {
    ...originalRouter,
    visit: (url: any, options?: any) => originalRouter.visit(prefixUrl(url), options),
    get: (url: any, data?: any, options?: any) => originalRouter.get(prefixUrl(url), data, options),
    post: (url: any, data?: any, options?: any) => originalRouter.post(prefixUrl(url), data, options),
    put: (url: any, data?: any, options?: any) => originalRouter.put(prefixUrl(url), data, options),
    patch: (url: any, data?: any, options?: any) => originalRouter.patch(prefixUrl(url), data, options),
    delete: (url: any, options?: any) => originalRouter.delete(prefixUrl(url), options),
    reload: (options?: any) => originalRouter.reload(options),
};
