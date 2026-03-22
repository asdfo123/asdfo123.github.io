'use client';

import { useEffect, useRef } from 'react';

export default function ClustrMapsGlobe() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        if (container.childElementCount > 0) return;

        // Override document.write temporarily to capture globe.js output
        const originalWrite = document.write.bind(document);
        let captured = '';
        document.write = (content: string) => {
            captured += content;
        };

        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://clustrmaps.com/globe.js?d=avG-4JvN5vL6vm1wDplFnk2UidHH4qQKDGhumzuvOeQ';

        script.onload = () => {
            document.write = originalWrite;
            if (captured && container) {
                container.innerHTML = captured;
                // Execute any scripts in the captured content
                const scripts = container.querySelectorAll('script');
                scripts.forEach((s) => {
                    const newScript = document.createElement('script');
                    if (s.src) {
                        newScript.src = s.src;
                    } else {
                        newScript.textContent = s.textContent;
                    }
                    s.replaceWith(newScript);
                });
            }
        };

        script.onerror = () => {
            document.write = originalWrite;
        };

        document.head.appendChild(script);

        return () => {
            document.write = originalWrite;
        };
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
