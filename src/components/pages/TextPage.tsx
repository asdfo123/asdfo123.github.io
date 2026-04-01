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
            transition={{ duration: 0.6, delay: 0.4 }}
            className={embedded ? "" : "max-w-3xl mx-auto"}
        >
            <div className="flex items-center justify-between mb-4">
                <h1 className={`${embedded ? "text-2xl" : "text-4xl"} font-serif font-bold text-primary`}>{config.title}</h1>
                {config.pdf && (
                    <a
                        href={config.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors duration-200 shadow-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download PDF
                    </a>
                )}
            </div>
            {config.description && (
                <p className={`${embedded ? "text-base" : "text-lg"} text-neutral-600 dark:text-neutral-500 mb-8 max-w-2xl`}>
                    {config.description}
                </p>
            )}
            <div className="text-neutral-700 dark:text-neutral-600 leading-relaxed">
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
                    <h2 className="text-2xl font-serif font-bold text-primary mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">PDF Preview</h2>
                    <div className="rounded-xl border border-neutral-200 dark:border-neutral-700/60 overflow-hidden shadow-sm">
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
