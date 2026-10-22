'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ResearchBlueprintStrip } from '@/components/ui/WorldModelArt';

interface AboutProps {
    content: string;
    title?: string;
    sectionId?: string;
}

interface ParsedEducationItem {
    period: string;
    institution: string;
    location?: string;
    degree: string;
    logo?: string;
    url?: string;
}

function getSectionIndexLabel(sectionId?: string): string {
    switch (sectionId) {
        case 'about':
            return '01 // BIOGRAPHY';
        case 'education':
            return '07 // ACADEMIC LINEAGE';
        case 'services':
            return '09 // ACADEMIC SERVICE';
        case 'misc':
            return '10 // MISCELLANEA';
        default:
            return '01 // OVERVIEW';
    }
}

function getEducationMeta(institution: string): { logo?: string; url?: string; cleanName: string; location?: string } {
    const lower = institution.toLowerCase();
    if (lower.includes('chinese university of hong kong')) {
        return {
            cleanName: 'The Chinese University of Hong Kong',
            location: 'Hong Kong SAR',
            logo: '/logos/cuhk.png',
            url: 'https://www.cuhk.edu.hk',
        };
    }
    if (lower.includes('harbin institute of technology')) {
        return {
            cleanName: 'Harbin Institute of Technology, Weihai',
            location: 'Weihai, China',
            logo: '/logos/hit.png',
            url: 'https://www.hitwh.edu.cn',
        };
    }
    if (lower.includes('hong kong university of science and technology')) {
        return {
            cleanName: 'The Hong Kong University of Science and Technology (Guangzhou)',
            location: 'Guangzhou, China',
            logo: '/logos/hkustgz.png',
            url: 'https://hkust-gz.edu.cn',
        };
    }
    if (lower.includes('dalian no.24')) {
        return {
            cleanName: 'Dalian No.24 High School',
            location: 'Dalian, China',
            logo: '/logos/dl24.png',
        };
    }
    return { cleanName: institution };
}

function tryParseEducationTimeline(content: string): ParsedEducationItem[] | null {
    const lines = content
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean);
    if (lines.length === 0) return null;

    const parsed: ParsedEducationItem[] = [];
    const regex = /^-\s*\*([^*]+)\*,\s*(.+?)\.\s+(.+?)\.?$/;

    for (const line of lines) {
        const match = line.match(regex);
        if (!match) return null;
        const rawInst = match[2].trim();
        const meta = getEducationMeta(rawInst);
        parsed.push({
            period: match[1].trim(),
            institution: meta.cleanName,
            location: meta.location,
            degree: match[3].trim().replace(/\.$/, ''),
            logo: meta.logo,
            url: meta.url,
        });
    }
    return parsed;
}

export default function About({ content, title = 'About', sectionId }: AboutProps) {
    const educationItems = sectionId === 'education' ? tryParseEducationTimeline(content) : null;
    const isHeroBio = !sectionId || sectionId === 'about';
    const indexLabel = getSectionIndexLabel(sectionId);

    return (
        <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
        >
            {/* Curatorial Section Header */}
            <div className="flex items-baseline justify-between pb-3 mb-5 swiss-rule-b">
                <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
                        {indexLabel}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-primary tracking-tight">
                        {title}
                    </h2>
                </div>
                <span aria-hidden="true" className="font-mono text-xs text-neutral-400">+</span>
            </div>

            {educationItems ? (
                <div className="divide-y divide-[var(--hairline)] swiss-rule-b">
                    {educationItems.map((edu, idx) => (
                        <div
                            key={idx}
                            className="py-4 first:pt-1 flex items-start sm:items-center gap-4 group transition-colors"
                        >
                            {edu.logo && (
                                <div className="w-11 h-11 flex-shrink-0 bg-white flex items-center justify-center p-1.5 border border-[var(--hairline)]">
                                    <Image
                                        src={edu.logo}
                                        alt={edu.institution}
                                        width={44}
                                        height={44}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
                                    <h3 className="text-base font-semibold text-primary">
                                        {edu.url ? (
                                            <a
                                                href={edu.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-accent transition-colors"
                                            >
                                                {edu.institution}
                                            </a>
                                        ) : (
                                            edu.institution
                                        )}
                                    </h3>
                                    <span className="font-mono text-[11px] text-neutral-500 shrink-0 tabular-nums">
                                        {edu.period}
                                    </span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-2 mt-0.5">
                                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
                                        {edu.degree}
                                    </p>
                                    {edu.location && (
                                        <p className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">
                                            {edu.location}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-sm sm:text-[15.5px] text-neutral-700 dark:text-neutral-300 leading-[1.75]">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h1: ({ children }) => <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-primary mt-6 mb-3">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-xl sm:text-2xl font-serif font-semibold text-primary mt-6 mb-3 swiss-rule-b pb-2">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-lg sm:text-xl font-semibold text-primary mt-5 mb-2">{children}</h3>,
                            p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                            ul: ({ children }) => <ul className="list-none space-y-2.5 my-2">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-outside mb-4 space-y-2 ml-5">{children}</ol>,
                            li: ({ children }) => (
                                <li className="relative pl-4 leading-relaxed before:content-['—'] before:absolute before:left-0 before:text-accent before:font-mono">
                                    {children}
                                </li>
                            ),
                            a: ({ href, ...props }) => {
                                const isMailto = href?.startsWith('mailto:');
                                return (
                                    <a
                                        href={href}
                                        {...props}
                                        target={isMailto ? undefined : '_blank'}
                                        rel={isMailto ? undefined : 'noopener noreferrer'}
                                        className="text-primary font-medium underline decoration-accent/60 decoration-1 underline-offset-4 hover:text-accent hover:decoration-accent transition-colors"
                                    />
                                );
                            },
                            blockquote: ({ children }) => (
                                <blockquote className="border-l-2 border-accent pl-4 italic my-4 text-neutral-600 dark:text-neutral-400">
                                    {children}
                                </blockquote>
                            ),
                            strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                            em: ({ children }) => <em className="italic font-serif text-base text-neutral-600 dark:text-neutral-300">{children}</em>,
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                    {isHeroBio && <ResearchBlueprintStrip />}
                </div>
            )}
        </motion.section>
    );
}
