'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Check,
  ArrowRight,
  Package,
  Clock,
  Shield,
  Globe,
  Store,
} from 'lucide-react';
import { useFeaturedPackages } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import { formatPrice, cn } from '@/lib/utils';
import { PackageCardSkeleton } from '@/components/common/Skeletons';
import { packageMetadataMap } from '@/lib/packageMetadata';
import type { PackageResponse, CurrencyCode } from '@/types';

// ─── Stage accent system ───────────────────────────────────────────────────
// Three colors that tell the story of growth: sage → amber → violet
const STAGE_ACCENTS = {
  1: {
    pill: 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/25',
    glow: 'from-emerald-500/8',
    check: 'text-emerald-400',
    border: 'border-emerald-500/30',
    cta: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    bar: 'bg-emerald-500',
    hoverShadow: 'hover:shadow-emerald-500/10',
    dot: 'bg-emerald-400',
    text: 'text-emerald-400',
  },
  2: {
    pill: 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/25',
    glow: 'from-amber-500/8',
    check: 'text-amber-400',
    border: 'border-amber-500/40',
    cta: 'bg-amber-500 hover:bg-amber-400 text-zinc-950',
    bar: 'bg-amber-500',
    hoverShadow: 'hover:shadow-amber-500/10',
    dot: 'bg-amber-400',
    text: 'text-amber-400',
  },
  3: {
    pill: 'bg-violet-500/15 text-violet-400 ring-1 ring-violet-500/25',
    glow: 'from-violet-500/8',
    check: 'text-violet-400',
    border: 'border-violet-500/30',
    cta: 'bg-violet-600 hover:bg-violet-500 text-white',
    bar: 'bg-violet-500',
    hoverShadow: 'hover:shadow-violet-500/10',
    dot: 'bg-violet-400',
    text: 'text-violet-400',
  },
} as const;

// Stage ordinals — the packages are a real, ordered journey (Start → Grow → Scale),
// so spelling out "Stage One/Two/Three" earns its place instead of decorating one.
const STAGE_ORDINAL: Record<1 | 2 | 3, string> = {
  1: 'One',
  2: 'Two',
  3: 'Three',
};

