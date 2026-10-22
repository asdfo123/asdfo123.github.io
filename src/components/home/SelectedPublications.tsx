'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
    ClipboardDocumentIcon,
    CheckIcon,
    ArrowUpRightIcon,
    MagnifyingGlassPlusIcon,
} from '@heroicons/react/24/outline';
import { Publication } from '@/types/publication';

interface SelectedPublicationsProps {
    publications: Publication[];
    title?: string;
}

function getAuthorshipBadge(pub: Publication): string | null {
    const highlighted = pub.authors.find(a => a.isHighlighted);
    if (!highlighted) return null;
    if (highlighted.isCoAuthor) return 'CO-FIRST AUTHOR';
    if (pub.authors[0]?.isHighlighted) return 'FIRST AUTHOR';
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
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
        >
            {/* Curatorial Section Header */}
            <div className="flex flex-wrap items-baseline justify-between gap-2 pb-3 mb-2 swiss-rule-b">
                <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
                        03 // SELECTED WORKS
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-primary tracking-tight">
                        {title}
                    </h2>
                </div>
                <Link
                    href="/publications"
                    prefetch={true}
                    className="font-mono text-[11px] uppercase tracking-wider text-primary hover:text-accent inline-flex items-center gap-1 transition-colors"
                >
                    <span>Full Archive</span>
                    <ArrowUpRightIcon className="w-3 h-3" />
                </Link>
            </div>

            <p className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 mb-4">
                Note // <span className="underline underline-offset-2">Underline</span> &amp; * denote equal contribution; † denotes corresponding author.
            </p>

            {/* Exhibition Plates List (De-boxed Swiss Grid) */}
            <div className="divide-y divide-[var(--hairline)] swiss-rule-b">
                {publications.map((pub, index) => {
                    const roleBadge = getAuthorshipBadge(pub);
                    return (
                        <div
                            key={pub.id}
                            className="py-6 first:pt-2 flex flex-col sm:flex-row items-start gap-5 group"
                        >
                            {pub.preview && (
                                <div className="w-full sm:w-48 md:w-52 flex-shrink-0">
                                    <div
                                        onClick={() => setLightboxImage({ src: `/papers/${pub.preview}`, alt: pub.title })}
                                        className="relative p-1 bg-white dark:bg-neutral-900 border border-[var(--hairline)] cursor-zoom-in group/img overflow-hidden"
                                    >
                                        <Image
                                            src={`/papers/${pub.preview}`}
                                            alt={pub.title}
                                            width={320}
                                            height={220}
                                            className="w-full h-auto block group-hover/img:scale-[1.02] transition-transform duration-500"
                                        />
                                        <div className="absolute bottom-1.5 right-1.5 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 bg-black/75 text-white p-1">
                                            <MagnifyingGlassPlusIcon className="w-3.5 h-3.5" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex-grow min-w-0 flex flex-col">
                                {/* Catalog Index + Venue + Role Metadata Row */}
                                <div className="flex flex-wrap items-center gap-2 mb-1.5 font-mono text-[10px] uppercase tracking-wider">
                                    <span className="text-accent font-semibold">
                                        [W.{String(index + 1).padStart(2, '0')}]
                                    </span>
                                    {pub.venue && (
                                        <span className="inline-flex items-center justify-center px-2 py-1 leading-none bg-primary text-background font-semibold">
                                            {pub.venue}
                                        </span>
                                    )}
                                    {roleBadge && (
                                        <span className="inline-flex items-center justify-center px-2 py-1 leading-none border border-accent/50 text-accent font-medium">
                                            {roleBadge}
                                        </span>
                                    )}
                                    <span className="text-neutral-400 ml-auto tabular-nums">
                                        {pub.year}
                                    </span>
                                </div>

                                {/* Paper Title */}
                                <h3 className="text-lg sm:text-xl font-serif font-semibold text-primary mb-1.5 leading-snug">
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

                                {/* Authors */}
                                <p className="text-xs sm:text-[13.5px] text-neutral-600 dark:text-neutral-400 mb-2 leading-relaxed">
                                    {pub.authors.map((author, idx) => (
                                        <span key={idx}>
                                            <span
                                                className={`${
                                                    author.isHighlighted
                                                        ? 'font-semibold text-primary underline decoration-accent decoration-1 underline-offset-4'
                                                        : ''
                                                } ${
                                                    author.isCoAuthor
                                                        ? 'underline underline-offset-4 decoration-neutral-400'
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
                                    <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-3 leading-relaxed">
                                        {pub.description}
                                    </p>
                                )}

                                {/* Monochrome Editorial Action Pills */}
                                <div className="flex flex-wrap items-center gap-1.5 mt-auto pt-1">
                                    {pub.url && (
                                        <a
                                            href={pub.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="cma-pill"
                                        >
                                            <span>Paper</span>
                                            <ArrowUpRightIcon className="w-3 h-3" />
                                        </a>
                                    )}
                                    {pub.website && (
                                        <a
                                            href={pub.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="cma-pill"
                                        >
                                            <span>Project</span>
                                            <ArrowUpRightIcon className="w-3 h-3" />
                                        </a>
                                    )}
                                    {pub.code && (
                                        <a
                                            href={pub.code}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="cma-pill"
                                        >
                                            <span>Code</span>
                                            <ArrowUpRightIcon className="w-3 h-3" />
                                        </a>
                                    )}
                                    {pub.models && (
                                        <a
                                            href={pub.models}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="cma-pill"
                                        >
                                            <span>Models</span>
                                            <ArrowUpRightIcon className="w-3 h-3" />
                                        </a>
                                    )}
                                    {pub.data && (
                                        <a
                                            href={pub.data}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="cma-pill"
                                        >
                                            <span>Dataset</span>
                                            <ArrowUpRightIcon className="w-3 h-3" />
                                        </a>
                                    )}
                                    {pub.media && (
                                        <a
                                            href={pub.media}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="cma-pill"
                                        >
                                            <span>Media</span>
                                            <ArrowUpRightIcon className="w-3 h-3" />
                                        </a>
                                    )}
                                    {pub.abstract && (
                                        <button
                                            onClick={() => setExpandedAbstractId(expandedAbstractId === pub.id ? null : pub.id)}
                                            className={`cma-pill ${expandedAbstractId === pub.id ? 'cma-pill-active' : ''}`}
                                        >
                                            <span>Abstract</span>
                                        </button>
                                    )}
                                    {pub.bibtex && (
                                        <button
                                            onClick={() => setExpandedBibtexId(expandedBibtexId === pub.id ? null : pub.id)}
                                            className={`cma-pill ${expandedBibtexId === pub.id ? 'cma-pill-active' : ''}`}
                                        >
                                            <span>BibTeX</span>
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
                                            <div className="p-4 border border-[var(--hairline)] bg-white/40 dark:bg-white/[0.02]">
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
                                            <div className="relative p-4 border border-[var(--hairline)] bg-white/40 dark:bg-white/[0.02]">
                                                <pre className="text-xs text-neutral-600 dark:text-neutral-300 overflow-x-auto whitespace-pre-wrap font-mono pr-20">
                                                    {pub.bibtex}
                                                </pre>
                                                <button
                                                    onClick={() => handleCopyBibtex(pub.id, pub.bibtex || '')}
                                                    className="absolute top-3 right-3 cma-pill"
                                                    title="Copy BibTeX"
                                                >
                                                    {copiedId === pub.id ? (
                                                        <>
                                                            <CheckIcon className="h-3 w-3 text-emerald-500" />
                                                            <span>Copied</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ClipboardDocumentIcon className="h-3 w-3" />
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
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 cursor-zoom-out"
                        onClick={() => setLightboxImage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.94, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.94, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="relative max-w-[92vw] max-h-[88vh] p-2 bg-white dark:bg-neutral-900 border border-[var(--hairline)] shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="absolute -top-3 -right-3 w-7 h-7 flex items-center justify-center bg-primary text-background font-mono text-xs hover:bg-accent transition-colors"
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
                                className="max-w-full max-h-[82vh] w-auto h-auto object-contain"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.section>
    );
}
