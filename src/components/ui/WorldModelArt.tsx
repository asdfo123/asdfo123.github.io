'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * 1. ProfileWorldScene
 * Real-time 60fps HTML5 <canvas> Generative 3D Latent World Manifold & Camera Frustum.
 * Computes 3D perspective projection (Yaw / Pitch / Focal length) of a dynamic wave manifold
 * and tracks 3D anchor nodes with projected bounding reticles.
 * Responds fluidly to cursor / touch movement like a CMA interactive installation.
 */
export function ProfileWorldScene() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const targetAnglesRef = useRef<{ yaw: number; pitch: number }>({ yaw: 0.42, pitch: 0.36 });
    const currentAnglesRef = useRef<{ yaw: number; pitch: number }>({ yaw: 0.42, pitch: 0.36 });
    const isHoveredRef = useRef<boolean>(false);
    const [telemetry, setTelemetry] = useState<{ yaw: string; pitch: string; step: string }>({
        yaw: '+24.1°',
        pitch: '+20.6°',
        step: 'τ=0.00',
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let t = 0;
        let frameCounter = 0;

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const rect = canvas.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        resize();
        window.addEventListener('resize', resize);

        // 3D grid configuration
        const GRID_X = 11;
        const GRID_Z = 9;
        const SPACING = 0.36;

        // Tracked 3D object anchor indices in the lattice
        const ANCHORS = [
            { ix: 3, iz: 3, label: 'OBJ_01' },
            { ix: 7, iz: 5, label: 'OBJ_02' },
        ];

        const render = () => {
            t += 0.018;
            frameCounter++;

            const rect = canvas.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;

            // Autonomous gentle orbital drift when pointer is not actively steering
            if (!isHoveredRef.current) {
                targetAnglesRef.current.yaw = 0.42 + Math.sin(t * 0.45) * 0.28;
                targetAnglesRef.current.pitch = 0.34 + Math.cos(t * 0.35) * 0.08;
            }

            // Smooth damping interpolation
            currentAnglesRef.current.yaw +=
                (targetAnglesRef.current.yaw - currentAnglesRef.current.yaw) * 0.08;
            currentAnglesRef.current.pitch +=
                (targetAnglesRef.current.pitch - currentAnglesRef.current.pitch) * 0.08;

            const yaw = currentAnglesRef.current.yaw;
            const pitch = currentAnglesRef.current.pitch;

            // Update telemetry readout every 8 frames to avoid React re-render overhead
            if (frameCounter % 8 === 0) {
                const yawDeg = ((yaw * 180) / Math.PI).toFixed(1);
                const pitchDeg = ((pitch * 180) / Math.PI).toFixed(1);
                setTelemetry({
                    yaw: `${Number(yawDeg) >= 0 ? '+' : ''}${yawDeg}°`,
                    pitch: `${Number(pitchDeg) >= 0 ? '+' : ''}${pitchDeg}°`,
                    step: `t=${(t % 99).toFixed(1)}s`,
                });
            }

            // Clear obsidian gallery background
            ctx.fillStyle = '#0a0b0e';
            ctx.fillRect(0, 0, width, height);

            // Subtle warm radial glow in the background
            const grad = ctx.createRadialGradient(
                width * 0.62,
                height * 0.48,
                8,
                width * 0.62,
                height * 0.48,
                width * 0.65
            );
            grad.addColorStop(0, 'rgba(223, 177, 107, 0.16)');
            grad.addColorStop(0.55, 'rgba(148, 163, 184, 0.05)');
            grad.addColorStop(1, 'rgba(10, 11, 14, 0)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height);

            const cosY = Math.cos(yaw);
            const sinY = Math.sin(yaw);
            const cosP = Math.cos(pitch);
            const sinP = Math.sin(pitch);

            const fov = 210;
            const camDist = 3.6;
            const centerX = width * 0.56;
            const centerY = height * 0.56;

            const project = (x: number, y: number, z: number) => {
                // Rotate around Y (Yaw)
                const x1 = x * cosY - z * sinY;
                const z1 = z * cosY + x * sinY;
                // Rotate around X (Pitch)
                const y2 = y * cosP - z1 * sinP;
                const z2 = z1 * cosP + y * sinP + camDist;
                const scale = fov / Math.max(0.4, z2);
                return {
                    u: centerX + x1 * scale,
                    v: centerY - y2 * scale,
                    depth: z2,
                    scale,
                };
            };

            // Compute projected manifold points
            const pts: Array<Array<{ u: number; v: number; depth: number; scale: number }>> = [];
            for (let ix = 0; ix < GRID_X; ix++) {
                pts[ix] = [];
                for (let iz = 0; iz < GRID_Z; iz++) {
                    const wx = (ix - (GRID_X - 1) / 2) * SPACING;
                    const wz = (iz - (GRID_Z - 1) / 2) * SPACING;
                    const wy =
                        Math.sin(wx * 1.6 + t * 1.4) * 0.16 +
                        Math.cos(wz * 1.6 - t * 1.1) * 0.14 -
                        0.22;
                    pts[ix][iz] = project(wx, wy, wz);
                }
            }

            // Draw wireframe lattice along X and Z
            ctx.lineWidth = 0.65;
            for (let ix = 0; ix < GRID_X; ix++) {
                for (let iz = 0; iz < GRID_Z; iz++) {
                    const p = pts[ix][iz];
                    const alpha = Math.max(0.06, Math.min(0.32, (4.8 - p.depth) * 0.14));
                    ctx.strokeStyle = `rgba(226, 221, 212, ${alpha})`;

                    if (ix + 1 < GRID_X) {
                        const px = pts[ix + 1][iz];
                        ctx.beginPath();
                        ctx.moveTo(p.u, p.v);
                        ctx.lineTo(px.u, px.v);
                        ctx.stroke();
                    }
                    if (iz + 1 < GRID_Z) {
                        const pz = pts[ix][iz + 1];
                        ctx.beginPath();
                        ctx.moveTo(p.u, p.v);
                        ctx.lineTo(pz.u, pz.v);
                        ctx.stroke();
                    }
                }
            }

            // Draw nodes
            for (let ix = 0; ix < GRID_X; ix++) {
                for (let iz = 0; iz < GRID_Z; iz++) {
                    const p = pts[ix][iz];
                    const r = Math.max(0.8, p.scale * 0.015);
                    ctx.fillStyle = 'rgba(243, 241, 236, 0.45)';
                    ctx.beginPath();
                    ctx.arc(p.u, p.v, r, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // Draw elevated 3D Tracked Object Anchors + Corner Bounding Reticles
            ANCHORS.forEach((anchor, idx) => {
                const wx = (anchor.ix - (GRID_X - 1) / 2) * SPACING;
                const wz = (anchor.iz - (GRID_Z - 1) / 2) * SPACING;
                const wy =
                    Math.sin(wx * 1.6 + t * 1.4) * 0.16 +
                    Math.cos(wz * 1.6 - t * 1.1) * 0.14 +
                    0.18;
                const basePt = pts[anchor.ix][anchor.iz];
                const objPt = project(wx, wy, wz);

                // Vertical tether line from terrain manifold to tracked object
                ctx.strokeStyle = 'rgba(223, 177, 107, 0.55)';
                ctx.lineWidth = 0.85;
                ctx.setLineDash([2, 2]);
                ctx.beginPath();
                ctx.moveTo(basePt.u, basePt.v);
                ctx.lineTo(objPt.u, objPt.v);
                ctx.stroke();
                ctx.setLineDash([]);

                // Glowing anchor core
                ctx.fillStyle = idx === 0 ? '#dfb16b' : '#f3f1ec';
                ctx.beginPath();
                ctx.arc(objPt.u, objPt.v, 2.6, 0, Math.PI * 2);
                ctx.fill();

                // Corner brackets around tracked instance
                const box = 9;
                const tick = 3.5;
                ctx.strokeStyle = idx === 0 ? 'rgba(223, 177, 107, 0.9)' : 'rgba(243, 241, 236, 0.65)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                // Top-left
                ctx.moveTo(objPt.u - box, objPt.v - box + tick);
                ctx.lineTo(objPt.u - box, objPt.v - box);
                ctx.lineTo(objPt.u - box + tick, objPt.v - box);
                // Top-right
                ctx.moveTo(objPt.u + box - tick, objPt.v - box);
                ctx.lineTo(objPt.u + box, objPt.v - box);
                ctx.lineTo(objPt.u + box, objPt.v - box + tick);
                // Bottom-left
                ctx.moveTo(objPt.u - box, objPt.v + box - tick);
                ctx.lineTo(objPt.u - box, objPt.v + box);
                ctx.lineTo(objPt.u - box + tick, objPt.v + box);
                // Bottom-right
                ctx.moveTo(objPt.u + box - tick, objPt.v + box);
                ctx.lineTo(objPt.u + box, objPt.v + box);
                ctx.lineTo(objPt.u + box, objPt.v + box - tick);
                ctx.stroke();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        isHoveredRef.current = true;
        targetAnglesRef.current = {
            yaw: 0.42 + nx * 0.65,
            pitch: 0.34 + ny * 0.28,
        };
    };

    const handlePointerLeave = () => {
        isHoveredRef.current = false;
    };

    return (
        <div
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            className="relative h-32 sm:h-36 lg:h-40 w-full bg-[#0a0b0e] overflow-hidden select-none cursor-crosshair border-b border-[var(--hairline)]"
        >
            <canvas ref={canvasRef} className="w-full h-full block" />

            {/* Top-Left Live Camera Telemetry Readout */}
            <div className="pointer-events-none absolute top-2.5 left-3 flex items-center gap-2 font-mono text-[9px] tracking-widest uppercase text-neutral-400">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#dfb16b]" />
                <span>LATENT.FIELD</span>
                <span className="hidden sm:inline text-neutral-500">
                    {telemetry.yaw} · {telemetry.pitch}
                </span>
            </div>

            {/* Top-Right Status Pill */}
            <div className="pointer-events-none absolute top-2.5 right-3 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-[10px] font-mono tracking-wider uppercase text-neutral-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>PhD Student @ CUHK</span>
            </div>
        </div>
    );
}

/**
 * 2. ResearchBlueprintStrip
 * De-boxed Swiss architectural 3-column schematic for World Models:
 *   01 / ACTION CONTROL
 *   02 / CAUSAL GENERATION
 *   03 / WORLD MEMORY
 * Uses crisp monochrome + warm bronze vector lines and exposed 1px hairlines.
 */
export function ResearchBlueprintStrip() {
    const [activePillar, setActivePillar] = useState<number>(1);

    return (
        <div className="mt-7 pt-6 swiss-rule-t">
            <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-accent font-semibold">
                        FIG. 01 — WORLD SIMULATION & MEMORY ARCHITECTURE
                    </span>
                </div>
                <span className="font-mono text-[10px] tracking-widest uppercase text-neutral-400 hidden sm:inline">
                    INTERACTIVE DIAGRAM
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 border border-[var(--hairline)] divide-y md:divide-y-0 md:divide-x divide-[var(--hairline)] bg-white/35 dark:bg-white/[0.02]">
                {/* Pillar 01: Action Control */}
                <div
                    onClick={() => setActivePillar(0)}
                    className={`p-4 sm:p-5 transition-colors duration-200 cursor-pointer flex flex-col justify-between ${
                        activePillar === 0
                            ? 'bg-neutral-900/[0.03] dark:bg-white/[0.04]'
                            : 'hover:bg-neutral-900/[0.015] dark:hover:bg-white/[0.02]'
                    }`}
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-primary font-semibold">
                            01 / Action Control
                        </span>
                        <span className="font-mono text-[10px] text-accent">c_t, a_t</span>
                    </div>

                    {/* Monochrome + Bronze Gyroscope & Trajectory Vector */}
                    <div className="h-20 w-full flex items-center justify-center my-1">
                        <svg viewBox="0 0 180 72" className="w-full h-18">
                            <motion.path
                                d="M 14 52 C 44 20, 76 60, 112 30 C 134 12, 152 42, 168 24"
                                fill="none"
                                stroke="currentColor"
                                className="text-neutral-400 dark:text-neutral-600"
                                strokeWidth="1.1"
                                strokeDasharray="3 3"
                                animate={{ strokeDashoffset: [24, 0] }}
                                transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
                            />
                            <g transform="translate(90, 36)">
                                <circle
                                    cx="0"
                                    cy="0"
                                    r="21"
                                    fill="none"
                                    stroke="currentColor"
                                    className="text-neutral-300 dark:text-neutral-700"
                                    strokeWidth="0.9"
                                />
                                <motion.ellipse
                                    cx="0"
                                    cy="0"
                                    rx="21"
                                    ry="7.5"
                                    fill="none"
                                    stroke="currentColor"
                                    className="text-primary"
                                    strokeWidth="1.1"
                                    animate={{ rotate: [-15, 15, -15] }}
                                    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                                />
                                <motion.line
                                    x1="0"
                                    y1="0"
                                    animate={{ x2: [15, -13, 15], y2: [-13, -15, -13] }}
                                    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                                    stroke="var(--accent)"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                />
                                <circle cx="0" cy="0" r="2.5" fill="var(--accent)" />
                            </g>
                        </svg>
                    </div>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mt-2">
                        Steering world simulation in real time through continuous camera trajectories and discrete action signals.
                    </p>
                </div>

                {/* Pillar 02: Causal Generation */}
                <div
                    onClick={() => setActivePillar(1)}
                    className={`p-4 sm:p-5 transition-colors duration-200 cursor-pointer flex flex-col justify-between ${
                        activePillar === 1
                            ? 'bg-neutral-900/[0.03] dark:bg-white/[0.04]'
                            : 'hover:bg-neutral-900/[0.015] dark:hover:bg-white/[0.02]'
                    }`}
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-primary font-semibold">
                            02 / Causal Generation
                        </span>
                        <span className="font-mono text-[10px] text-accent">z_t → z_t+1</span>
                    </div>

                    <div className="h-20 w-full flex items-center justify-center my-1">
                        <svg viewBox="0 0 180 72" className="w-full h-18">
                            <motion.path
                                d="M 38 20 Q 74 4 110 20"
                                fill="none"
                                stroke="var(--accent)"
                                strokeWidth="1.2"
                                strokeDasharray="3 2.5"
                                animate={{ strokeDashoffset: [22, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            />
                            <motion.path
                                d="M 74 20 Q 110 4 146 20"
                                fill="none"
                                stroke="currentColor"
                                className="text-neutral-400 dark:text-neutral-500"
                                strokeWidth="1.1"
                                strokeDasharray="3 2.5"
                                animate={{ strokeDashoffset: [22, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            />

                            <g transform="translate(22, 20)">
                                <polygon
                                    points="0,8 25,0 25,33 0,41"
                                    fill="none"
                                    stroke="currentColor"
                                    className="text-neutral-400 dark:text-neutral-600"
                                    strokeWidth="1"
                                />
                            </g>
                            <g transform="translate(62, 20)">
                                <polygon
                                    points="0,8 25,0 25,33 0,41"
                                    fill="none"
                                    stroke="currentColor"
                                    className="text-primary"
                                    strokeWidth="1.1"
                                />
                            </g>
                            <motion.g
                                animate={{ y: [0, -3, 0] }}
                                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <g transform="translate(102, 20)">
                                    <polygon
                                        points="0,8 25,0 25,33 0,41"
                                        fill="rgba(184, 134, 54, 0.14)"
                                        stroke="var(--accent)"
                                        strokeWidth="1.4"
                                    />
                                    <rect x="8" y="14" width="8" height="8" fill="var(--accent)" opacity="0.85" />
                                </g>
                            </motion.g>
                            <g transform="translate(140, 20)" opacity="0.65">
                                <polygon
                                    points="0,8 22,1 22,32 0,39"
                                    fill="none"
                                    stroke="currentColor"
                                    className="text-neutral-400 dark:text-neutral-600"
                                    strokeWidth="1"
                                    strokeDasharray="2 2"
                                />
                            </g>
                        </svg>
                    </div>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mt-2">
                        Autoregressive and few-step diffusion paradigms for low-latency, interactive video world rollouts.
                    </p>
                </div>

                {/* Pillar 03: World Memory */}
                <div
                    onClick={() => setActivePillar(2)}
                    className={`p-4 sm:p-5 transition-colors duration-200 cursor-pointer flex flex-col justify-between ${
                        activePillar === 2
                            ? 'bg-neutral-900/[0.03] dark:bg-white/[0.04]'
                            : 'hover:bg-neutral-900/[0.015] dark:hover:bg-white/[0.02]'
                    }`}
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-primary font-semibold">
                            03 / World Memory
                        </span>
                        <span className="font-mono text-[10px] text-accent">M_0 ⟷ M_t</span>
                    </div>

                    <div className="h-20 w-full flex items-center justify-center my-1">
                        <svg viewBox="0 0 180 72" className="w-full h-18">
                            <motion.line
                                x1="42"
                                y1="36"
                                x2="90"
                                y2="18"
                                stroke="currentColor"
                                className="text-neutral-400 dark:text-neutral-600"
                                strokeWidth="1.1"
                                strokeDasharray="3 2"
                                animate={{ strokeDashoffset: [15, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            />
                            <motion.line
                                x1="42"
                                y1="36"
                                x2="90"
                                y2="54"
                                stroke="currentColor"
                                className="text-neutral-400 dark:text-neutral-600"
                                strokeWidth="1.1"
                                strokeDasharray="3 2"
                                animate={{ strokeDashoffset: [15, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            />
                            <line
                                x1="90"
                                y1="18"
                                x2="90"
                                y2="54"
                                stroke="currentColor"
                                className="text-neutral-300 dark:text-neutral-700"
                                strokeWidth="0.9"
                            />
                            <motion.line
                                x1="90"
                                y1="18"
                                x2="138"
                                y2="36"
                                stroke="var(--accent)"
                                strokeWidth="1.3"
                                strokeDasharray="3 2"
                                animate={{ strokeDashoffset: [15, 0] }}
                                transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                            />
                            <motion.line
                                x1="90"
                                y1="54"
                                x2="138"
                                y2="36"
                                stroke="currentColor"
                                className="text-primary"
                                strokeWidth="1.1"
                                strokeDasharray="3 2"
                                animate={{ strokeDashoffset: [15, 0] }}
                                transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                            />

                            {/* Left Input Anchor */}
                            <g transform="translate(24, 22)">
                                <rect
                                    width="28"
                                    height="28"
                                    rx="2"
                                    fill="none"
                                    stroke="currentColor"
                                    className="text-primary"
                                    strokeWidth="1.2"
                                />
                                <circle cx="14" cy="14" r="3.5" fill="currentColor" className="text-primary" />
                            </g>

                            {/* Middle Memory Nodes */}
                            <motion.circle
                                cx="90"
                                cy="18"
                                r="6"
                                fill="none"
                                stroke="var(--accent)"
                                strokeWidth="1.2"
                                animate={{ r: [5.5, 7.5, 5.5] }}
                                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                            />
                            <circle cx="90" cy="18" r="2" fill="var(--accent)" />

                            <motion.circle
                                cx="90"
                                cy="54"
                                r="6"
                                fill="none"
                                stroke="currentColor"
                                className="text-primary"
                                strokeWidth="1.2"
                                animate={{ r: [5.5, 7.5, 5.5] }}
                                transition={{ duration: 2.2, delay: 0.7, repeat: Infinity, ease: 'easeInOut' }}
                            />
                            <circle cx="90" cy="54" r="2" fill="currentColor" className="text-primary" />

                            {/* Right Persistent Object State */}
                            <g transform="translate(128, 22)">
                                <rect
                                    width="28"
                                    height="28"
                                    rx="2"
                                    fill="rgba(184, 134, 54, 0.12)"
                                    stroke="var(--accent)"
                                    strokeWidth="1.3"
                                />
                                <polygon points="14,7 21,11 14,15 7,11" fill="var(--accent)" />
                                <polygon points="7,11 14,15 14,22 7,18" fill="var(--accent)" opacity="0.75" />
                                <polygon points="14,15 21,11 21,18 14,22" fill="var(--accent)" opacity="0.55" />
                            </g>
                        </svg>
                    </div>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mt-2">
                        Preserving spatial-temporal state and visual consistency across long-horizon world exploration.
                    </p>
                </div>
            </div>
        </div>
    );
}

/**
 * 3. PageBlueprintDecor
 * Subtle architectural registration crosshairs and orbital geometry in the background.
 */
export function PageBlueprintDecor() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none"
        >
            {/* Top-Right Orbital Calibration Drawing */}
            <svg
                viewBox="0 0 600 600"
                className="
                    absolute -top-28 -right-28 w-[420px] h-[420px]
                    sm:w-[580px] sm:h-[580px]
                    text-neutral-900/[0.04] dark:text-neutral-100/[0.045]
                "
                fill="none"
            >
                <circle cx="300" cy="300" r="240" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 6" />
                <circle cx="300" cy="300" r="175" stroke="currentColor" strokeWidth="0.8" />
                <ellipse
                    cx="300"
                    cy="300"
                    rx="250"
                    ry="82"
                    transform="rotate(-26 300 300)"
                    stroke="currentColor"
                    strokeWidth="1"
                />
                <ellipse
                    cx="300"
                    cy="300"
                    rx="250"
                    ry="82"
                    transform="rotate(34 300 300)"
                    stroke="currentColor"
                    strokeWidth="0.8"
                    strokeDasharray="3 4"
                />
                <line x1="40" y1="300" x2="560" y2="300" stroke="currentColor" strokeWidth="0.5" />
                <line x1="300" y1="40" x2="300" y2="560" stroke="currentColor" strokeWidth="0.5" />
            </svg>
        </div>
    );
}

