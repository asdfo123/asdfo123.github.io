'use client';

import { useEffect, useRef } from 'react';

export default function ClustrMapsGlobe() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        // Already injected
        if (container.querySelector('canvas, iframe')) return;

        // ClustrMaps globe.js locates itself by finding the script tag with
        // id="clstr_globe" and injects the canvas immediately after it.
        // So we must place the script INSIDE our container, not in <head>.
        const script = document.createElement('script');
        script.id = 'clstr_globe';
        script.type = 'text/javascript';
        script.src = 'https://clustrmaps.com/globe.js?d=avG-4JvN5vL6vm1wDplFnk2UidHH4qQKDGhumzuvOeQ';

        container.appendChild(script);
    }, []);

    return (
        <div className="flex justify-center">
            <div
                ref={containerRef}
                style={{ width: '150px', height: '150px', overflow: 'hidden' }}
            />
        </div>
    );
}
