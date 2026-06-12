'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Publication } from '@/types/publication';

interface SelectedPublicationsProps {
    publications: Publication[];
    title?: string;
}

export default function SelectedPublications({ publications, title = 'Selected Publications' }: SelectedPublicationsProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-serif font-bold text-primary">{title}</h2>
                <Link
                    href="/publications"
                    prefetch={true}
                    className="text-accent hover:text-accent-dark text-sm font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
                >
                    View All →
                </Link>
            </div>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto lg:max-h-none lg:overflow-visible pr-1">
                {publications.map((pub, index) => (
                    <motion.div
                        key={pub.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg shadow-sm border border-neutral-200 dark:border-[rgba(148,163,184,0.24)] hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                    >
                        <div className="flex flex-col sm:flex-row gap-4">
                            {pub.preview && (
                                <div className="w-full sm:w-44 flex-shrink-0">
                                    <div className="relative p-1 rounded-lg bg-white dark:bg-neutral-700 shadow-md hover:shadow-xl transition-shadow duration-300 ring-1 ring-neutral-200 dark:ring-neutral-600">
                                        {pub.venue && (
                                            <span
                                                className="absolute top-0 left-0 z-10 px-1.5 py-0.5 text-[10px] font-bold text-white bg-blue-900 rounded-br-md shadow-md"
                                                style={{ fontFamily: 'Arial, sans-serif' }}
                                            >
                                                {pub.venue}
                                            </span>
                                        )}
                                        <Image
                                            src={`/papers/${pub.preview}`}
                                            alt={pub.title}
                                            width={200}
                                            height={150}
                                            className="w-full h-auto rounded hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                </div>
                            )}
                            <div className="flex-grow">
                                <h3 className="font-semibold text-primary mb-2 leading-tight">
                                    {pub.doi || pub.url ? (
                                        <a
                                            href={pub.doi ? `https://doi.org/${pub.doi}` : pub.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-accent transition-colors duration-200"
                                        >
                                            {pub.title}
                                        </a>
                                    ) : (
                                        pub.title
                                    )}
                                </h3>
                                <p className="text-sm text-neutral-600 dark:text-neutral-500 mb-1">
                                    {pub.authors.map((author, idx) => (
                                        <span key={idx}>
                                            <span className={`${author.isHighlighted ? 'font-semibold text-accent' : ''} ${author.isCoAuthor ? `underline underline-offset-4 ${author.isHighlighted ? 'decoration-accent' : 'decoration-neutral-400'}` : ''}`}>
                                                {author.name}
                                            </span>
                                            {author.isCorresponding && (
                                                <sup className={`ml-0 ${author.isHighlighted ? 'text-accent' : 'text-neutral-600 dark:text-neutral-500'}`}>†</sup>
                                            )}
                                            {idx < pub.authors.length - 1 && ', '}
                                        </span>
                                    ))}
                                </p>
                                <p className="text-sm text-neutral-600 dark:text-neutral-500 mb-2">
                                    {pub.journal || pub.conference}, {pub.year}
                                </p>
                                {pub.description && (
                                    <p className="text-sm text-neutral-500 dark:text-neutral-500 line-clamp-2">
                                        {pub.description}
                                    </p>
                                )}
                                {/* Action links */}
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {pub.url && (
                                        <a
                                            href={pub.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                            Paper
                                        </a>
                                    )}
                                    {pub.code && (
                                        <a
                                            href={pub.code}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
                                        >
                                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                                            </svg>
                                            Code
                                        </a>
                                    )}
                                    {pub.data && (
                                        <a
                                            href={pub.data}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                                            </svg>
                                            Dataset
                                        </a>
                                    )}
                                    {pub.media && (
                                        <a
                                            href={pub.media}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                            </svg>
                                            Media
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}
