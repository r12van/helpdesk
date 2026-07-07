import type { ImgHTMLAttributes } from 'react';
import { toAsset } from '@/lib/utils';

export default function AppLogoIcon(
    props: ImgHTMLAttributes<HTMLImageElement>,
) {
    return <img src={toAsset('/pampi-head.png')} alt="Pampi Logo" {...props} />;
}
