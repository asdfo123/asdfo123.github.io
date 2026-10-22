'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * 1. ProfileWorldScene
 * A genuinely animated, interactive 3D World-Model & Camera Frustum scene rendered with SVG + Framer Motion.
 * - Continuously flowing 3D perspective floor grid (simulating forward world rollout)
 * - Sweeping 3D camera frustum & field-of-view light cone along a smooth trajectory
 * - Levitating isometric 3D voxel cluster & pulsing memory anchor
 * - Interactive mouse-parallax steering on hover
 */
export function ProfileWorldScene() {
    const [pointer, setPointer] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
        const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
        setPointer({ x: nx, y: ny });
    };

    const handleMouseLeave = () => {
        setPointer({ x: 0, y: 0 });
    };

    return (
        <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative h-28 sm:h-32 lg:h-36 w-full bg-[#090e1a] overflow-hidden select-none"
        >
            <svg
                viewBox="0 0 400 150"
                preserveAspectRatio="xMidYMid slice"
                className="w-full h-full block"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id="skyBg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#060913" />
                        <stop offset="60%" stopColor="#0f172a" />
                        <stop offset="100%" stopColor="#1b182c" />
                    </linearGradient>

                    <radialGradient id="horizonGlow" cx="62%" cy="56%" r="58%">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.28" />
                        <stop offset="45%" stopColor="#38bdf8" stopOpacity="0.14" />
                        <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
                    </radialGradient>

                    <linearGradient id="fovCone" x1="0" y1="0" x2="1" y2="0.25">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.42" />
                        <stop offset="55%" stopColor="#f59e0b" stopOpacity="0.16" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                    </linearGradient>

                    <linearGradient id="voxelTop" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#0284c7" stopOpacity="0.9" />
                    </linearGradient>
                    <linearGradient id="voxelLeft" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0369a1" stopOpacity="0.92" />
                        <stop offset="100%" stopColor="#0f172a" stopOpacity="0.96" />
                    </linearGradient>
                    <linearGradient id="voxelRight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#075985" stopOpacity="0.92" />
                        <stop offset="100%" stopColor="#090d16" stopOpacity="0.96" />
                    </linearGradient>

                    <linearGradient id="goldTop" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                    <linearGradient id="goldLeft" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#d97706" />
                        <stop offset="100%" stopColor="#78350f" />
                    </linearGradient>
                    <linearGradient id="goldRight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#b45309" />
                        <stop offset="100%" stopColor="#451a03" />
                    </linearGradient>
                </defs>

                {/* Base Sky & Horizon Glow */}
                <rect width="400" height="150" fill="url(#skyBg)" />
                <rect width="400" height="150" fill="url(#horizonGlow)" />

                {/* Subtle Blueprint Coordinate Grid in Sky */}
                <g stroke="rgba(148,163,184,0.07)" strokeWidth="0.5">
                    <line x1="0" y1="26" x2="400" y2="26" />
                    <line x1="0" y1="52" x2="400" y2="52" />
                    <line x1="80" y1="0" x2="80" y2="80" />
                    <line x1="160" y1="0" x2="160" y2="80" />
                    <line x1="240" y1="0" x2="240" y2="80" />
                    <line x1="320" y1="0" x2="320" y2="80" />
                </g>

                {/* 3D Perspective Floor Grid with Continuous Forward Rollout Animation */}
                <motion.g
                    animate={{ x: pointer.x * -10, y: pointer.y * -4 }}
                    transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                >
                    {/* Horizon line */}
                    <line x1="-30" y1="80" x2="430" y2="80" stroke="rgba(229,184,105,0.42)" strokeWidth="0.9" />

                    {/* Perspective rays from vanishing point (235, 80) */}
                    <g stroke="rgba(56,189,248,0.18)" strokeWidth="0.65">
                        <line x1="235" y1="80" x2="-50" y2="155" />
                        <line x1="235" y1="80" x2="20" y2="155" />
                        <line x1="235" y1="80" x2="90" y2="155" />
                        <line x1="235" y1="80" x2="155" y2="155" />
                        <line x1="235" y1="80" x2="215" y2="155" />
                        <line x1="235" y1="80" x2="275" y2="155" />
                        <line x1="235" y1="80" x2="340" y2="155" />
                        <line x1="235" y1="80" x2="420" y2="155" />
                    </g>

                    {/* Animated horizontal depth scanlines flowing toward viewer */}
                    {[0, 1, 2, 3, 4].map((idx) => (
                        <motion.line
                            key={idx}
                            x1="-30"
                            x2="430"
                            stroke="rgba(56,189,248,0.22)"
                            strokeWidth="0.65"
                            initial={{ y1: 82 + idx * 13, y2: 82 + idx * 13, opacity: 0.2 }}
                            animate={{
                                y1: [82 + idx * 13, 95 + idx * 13],
                                y2: [82 + idx * 13, 95 + idx * 13],
                                opacity: [0.15, 0.45, 0.15],
                            }}
                            transition={{
                                duration: 2.6,
                                repeat: Infinity,
                                ease: 'linear',
                            }}
                        />
                    ))}
                </motion.g>

                {/* Continuously Sweeping Camera + FOV Cone + Voxel World */}
                <motion.g
                    animate={{
                        x: pointer.x * 12,
                        y: pointer.y * 6,
                    }}
                    transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                >
                    {/* Animated Camera + FOV Cone sweeping across the 3D scene */}
                    <motion.g
                        animate={{
                            x: [0, 14, -6, 0],
                            y: [0, -4, 3, 0],
                        }}
                        transition={{
                            duration: 7,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    >
                        {/* FOV Light Cone */}
                        <polygon points="118,48 278,18 308,108" fill="url(#fovCone)" />
                        <motion.line
                            x1="118"
                            y1="48"
                            x2="278"
                            y2="18"
                            stroke="rgba(56,189,248,0.6)"
                            strokeWidth="0.85"
                            strokeDasharray="3 2"
                            animate={{ strokeDashoffset: [20, 0] }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                        />
                        <motion.line
                            x1="118"
                            y1="48"
                            x2="308"
                            y2="108"
                            stroke="rgba(56,189,248,0.6)"
                            strokeWidth="0.85"
                            strokeDasharray="3 2"
                            animate={{ strokeDashoffset: [20, 0] }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                        />

                        {/* 3D Camera Frustum Wireframe Pyramid */}
                        <g stroke="#38bdf8" strokeWidth="1.1" fill="rgba(15,23,42,0.85)">
                            <polygon points="102,52 118,41 122,56 106,63" fill="rgba(56,189,248,0.24)" />
                            <line x1="92" y1="50" x2="102" y2="52" />
                            <line x1="92" y1="50" x2="118" y2="41" />
                            <line x1="92" y1="50" x2="122" y2="56" />
                            <line x1="92" y1="50" x2="106" y2="63" />
                            <circle cx="92" cy="50" r="2.5" fill="#fbbf24" stroke="none" />
                        </g>
                    </motion.g>

                    {/* Isometric 3D Voxel World Cluster */}
                    <g>
                        {/* Left Voxel */}
                        <motion.g
                            animate={{ y: [0, -2.5, 0] }}
                            transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <g transform="translate(216, 56)">
                                <polygon points="12,0 24,6 12,12 0,6" fill="url(#voxelTop)" />
                                <polygon points="0,6 12,12 12,26 0,20" fill="url(#voxelLeft)" />
                                <polygon points="12,12 24,6 24,20 12,26" fill="url(#voxelRight)" />
                            </g>
                        </motion.g>

                        {/* Center-Left Base Voxel */}
                        <g transform="translate(246, 64)">
                            <polygon points="16,0 32,8 16,16 0,8" fill="url(#voxelTop)" />
                            <polygon points="0,8 16,16 16,34 0,26" fill="url(#voxelLeft)" />
                            <polygon points="16,16 32,8 32,26 16,34" fill="url(#voxelRight)" />
                            <polyline points="0,8 16,16 32,8" fill="none" stroke="rgba(186,230,253,0.55)" strokeWidth="0.6" />
                        </g>

                        {/* Center-Right Base Voxel */}
                        <g transform="translate(268, 73)">
                            <polygon points="14,0 28,7 14,14 0,7" fill="url(#voxelTop)" />
                            <polygon points="0,7 14,14 14,30 0,23" fill="url(#voxelLeft)" />
                            <polygon points="14,14 28,7 28,23 14,30" fill="url(#voxelRight)" />
                        </g>

                        {/* Levitating Gold Core Voxel + Pulsing 3D Bounding Reticle */}
                        <motion.g
                            animate={{ y: [0, -4.5, 0] }}
                            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <g transform="translate(254, 40)">
                                <polygon points="14,0 28,7 14,14 0,7" fill="url(#goldTop)" />
                                <polygon points="0,7 14,14 14,29 0,22" fill="url(#goldLeft)" />
                                <polygon points="14,14 28,7 28,22 14,29" fill="url(#goldRight)" />
                                <polyline points="0,7 14,14 28,7" fill="none" stroke="#fef3c7" strokeWidth="0.75" />
                            </g>

                            {/* Corner Lock Reticle */}
                            <g transform="translate(249, 35)" stroke="#fbbf24" strokeWidth="1.3" fill="none">
                                <path d="M 0 8 V 0 H 8" />
                                <path d="M 30 0 H 38 V 8" />
                                <path d="M 0 30 V 38 H 8" />
                                <path d="M 30 38 H 38 V 30" />
                            </g>
                        </motion.g>

                        {/* Far Right Voxel */}
                        <motion.g
                            animate={{ y: [0, 3, 0] }}
                            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <g transform="translate(314, 48)">
                                <polygon points="11,0 22,5.5 11,11 0,5.5" fill="url(#voxelTop)" />
                                <polygon points="0,5.5 11,11 11,23 0,17.5" fill="url(#voxelLeft)" />
                                <polygon points="11,11 22,5.5 22,17.5 11,23" fill="url(#voxelRight)" />
                            </g>
                        </motion.g>
                    </g>

                    {/* Animated Trajectory Curve with Flowing Dash Signal */}
                    <motion.path
                        d="M 14 96 C 52 84, 78 52, 118 48 C 168 42, 212 66, 268 54 C 312 44, 348 62, 392 52"
                        fill="none"
                        stroke="rgba(251,191,36,0.6)"
                        strokeWidth="1.2"
                        strokeDasharray="5 4"
                        animate={{ strokeDashoffset: [36, 0] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
                    />
                </motion.g>
            </svg>

            {/* Status pill in top right of banner */}
            <div className="absolute top-2.5 right-3 sm:top-3 sm:right-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-amber-300/25 text-[11px] font-medium text-amber-100 shadow-sm z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>PhD Student @ CUHK</span>
            </div>
        </div>
    );
}

/**
 * 2. ResearchBlueprintStrip
 * High-level, general research themes illustrated with clean, continuously animated SVG graphics:
 *   01 · Action Control
 *   02 · World Models
 *   03 · Memory
 * Each card uses a vertical stack (pure SVG canvas on top + concise title + general description below)
 * so text never collides or overlaps at any viewport width.
 */
export function ResearchBlueprintStrip() {
    const [activePillar, setActivePillar] = useState<number>(1);

    return (
        <div className="mt-6 pt-5 border-t border-neutral-200/80 dark:border-neutral-800/90">
            <div className="flex items-center gap-2 mb-3.5">
                <span className="inline-block w-2 h-2 rounded-full bg-accent" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold">
                    World Models · Interactive Overview
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* Theme 01: Action Control */}
                <div
                    onClick={() => setActivePillar(0)}
                    className={`group rounded-2xl p-4 border transition-all duration-200 cursor-pointer flex flex-col ${
                        activePillar === 0
                            ? 'bg-amber-50/45 dark:bg-amber-950/20 border-accent/60 shadow-xs'
                            : 'bg-neutral-50/70 dark:bg-neutral-800/40 border-neutral-200/80 dark:border-neutral-800 hover:border-accent/40'
                    }`}
                >
                    <div className="text-xs font-mono font-bold uppercase tracking-wider text-accent mb-2.5 truncate">
                        01 · Action Control
                    </div>

                    {/* Animated 3D Camera & Trajectory Sphere SVG */}
                    <div className="h-24 w-full rounded-xl bg-white/85 dark:bg-neutral-900/75 border border-neutral-200/60 dark:border-neutral-800 flex items-center justify-center mb-3 overflow-hidden">
                        <svg viewBox="0 0 180 76" className="w-full h-20">
                            {/* Smooth Trajectory Wave */}
                            <motion.path
                                d="M 16 54 C 44 22, 76 62, 112 32 C 134 14, 152 44, 166 26"
                                fill="none"
                                stroke="#38bdf8"
                                strokeWidth="1.4"
                                strokeDasharray="4 3"
                                animate={{ strokeDashoffset: [28, 0] }}
                                transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
                            />

                            {/* 3D Gyroscope Sphere */}
                            <g transform="translate(88, 38)">
                                <circle
                                    cx="0"
                                    cy="0"
                                    r="22"
                                    fill="rgba(56,189,248,0.06)"
                                    stroke="currentColor"
                                    className="text-neutral-300 dark:text-neutral-700"
                                    strokeWidth="1"
                                />
                                <motion.ellipse
                                    cx="0"
                                    cy="0"
                                    rx="22"
                                    ry="8"
                                    fill="none"
                                    stroke="#38bdf8"
                                    strokeWidth="1.2"
                                    animate={{ rotate: [-16, 16, -16] }}
                                    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                                />
                                <motion.ellipse
                                    cx="0"
                                    cy="0"
                                    rx="8"
                                    ry="22"
                                    fill="none"
                                    stroke="rgba(245,158,11,0.55)"
                                    strokeWidth="1.1"
                                    strokeDasharray="2.5 2"
                                    animate={{ rotate: [12, -12, 12] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                                />
                                {/* Sweeping Pose Vector Arrow */}
                                <motion.line
                                    x1="0"
                                    y1="0"
                                    animate={{ x2: [16, -14, 16], y2: [-14, -16, -14] }}
                                    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                                    stroke="#f59e0b"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                                <circle cx="0" cy="0" r="3" fill="#f59e0b" />
                            </g>

                            {/* Keyframe Waypoints */}
                            <circle cx="34" cy="40" r="2.5" fill="#38bdf8" />
                            <circle cx="144" cy="30" r="2.5" fill="#10b981" />
                        </svg>
                    </div>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        Steering world simulation in real time through continuous camera trajectories and discrete action signals.
                    </p>
                </div>

                {/* Theme 02: Causal Rollout */}
                <div
                    onClick={() => setActivePillar(1)}
                    className={`group rounded-2xl p-4 border transition-all duration-200 cursor-pointer flex flex-col ${
                        activePillar === 1
                            ? 'bg-amber-50/45 dark:bg-amber-950/20 border-accent/60 shadow-xs'
                            : 'bg-neutral-50/70 dark:bg-neutral-800/40 border-neutral-200/80 dark:border-neutral-800 hover:border-accent/40'
                    }`}
                >
                    <div className="text-xs font-mono font-bold uppercase tracking-wider text-accent mb-2.5 truncate">
                        02 · Causal Generation
                    </div>

                    {/* Animated Causal Latent Rollout SVG */}
                    <div className="h-24 w-full rounded-xl bg-white/85 dark:bg-neutral-900/75 border border-neutral-200/60 dark:border-neutral-800 flex items-center justify-center mb-3 overflow-hidden">
                        <svg viewBox="0 0 180 76" className="w-full h-20">
                            {/* Animated Causal Attention Arcs */}
                            <motion.path
                                d="M 38 22 Q 74 5 110 22"
                                fill="none"
                                stroke="#f59e0b"
                                strokeWidth="1.3"
                                strokeDasharray="3.5 2.5"
                                animate={{ strokeDashoffset: [24, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            />
                            <motion.path
                                d="M 74 22 Q 110 5 146 22"
                                fill="none"
                                stroke="#38bdf8"
                                strokeWidth="1.3"
                                strokeDasharray="3.5 2.5"
                                animate={{ strokeDashoffset: [24, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            />

                            {/* Isometric Frame 1 */}
                            <g transform="translate(22, 22)">
                                <polygon
                                    points="0,9 26,0 26,34 0,43"
                                    fill="rgba(148,163,184,0.16)"
                                    stroke="#94a3b8"
                                    strokeWidth="1.1"
                                />
                            </g>

                            {/* Isometric Frame 2 */}
                            <g transform="translate(62, 22)">
                                <polygon
                                    points="0,9 26,0 26,34 0,43"
                                    fill="rgba(56,189,248,0.18)"
                                    stroke="#38bdf8"
                                    strokeWidth="1.2"
                                />
                            </g>

                            {/* Isometric Frame 3 (Active Levitating Frame) */}
                            <motion.g
                                animate={{ y: [0, -3.5, 0] }}
                                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <g transform="translate(102, 22)">
                                    <polygon
                                        points="0,9 26,0 26,34 0,43"
                                        fill="rgba(245,158,11,0.22)"
                                        stroke="#f59e0b"
                                        strokeWidth="1.4"
                                    />
                                    <rect x="8" y="14" width="9" height="9" rx="1.5" fill="#fbbf24" opacity="0.85" />
                                </g>
                            </motion.g>

                            {/* Isometric Frame 4 (Future Horizon) */}
                            <g transform="translate(140, 22)" opacity="0.75">
                                <polygon
                                    points="0,9 22,1 22,33 0,41"
                                    fill="rgba(16,185,129,0.14)"
                                    stroke="#10b981"
                                    strokeWidth="1.1"
                                    strokeDasharray="2.5 2"
                                />
                            </g>
                        </svg>
                    </div>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        Autoregressive and few-step diffusion paradigms for low-latency, interactive video world rollouts.
                    </p>
                </div>

                {/* Theme 03: World Memory */}
                <div
                    onClick={() => setActivePillar(2)}
                    className={`group rounded-2xl p-4 border transition-all duration-200 cursor-pointer flex flex-col ${
                        activePillar === 2
                            ? 'bg-amber-50/45 dark:bg-amber-950/20 border-accent/60 shadow-xs'
                            : 'bg-neutral-50/70 dark:bg-neutral-800/40 border-neutral-200/80 dark:border-neutral-800 hover:border-accent/40'
                    }`}
                >
                    <div className="text-xs font-mono font-bold uppercase tracking-wider text-accent mb-2.5 truncate">
                        03 · World Memory
                    </div>

                    {/* Animated Spatial-Temporal Memory Graph SVG */}
                    <div className="h-24 w-full rounded-xl bg-white/85 dark:bg-neutral-900/75 border border-neutral-200/60 dark:border-neutral-800 flex items-center justify-center mb-3 overflow-hidden">
                        <svg viewBox="0 0 180 76" className="w-full h-20">
                            {/* Animated Memory Retrieval Links */}
                            <motion.line
                                x1="42"
                                y1="38"
                                x2="90"
                                y2="20"
                                stroke="#94a3b8"
                                strokeWidth="1.2"
                                strokeDasharray="3 2"
                                animate={{ strokeDashoffset: [15, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            />
                            <motion.line
                                x1="42"
                                y1="38"
                                x2="90"
                                y2="56"
                                stroke="#94a3b8"
                                strokeWidth="1.2"
                                strokeDasharray="3 2"
                                animate={{ strokeDashoffset: [15, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            />
                            <line x1="90" y1="20" x2="90" y2="56" stroke="rgba(148,163,184,0.35)" strokeWidth="1" />
                            <motion.line
                                x1="90"
                                y1="20"
                                x2="138"
                                y2="38"
                                stroke="#f59e0b"
                                strokeWidth="1.4"
                                strokeDasharray="3.5 2"
                                animate={{ strokeDashoffset: [15, 0] }}
                                transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                            />
                            <motion.line
                                x1="90"
                                y1="56"
                                x2="138"
                                y2="38"
                                stroke="#38bdf8"
                                strokeWidth="1.4"
                                strokeDasharray="3.5 2"
                                animate={{ strokeDashoffset: [15, 0] }}
                                transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                            />

                            {/* Left Anchor State */}
                            <g transform="translate(24, 24)">
                                <rect
                                    width="28"
                                    height="28"
                                    rx="6"
                                    fill="rgba(56,189,248,0.14)"
                                    stroke="#38bdf8"
                                    strokeWidth="1.3"
                                />
                                <circle cx="14" cy="14" r="4.5" fill="#38bdf8" />
                            </g>

                            {/* Middle Pulsing Memory Bank Nodes */}
                            <motion.circle
                                cx="90"
                                cy="20"
                                r="7"
                                fill="rgba(245,158,11,0.2)"
                                stroke="#f59e0b"
                                strokeWidth="1.3"
                                animate={{ r: [6.5, 8, 6.5] }}
                                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                            />
                            <circle cx="90" cy="20" r="2.5" fill="#f59e0b" />

                            <motion.circle
                                cx="90"
                                cy="56"
                                r="7"
                                fill="rgba(16,185,129,0.2)"
                                stroke="#10b981"
                                strokeWidth="1.3"
                                animate={{ r: [6.5, 8, 6.5] }}
                                transition={{ duration: 2.2, delay: 0.7, repeat: Infinity, ease: 'easeInOut' }}
                            />
                            <circle cx="90" cy="56" r="2.5" fill="#10b981" />

                            {/* Right Persistent State Node */}
                            <g transform="translate(128, 24)">
                                <rect
                                    width="28"
                                    height="28"
                                    rx="6"
                                    fill="rgba(245,158,11,0.18)"
                                    stroke="#f59e0b"
                                    strokeWidth="1.4"
                                />
                                <polygon points="14,7 21,11 14,15 7,11" fill="#fbbf24" />
                                <polygon points="7,11 14,15 14,22 7,18" fill="#d97706" />
                                <polygon points="14,15 21,11 21,18 14,22" fill="#b45309" />
                            </g>
                        </svg>
                    </div>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        Preserving spatial-temporal state and visual consistency across long-horizon world exploration.
                    </p>
                </div>
            </div>
        </div>
    );
}

/**
 * 3. PageBlueprintDecor
 * Architectural vector geometry & orbital lines rendered in the background of the page.
 */
export function PageBlueprintDecor() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none"
        >
            <svg
                viewBox="0 0 600 600"
                className="
                    absolute -top-24 -right-28 w-[420px] h-[420px]
                    sm:w-[560px] sm:h-[560px]
                    text-slate-900/[0.045] dark:text-amber-200/[0.055]
                "
                fill="none"
            >
                <circle cx="300" cy="300" r="240" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" />
                <circle cx="300" cy="300" r="180" stroke="currentColor" strokeWidth="1" />
                <circle cx="300" cy="300" r="115" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" />

                <ellipse
                    cx="300"
                    cy="300"
                    rx="250"
                    ry="88"
                    transform="rotate(-24 300 300)"
                    stroke="currentColor"
                    strokeWidth="1.2"
                />
                <ellipse
                    cx="300"
                    cy="300"
                    rx="250"
                    ry="88"
                    transform="rotate(36 300 300)"
                    stroke="currentColor"
                    strokeWidth="0.9"
                    strokeDasharray="4 4"
                />

                <g transform="translate(252, 246)" stroke="currentColor" strokeWidth="1.2">
                    <polygon points="48,0 96,24 48,48 0,24" />
                    <polygon points="0,24 48,48 48,102 0,78" />
                    <polygon points="48,48 96,24 96,78 48,102" />
                    <line x1="48" y1="0" x2="48" y2="54" strokeDasharray="3 3" />
                    <line x1="48" y1="54" x2="0" y2="78" strokeDasharray="3 3" />
                    <line x1="48" y1="54" x2="96" y2="78" strokeDasharray="3 3" />
                </g>

                <line x1="40" y1="300" x2="560" y2="300" stroke="currentColor" strokeWidth="0.6" />
                <line x1="300" y1="40" x2="300" y2="560" stroke="currentColor" strokeWidth="0.6" />
            </svg>

            <svg
                viewBox="0 0 500 400"
                className="
                    hidden sm:block absolute -bottom-16 -left-20 w-[440px] h-[340px]
                    text-slate-900/[0.035] dark:text-sky-300/[0.045]
                "
                fill="none"
            >
                <path d="M 0 350 L 250 140 L 500 350" stroke="currentColor" strokeWidth="1" />
                <path d="M 80 350 L 250 140 L 420 350" stroke="currentColor" strokeWidth="0.8" />
                <path d="M 165 350 L 250 140 L 335 350" stroke="currentColor" strokeWidth="0.8" />
                <line x1="40" y1="220" x2="460" y2="220" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 4" />
                <line x1="15" y1="275" x2="485" y2="275" stroke="currentColor" strokeWidth="0.8" />
                <line x1="0" y1="330" x2="500" y2="330" stroke="currentColor" strokeWidth="0.8" />
            </svg>
        </div>
    );
}
