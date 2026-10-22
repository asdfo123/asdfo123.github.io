'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
    BookOpenIcon,
    ClipboardDocumentIcon,
    CheckIcon,
    DocumentTextIcon,
    ArrowTopRightOnSquareIcon,
    MagnifyingGlassPlusIcon,
} from '@heroicons/react/24/outline';
import { Publication } from '@/types/publication';

interface SelectedPublicationsProps {
    publications: Publication[];
    title?: string;
}

function getVenueBadgeClass(venue?: string): string {
    if (!venue) return 'bg-slate-800 text-white';
    const lower = venue.toLowerCase();
    if (lower.includes('arxiv') || lower.includes('preprint')) {
        return 'bg-slate-900/90 text-amber-200 border border-amber-400/30 backdrop-blur-xs';
    }
    if (lower.includes('findings')) {
        return 'bg-gradient-to-r from-teal-800 to-emerald-700 text-white shadow-xs';
    }
    if (lower.includes('workshop')) {
        return 'bg-gradient-to-r from-purple-800 to-indigo-800 text-white shadow-xs';
    }
    return 'bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 text-white shadow-xs';
}

function getAuthorshipBadge(pub: Publication): string | null {
    const highlighted = pub.authors.find(a => a.isHighlighted);
    if (!highlighted) return null;
    if (highlighted.isCoAuthor) return 'Co-First Author';
    if (pub.authors[0]?.isHighlighted) return 'First Author';
    return null;
}