// ─── Package Card ──────────────────────────────────────────────────────────
function PackageCard({
  pkg,
  index,
  featured,
}: {
  pkg: PackageResponse;
  index: number;
  featured?: boolean;
}) {
  const metadata = packageMetadataMap[pkg.slug] ?? {
    thumbnail: null,
    imageAlt: `${pkg.name} for grocery businesses`,
    displayName: pkg.name,
    stage: 'For Your Business',
    stageWord: 'Start',
    stageNumber: 1 as const,
    bestFor: 'Grocery Stores',
    beforeAfter: 'A digital storefront built around how your store actually runs.',
    outcomes: [],
    stats: {
      products: 'Varies',
      delivery: '2–4 weeks',
      support: '3 months free',
      platforms: 'Web',
    },
  };

  const [imageError, setImageError] = useState(false);
  const isFeatured = featured ?? index === 1;
  const stageKey = metadata.stageNumber as 1 | 2 | 3;
  const accent = STAGE_ACCENTS[stageKey];

  // Resolve thumbnail
  const thumbnailSrc =
    metadata.thumbnail && !imageError
      ? metadata.thumbnail
      : pkg.iconImage
      ? getOptimizedUrl(pkg.iconImage)
      : null;

  // Derive outcomes: prefer metadata, fall back to service names translated to outcome language
  const services = pkg.services ?? [];
  const fallbackOutcomes = services
    .map((s) => s.serviceResponse?.name)
    .filter(Boolean) as string[];
  const outcomes =
    metadata.outcomes.length > 0 ? metadata.outcomes : fallbackOutcomes.slice(0, 6);
  const hasMoreServices = fallbackOutcomes.length > 6 && metadata.outcomes.length === 0;
  const hasCuratedOutcomes = metadata.outcomes.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ delay: index * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: isFeatured ? -4 : -6, transition: { duration: 0.22 } }}
      className={cn(
        'group relative flex flex-col rounded-2xl overflow-hidden',
        'bg-card border transition-all duration-300',
        isFeatured
          ? [accent.border, 'shadow-2xl shadow-black/40 scale-[1.03] md:scale-[1.04] z-10']
          : ['border-default hover:border-[var(--color-border-glow)] shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30', accent.hoverShadow]
      )}
    >
      {/* Stage marker — a thin band of the stage color, present on every card,
          so the eye reads emerald → amber → violet across the row before a word is read. */}
      <div className={cn('h-[3px] w-full flex-shrink-0', accent.bar)} />

      {/* Stage glow — very subtle, only on featured */}
      {isFeatured && (
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-b pointer-events-none',
            accent.glow,
            'to-transparent'
          )}
        />
      )}

      {/* ── Thumbnail / Visual Header ──────────────────────────────────── */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-raised flex-shrink-0">
        {thumbnailSrc ? (
          <img
            src={thumbnailSrc}
            alt={metadata.imageAlt}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          // Elegant placeholder that doesn't look like an error state
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-card)]">
            <Store className="w-12 h-12 text-muted" />
          </div>
        )}
        {/* Bottom fade to card background */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-card)] via-[var(--color-card)]/20 to-transparent pointer-events-none" />
      </div>

      {/* ── Content ────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col px-7 pb-7 pt-1">

        {/* 1. Business stage — highest visual priority */}
        <div className="mb-3 -mt-3 relative z-10">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-widest uppercase',
              accent.pill
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
            Stage {STAGE_ORDINAL[stageKey]} · {metadata.stageWord}
          </span>
        </div>

        {/* 2. Display name */}
        <h3 className="font-display text-[1.6rem] font-bold text-primary leading-tight tracking-tight mb-1">
          {metadata.displayName}
        </h3>

        {/* 3. Who it's for */}
        <p className="text-sm text-muted mb-4">
          {metadata.bestFor}
        </p>

        {/* 3b. Before → after — the emotional shift, in one honest sentence */}
        {metadata.beforeAfter && (
          <p
            className={cn(
              'text-sm text-secondary leading-relaxed italic pl-3 border-l-2 mb-5',
              accent.border
            )}
          >
            {metadata.beforeAfter}
          </p>
        )}

        {/* Divider */}
        <div className="w-full h-px bg-[var(--color-border)] mb-5" />

        {/* 4. Business outcomes */}
        <div className="flex-1 mb-5">
          {metadata.includesPrevious && (
            <p className="text-xs text-muted mb-2.5 flex items-center gap-1.5">
              <Check className="w-3 h-3 text-muted flex-shrink-0" strokeWidth={2.5} />
              Includes everything in {metadata.includesPrevious}
            </p>
          )}
          <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-muted mb-3">
            {metadata.includesPrevious
              ? 'Plus, Your Store Will Be Able To'
              : hasCuratedOutcomes
              ? 'Your Store Will Be Able To'
              : "What's Included"}
          </p>
          <ul className="space-y-2.5">
            {outcomes.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-sm text-secondary leading-snug"
              >
                <Check
                  className={cn('w-4 h-4 flex-shrink-0 mt-[1px]', accent.check)}
                  strokeWidth={2.5}
                />
                <span>{item}</span>
              </li>
            ))}
            {hasMoreServices && (
              <li className="text-xs text-muted pl-[26px]">
                + {fallbackOutcomes.length - 6} more services included
              </li>
            )}
          </ul>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[var(--color-border)] mb-5" />

        {/* 5. Timeline & support stats — before price */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-muted flex-shrink-0" />
            <span className="text-xs text-secondary">{metadata.stats.delivery}</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-muted flex-shrink-0" />
            <span className="text-xs text-secondary">{metadata.stats.support}</span>
          </div>
          <div className="flex items-center gap-2">
            <Package className="w-3.5 h-3.5 text-muted flex-shrink-0" />
            <span className="text-xs text-secondary">{metadata.stats.products}</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-muted flex-shrink-0" />
            <span className="text-xs text-secondary">{metadata.stats.platforms}</span>
          </div>
        </div>

        {/* 6. Price — present but not the lead */}
        <div className="flex items-baseline gap-1.5 mb-5">
          <span className="text-2xl font-bold text-primary tabular-nums">
            {formatPrice(pkg.price, pkg.currencyCode as CurrencyCode)}
          </span>
          <span className="text-xs text-muted">one-time investment</span>
        </div>

        {/* 7. CTA */}
        <Link
          href={`/packages/${pkg.slug}`}
          className={cn(
            'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3',
            'text-sm font-semibold tracking-wide transition-all duration-200 active:scale-[0.98]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-card)]',
            accent.cta
          )}
          aria-label={`View the complete ${metadata.displayName} package — built for ${metadata.bestFor}`}
        >
          View Complete Package
          <ArrowRight className="w-4 h-4 opacity-80" strokeWidth={2} />
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Section Header ────────────────────────────────────────────────────────
function SectionHeader() {
  return (
    <div className="max-w-2xl mx-auto text-center mb-12">
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="inline-block text-[10px] font-bold tracking-[0.18em] uppercase text-muted mb-4"
      >
        Built For Grocery Businesses
      </motion.span>

      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.07 }}
        className="font-display text-3xl md:text-4xl lg:text-[2.6rem] font-bold text-primary leading-tight tracking-tight mb-5"
      >
        Find Your Next{' '}
        <span className="text-secondary font-light italic">Stage of Growth</span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.14 }}
        className="text-secondary text-base leading-relaxed"
      >
        Every grocery business is at a different point in its journey.
        Our solutions are designed around where you are today — and built
        to grow with you as your store expands.
      </motion.p>
    </div>
  );
}

