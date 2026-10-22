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
            transition={{ duration: 0.5, delay: 0.35 }}
        >
            <div className="flex items-center gap-2.5 mb-4">
                <span className="w-1 h-6 rounded-full bg-gradient-to-b from-accent to-amber-500/50 inline-block" />
                <h2 className="text-2xl font-serif font-bold text-primary tracking-tight">{title}</h2>
            </div>
            <div className="grid grid-cols-1 gap-3">
                {items.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.06 * index }}
                        className="editorial-card flex items-start sm:items-center gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-2xl hover:shadow-md hover:border-accent/40 transition-all duration-200"
                    >
                        {item.logo && (
                            <div className="w-11 h-11 sm:w-12 sm:h-12 flex-shrink-0 rounded-xl overflow-hidden bg-white flex items-center justify-center p-1.5 border border-neutral-200/70 dark:border-neutral-700 shadow-2xs">
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
                            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-2">
                                <h3 className="text-sm sm:text-base font-semibold text-primary">
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
                                <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400 shrink-0 tabular-nums">
                                    {item.period}
                                </span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-2 mt-0.5">
                                <p className="text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    {item.role}
                                </p>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                    {item.location}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}
