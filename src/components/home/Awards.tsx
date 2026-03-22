'use client';

import { motion } from 'framer-motion';

export interface AwardItem {
    date: string;
    awards: string[];  // Array of award names
    suffix?: string;   // Optional text after awards (e.g., "in the 6th Youth of HDU program")
}

interface AwardsProps {
    items: AwardItem[];
    title?: string;
}

export default function Awards({ items, title = 'Awards' }: AwardsProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
        >
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">{title}</h2>
            <ul className="list-disc list-outside ml-4 space-y-2">
                {items.map((item, index) => (
                    <li key={index} className="text-sm text-neutral-700 dark:text-neutral-400">
                        <span className="italic text-neutral-500">{item.date}</span>
                        <span>, </span>
                        {item.awards.map((award, awardIndex) => (
                            <span key={awardIndex}>
                                {awardIndex > 0 && <span> and </span>}
                                <span className="font-bold">{award}</span>
                            </span>
                        ))}
                        {item.suffix && <span> {item.suffix}</span>}
                        <span>.</span>
                    </li>
                ))}
            </ul>
        </motion.section>
    );
}