// ─── Journey strip ──────────────────────────────────────────────────────────
// A real, ordered sequence (Start → Grow → Scale) earns a literal label —
// this is the "scan it in two seconds" version of the section.
const STAGE_JOURNEY = [
  { word: 'Start', accent: STAGE_ACCENTS[1] },
  { word: 'Grow', accent: STAGE_ACCENTS[2] },
  { word: 'Scale', accent: STAGE_ACCENTS[3] },
] as const;

function JourneyStrip() {
  return (
    <div
      className="hidden lg:flex items-center justify-center gap-3 mb-10"
      aria-hidden="true"
    >
      {STAGE_JOURNEY.map((s, i) => (
        <React.Fragment key={s.word}>
          <span
            className={cn(
              'flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase',
              s.accent.text
            )}
          >
            <span className={cn('w-1.5 h-1.5 rounded-full', s.accent.dot)} />
            {s.word}
          </span>
          {i < STAGE_JOURNEY.length - 1 && (
            <ArrowRight className="w-3.5 h-3.5 text-muted" strokeWidth={2} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Main Section ──────────────────────────────────────────────────────────
export function PackagesSection() {
  const { data: packages, isLoading } = useFeaturedPackages();

  const displayPackages = packages?.slice(0, 3) ?? [];

  return (
    <section className="py-24 bg-surface" aria-labelledby="packages-heading">
      <div className="section-container">
        <SectionHeader />

        <JourneyStrip />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-center">
          {isLoading
            ? Array(3)
                .fill(0)
                .map((_, i) => <PackageCardSkeleton key={i} />)
            : displayPackages.map((pkg, i) => {
                const isFeatured =
                  pkg.featured || (displayPackages.length === 3 && i === 1);
                return (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    index={i}
                    featured={isFeatured}
                  />
                );
              })}
        </div>

        {/* Footer link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link
            href="/packages"
            className={cn(
              'inline-flex items-center gap-2 px-6 py-3 rounded-xl',
              'text-sm font-medium text-muted hover:text-primary',
              'border border-default hover:border-[var(--color-border-glow)]',
              'bg-transparent hover:bg-[var(--color-card-hover)]',
              'transition-all duration-200'
            )}
          >
            See how each stage compares
            <ArrowRight className="w-4 h-4 opacity-60" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}