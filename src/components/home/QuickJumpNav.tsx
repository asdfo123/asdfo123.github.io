'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export interface QuickLink {
    id: string;
    label: string;
}

interface QuickJumpNavProps {
    links: QuickLink[];
}

export default function QuickJumpNav({ links }: QuickJumpNavProps) {
    const [activeId, setActiveId] = useState<string>(links[0]?.id || '');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (links.length === 0) return;

        const handleObserver = (entries: IntersectionObserverEntry[]) => {
            const visible = entries
                .filter(e => e.isIntersecting)
                .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

            if (visible.length > 0) {
                setActiveId(visible[0].target.id);
            }
        };

        const observer = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: '-120px 0px -55% 0px',
            threshold: 0.05,
        });

        links.forEach(link => {
            const el = document.getElementById(link.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [links]);

    useEffect(() => {
        if (!activeId || !containerRef.current) return;
        const activeBtn = containerRef.current.querySelector(`[data-jump-id="${activeId}"]`) as HTMLElement | null;
        if (activeBtn) {
            const container = containerRef.current;
            const targetScrollLeft =
                activeBtn.offsetLeft - container.clientWidth / 2 + activeBtn.clientWidth / 2;
            container.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
        }
    }, [activeId]);

    if (links.length <= 1) return null;

    return (
        <nav
            aria-label="Section quick navigation"
            className="sticky top-14 lg:top-16 z-30 -mx-4 px-4 sm:mx-0 sm:px-0 py-2 bg-background/90 backdrop-blur-xl swiss-rule-t swiss-rule-b"
        >
            <div ref={containerRef} className="flex items-center gap-4 overflow-x-auto no-scrollbar">
                <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400 shrink-0">
                    INDEX //
                </span>
                {links.map((link, idx) => {
                    const isActive = activeId === link.id;
                    return (
                        <a
                            key={link.id}
                            href={`#${link.id}`}
                            data-jump-id={link.id}
                            onClick={() => setActiveId(link.id)}
                            className={`relative py-1 font-mono text-[11px] uppercase tracking-wider transition-colors shrink-0 ${
                                isActive
                                    ? 'text-primary font-semibold'
                                    : 'text-neutral-500 hover:text-primary'
                            }`}
                        >
                            <span className="text-[9px] text-accent mr-1">{String(idx + 1).padStart(2, '0')}</span>
                            <span>{link.label}</span>
                            {isActive && (
                                <motion.span
                                    layoutId="quickJumpActiveLine"
                                    className="absolute left-0 right-0 -bottom-2 h-[2px] bg-primary"
                                    transition={{ type: 'spring', stiffness: 450, damping: 34 }}
                                />
                            )}
                        </a>
                    );
                })}
            </div>
        </nav>
    );
}