export default function SelectedPublications({ publications, title = 'Selected Publications' }: SelectedPublicationsProps) {
    const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);
    const [expandedBibtexId, setExpandedBibtexId] = useState<string | null>(null);
    const [expandedAbstractId, setExpandedAbstractId] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopyBibtex = (id: string, bibtex: string) => {
        navigator.clipboard.writeText(bibtex);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                    <span className="w-1 h-6 rounded-full bg-gradient-to-b from-accent to-amber-500/50 inline-block" />
                    <h2 className="text-2xl font-serif font-bold text-primary tracking-tight">{title}</h2>
                </div>
                <Link
                    href="/publications"
                    prefetch={true}
                    className="inline-flex items-center gap-1 text-accent hover:text-accent-dark text-sm font-medium transition-all duration-200 px-2.5 py-1 rounded-lg hover:bg-accent/10"
                >
                    <span>View All Publications</span>
                    <span aria-hidden="true">→</span>
                </Link>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                <span className="underline underline-offset-2">Underline</span> and <sup>*</sup> indicate equal contribution; <sup>†</sup> indicates corresponding author.
            </p>

            <div className="space-y-4">
                {publications.map((pub, index) => {
                    const roleBadge = getAuthorshipBadge(pub);
                    return (
                        <motion.div
                            key={pub.id}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: 0.06 * index }}
                            className="editorial-card group p-4 sm:p-5 rounded-2xl hover:shadow-md hover:border-accent/40 dark:hover:border-accent/40 transition-all duration-200"
                        >
                            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
                                {pub.preview && (
                                    <div className="w-full sm:w-48 md:w-52 flex-shrink-0">
                                        <div
                                            onClick={() => setLightboxImage({ src: `/papers/${pub.preview}`, alt: pub.title })}
                                            className="relative p-1 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/70 shadow-xs cursor-zoom-in group/img overflow-hidden"
                                        >
                                            {pub.venue && (
                                                <span
                                                    className={`absolute top-1.5 left-1.5 z-10 px-2 py-0.5 text-[10px] font-semibold tracking-wide rounded-md ${getVenueBadgeClass(
                                                        pub.venue
                                                    )}`}
                                                >
                                                    {pub.venue}
                                                </span>
                                            )}
                                            <Image
                                                src={`/papers/${pub.preview}`}
                                                alt={pub.title}
                                                width={320}
                                                height={220}
                                                className="w-full h-auto block rounded-lg group-hover/img:scale-[1.03] transition-transform duration-300"
                                            />
                                            <div className="absolute bottom-2 right-2 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 bg-black/65 text-white p-1 rounded-md backdrop-blur-xs">
                                                <MagnifyingGlassPlusIcon className="w-3.5 h-3.5" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="flex-grow min-w-0 flex flex-col">
                                    {/* Top badges row */}
                                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                        {roleBadge && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-amber-500/12 text-accent border border-accent/25">
                                                ★ {roleBadge}
                                            </span>
                                        )}
                                        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                            {pub.journal || pub.conference ? (
                                                <span className="italic">{pub.journal || pub.conference}</span>
                                            ) : (
                                                <span>{pub.venue || pub.year}</span>
                                            )}
                                        </span>
                                    </div>

                                    <h3 className="text-base sm:text-lg font-semibold text-primary mb-1.5 leading-snug">
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

                                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-2 leading-relaxed">
                                        {pub.authors.map((author, idx) => (
                                            <span key={idx}>
                                                <span
                                                    className={`${
                                                        author.isHighlighted
                                                            ? 'font-semibold text-primary dark:text-white bg-accent/15 dark:bg-accent/20 px-1 py-0.2 rounded'
                                                            : ''
                                                    } ${
                                                        author.isCoAuthor
                                                            ? `underline underline-offset-4 ${
                                                                  author.isHighlighted ? 'decoration-accent' : 'decoration-neutral-400'
                                                              }`
                                                            : ''
                                                    }`}
                                                >
                                                    {author.name}
                                                </span>
                                                {author.isCoAuthor && (
                                                    <sup className={`ml-0.5 ${author.isHighlighted ? 'text-accent font-bold' : 'text-neutral-500'}`}>*</sup>
                                                )}
                                                {author.isCorresponding && (
                                                    <sup className={`ml-0.5 ${author.isHighlighted ? 'text-accent font-bold' : 'text-neutral-500'}`}>†</sup>
                                                )}
                                                {idx < pub.authors.length - 1 && ', '}
                                            </span>
                                        ))}
                                    </p>

                                    {pub.description && (
                                        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-3 leading-relaxed">
                                            {pub.description}
                                        </p>
                                    )}

                                    {/* Action links */}
                                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-auto pt-1">
                                        {pub.url && (
                                            <a
                                                href={pub.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-accent/10 text-accent hover:bg-accent hover:text-white transition-colors"
                                            >
                                                <DocumentTextIcon className="w-3.5 h-3.5" />
                                                Paper
                                            </a>
                                        )}
                                        {pub.website && (
                                            <a
                                                href={pub.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-600 hover:text-white transition-colors"
                                            >
                                                <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                                                Project
                                            </a>
                                        )}
                                        {pub.code && (
                                            <a
                                                href={pub.code}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-800 hover:text-white dark:hover:bg-neutral-700 transition-colors"
                                            >
                                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                                </svg>
                                                Code
                                            </a>
                                        )}
                                        {pub.models && (
                                            <a
                                                href={pub.models}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-600 hover:text-white transition-colors"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                </svg>
                                                Models
                                            </a>
                                        )}
                                        {pub.data && (
                                            <a
                                                href={pub.data}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-600 hover:text-white transition-colors"
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
                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white transition-colors"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                                </svg>
                                                Media
                                            </a>
                                        )}
                                        {pub.abstract && (
                                            <button
                                                onClick={() => setExpandedAbstractId(expandedAbstractId === pub.id ? null : pub.id)}
                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                                                    expandedAbstractId === pub.id
                                                        ? 'bg-accent text-white'
                                                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                                                }`}
                                            >
                                                <DocumentTextIcon className="w-3.5 h-3.5" />
                                                Abstract
                                            </button>
                                        )}
                                        {pub.bibtex && (
                                            <button
                                                onClick={() => setExpandedBibtexId(expandedBibtexId === pub.id ? null : pub.id)}
                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                                                    expandedBibtexId === pub.id
                                                        ? 'bg-accent text-white'
                                                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                                                }`}
                                            >
                                                <BookOpenIcon className="w-3.5 h-3.5" />
                                                BibTeX
                                            </button>
                                        )}
                                    </div>

                                    {/* Expandable Abstract & BibTeX */}
                                    <AnimatePresence>
                                        {expandedAbstractId === pub.id && pub.abstract && (
                                            <motion.div
                                                key="abstract"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden mt-3"
                                            >
                                                <div className="bg-neutral-50 dark:bg-neutral-800/80 rounded-xl p-3.5 border border-neutral-200 dark:border-neutral-700">
                                                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                                                        {pub.abstract}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                        {expandedBibtexId === pub.id && pub.bibtex && (
                                            <motion.div
                                                key="bibtex"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden mt-3"
                                            >
                                                <div className="relative bg-neutral-50 dark:bg-neutral-800/80 rounded-xl p-3.5 border border-neutral-200 dark:border-neutral-700">
                                                    <pre className="text-xs text-neutral-600 dark:text-neutral-300 overflow-x-auto whitespace-pre-wrap font-mono pr-16">
                                                        {pub.bibtex}
                                                    </pre>
                                                    <button
                                                        onClick={() => handleCopyBibtex(pub.id, pub.bibtex || '')}
                                                        className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white dark:bg-neutral-700 text-xs font-medium text-neutral-600 dark:text-neutral-200 hover:text-accent shadow-xs border border-neutral-200 dark:border-neutral-600 transition-colors cursor-pointer"
                                                        title="Copy BibTeX"
                                                    >
                                                        {copiedId === pub.id ? (
                                                            <>
                                                                <CheckIcon className="h-3.5 w-3.5 text-green-500" />
                                                                <span>Copied</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ClipboardDocumentIcon className="h-3.5 w-3.5" />
                                                                <span>Copy</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {lightboxImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-zoom-out"
                        onClick={() => setLightboxImage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="relative max-w-[92vw] max-h-[88vh] p-2 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center bg-white dark:bg-neutral-800 rounded-full shadow-lg text-neutral-600 dark:text-neutral-300 hover:text-red-500 transition-colors"
                                onClick={() => setLightboxImage(null)}
                                aria-label="Close preview"
                            >
                                ✕
                            </button>
                            <Image
                                src={lightboxImage.src}
                                alt={lightboxImage.alt}
                                width={1200}
                                height={800}
                                className="max-w-full max-h-[82vh] w-auto h-auto rounded-xl object-contain"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.section>
    );
}
