'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BlogPost } from '@/types/page';

interface BlogPostPageProps {
    post: BlogPost;
    prevPost?: { slug: string; title: string } | null;
    nextPost?: { slug: string; title: string } | null;
}

export default function BlogPostPage({ post, prevPost, nextPost }: BlogPostPageProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto"
        >
            {/* Back link */}
            <Link
                href="/blog/"
                className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-accent transition-colors duration-200 mb-6 group"
            >
                <svg className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Blog
            </Link>

            {/* Post header */}
            <header className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-primary leading-tight">
                    {post.title}
                </h1>
                <div className="flex items-center gap-3 mt-3 text-sm text-neutral-500 dark:text-neutral-600">
                    <time className="tabular-nums">{formatDate(post.date)}</time>
                    {post.tags.length > 0 && (
                        <>
                            <span className="text-neutral-300 dark:text-neutral-700">·</span>
                            <div className="flex flex-wrap gap-1.5">
                                {post.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-medium"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </header>

            {/* Divider */}
            <hr className="border-neutral-200 dark:border-neutral-800 mb-8" />

            {/* Content */}
            {post.contentType === 'notion' && post.notionUrl ? (
                <div className="rounded-xl border border-neutral-200 dark:border-neutral-700/60 overflow-hidden">
                    <iframe
                        src={post.notionUrl}
                        className="w-full border-0"
                        style={{ height: 'calc(100vh - 12rem)', minHeight: '60vh' }}
                        title={post.title}
                        allowFullScreen
                    />
                </div>
            ) : (
                <article className="text-neutral-700 dark:text-neutral-600 leading-relaxed">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h1: ({ children }) => <h1 className="text-3xl font-serif font-bold text-primary mt-8 mb-4">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-2xl font-serif font-bold text-primary mt-8 mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-xl font-semibold text-primary mt-6 mb-3">{children}</h3>,
                            p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1 ml-4">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1 ml-4">{children}</ol>,
                            li: ({ children }) => <li className="mb-1">{children}</li>,
                            a: ({ ...props }) => (
                                <a
                                    {...props}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-accent font-medium hover:underline transition-colors"
                                />
                            ),
                            blockquote: ({ children }) => (
                                <blockquote className="border-l-4 border-accent/50 pl-4 italic my-4 text-neutral-600 dark:text-neutral-500">
                                    {children}
                                </blockquote>
                            ),
                            strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                            em: ({ children }) => <em className="italic text-neutral-600 dark:text-neutral-500">{children}</em>,
                            code: ({ children, className }) => {
                                const isInline = !className;
                                return isInline ? (
                                    <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-sm font-mono text-accent">
                                        {children}
                                    </code>
                                ) : (
                                    <code className={className}>{children}</code>
                                );
                            },
                            pre: ({ children }) => (
                                <pre className="rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 overflow-x-auto mb-4 text-sm">
                                    {children}
                                </pre>
                            ),
                            img: ({ src, alt }) => {
                                const [displayAlt, width] = (alt || '').split('|');
                                return (
                                    <span className="block my-6">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={src}
                                            alt={displayAlt}
                                            style={width ? { width } : undefined}
                                            className="rounded-xl max-w-full mx-auto shadow-sm"
                                        />
                                        {displayAlt && (
                                            <span className="block text-center text-sm text-neutral-500 mt-2">{displayAlt}</span>
                                        )}
                                    </span>
                                );
                            },
                            table: ({ children }) => (
                                <div className="overflow-x-auto my-8">
                                    <table className="w-full border-collapse text-left text-sm">
                                        {children}
                                    </table>
                                </div>
                            ),
                            thead: ({ children }) => (
                                <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                                    {children}
                                </thead>
                            ),
                            th: ({ children }) => (
                                <th className="px-4 py-3 font-semibold text-primary/80 border border-neutral-200 dark:border-neutral-800">
                                    {children}
                                </th>
                            ),
                            td: ({ children }) => (
                                <td className="px-4 py-3 border border-neutral-200 dark:border-neutral-800">
                                    {children}
                                </td>
                            ),
                            tr: ({ children }) => (
                                <tr className="even:bg-neutral-50/30 dark:even:bg-neutral-900/10 transition-colors">
                                    {children}
                                </tr>
                            ),
                        }}
                    >
                        {post.content}
                    </ReactMarkdown>
                </article>
            )}

            {/* Prev / Next navigation */}
            {(prevPost || nextPost) && (
                <nav className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
                    <div className="flex justify-between gap-4">
                        {prevPost ? (
                            <Link
                                href={`/blog/${prevPost.slug}/`}
                                className="group flex flex-col items-start max-w-[45%]"
                            >
                                <span className="text-xs text-neutral-500 mb-1">← Previous</span>
                                <span className="text-sm font-medium text-primary group-hover:text-accent transition-colors line-clamp-2">
                                    {prevPost.title}
                                </span>
                            </Link>
                        ) : <div />}
                        {nextPost ? (
                            <Link
                                href={`/blog/${nextPost.slug}/`}
                                className="group flex flex-col items-end max-w-[45%] text-right"
                            >
                                <span className="text-xs text-neutral-500 mb-1">Next →</span>
                                <span className="text-sm font-medium text-primary group-hover:text-accent transition-colors line-clamp-2">
                                    {nextPost.title}
                                </span>
                            </Link>
                        ) : <div />}
                    </div>
                </nav>
            )}
        </motion.div>
    );
}

function formatDate(dateStr: string): string {
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch {
        return dateStr;
    }
}
