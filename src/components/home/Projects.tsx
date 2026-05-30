'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export interface ProjectLink {
    label: string;
    url: string;
}

export interface ProjectItem {
    name: string;
    description: string;
    date?: string;
    image?: string;
    tags?: string[];
    links?: ProjectLink[];
}

interface ProjectsProps {
    items: ProjectItem[];
    title?: string;
}

export default function Projects({ items, title = 'Open-Source Projects' }: ProjectsProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">{title}</h2>
            <div className="space-y-4">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 hover:shadow-md transition-shadow"
                    >
                        {item.image && (
                            <div className="sm:w-44 w-full flex-shrink-0">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={320}
                                    height={180}
                                    className="w-full rounded-md object-cover"
                                />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-baseline justify-between gap-2 flex-wrap">
                                <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
                                    {item.name}
                                </h3>
                                {item.date && (
                                    <span className="text-xs text-neutral-500">{item.date}</span>
                                )}
                            </div>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                                {item.description}
                            </p>
                            {item.tags && item.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {item.tags.map((tag, tagIndex) => (
                                        <span
                                            key={tagIndex}
                                            className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                            {item.links && item.links.length > 0 && (
                                <div className="flex flex-wrap gap-3 mt-3">
                                    {item.links.map((link, linkIndex) => (
                                        <a
                                            key={linkIndex}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium text-primary hover:underline"
                                        >
                                            {link.label} &rarr;
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </motion.section>
    );
}
