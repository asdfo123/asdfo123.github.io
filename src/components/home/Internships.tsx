'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export interface InternshipItem {
    period: string;
    role: string;
    company: string;
    location: string;
    logo?: string;
    url?: string;
}

interface InternshipsProps {
    items: InternshipItem[];
    title?: string;
}

export default function Internships({ items, title = 'Internships' }: InternshipsProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3 }}
        >
            {/* Curatorial Section Header */}
            <div className="flex items-baseline justify-between pb-3 mb-2 swiss-rule-b">
                <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
                        08 // INDUSTRY & LABS
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-primary tracking-tight">
                        {title}
                    </h2>
                </div>
                <span aria-hidden="true" className="font-mono text-xs text-neutral-400">+</span>
            </div>

            <div className="divide-y divide-[var(--hairline)] swiss-rule-b">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="py-4 flex items-start sm:items-center gap-4"
                    >
                        {item.logo && (
                            <div className="w-11 h-11 flex-shrink-0 bg-white flex items-center justify-center p-1.5 border border-[var(--hairline)]">
                                <Image
                                    src={item.logo}
                                    alt={item.company}
                                    width={44}
                                    height={44}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
                                <h3 className="text-base font-semibold text-primary">
                                    {item.url ? (
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-accent transition-colors"
                                        >
                                            {item.company}
                                        </a>
                                    ) : (
                                        item.company
                                    )}
                                </h3>
                                <span className="font-mono text-[11px] text-neutral-500 shrink-0 tabular-nums">
                                    {item.period}
                                </span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-2 mt-0.5">
                                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
                                    {item.role}
                                </p>
                                <p className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">
                                    {item.location}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.section>
    );
}
