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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">{title}</h2>
            <div className="space-y-3">
                {items.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                        className="flex items-center gap-4 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 hover:shadow-md transition-shadow"
                    >
                        {item.logo && (
                            <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-white flex items-center justify-center p-1 border border-neutral-100 dark:border-neutral-700">
                                <Image
                                    src={item.logo}
                                    alt={item.company}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-baseline justify-between gap-2 flex-wrap">
                                <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
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
                                <span className="text-xs text-neutral-500 shrink-0 tabular-nums">
                                    {item.period}
                                </span>
                            </div>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                {item.role}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-500">
                                {item.location}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}
