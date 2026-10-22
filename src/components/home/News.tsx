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
            parts.push(
                <a
                    key={match.index}
                    href={match[2]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-medium underline decoration-accent/60 underline-offset-4 hover:text-accent transition-colors"
                >
                    {match[1]}
                </a>
            );
        } else if (match[3] !== undefined) {
            parts.push(
                <strong key={match.index} className="font-semibold text-primary">
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
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
        >
            {/* Curatorial Section Header */}
            <div className="flex items-baseline justify-between pb-3 mb-2 swiss-rule-b">
                <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
                        04 // CHRONICLE
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-primary tracking-tight">
                        {title}
                    </h2>
                </div>
                {hasMore && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="font-mono text-[11px] uppercase tracking-wider text-primary hover:text-accent inline-flex items-center gap-1 transition-colors cursor-pointer"
                    >
                        <span>{expanded ? 'Collapse' : `All (${items.length})`}</span>
                        {expanded ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />}
                    </button>
                )}
            </div>

            {/* Architectural Ledger Rows */}
            <div className="divide-y divide-[var(--hairline)] swiss-rule-b">
                <AnimatePresence initial={false}>
                    {visibleItems.map((item, index) => (
                        <motion.div
                            key={`${item.date}-${index}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            className="py-3 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6"
                        >
                            <span className="font-mono text-xs text-accent w-20 shrink-0 tabular-nums font-medium">
                                {item.date}
                            </span>
                            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed flex-1">
                                {item.icon && <span className="mr-1">{item.icon}</span>}
                                {parseMarkdownInline(item.content)}
                            </p>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {hasMore && (
                <div className="mt-3 flex justify-start">
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="cma-pill"
                    >
                        <span>
                            {expanded
                                ? 'Collapse Archive'
                                : `+ ${items.length - initialCount} Earlier Entries`}
                        </span>
                    </button>
                </div>
            )}
        </motion.section>
    );
}
