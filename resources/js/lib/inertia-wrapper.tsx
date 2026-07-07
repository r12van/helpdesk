import React from 'react';
import { Link as OriginalLink, router as originalRouter, useForm as originalUseForm } from '../../../node_modules/@inertiajs/react';

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

// Custom Router Wrapper using Proxy to preserve prototype chain and original method bindings
export const router = new Proxy(originalRouter, {
    get(target, prop, receiver) {
        if (prop === 'visit') {
            return (url: any, options?: any) => target.visit(prefixUrl(url), options);
        }
        if (prop === 'get') {
            return (url: any, data?: any, options?: any) => target.get(prefixUrl(url), data, options);
        }
        if (prop === 'post') {
            return (url: any, data?: any, options?: any) => target.post(prefixUrl(url), data, options);
        }
        if (prop === 'put') {
            return (url: any, data?: any, options?: any) => target.put(prefixUrl(url), data, options);
        }
        if (prop === 'patch') {
            return (url: any, data?: any, options?: any) => target.patch(prefixUrl(url), data, options);
        }
        if (prop === 'delete') {
            return (url: any, options?: any) => target.delete(prefixUrl(url), options);
        }
        
        const value = Reflect.get(target, prop, receiver);
        return typeof value === 'function' ? value.bind(target) : value;
    }
});

// Custom useForm Wrapper to intercept and prefix form actions
export function useForm(...args: any[]) {
    const form = (originalUseForm as any)(...args);
    
    const originalSubmit = form.submit;
    form.submit = (method: string, url: string, options?: any) => {
        return originalSubmit.call(form, method, prefixUrl(url), options);
    };
    
    const originalGet = form.get;
    form.get = (url: string, options?: any) => {
        return originalGet.call(form, prefixUrl(url), options);
    };
    
    const originalPost = form.post;
    form.post = (url: string, options?: any) => {
        return originalPost.call(form, prefixUrl(url), options);
    };
    
    const originalPut = form.put;
    form.put = (url: string, options?: any) => {
        return originalPut.call(form, prefixUrl(url), options);
    };
    
    const originalPatch = form.patch;
    form.patch = (url: string, options?: any) => {
        return originalPatch.call(form, prefixUrl(url), options);
    };
    
    const originalDelete = form.delete;
    form.delete = (url: string, options?: any) => {
        return originalDelete.call(form, prefixUrl(url), options);
    };
    
    return form;
}
