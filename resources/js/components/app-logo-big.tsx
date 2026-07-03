import type { ImgHTMLAttributes } from 'react';

export default function AppLogoBig(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/pampi-head.png"
            alt="Pampi Logo"
            width={200}
            height={200}
            {...props}
        />
    );
}
