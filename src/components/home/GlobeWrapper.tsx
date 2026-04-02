'use client';

import { useEffect, useState } from 'react';
import ClustrMapsGlobe from './ClustrMapsGlobe';

/**
 * GlobeWrapper renders the ClustrMapsGlobe in one of two slots
 * based on screen orientation:
 *   - landscape → showsIn="sidebar"  (left column, below Research Interests)
 *   - portrait  → showsIn="bottom"   (bottom of the page)
 *
 * To avoid rendering two Globe instances (which would break the
 * document.write capture), we render a single Globe and two
 * placeholder-like wrappers, but only one will ever be active.
 */
export function GlobeSidebar() {
    const [isLandscape, setIsLandscape] = useState<boolean | null>(null);

    useEffect(() => {
        const mq = window.matchMedia('(orientation: landscape)');
        setIsLandscape(mq.matches);
        const handler = (e: MediaQueryListEvent) => setIsLandscape(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    // Only render when landscape; null = SSR/hydrating, hide during that too
    if (!isLandscape) return null;

    return (
        <div className="mt-6">
            <ClustrMapsGlobe />
        </div>
    );
}

export function GlobeBottom() {
    const [isPortrait, setIsPortrait] = useState<boolean | null>(null);

    useEffect(() => {
        const mq = window.matchMedia('(orientation: portrait)');
        setIsPortrait(mq.matches);
        const handler = (e: MediaQueryListEvent) => setIsPortrait(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    // Only render when portrait
    if (!isPortrait) return null;

    return (
        <div className="mt-8">
            <ClustrMapsGlobe />
        </div>
    );
}
