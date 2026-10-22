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

    // Keep active pill visible in horizontal scroll bar on mobile
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
            className="sticky top-16 lg:top-20 z-30 -mx-4 px-4 sm:mx-0 sm:px-0 py-1.5 bg-background/85 backdrop-blur-xl border-b border-neutral-200/70 dark:border-neutral-800/80 sm:border sm:rounded-2xl sm:p-1.5 sm:bg-white/80 sm:dark:bg-neutral-900/80 shadow-xs"
        >
            <div ref={containerRef} className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {links.map((link) => {
                    const isActive = activeId === link.id;
                    return (
                        <a
                            key={link.id}
                            href={`#${link.id}`}
                            data-jump-id={link.id}
                            onClick={() => setActiveId(link.id)}
                            className={`relative px-3 py-1.5 rounded-xl text-xs font-medium transition-colors shrink-0 ${
                                isActive
                                    ? 'text-accent font-semibold'
                                    : 'text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-white'
                            }`}
                        >
                            {isActive && (
                                <motion.span
                                    layoutId="quickJumpActivePill"
                                    className="absolute inset-0 rounded-xl bg-accent/12 dark:bg-accent/18 border border-accent/25"
                                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                                />
                            )}
                            <span className="relative z-10">{link.label}</span>
                        </a>
                    );
                })}
            </div>
        </nav>
    );
}
