'use client';

import { motion } from 'framer-motion';

export interface CompetitionItem {
    date: string;
    name: string;
    url?: string;
    prize: string;
    role: string;
}

interface CompetitionsProps {
    items: CompetitionItem[];
    title?: string;
}

export default function Competitions({ items, title = 'Competitions' }: CompetitionsProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.28 }}
        >
            {/* Curatorial Section Header */}
            <div className="flex items-baseline justify-between pb-3 mb-2 swiss-rule-b">
                <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
                        06 // COMPETITIVE PROGRAMMING
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-primary tracking-tight">
                        {title}
                    </h2>
                </div>
                <span aria-hidden="true" className="font-mono text-xs text-neutral-400">+</span>
            </div>

            <div className="divide-y divide-[var(--hairline)] swiss-rule-b">
                {items.map((item, index) => {
                    const isFirstTier =
                        item.prize.toLowerCase().includes('gold') || item.prize.toLowerCase().includes('first');
                    return (
                        <div
                            key={index}
                            className="py-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-4"
                        >
                            <div className="flex items-baseline gap-3 min-w-0">
                                <span className="font-mono text-xs text-neutral-400 w-16 shrink-0 tabular-nums">
                                    {item.date}
                                </span>
                                <div className="min-w-0">
                                    {item.url ? (
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm sm:text-[15px] font-medium text-primary hover:text-accent transition-colors"
                                        >
                                            {item.name}
                                        </a>
                                    ) : (
                                        <span className="text-sm sm:text-[15px] font-medium text-primary">
                                            {item.name}
                                        </span>
                                    )}
                                    <span className="text-xs text-neutral-400 ml-2 font-mono">
                                        ({item.role})
                                    </span>
                                </div>
                            </div>

                            <span
                                className={`pl-19 sm:pl-0 font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5 border shrink-0 w-fit ${
                                    isFirstTier
                                        ? 'bg-primary text-background border-primary font-semibold'
                                        : 'border-[var(--hairline)] text-neutral-600 dark:text-neutral-300'
                                }`}
                            >
                                {item.prize}
                            </span>
                        </div>
                    );
                })}
            </div>
        </motion.section>
    );
}
