'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TextPageConfig } from '@/types/page';

interface TextPageProps {
    config: TextPageConfig;
    content: string;
    embedded?: boolean;
}

export default function TextPage({ config, content, embedded = false }: TextPageProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className={embedded ? "" : "max-w-3xl mx-auto"}
        >
            <div className="pb-5 mb-8 swiss-rule-b">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
                    ARCHIVE // {config.title}
                </span>
                <div className="flex flex-wrap items-end justify-between gap-3 mt-2">
                    <h1 className={`${embedded ? "text-2xl sm:text-3xl" : "text-3xl sm:text-5xl"} font-serif font-semibold text-primary tracking-tight`}>
                        {config.title}
                    </h1>
                    {config.pdf && (
                        <a
                            href={config.pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cma-pill cma-pill-active"
                        >
                            <span>Download PDF</span>
                            <span aria-hidden="true">↓</span>
                        </a>
                    )}
                </div>
                {config.description && (
                    <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-2 max-w-2xl">
                        {config.description}
                    </p>
                )}
            </div>
            <div className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
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
                                className="text-primary font-medium underline decoration-accent/60 underline-offset-4 hover:text-accent transition-colors"
                            />
                        ),
                        blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-accent/50 pl-4 italic my-4 text-neutral-600 dark:text-neutral-400">
                                {children}
                            </blockquote>
                        ),
                        strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                        em: ({ children }) => <em className="italic text-neutral-600 dark:text-neutral-400">{children}</em>,
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
                    {content}
                </ReactMarkdown>
            </div>
            {config.pdf && (
                <div className="mt-8">
                    <div className="flex flex-wrap items-baseline justify-between gap-2 pb-3 mb-4 swiss-rule-b">
                        <div className="flex items-baseline gap-3">
                            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
                                FIG. 01
                            </span>
                            <h2 className="text-2xl font-serif font-semibold text-primary">PDF Preview</h2>
                        </div>
                        <a
                            href={config.pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-[11px] uppercase tracking-wider text-primary hover:text-accent transition-colors"
                        >
                            Full Screen ↗
                        </a>
                    </div>
                    <div className="sm:hidden mb-4 pl-4 border-l-2 border-accent flex items-center justify-between gap-3">
                        <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-snug">
                            On mobile, the PDF reads best when opened directly.
                        </p>
                        <a
                            href={config.pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cma-pill cma-pill-active shrink-0"
                        >
                            Open PDF ↗
                        </a>
                    </div>
                    <div className="border border-[var(--hairline)] bg-white p-1 overflow-hidden">
                        <object
                            data={`${config.pdf}#view=FitH`}
                            type="application/pdf"
                            className="w-full"
                            style={{ height: 'calc(100vh - 4rem)', minHeight: '80vh' }}
                        >
                            <iframe
                                src={`${config.pdf}#view=FitH`}
                                className="w-full border-0"
                                style={{ height: 'calc(100vh - 4rem)', minHeight: '80vh' }}
                                title="CV Preview"
                            />
                        </object>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
