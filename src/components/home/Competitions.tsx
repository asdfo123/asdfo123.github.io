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

function getPrizeBadgeStyle(prize: string): { cls: string; icon: string } {
    const lower = prize.toLowerCase();
    if (lower.includes('gold') || lower.includes('first')) {
        return {
            cls: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60',
            icon: '🥇',
        };
    }
    if (lower.includes('silver') || lower.includes('second')) {
        return {
            cls: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700',
            icon: '🥈',
        };
    }
    return {
        cls: 'bg-orange-50/80 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200/70 dark:border-orange-800/50',
        icon: '🥉',
    };
}

export default function Competitions({ items, title = 'Competitions' }: CompetitionsProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.32 }}
        >
            <div className="flex items-center gap-2.5 mb-4">
                <span className="w-1 h-6 rounded-full bg-gradient-to-b from-accent to-amber-500/50 inline-block" />
                <h2 className="text-2xl font-serif font-bold text-primary tracking-tight">{title}</h2>
            </div>

            <div className="editorial-card rounded-2xl divide-y divide-neutral-200/60 dark:divide-neutral-800/80 overflow-hidden">
                {items.map((item, index) => {
                    const badge = getPrizeBadgeStyle(item.prize);
                    return (
                        <div
                            key={index}
                            className="p-3.5 sm:px-5 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors"
                        >
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    {item.url ? (
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-semibold text-primary dark:text-white hover:text-accent transition-colors"
                                        >
                                            {item.name}
                                        </a>
                                    ) : (
                                        <span className="text-sm font-semibold text-primary dark:text-white">
                                            {item.name}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                                    {item.role} · <span className="font-mono">{item.date}</span>
                                </p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <span
                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${badge.cls}`}
                                >
                                    <span>{badge.icon}</span>
                                    <span>{item.prize}</span>
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </motion.section>
    );
}
