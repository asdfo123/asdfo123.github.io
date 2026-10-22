'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
    EnvelopeIcon,
    AcademicCapIcon,
    HeartIcon,
    MapPinIcon,
    CheckIcon,
    ClipboardDocumentIcon,
    ArrowUpRightIcon,
} from '@heroicons/react/24/outline';
import {
    MapPinIcon as MapPinSolidIcon,
    EnvelopeIcon as EnvelopeSolidIcon,
    HeartIcon as HeartSolidIcon,
} from '@heroicons/react/24/solid';
import { Github, Linkedin } from 'lucide-react';
import { SiteConfig } from '@/lib/config';
import { ProfileWorldScene } from '@/components/ui/WorldModelArt';

const LIKES_API_BASE = 'https://abacus.jasoncameron.dev';
const LIKES_NAMESPACE = 'asdfo123.github.io';
const LIKES_KEY = 'homepage-likes';

// Custom ORCID icon component
const OrcidIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z" />
    </svg>
);

// Custom Xiaohongshu (小红书) icon component
const XiaohongshuIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 1024 1024"
        fill="currentColor"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M512 0C229.2 0 0 229.2 0 512s229.2 512 512 512 512-229.2 512-512S794.8 0 512 0zm255.8 585.6l-42.2 7.2c-5.6 1-11 3-16 5.8l-64.4 36.2c-2.6 1.4-5.4 2.4-8.4 2.8l-52.8 7.2c-3 .4-5.8 1.6-8.2 3.2l-55.6 38.8c-2 1.4-4.2 2.4-6.6 3l-62.4 15.2c-4.8 1.2-9 4-12 7.8l-25.4 32c-1.6 2-3.6 3.6-5.8 4.8l-46.4 24.4c-4.2 2.2-7.6 5.6-9.8 9.8l-5.4 10.4c-2.4 4.6-7 7.6-12.2 8l-14.6 1.2c-6.6.6-12.4-3.6-14.2-10l-4.6-16.4c-1-3.6-3.2-6.6-6.2-8.8l-13.2-9.4c-5.4-3.8-7.6-10.8-5.4-17.2l9.8-28.2c1.2-3.4 1.2-7 .2-10.4l-13.2-42c-1-3.2-1-6.6 0-9.8l8.4-27.8c.8-2.8.8-5.8 0-8.6l-12.8-42.6c-.6-2.2-.8-4.4-.4-6.6l5.4-34.8c.6-3.6-.2-7.4-2.2-10.4L259 432.8c-2.2-3.4-3-7.4-2.2-11.4l3.4-16.8c.8-4.2 3.4-7.8 7-10l18.6-11.2c2.6-1.6 4.8-3.8 6.4-6.4l19.2-32.4c2-3.4 5.2-6 8.8-7.2l77.4-26.8c2.6-.8 4.8-2.4 6.6-4.4l32.2-36.4c1.6-1.8 3.6-3.2 5.8-4.2l50.6-21.8c3-1.2 5.4-3.4 7.2-6.2l15.4-24c2.2-3.4 5.6-5.8 9.4-6.8l33.6-8.6c3.6-.8 6.6-3 8.6-6l14.4-21.4c3.4-5 9.4-7.6 15.4-6.4l19.6 3.6c5.8 1 10.2 5.4 11.2 11.2l3 17.4c.8 4.6 3.8 8.6 8 10.8l36.8 19c3.2 1.6 5.6 4.4 7 7.8l14.4 35.6c1.2 3 3.4 5.4 6 7.2l35.2 23.4c3.2 2.2 5.6 5.4 6.6 9l9.2 33.2c.8 3 2.6 5.8 5 7.8l21 17.4c4.4 3.6 6.4 9.4 5 15l-6 24.6c-1 4-3.6 7.4-7 9.6l-18.6 11.8c-2 1.2-3.6 2.8-4.8 4.8l-20 32.2c-1.6 2.6-4 4.6-6.8 5.8l-38.8 17c-3.2 1.4-5.8 3.8-7.4 6.8l-15.6 29.4c-1 1.8-2.2 3.4-3.8 4.8z" />
    </svg>
);

