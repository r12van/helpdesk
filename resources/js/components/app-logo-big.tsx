import type { ImgHTMLAttributes } from 'react';
import { toAsset } from '@/lib/utils';

export default function AppLogoBig(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src={toAsset('/pampi-head.png')}
            alt="Pampi Logo"
            width={200}
            height={200}
            {...props}
        />
    );
}
