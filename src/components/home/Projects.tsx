'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';

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
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
        >
            {/* Curatorial Section Header */}
            <div className="flex items-baseline justify-between pb-3 mb-5 swiss-rule-b">
                <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
                        02 // OPEN-SOURCE
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-primary tracking-tight">
                        {title}
                    </h2>
                </div>
                <span aria-hidden="true" className="font-mono text-xs text-neutral-400">+</span>
            </div>

            <div className="divide-y divide-[var(--hairline)] swiss-rule-b">
                {items.map((item, index) => (
                    <ProjectCard key={index} item={item} index={index} />
                ))}
            </div>
        </motion.section>
    );
}

function ProjectCard({ item, index }: { item: ProjectItem; index: number }) {
    return (
        <div className="py-5 first:pt-1 flex flex-col sm:flex-row items-start gap-5">
            {item.image && (
                <div className="sm:w-52 md:w-56 w-full flex-shrink-0">
                    <div className="p-1 bg-white dark:bg-neutral-900 border border-[var(--hairline)] overflow-hidden">
                        <Image
                            src={item.image}
                            alt={item.name}
                            width={360}
                            height={180}
                            className="w-full h-auto block object-contain hover:scale-[1.02] transition-transform duration-500"
                        />
                    </div>
                </div>
            )}
            <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex items-center justify-between gap-2 flex-wrap mb-1.5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono text-[11px] text-accent font-medium">
                            [OS.0{index + 1}]
                        </span>
                        <h3 className="text-lg sm:text-xl font-serif font-semibold text-primary tracking-tight">
                            {item.name}
                        </h3>
                        {item.github && (
                            <a
                                href={`https://github.com/${item.github}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center opacity-85 hover:opacity-100 transition-opacity"
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={`https://img.shields.io/github/stars/${item.github}?style=social`}
                                    alt="GitHub stars"
                                    className="h-4.5"
                                />
                            </a>
                        )}
                    </div>
                    {item.date && (
                        <span className="font-mono text-[11px] text-neutral-500">
                            {item.date}
                        </span>
                    )}
                </div>

                {item.highlight && (
                    <p className="text-xs sm:text-sm font-medium text-accent mb-1.5">
                        {item.highlight}
                    </p>
                )}

                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-3">
                    {item.description}
                </p>

                {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3.5">
                        {item.tags.map((tag, tagIndex) => (
                            <span
                                key={tagIndex}
                                className="inline-flex items-center justify-center font-mono text-[10px] leading-none uppercase tracking-wider px-2.5 py-1 border border-[var(--hairline)] text-neutral-500 dark:text-neutral-400"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {item.links && item.links.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                        {item.links.map((link, linkIndex) => (
                            <a
                                key={linkIndex}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cma-pill"
                            >
                                <span>{link.label}</span>
                                <ArrowUpRightIcon className="w-3 h-3" />
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
