'use client';

import { motion } from 'framer-motion';

export interface AwardItem {
    date: string;
    awards: string[];
    suffix?: string;
}

interface AwardsProps {
    items: AwardItem[];
    title?: string;
}

function parseSuffix(suffix?: string): { badge?: string; org?: string } {
    if (!suffix) return {};
    const match = suffix.match(/^\(([^)]+)\),?\s*(.*)$/);
    if (match) {
        return {
            badge: match[1].trim(),
            org: match[2].trim() || undefined,
        };
    }
    return { org: suffix.trim() };
}

export default function Awards({ items, title = 'Honors and Awards' }: AwardsProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.25 }}
        >
            {/* Curatorial Section Header */}
            <div className="flex items-baseline justify-between pb-3 mb-2 swiss-rule-b">
                <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
                        05 // DISTINCTIONS
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-primary tracking-tight">
                        {title}
                    </h2>
                </div>
                <span aria-hidden="true" className="font-mono text-xs text-neutral-400">+</span>
            </div>

            <div className="divide-y divide-[var(--hairline)] swiss-rule-b">
                {items.map((item, index) => {
                    const { badge, org } = parseSuffix(item.suffix);
                    return (
                        <div
                            key={index}
                            className="py-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4"
                        >
                            <div className="flex items-baseline gap-3 min-w-0">
                                <span className="font-mono text-xs text-neutral-400 w-16 shrink-0 tabular-nums">
                                    {item.date}
                                </span>
                                <div className="min-w-0">
                                    <span className="text-sm sm:text-[15px] font-semibold text-primary">
                                        {item.awards.join(' & ')}
                                    </span>
                                    {org && (
                                        <span className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                                            {' '}— {org}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {badge && (
                                <span className="pl-19 sm:pl-0 font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-accent/45 text-accent shrink-0 w-fit">
                                    {badge}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </motion.section>
    );
}