// Custom WeChat icon component
const WechatIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.269-.03-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z" />
    </svg>
);

interface ProfileProps {
    author: SiteConfig['author'];
    social: SiteConfig['social'];
    features: SiteConfig['features'];
    researchInterests?: string[];
}

export default function Profile({ author, social, features, researchInterests }: ProfileProps) {
    const [hasLiked, setHasLiked] = useState(false);
    const [likeCount, setLikeCount] = useState<number | null>(null);
    const [showThanks, setShowThanks] = useState(false);
    const [activePanel, setActivePanel] = useState<'email' | 'address' | null>(null);
    const [copiedEmail, setCopiedEmail] = useState(false);

    useEffect(() => {
        if (!features.enable_likes) return;

        const userHasLiked = localStorage.getItem('xinye-website-user-liked');
        if (userHasLiked === 'true') {
            setHasLiked(true);
        }

        const controller = new AbortController();
        fetch(`${LIKES_API_BASE}/get/${LIKES_NAMESPACE}/${LIKES_KEY}`, {
            signal: controller.signal,
        })
            .then(res => (res.ok ? res.json() : null))
            .then(data => {
                if (data && typeof data.value === 'number' && data.value >= 0) {
                    setLikeCount(data.value);
                }
            })
            .catch(() => {});

        return () => controller.abort();
    }, [features.enable_likes]);

    const handleLike = () => {
        const newLikedState = !hasLiked;
        setHasLiked(newLikedState);

        if (newLikedState) {
            localStorage.setItem('xinye-website-user-liked', 'true');
            setShowThanks(true);
            setTimeout(() => setShowThanks(false), 2000);

            const alreadyCounted = localStorage.getItem('xinye-website-user-like-counted');
            if (alreadyCounted !== 'true') {
                setLikeCount(prev => (prev !== null ? prev + 1 : 1));
                localStorage.setItem('xinye-website-user-like-counted', 'true');
                fetch(`${LIKES_API_BASE}/hit/${LIKES_NAMESPACE}/${LIKES_KEY}`)
                    .then(res => (res.ok ? res.json() : null))
                    .then(data => {
                        if (data && typeof data.value === 'number') {
                            setLikeCount(data.value);
                        }
                    })
                    .catch(() => {});
            }
        } else {
            localStorage.removeItem('xinye-website-user-liked');
            setShowThanks(false);
        }
    };

    const handleCopyEmail = () => {
        if (!social.email) return;
        navigator.clipboard.writeText(social.email);
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
    };

    const socialLinks = [
        ...(social.email ? [{
            name: 'Email',
            href: `mailto:${social.email}`,
            icon: EnvelopeIcon,
            isEmail: true,
        }] : []),
        ...(social.location || social.location_details ? [{
            name: 'Location',
            href: social.location_url || '#',
            icon: MapPinIcon,
            isLocation: true,
        }] : []),
        ...(social.google_scholar ? [{
            name: 'Google Scholar',
            href: social.google_scholar,
            icon: AcademicCapIcon,
        }] : []),
        ...(social.orcid ? [{
            name: 'ORCID',
            href: social.orcid,
            icon: OrcidIcon,
        }] : []),
        ...(social.github ? [{
            name: 'GitHub',
            href: social.github,
            icon: Github,
        }] : []),
        ...(social.linkedin ? [{
            name: 'LinkedIn',
            href: social.linkedin,
            icon: Linkedin,
        }] : []),
        ...(social.xiaohongshu ? [{
            name: 'Xiaohongshu',
            href: social.xiaohongshu,
            icon: XiaohongshuIcon,
            customIcon: '/soical_logo/xiaohongshu.jpg',
        }] : []),
        ...(social.wechat ? [{
            name: 'WeChat',
            href: social.wechat,
            icon: WechatIcon,
        }] : []),
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-24"
        >
            {/* Architectural Monograph Frame */}
            <div className="relative editorial-card overflow-hidden">
                {/* Corner Registration Marks (+) */}
                <span aria-hidden="true" className="pointer-events-none absolute top-1 left-1.5 z-20 font-mono text-[10px] text-white/35 leading-none">+</span>
                <span aria-hidden="true" className="pointer-events-none absolute bottom-1 right-1.5 z-20 font-mono text-[10px] text-neutral-400/50 leading-none">+</span>

                {/* Real-time 60fps HTML5 Canvas 3D Latent Point-Cloud Scene */}
                <ProfileWorldScene />

                <div className="p-5 sm:p-6">
                    {/* Responsive Identity Block */}
                    <div className="flex flex-row lg:flex-col items-start lg:items-start gap-4 lg:gap-0 mb-5">
                        {/* Portrait with crisp museum matte frame */}
                        <div className="relative z-10 -mt-10 sm:-mt-12 lg:-mt-14 w-24 h-24 sm:w-28 sm:h-28 lg:w-36 lg:h-36 overflow-hidden bg-neutral-100 ring-4 ring-[var(--background)] shadow-md flex-shrink-0 group">
                            <Image
                                src={author.avatar}
                                alt={author.name}
                                width={256}
                                height={256}
                                className="w-full h-full object-cover object-[32%_center] group-hover:scale-105 transition-transform duration-500"
                                priority
                            />
                        </div>

                        {/* Name & Affiliation */}
                        <div className="flex-1 min-w-0 pt-1 sm:pt-1.5 lg:pt-0 lg:mt-4">
                            <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5 mb-1">
                                <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-primary tracking-tight leading-none">
                                    {author.name}
                                </h1>
                                <span className="text-sm font-serif text-neutral-500 dark:text-neutral-400 tracking-widest">
                                    李昕烨
                                </span>
                            </div>

                            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent font-medium mt-1.5">
                                {author.title} · {author.institution}
                            </p>
                        </div>
                    </div>

                    {/* Monochrome Contact Icon Strip */}
                    <div className="flex flex-wrap gap-1.5 pb-5 swiss-rule-b">
                        {socialLinks.map((link) => {
                            const IconComponent = link.icon;
                            if (link.isLocation) {
                                const isSelected = activePanel === 'address';
                                return (
                                    <button
                                        key={link.name}
                                        onClick={() => setActivePanel(isSelected ? null : 'address')}
                                        className={`w-9 h-9 flex items-center justify-center transition-all duration-150 border cursor-pointer ${
                                            isSelected
                                                ? 'bg-primary text-background border-primary'
                                                : 'border-[var(--hairline)] text-neutral-600 dark:text-neutral-300 hover:bg-primary hover:text-background hover:border-primary'
                                        }`}
                                        aria-label={link.name}
                                        title={link.name}
                                    >
                                        {isSelected ? (
                                            <MapPinSolidIcon className="h-4 w-4" />
                                        ) : (
                                            <MapPinIcon className="h-4 w-4" />
                                        )}
                                    </button>
                                );
                            }
                            if (link.isEmail) {
                                const isSelected = activePanel === 'email';
                                return (
                                    <button
                                        key={link.name}
                                        onClick={() => setActivePanel(isSelected ? null : 'email')}
                                        className={`w-9 h-9 flex items-center justify-center transition-all duration-150 border cursor-pointer ${
                                            isSelected
                                                ? 'bg-primary text-background border-primary'
                                                : 'border-[var(--hairline)] text-neutral-600 dark:text-neutral-300 hover:bg-primary hover:text-background hover:border-primary'
                                        }`}
                                        aria-label={link.name}
                                        title={link.name}
                                    >
                                        {isSelected ? (
                                            <EnvelopeSolidIcon className="h-4 w-4" />
                                        ) : (
                                            <EnvelopeIcon className="h-4 w-4" />
                                        )}
                                    </button>
                                );
                            }
                            return (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 flex items-center justify-center border border-[var(--hairline)] text-neutral-600 dark:text-neutral-300 hover:bg-primary hover:text-background hover:border-primary transition-all duration-150"
                                    aria-label={link.name}
                                    title={link.name}
                                >
                                    {link.customIcon ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={link.customIcon}
                                            alt={link.name}
                                            className="h-4 w-4 rounded-xs object-cover grayscale contrast-125 hover:grayscale-0 transition-all"
                                        />
                                    ) : (
                                        <IconComponent className="h-4 w-4" />
                                    )}
                                </a>
                            );
                        })}
                    </div>

                    {/* Expandable Contact Drawer */}
                    <AnimatePresence mode="wait">
                        {activePanel === 'email' && social.email && (
                            <motion.div
                                key="email-panel"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="py-4 swiss-rule-b">
                                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400 mb-1">
                                        Direct Correspondence
                                    </p>
                                    <p className="text-xs font-mono text-primary break-all mb-3">
                                        {social.email}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-1.5">
                                        <button
                                            onClick={handleCopyEmail}
                                            className="cma-pill"
                                        >
                                            {copiedEmail ? (
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
                                        <a
                                            href={`mailto:${social.email}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.location.href = `mailto:${social.email}`;
                                            }}
                                            className="cma-pill cma-pill-active"
                                        >
                                            <EnvelopeIcon className="h-3 w-3" />
                                            <span>Mail App</span>
                                        </a>
                                        <a
                                            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(social.email)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="cma-pill"
                                        >
                                            <span>Gmail ↗</span>
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activePanel === 'address' && (
                            <motion.div
                                key="address-panel"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="py-4 swiss-rule-b">
                                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400 mb-1">
                                        Location
                                    </p>
                                    {social.location_details?.map((line, i) => (
                                        <p key={i} className="text-xs text-primary break-words">
                                            {line}
                                        </p>
                                    ))}
                                    {social.location_url && (
                                        <a
                                            href={social.location_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-2 cma-pill"
                                        >
                                            <span>Maps ↗</span>
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Indexed Research Focus List (De-boxed Swiss Hairlines) */}
                    {researchInterests && researchInterests.length > 0 && (
                        <div className="py-4 swiss-rule-b">
                            <div className="flex items-center justify-between mb-2.5">
                                <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-semibold">
                                    Research Focus
                                </h3>
                                <span className="font-mono text-[10px] text-neutral-400">01—0{researchInterests.length}</span>
                            </div>
                            <div className="divide-y divide-[var(--hairline)]">
                                {researchInterests.map((interest, index) => (
                                    <div
                                        key={index}
                                        className="py-2 first:pt-0.5 last:pb-0.5 flex items-baseline gap-2.5 text-xs text-neutral-700 dark:text-neutral-200 leading-snug"
                                    >
                                        <span className="font-mono text-[10px] text-accent shrink-0">
                                            0{index + 1}
                                        </span>
                                        <span className="font-medium">{interest}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Bottom Action Row: Curriculum Vitae + Appreciation Counter */}
                    <div className="pt-4 flex items-center justify-between gap-2">
                        <Link
                            href="/cv"
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 font-mono text-[11px] uppercase tracking-wider font-medium bg-primary text-background hover:bg-accent hover:text-white transition-colors"
                        >
                            <span>Curriculum Vitae</span>
                            <ArrowUpRightIcon className="w-3.5 h-3.5" />
                        </Link>

                        {features.enable_likes && (
                            <div className="relative">
                                <motion.button
                                    onClick={handleLike}
                                    whileTap={{ scale: 0.96 }}
                                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 font-mono text-[11px] uppercase tracking-wider font-medium transition-all duration-150 border cursor-pointer ${
                                        hasLiked
                                            ? 'border-primary bg-primary/8 text-primary'
                                            : 'border-[var(--hairline)] text-neutral-600 dark:text-neutral-300 hover:border-primary hover:text-primary'
                                    }`}
                                >
                                    {hasLiked ? (
                                        <HeartSolidIcon className="h-3.5 w-3.5 text-accent" />
                                    ) : (
                                        <HeartIcon className="h-3.5 w-3.5" />
                                    )}
                                    <span>{hasLiked ? 'Liked' : 'Like'}</span>
                                    {likeCount !== null && (
                                        <span className="tabular-nums text-accent font-semibold">
                                            [{likeCount}]
                                        </span>
                                    )}
                                </motion.button>

                                <AnimatePresence>
                                    {showThanks && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: -8 }}
                                            exit={{ opacity: 0, y: -14 }}
                                            className="absolute top-0 right-0 transform -translate-y-full bg-primary text-background px-2.5 py-1 font-mono text-[10px] tracking-wider uppercase whitespace-nowrap z-20"
                                        >
                                            Appreciated
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
