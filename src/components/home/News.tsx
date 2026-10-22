'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

export interface NewsItem {
    date: string;
    content: string;
    icon?: string;
}

interface NewsProps {
    items: NewsItem[];
    title?: string;
    initialCount?: number;
}

// Parse inline Markdown links [text](url) and bold **text**
function parseMarkdownInline(text: string): React.ReactNode[] {
    const regex = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(text.slice(lastIndex, match.index));
        }
        if (match[1] !== undefined) {
            // Link: [text](url)
            parts.push(
                <a
                    key={match.index}
                    href={match[2]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent font-medium underline decoration-accent/40 underline-offset-3 hover:decoration-accent transition-colors"
                >
                    {match[1]}
                </a>
            );
        } else if (match[3] !== undefined) {
            // Bold: **text**
            parts.push(
                <strong key={match.index} className="font-semibold text-primary dark:text-white">
                    {match[3]}
                </strong>
            );
        }
        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : [text];
}

export default function News({ items, title = 'News', initialCount = 7 }: NewsProps) {
    const [expanded, setExpanded] = useState(false);
    const hasMore = items.length > initialCount;
    const visibleItems = expanded ? items : items.slice(0, initialCount);

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                    <span className="w-1 h-6 rounded-full bg-gradient-to-b from-accent to-amber-500/50 inline-block" />
                    <h2 className="text-2xl font-serif font-bold text-primary tracking-tight">{title}</h2>
                </div>
                {hasMore && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-accent hover:text-accent-dark px-2.5 py-1 rounded-lg hover:bg-accent/10 transition-colors cursor-pointer"
                    >
                        <span>{expanded ? 'Show Less' : `Show All (${items.length})`}</span>
                        {expanded ? <ChevronUpIcon className="w-3.5 h-3.5" /> : <ChevronDownIcon className="w-3.5 h-3.5" />}
                    </button>
                )}
            </div>

            <div className="editorial-card rounded-2xl p-4 sm:p-6">
                <div className="relative border-l-2 border-neutral-200 dark:border-neutral-800 ml-2 sm:ml-3 space-y-4">
                    <AnimatePresence initial={false}>
                        {visibleItems.map((item, index) => (
                            <motion.div
                                key={`${item.date}-${index}`}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.2 }}
                                className="relative pl-4 sm:pl-5 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3"
                            >
                                {/* Timeline dot */}
                                <span
                                    className={`absolute -left-[5px] top-1.5 sm:top-2 w-2 h-2 rounded-full ring-4 ring-white dark:ring-neutral-900 ${
                                        index < 3 ? 'bg-accent' : 'bg-neutral-300 dark:bg-neutral-600'
                                    }`}
                                />
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 w-fit shrink-0 tabular-nums">
                                    {item.date}
                                </span>
                                <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                    {item.icon && <span className="mr-1">{item.icon}</span>}
                                    {parseMarkdownInline(item.content)}
                                </p>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {hasMore && (
                    <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex justify-center">
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-accent dark:hover:text-accent transition-colors py-1 px-3 rounded-full bg-neutral-50 dark:bg-neutral-800/60 cursor-pointer"
                        >
                            <span>
                                {expanded
                                    ? 'Collapse earlier news'
                                    : `Show ${items.length - initialCount} more news items`}
                            </span>
                            {expanded ? (
                                <ChevronUpIcon className="w-3.5 h-3.5" />
                            ) : (
                                <ChevronDownIcon className="w-3.5 h-3.5" />
                            )}
                        </button>
                    </div>
                )}
            </div>
        </motion.section>
    );
}
