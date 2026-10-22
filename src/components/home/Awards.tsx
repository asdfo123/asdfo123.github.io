'use client';

import { motion } from 'framer-motion';
import { TrophyIcon } from '@heroicons/react/24/outline';

export interface AwardItem {
    date: string;
    awards: string[];
    suffix?: string;
}

interface AwardsProps {
    items: AwardItem[];
    title?: string;
}

// Extract parenthetical highlight e.g. "(Top 0.2% Nationwide), Ministry of Education of China"
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            <div className="flex items-center gap-2.5 mb-4">
                <span className="w-1 h-6 rounded-full bg-gradient-to-b from-accent to-amber-500/50 inline-block" />
                <h2 className="text-2xl font-serif font-bold text-primary tracking-tight">{title}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {items.map((item, index) => {
                    const { badge, org } = parseSuffix(item.suffix);
                    const isTopHighlight = index === 0 || (badge && badge.toLowerCase().includes('top 0.'));
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.04 * index }}
                            className={`editorial-card rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between gap-2 hover:border-accent/40 transition-all duration-200 ${
                                index === 0 ? 'sm:col-span-2 border-l-4 border-l-accent' : ''
                            }`}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-start gap-2.5 min-w-0">
                                    <div
                                        className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                            isTopHighlight
                                                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                                                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                                        }`}
                                    >
                                        <TrophyIcon className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-sm font-semibold text-primary dark:text-white leading-snug">
                                            {item.awards.join(' & ')}
                                        </h3>
                                        {org && (
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                                                {org}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 shrink-0 tabular-nums">
                                    {item.date}
                                </span>
                            </div>

                            {badge && (
                                <div className="pl-9">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60">
                                        ✦ {badge}
                                    </span>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </motion.section>
    );
}
