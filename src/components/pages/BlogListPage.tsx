'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';
import { BlogPost } from '@/types/page';
import { BlogPageConfig } from '@/types/page';

interface BlogListPageProps {
    config: BlogPageConfig;
    posts: BlogPost[];
}

export default function BlogListPage({ config, posts }: BlogListPageProps) {
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    const allTags = Array.from(new Set(posts.flatMap(p => p.tags)));
    const filteredPosts = selectedTag
        ? posts.filter(p => p.tags.includes(selectedTag))
        : posts;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="max-w-3xl mx-auto"
        >
            {/* Header */}
            <div className="pb-5 mb-6 swiss-rule-b">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
                    ARCHIVE // WRITING
                </span>
                <h1 className="text-3xl sm:text-5xl font-serif font-semibold text-primary tracking-tight mt-2">
                    {config.title}
                </h1>
                {config.description && (
                    <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-2">
                        {config.description}
                    </p>
                )}
            </div>

            {/* Tags Filter */}
            {allTags.length > 0 && (
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-4 mb-2 swiss-rule-b">
                    <button
                        onClick={() => setSelectedTag(null)}
                        className={`cma-pill shrink-0 ${selectedTag === null ? 'cma-pill-active' : ''}`}
                    >
                        All [{posts.length}]
                    </button>
                    {allTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                            className={`cma-pill shrink-0 ${selectedTag === tag ? 'cma-pill-active' : ''}`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            )}

            {/* Post Ledger */}
            <div className="divide-y divide-[var(--hairline)] swiss-rule-b">
                {filteredPosts.length === 0 && (
                    <p className="py-12 text-center font-mono text-xs uppercase tracking-widest text-neutral-400">
                        No entries yet.
                    </p>
                )}
                {filteredPosts.map((post, index) => (
                    <Link
                        key={post.slug}
                        href={`/blog/${post.slug}/`}
                        className="group flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 py-5"
                    >
                        <div className="flex sm:flex-col items-baseline gap-3 sm:gap-1 w-24 shrink-0 font-mono text-[11px] uppercase tracking-wider">
                            <span className="text-accent font-semibold">[B.{String(index + 1).padStart(2, '0')}]</span>
                            <time className="text-neutral-400 tabular-nums">{formatDate(post.date)}</time>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="flex items-start gap-1.5 text-lg sm:text-xl font-serif font-semibold text-primary leading-snug group-hover:text-accent transition-colors">
                                <span>{post.title}</span>
                                <ArrowUpRightIcon className="w-4 h-4 mt-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </h2>
                            {post.summary && (
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1.5 line-clamp-2 leading-relaxed">
                                    {post.summary}
                                </p>
                            )}
                            {post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2.5">
                                    {post.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center font-mono text-[10px] leading-none uppercase tracking-wider px-2 py-1 border border-[var(--hairline)] text-neutral-500 dark:text-neutral-400"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </motion.div>
    );
}

function formatDate(dateStr: string): string {
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    } catch {
        return dateStr;
    }
}
