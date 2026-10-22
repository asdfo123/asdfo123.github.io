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
            transition={{ duration: 0.5, delay: 0.15 }}
        >
            <div className="flex items-center gap-2.5 mb-4">
                <span className="w-1 h-6 rounded-full bg-gradient-to-b from-accent to-amber-500/50 inline-block" />
                <h2 className="text-2xl font-serif font-bold text-primary tracking-tight">{title}</h2>
            </div>
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
        <div className="editorial-card flex flex-col sm:flex-row items-start gap-4 sm:gap-5 p-4 sm:p-5 rounded-2xl hover:shadow-md hover:border-accent/40 transition-all duration-200">
            {item.image && (
                <div className="sm:w-48 md:w-52 w-full flex-shrink-0">
                    <div className="overflow-hidden rounded-xl border border-neutral-200/70 dark:border-neutral-700/70 bg-neutral-900 shadow-xs">
                        <Image
                            src={item.image}
                            alt={item.name}
                            width={360}
                            height={180}
                            className="w-full h-auto block object-contain hover:scale-[1.03] transition-transform duration-300"
                        />
                    </div>
                </div>
            )}
            <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="text-base sm:text-lg font-bold text-primary">
                            {item.name}
                        </h3>
                        {item.github && (
                            <a
                                href={`https://github.com/${item.github}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center"
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
                        <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                            {item.date}
                        </span>
                    )}
                </div>
                {item.highlight && (
                    <p className="text-xs sm:text-sm font-semibold text-accent mb-1.5">
                        {item.highlight}
                    </p>
                )}
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-2.5">
                    {item.description}
                </p>
                {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {item.tags.map((tag, tagIndex) => (
                            <span
                                key={tagIndex}
                                className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-700/50"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
                {item.links && item.links.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-auto pt-1">
                        {item.links.map((link, linkIndex) => (
                            <a
                                key={linkIndex}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-accent hover:text-white transition-colors"
                            >
                                <LinkIcon label={link.label} />
                                <span>{link.label}</span>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function LinkIcon({ label }: { label: string }) {
    const cls = 'w-3.5 h-3.5 flex-shrink-0';
    const lower = label.toLowerCase();

    if (lower.includes('blog') || lower.startsWith('note')) {
        return (
            <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
        );
    }

    if (lower.includes('code') || lower.includes('github')) {
        return (
            <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
        );
    }

    if (lower.includes('model') || lower.includes('huggingface')) {
        return (
            <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
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

    if (lower.includes('paper') || lower.includes('pdf') || lower.includes('arxiv')) {
        return (
            <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        );
    }

    return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
    );
}
