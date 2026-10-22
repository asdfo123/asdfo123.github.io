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

function getEducationMeta(institution: string): { logo?: string; url?: string; cleanName: string; location?: string } {
    const lower = institution.toLowerCase();
    if (lower.includes('chinese university of hong kong')) {
        return {
            cleanName: 'The Chinese University of Hong Kong',
            location: 'Hong Kong SAR, China',
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

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
        >
            <div className="flex items-center gap-2.5 mb-4">
                <span className="w-1 h-6 rounded-full bg-gradient-to-b from-accent to-amber-500/50 inline-block" />
                <h2 className="text-2xl font-serif font-bold text-primary tracking-tight">{title}</h2>
            </div>

            {educationItems ? (
                <div className="grid grid-cols-1 gap-3">
                    {educationItems.map((edu, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.05 * idx }}
                            className="editorial-card flex items-start sm:items-center gap-3.5 sm:gap-4 p-3.5 sm:p-4 rounded-2xl hover:shadow-md hover:border-accent/40 transition-all duration-200"
                        >
                            {edu.logo && (
                                <div className="w-11 h-11 sm:w-12 sm:h-12 flex-shrink-0 rounded-xl overflow-hidden bg-white flex items-center justify-center p-1.5 border border-neutral-200/70 dark:border-neutral-700 shadow-2xs">
                                    <Image
                                        src={edu.logo}
                                        alt={edu.institution}
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-2">
                                    <h3 className="text-sm sm:text-base font-semibold text-primary">
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
                                    <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400 shrink-0 tabular-nums">
                                        {edu.period}
                                    </span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-2 mt-0.5">
                                    <p className="text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                        {edu.degree}
                                    </p>
                                    {edu.location && (
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                            {edu.location}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div
                    className={`editorial-card rounded-2xl p-5 sm:p-6 text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed relative overflow-hidden ${
                        isHeroBio ? 'border-t-2 border-t-accent/60' : ''
                    }`}
                >
                    {isHeroBio && (
                        <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-accent/8 blur-3xl" />
                    )}
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h1: ({ children }) => <h1 className="text-2xl sm:text-3xl font-serif font-bold text-primary mt-6 mb-3">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mt-6 mb-3 border-b border-neutral-200 dark:border-neutral-800 pb-2">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-lg sm:text-xl font-semibold text-primary mt-5 mb-2">{children}</h3>,
                            p: ({ children }) => <p className="mb-3.5 last:mb-0">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc list-outside mb-3.5 last:mb-0 space-y-2 ml-5">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-outside mb-3.5 last:mb-0 space-y-2 ml-5">{children}</ol>,
                            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                            a: ({ href, ...props }) => {
                                const isMailto = href?.startsWith('mailto:');
                                return (
                                    <a
                                        href={href}
                                        {...props}
                                        target={isMailto ? undefined : '_blank'}
                                        rel={isMailto ? undefined : 'noopener noreferrer'}
                                        className="text-accent font-medium underline decoration-accent/40 underline-offset-3 hover:decoration-accent transition-all duration-200"
                                    />
                                );
                            },
                            blockquote: ({ children }) => (
                                <blockquote className="border-l-4 border-accent/50 pl-4 italic my-4 text-neutral-600 dark:text-neutral-400">
                                    {children}
                                </blockquote>
                            ),
                            strong: ({ children }) => <strong className="font-semibold text-primary dark:text-white">{children}</strong>,
                            em: ({ children }) => <em className="italic text-neutral-500 dark:text-neutral-400">{children}</em>,
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
                                            <span className="block text-center text-sm text-neutral-500 dark:text-neutral-400 mt-2">{displayAlt}</span>
                                        )}
                                    </span>
                                );
                            },
                            table: ({ children }) => (
                                <div className="overflow-x-auto my-6">
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
                    {isHeroBio && <ResearchBlueprintStrip />}
                </div>
            )}
        </motion.section>
    );
}
