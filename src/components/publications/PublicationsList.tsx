'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
    MagnifyingGlassIcon,
    ClipboardDocumentIcon,
    CheckIcon,
    ArrowUpRightIcon,
} from '@heroicons/react/24/outline';
import { Publication } from '@/types/publication';
import { PublicationPageConfig } from '@/types/page';

interface PublicationsListProps {
    config: PublicationPageConfig;
    publications: Publication[];
    embedded?: boolean;
}

export default function PublicationsList({ config, publications, embedded = false }: PublicationsListProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
    const [expandedBibtexId, setExpandedBibtexId] = useState<string | null>(null);
    const [expandedAbstractId, setExpandedAbstractId] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    const years = useMemo(() => {
        const uniqueYears = Array.from(new Set(publications.map(p => p.year)));
        return uniqueYears.sort((a, b) => b - a);
    }, [publications]);

    const filteredPublications = useMemo(() => {
        return publications.filter(pub => {
            const matchesSearch =
                pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pub.authors.some(author => author.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                pub.journal?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pub.conference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pub.venue?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pub.description?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesYear = selectedYear === 'all' || pub.year === selectedYear;
            return matchesSearch && matchesYear;
        });
    }, [publications, searchQuery, selectedYear]);

    const handleCopyBibtex = (id: string, bibtex: string) => {
        navigator.clipboard.writeText(bibtex);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const getAuthorshipBadge = (pub: Publication): string | null => {
        const highlighted = pub.authors.find(a => a.isHighlighted);
        if (!highlighted) return null;
        if (highlighted.isCoAuthor) return 'CO-FIRST AUTHOR';
        if (pub.authors[0]?.isHighlighted) return 'FIRST AUTHOR';
        return null;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
        >
            {/* Header */}
            <div className="pb-5 mb-6 swiss-rule-b">
                <div className="flex items-baseline gap-3 mb-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
                        ARCHIVE // PUBLICATIONS
                    </span>
                </div>
                <h1 className={`${embedded ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-5xl'} font-serif font-semibold text-primary tracking-tight mb-2`}>
                    {config.title}
                </h1>
                {config.description && (
                    <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mb-3">
                        {config.description}
                    </p>
                )}
                <p className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                    Note // <span className="underline underline-offset-2">Underline</span> &amp; * denote equal contribution; † denotes corresponding author.
                </p>
            </div>

            {/* Search and Year Index Bar */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 swiss-rule-b">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => setSelectedYear('all')}
                        className={`cma-pill shrink-0 ${selectedYear === 'all' ? 'cma-pill-active' : ''}`}
                    >
                        All [{publications.length}]
                    </button>
                    {years.map(year => {
                        const count = publications.filter(p => p.year === year).length;
                        return (
                            <button
                                key={year}
                                onClick={() => setSelectedYear(year === selectedYear ? 'all' : year)}
                                className={`cma-pill shrink-0 ${selectedYear === year ? 'cma-pill-active' : ''}`}
                            >
                                {year} [{count}]
                            </button>
                        );
                    })}
                </div>

                <div className="relative w-full sm:w-64">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Filter archive..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 font-mono text-xs border border-[var(--hairline)] bg-transparent focus:outline-none focus:border-primary transition-colors"
                    />
                </div>
            </div>

            {/* Publications Ledger */}
            <div className="divide-y divide-[var(--hairline)] swiss-rule-b">
                {filteredPublications.length === 0 ? (
                    <div className="text-center py-12 font-mono text-xs uppercase tracking-widest text-neutral-400">
                        No matching entries in archive.
                    </div>
                ) : (
                    filteredPublications.map((pub, index) => {
                        const roleBadge = getAuthorshipBadge(pub);
                        return (
                            <div
                                key={pub.id}
                                className="py-6 first:pt-2 flex flex-col md:flex-row items-start gap-6"
                            >
                                {pub.preview && (
                                    <div className="w-full md:w-56 flex-shrink-0">
                                        <div
                                            className="relative p-1 bg-white dark:bg-neutral-900 border border-[var(--hairline)] cursor-zoom-in group/img overflow-hidden"
                                            onClick={() => setLightboxImage(`/papers/${pub.preview}`)}
                                        >
                                            <Image
                                                src={`/papers/${pub.preview}`}
                                                alt={pub.title}
                                                width={340}
                                                height={220}
                                                className="w-full h-auto block group-hover/img:scale-[1.02] transition-transform duration-500"
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="flex-grow min-w-0 flex flex-col">
                                    {/* Index + Venue + Role */}
                                    <div className="flex flex-wrap items-center gap-2 mb-1.5 font-mono text-[10px] uppercase tracking-wider">
                                        <span className="text-accent font-semibold">
                                            [P.{String(index + 1).padStart(2, '0')}]
                                        </span>
                                        {pub.venue && (
                                            <span className="px-2 py-0.5 bg-primary text-background font-semibold">
                                                {pub.venue}
                                            </span>
                                        )}
                                        {roleBadge && (
                                            <span className="px-2 py-0.5 border border-accent/50 text-accent font-medium">
                                                {roleBadge}
                                            </span>
                                        )}
                                        <span className="text-neutral-400 ml-auto tabular-nums">
                                            {pub.year}
                                        </span>
                                    </div>

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

                                    {(pub.journal || pub.conference) && (
                                        <p className="text-xs italic font-serif text-neutral-500 dark:text-neutral-400 mb-2">
                                            {pub.journal || pub.conference}, {pub.year}
                                        </p>
                                    )}

                                    {pub.description && (
                                        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mb-3 leading-relaxed">
                                            {pub.description}
                                        </p>
                                    )}

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
                                        {pub.doi && (
                                            <a
                                                href={`https://doi.org/${pub.doi}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="cma-pill"
                                            >
                                                <span>DOI</span>
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

                                    <AnimatePresence>
                                        {expandedAbstractId === pub.id && pub.abstract ? (
                                            <motion.div
                                                key="abstract"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden mt-4"
                                            >
                                                <div className="p-4 border border-[var(--hairline)] bg-white/40 dark:bg-white/[0.02]">
                                                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                                                        {pub.abstract}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ) : null}
                                        {expandedBibtexId === pub.id && pub.bibtex ? (
                                            <motion.div
                                                key="bibtex"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden mt-4"
                                            >
                                                <div className="relative p-4 border border-[var(--hairline)] bg-white/40 dark:bg-white/[0.02]">
                                                    <pre className="text-xs text-neutral-600 dark:text-neutral-300 overflow-x-auto whitespace-pre-wrap font-mono pr-20">
                                                        {pub.bibtex}
                                                    </pre>
                                                    <button
                                                        onClick={() => handleCopyBibtex(pub.id, pub.bibtex || '')}
                                                        className="absolute top-3 right-3 cma-pill"
                                                        title="Copy to clipboard"
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
                                        ) : null}
                                    </AnimatePresence>
                                </div>
                            </div>
                        );
                    })
                )}
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
                            >
                                ✕
                            </button>
                            <Image
                                src={lightboxImage}
                                alt="Enlarged preview"
                                width={1200}
                                height={800}
                                className="max-w-full max-h-[82vh] w-auto h-auto object-contain"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
