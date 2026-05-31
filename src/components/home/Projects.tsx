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
    highlight?: string;
    github?: string;
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
                    <ProjectCard key={index} item={item} />
                ))}
            </div>
        </motion.section>
    );
}

function ProjectCard({ item }: { item: ProjectItem }) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 hover:shadow-md transition-shadow">
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
                <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
                            {item.name}
                        </h3>
                        {item.github && (
                            <a
                                href={`https://github.com/${item.github}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={`https://img.shields.io/github/stars/${item.github}?style=social`}
                                    alt="GitHub stars"
                                    className="h-5"
                                />
                            </a>
                        )}
                    </div>
                    {item.date && (
                        <span className="text-xs text-neutral-500">{item.date}</span>
                    )}
                </div>
                {item.highlight && (
                    <p className="text-sm font-semibold text-accent mt-1">
                        {item.highlight}
                    </p>
                )}
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
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-accent transition-colors"
                            >
                                <LinkIcon label={link.label} />
                                {link.label}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function LinkIcon({ label }: { label: string }) {
    const cls = "w-4 h-4 flex-shrink-0";
    const lower = label.toLowerCase();

    if (lower.includes('code') || lower.includes('github')) {
        return (
            <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
        );
    }

    if (lower.includes('model') || lower.includes('huggingface')) {
        return (
            <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
                <path d="M10.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm3 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM7.5 8.25a.75.75 0 01.75.75v6a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm9 0a.75.75 0 01.75.75v6a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zM6 17.25a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm4.5 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm4.5 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm3 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"/>
            </svg>
        );
    }

    if (lower.includes('data')) {
        return (
            <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
        );
    }

    // Default: globe icon for "Project Page" or others
    return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
    );
}
