'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  ShoppingCart,
  Truck,
  Package,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  Clock,
} from 'lucide-react';

// ─── Motion constants ─────────────────────────────────────────────────
const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
};

// ─── Copy ────────────────────────────────────────────────────────────
const HERO = {
  eyebrow: 'For Grocery, Bakery & Specialty Food Businesses',
  h1a: 'Your store deserves',
  h1b: 'software built for it.',
  sub: 'We design and build digital operations platforms exclusively for grocery businesses — so every order, every delivery, and every customer is handled the way your store actually works.',
  primaryCta:   { label: 'Book a Strategy Call',  href: '/contact' },
  secondaryCta: { label: 'Explore Solutions',      href: '/packages' },
};

const CREDENTIALS = [
  'Grocery-exclusive focus',
  'Strategy-first approach',
  'Long-term partnership',
  'Custom-built software',
];

// ─── Live operations feed data ────────────────────────────────────────
const LIVE_EVENTS = [
  {
    icon:   ShoppingCart,
    accent: '#22C55E',
    label:  'New order',
    detail: 'Rajesh Kumar · ₹1,240',
    badge:  'New' as const,
  },
  {
    icon:   Truck,
    accent: '#38BDF8',
    label:  'Out for delivery',
    detail: 'Slot 11:00–12:00 · 4 orders',
    badge:  '8 min ago' as const,
  },
  {
    icon:   AlertCircle,
    accent: '#FBBF24',
    label:  'Low stock alert',
    detail: 'Toned Milk 500ml · 3 units left',
    badge:  '14 min ago' as const,
  },
  {
    icon:   Package,
    accent: '#22C55E',
    label:  'Order packed',
    detail: 'Order #1847 · Ready',
    badge:  '22 min ago' as const,
  },
  {
    icon:   BarChart3,
    accent: '#A78BFA',
    label:  "Today's revenue",
    detail: '₹28,540 · 47 orders',
    badge:  'Live' as const,
  },
] as const;

