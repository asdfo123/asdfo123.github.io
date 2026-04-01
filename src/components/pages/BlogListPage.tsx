'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto"
        >
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-serif font-bold text-primary">{config.title}</h1>
                {config.description && (
                    <p className="text-lg text-neutral-600 dark:text-neutral-500 mt-2">
                        {config.description}
                    </p>
                )}
            </div>

            {/* Tags Filter */}
            {allTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                    <button
                        onClick={() => setSelectedTag(null)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${selectedTag === null
                                ? 'bg-accent text-white shadow-sm'
                                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                            }`}
                    >
                        All
                    </button>
                    {allTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${selectedTag === tag
                                    ? 'bg-accent text-white shadow-sm'
                                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            )}

            {/* Post List */}
            <div className="space-y-1">
                {filteredPosts.length === 0 && (
                    <p className="text-neutral-500 dark:text-neutral-600 text-center py-12">
                        No posts yet. Stay tuned! ✍️
                    </p>
                )}
                {filteredPosts.map((post, index) => (
                    <motion.div
                        key={post.slug}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                    >
                        <Link
                            href={`/blog/${post.slug}/`}
                            className="group block py-4 -mx-4 px-4 rounded-xl transition-colors duration-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                        >
                            <div className="flex items-baseline justify-between gap-4">
                                <h2 className="text-lg font-semibold text-primary group-hover:text-accent transition-colors duration-200 leading-snug">
                                    {post.title}
                                </h2>
                                <time className="text-sm text-neutral-500 dark:text-neutral-600 shrink-0 tabular-nums">
                                    {formatDate(post.date)}
                                </time>
                            </div>
                            {post.summary && (
                                <p className="text-sm text-neutral-600 dark:text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                                    {post.summary}
                                </p>
                            )}
                            {post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {post.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </Link>
                    </motion.div>
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