// ─── Operations card ──────────────────────────────────────────────────
function OperationsCard({ reduced }: { reduced: boolean }) {
  return (
    <div
      className="relative w-full"
      style={{ perspective: '900px' }}    >
      {/* Ambient glow — dark mode only */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 rounded-3xl opacity-0 dark:opacity-100"
        style={{
          background:
            'radial-gradient(ellipse at 55% 0%, rgba(34,197,94,0.13) 0%, transparent 65%)',
        }}
      />

      {/* Soft shadow bloom — light mode only */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-3 rounded-3xl opacity-100 dark:opacity-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 110%, rgba(0,0,0,0.07) 0%, transparent 70%)',
          filter: 'blur(16px)',
        }}
      />

      {/* Card shell */}
      <div
          className="ops-card relative rounded-2xl overflow-hidden"
          style={{
          transform: 'rotateX(2deg) rotateY(-3deg)',
          transformStyle: 'preserve-3d',
          /* Light mode surface */
          background: 'linear-gradient(160deg,#17171D 0%,#101014 100%)',
          border: '1px solid rgba(255,255,255,.07)',
          boxShadow:
            '0 0 0 1px rgba(255,255,255,.03),0 24px 64px rgba(0,0,0,.55),0 8px 20px rgba(0,0,0,.40)',
        } as React.CSSProperties}
      >

        <div className="ops-card" style={{ background: 'var(--card-bg)' } as React.CSSProperties}>
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-3.5"
            style={{ borderBottom: '1px solid var(--header-border)' } as React.CSSProperties}
          >
            <div className="flex items-center gap-2.5">
              {/* Traffic lights */}
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/50 dark:bg-red-500/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/50 dark:bg-yellow-500/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400/50 dark:bg-green-500/50" />
              </div>
              <span
                className="text-[11px] font-medium"
                style={{ color: 'var(--title-color)' } as React.CSSProperties}
              >
                Store Operations
              </span>
            </div>
            {/* Live indicator */}
            <div className="flex items-center gap-1.5" aria-label="Live data">
              <motion.span
                animate={reduced ? {} : { opacity: [1, 0.25, 1] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                aria-hidden="true"
              />
              <span
                className="text-[10px] font-semibold tracking-[0.12em] uppercase"
                style={{ color: 'var(--live-color)' } as React.CSSProperties}
              >
                Live
              </span>
            </div>
          </div>

          {/* Event rows */}
          <ul>
            {LIVE_EVENTS.map(({ icon: Icon, accent, label, detail, badge }, i) => (
              <motion.li
                key={label}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: reduced ? 0 : 0.45 + i * 0.09, duration: 0.38, ease: EASE }}
                className="flex items-center gap-3.5 px-5 py-3.5"
                style={{ borderBottom: '1px solid var(--row-divide)' } as React.CSSProperties}
              >
                {/* Icon chip */}
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${accent}1A` }}
                  aria-hidden="true"
                >
                  <Icon className="w-4 h-4" style={{ color: accent }} />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[12px] font-semibold truncate"
                    style={{ color: 'var(--label-color)' } as React.CSSProperties}
                  >
                    {label}
                  </p>
                  <p
                    className="text-[11px] truncate mt-0.5"
                    style={{ color: 'var(--detail-color)' } as React.CSSProperties}
                  >
                    {detail}
                  </p>
                </div>

                {/* Badge */}
                {badge === 'New' ? (
                  <span
                    className="flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      background: 'var(--badge-new-bg)',
                      color: 'var(--badge-new-fg)',
                    } as React.CSSProperties}
                  >
                    New
                  </span>
                ) : (
                  <span
                    className="flex-shrink-0 text-[10px] font-medium"
                    style={{ color: 'var(--time-color)' } as React.CSSProperties}
                  >
                    {badge}
                  </span>
                )}
              </motion.li>
            ))}
          </ul>

          {/* Footer */}
          <div
            className="px-5 py-3 flex items-center gap-2"
            style={{ background: 'var(--footer-bg)' } as React.CSSProperties}
          >
            <Clock
              className="w-3 h-3 flex-shrink-0"
              style={{ color: 'var(--time-color)' } as React.CSSProperties}
              aria-hidden="true"
            />
            <span
              className="text-[10px] font-medium"
              style={{ color: 'var(--time-color)' } as React.CSSProperties}
            >
              Updated in real time · Web, mobile & in-store
            </span>
          </div>
        </div>
      </div>

      {/* Ground reflection — dark mode */}
      <div
        aria-hidden="true"
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 pointer-events-none opacity-0 dark:opacity-100"
        style={{
          background:
            'radial-gradient(ellipse, rgba(34,197,94,0.07) 0%, transparent 70%)',
          filter: 'blur(10px)',
        }}
      />
    </div>
  );
}

// ─── Credential strip ─────────────────────────────────────────────────
function CredentialStrip({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      variants={reduced ? {} : fadeUp}
      className="
        inline-flex flex-wrap items-center gap-x-0 gap-y-2
        rounded-xl px-4 py-2.5
        /* Light */
        bg-black/[0.03] border border-black/[0.06]
        /* Dark */
        dark:bg-white/[0.04] dark:border-white/[0.07]
      "
      role="list"
      aria-label="Why clients choose us"
    >
      {CREDENTIALS.map((item, i) => (
        <div key={item} role="listitem" className="flex items-center">
          <div className="flex items-center gap-1.5 px-2">
            <CheckCircle2
              className="w-3.5 h-3.5 flex-shrink-0 text-emerald-600 dark:text-emerald-400"
              aria-hidden="true"
            />
            <span className="text-[11.5px] font-medium text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
              {item}
            </span>
          </div>
          {i < CREDENTIALS.length - 1 && (
            <span
              aria-hidden="true"
              className="w-px h-3 bg-black/10 dark:bg-white/10 mx-0.5"
            />
          )}
        </div>
      ))}
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────
export function HeroSection() {
const reduced = false;
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden
        /* Light mode: warm white */
        bg-[#FAFAF8]
        /* Dark mode: near-black charcoal */
        dark:bg-[#0A0A0C]
      "
    >
      {/* ── Background layers ─────────────────────────────────────── */}
      <div aria-hidden="true" className="pointer-events-none select-none absolute inset-0">

        {/* LIGHT MODE backgrounds */}
        {/* Warm upper-left glow */}
        <div
          className="absolute -top-40 -left-40 w-[640px] h-[640px] rounded-full opacity-100 dark:opacity-0"
          style={{
            background:
              'radial-gradient(circle, rgba(22,163,74,0.06) 0%, transparent 60%)',
          }}
        />
        {/* Warm lower-right tint */}
        <div
          className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-100 dark:opacity-0"
          style={{
            background:
              'radial-gradient(circle, rgba(251,191,36,0.04) 0%, transparent 60%)',
          }}
        />
        {/* Light mode top rule */}
        <div
          className="absolute top-0 inset-x-0 h-px opacity-100 dark:opacity-0"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.06) 40%, rgba(22,163,74,0.15) 50%, rgba(0,0,0,0.06) 60%, transparent 100%)',
          }}
        />

        {/* DARK MODE backgrounds */}
        {/* Deep emerald upper-left */}
        <div
          className="absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full opacity-0 dark:opacity-100"
          style={{
            background:
              'radial-gradient(circle, rgba(22,163,74,0.08) 0%, transparent 60%)',
          }}
        />
        {/* Violet lower-right depth */}
        <div
          className="absolute top-1/2 -right-48 w-[560px] h-[560px] rounded-full opacity-0 dark:opacity-100"
          style={{
            background:
              'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 60%)',
          }}
        />
        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-0 dark:opacity-[0.022]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '128px',
          }}
        />
        {/* Dark top rule */}
        <div
          className="absolute top-0 inset-x-0 h-px opacity-0 dark:opacity-100"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 30%, rgba(134,239,172,0.14) 50%, rgba(255,255,255,0.05) 70%, transparent 100%)',
          }}
        />
      </div>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="relative z-10 section-container pt-14 pb-16 md:pt-16 md:pb-24 lg:pt-18 lg:pb-20">
        <div className="grid md:grid-cols-[1fr_auto] gap-12 lg:gap-20 items-center">

          {/* ── Left: text column ─────────────────────────────────── */}
          <motion.div
            variants={reduced ? {} : stagger}
            initial={false}
            animate="animate"
            className="max-w-[540px]"
          >
            {/* Eyebrow */}
            <motion.div variants={reduced ? {} : fadeUp} className="mb-6">
              <span
                className="
                  inline-flex items-center gap-2 text-[11px] font-semibold
                  tracking-[0.1em] uppercase rounded-full px-3.5 py-1.5
                  /* Light */
                  bg-emerald-50 border border-emerald-200/70 text-emerald-700
                  /* Dark */
                  dark:bg-emerald-950/40 dark:border-emerald-800/40 dark:text-emerald-400
                "
              >
                <span
                  className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"
                  aria-hidden="true"
                />
                {HERO.eyebrow}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              id="hero-heading"
              variants={reduced ? {} : fadeUp}
              className="
                font-display font-bold leading-[1.06] tracking-[-0.025em] mb-5
                text-zinc-900 dark:text-[#F2F2EE]
              "
              style={{ fontSize: 'clamp(2.4rem, 4.8vw, 3.6rem)' }}
            >
              {HERO.h1a}
              <br />
              {/* Light: dark ink with emerald emphasis. Dark: gradient sweep. */}
              <span
                className="hidden dark:inline"
                style={{
                  background:
                    'linear-gradient(130deg, #86EFAC 0%, #F2F2EE 45%, #86EFAC 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {HERO.h1b}
              </span>
              <span className="inline dark:hidden text-emerald-700">
                {HERO.h1b}
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={reduced ? {} : fadeUp}
              className="
                text-base md:text-[1.0625rem] leading-[1.72] mb-8
                text-zinc-500 dark:text-zinc-400
              "
              style={{ maxWidth: '40ch' }}
            >
              {HERO.sub}
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={reduced ? {} : fadeUp}
              className="flex flex-wrap items-center gap-3 mb-8"
            >
              {/* Primary */}
              <Link
                href={HERO.primaryCta.href}
                className="
                  group inline-flex items-center gap-2.5
                  text-[0.9375rem] font-semibold tracking-[-0.01em]
                  rounded-[10px] px-6 py-3.5
                  text-white
                  transition-all duration-200
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-emerald-500 focus-visible:ring-offset-2
                  focus-visible:ring-offset-[#FAFAF8] dark:focus-visible:ring-offset-[#0A0A0C]
                "
                style={{
                  background: 'linear-gradient(145deg, #16A34A 0%, #15803D 100%)',
                  boxShadow:
                    '0 1px 2px rgba(0,0,0,0.18), 0 0 0 1px rgba(22,163,74,0.22), inset 0 1px 0 rgba(255,255,255,0.12)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow =
                    '0 6px 20px rgba(22,163,74,0.30), 0 0 0 1px rgba(22,163,74,0.35), inset 0 1px 0 rgba(255,255,255,0.14)';
                  el.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow =
                    '0 1px 2px rgba(0,0,0,0.18), 0 0 0 1px rgba(22,163,74,0.22), inset 0 1px 0 rgba(255,255,255,0.12)';
                  el.style.transform = 'translateY(0)';
                }}
              >
                {HERO.primaryCta.label}
                <ArrowRight
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>

              {/* Secondary */}
              <Link
                href={HERO.secondaryCta.href}
                className="
                  group inline-flex items-center gap-2
                  text-[0.9375rem] font-medium tracking-[-0.01em]
                  rounded-[10px] px-5 py-3.5
                  border
                  transition-all duration-150
                  /* Light */
                  bg-white border-black/10 text-zinc-600
                  hover:border-black/16 hover:text-zinc-800 hover:bg-zinc-50
                  /* Dark */
                  dark:bg-white/[0.04] dark:border-white/[0.10] dark:text-white/65
                  dark:hover:bg-white/[0.07] dark:hover:border-white/[0.18] dark:hover:text-white/90
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-zinc-400 focus-visible:ring-offset-2
                  focus-visible:ring-offset-[#FAFAF8] dark:focus-visible:ring-offset-[#0A0A0C]
                "
                style={{ backdropFilter: 'blur(8px)' }}
              >
                {HERO.secondaryCta.label}
                <ArrowRight
                  className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </motion.div>

            {/* Credentials */}
            <CredentialStrip reduced={reduced} />
          </motion.div>

          {/* ── Right: card column ─────────────────────────────────── */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20, scale: 0.97 }}
            animate={reduced ? false : {
              opacity: 1, y: 0, scale: 1,
              transition: { duration: 0.65, delay: 0.28, ease: EASE },
            }}
            className="w-full md:w-[320px] lg:w-[350px] xl:w-[370px]"
          >
            <OperationsCard reduced={reduced} />
          </motion.div>
        </div>
      </div>

      {/* ── Bottom section fade ──────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 h-20 pointer-events-none
          /* Light */
          bg-gradient-to-b from-transparent to-[#FAFAF8]/60
          /* Dark */
          dark:bg-gradient-to-b dark:from-transparent dark:to-[#0A0A0C]/60
        "
      />

      {/* ── Scroll indicator ─────────────────────────────────────────── */}
      {!reduced && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.5 }}
          className="absolute bottom-7 left-1/2 -translate-x-1/2"
          aria-hidden="true"
        >
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut' }}
            className="
              w-5 h-8 rounded-full flex justify-center pt-[5px]
              border border-black/10 dark:border-white/12
            "
          >
            <div className="w-1 h-2 rounded-full bg-emerald-600/50 dark:bg-emerald-400/40" />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}