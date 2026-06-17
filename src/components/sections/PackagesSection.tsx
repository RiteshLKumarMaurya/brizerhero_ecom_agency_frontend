'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Check,
  ArrowRight,
  Star,
  Zap,
  Package,
  Clock,
  Shield,
  Globe,
} from 'lucide-react';
import { useFeaturedPackages } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import { formatPrice, cn } from '@/lib/utils';
import { PackageCardSkeleton } from '@/components/common/Skeletons';
import { packageMetadataMap } from '@/lib/packageMetadata';
import type { PackageResponse, CurrencyCode } from '@/types';

// ─── Package Card (same premium design as PackagesPage) ──────────────────
function PackageCard({ pkg, index, featured }: { pkg: PackageResponse; index: number; featured?: boolean }) {
  const metadata = packageMetadataMap[pkg.slug] || {
    thumbnail: null,
    bestFor: 'All Businesses',
    stats: {
      products: 'Varies',
      delivery: '2–4 weeks',
      support: '3 months',
      platforms: 'Web',
    },
  };

  const [imageError, setImageError] = useState(false);
  const services = pkg.services || [];

  const isFeatured = featured || (index === 1);

  // Thumbnail: use metadata.thumbnail or fallback to iconImage
  const thumbnailSrc = metadata.thumbnail && !imageError
    ? metadata.thumbnail
    : pkg.iconImage
    ? getOptimizedUrl(pkg.iconImage)
    : null;

  // Highlights from actual services
  const serviceNames = services.map(s => s.serviceResponse?.name).filter(Boolean) as string[];
  const highlights = serviceNames.slice(0, 6);
  const hasMore = serviceNames.length > 6;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      className={cn(
        'group relative rounded-2xl bg-white dark:bg-zinc-900 border overflow-hidden shadow-sm transition-all duration-300 flex flex-col h-full',
        isFeatured
          ? 'border-brand-400 dark:border-brand-600 shadow-brand-500/20 shadow-xl scale-[1.02] md:scale-[1.05] z-10'
          : 'border-zinc-200 dark:border-zinc-800 hover:shadow-md'
      )}
    >
      {/* Featured glow */}
      {isFeatured && (
        <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-purple-500/10 pointer-events-none" />
      )}

      {/* ─── Thumbnail Banner ─────────────────────────────────────────── */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-brand-600 to-purple-600 flex-shrink-0">
        {thumbnailSrc ? (
          <img
            src={thumbnailSrc}
            alt={pkg.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-white/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {isFeatured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400/90 text-amber-950 text-xs font-bold backdrop-blur-sm">
              <Star className="w-3 h-3 fill-current" /> Best Value
            </span>
          )}
          {pkg.featured && !isFeatured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-500/90 text-white text-xs font-medium backdrop-blur-sm">
              <Zap className="w-3 h-3" /> Popular
            </span>
          )}
        </div>

        {/* "Best for" badge */}
        <div className="absolute bottom-4 left-4 right-4">
          <span className="inline-block px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-xs font-medium">
            Best for: {metadata.bestFor}
          </span>
        </div>
      </div>

      {/* ─── Content ───────────────────────────────────────────────────── */}
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {pkg.name}
          </h3>
        </div>
        <div className="flex items-baseline gap-0.5 mb-3">
          <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {formatPrice(pkg.price, pkg.currencyCode as CurrencyCode)}
          </span>
          <span className="text-xs text-zinc-400">one‑time</span>
        </div>

        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4 line-clamp-2">
          {pkg.shortDescription}
        </p>

        {/* Highlights */}
        <div className="mb-4">
          <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
            Package Highlights
          </div>
          <ul className="space-y-1.5">
            {highlights.slice(0, 6).map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                <Check className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
            {hasMore && (
              <li className="text-xs text-brand-500">+{serviceNames.length - 6} more</li>
            )}
          </ul>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-1 text-xs mb-5">
          <div className="flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-zinc-600 dark:text-zinc-400">{metadata.stats.products} products</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-zinc-600 dark:text-zinc-400">{metadata.stats.delivery}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-zinc-600 dark:text-zinc-400">{metadata.stats.support} support</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-zinc-600 dark:text-zinc-400">{metadata.stats.platforms}</span>
          </div>
        </div>

        {/* CTA */}
        <Link
          href={`/packages/${pkg.slug}`}
          className={cn(
            'btn-primary w-full justify-center text-sm py-2.5 transition-all',
            isFeatured && 'shadow-md hover:shadow-lg'
          )}
        >
          View Details <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Main Section ──────────────────────────────────────────────────────────
export function PackagesSection() {
  const { data: packages, isLoading } = useFeaturedPackages();

  // Show up to 3 packages (if none featured, fallback to first 3)
  const displayPackages = packages?.slice(0, 3) || [];

  return (
    <section className="py-20 bg-zinc-950">
      <div className="section-container">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="text-xs font-semibold tracking-widest text-brand-400 uppercase">Pricing</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mt-2">
            Choose Your Package
          </h2>
          <p className="text-zinc-400 mt-1">From launch to enterprise – we have a solution for every stage.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {isLoading
            ? Array(3).fill(0).map((_, i) => <PackageCardSkeleton key={i} />)
            : displayPackages.map((pkg, i) => {
                // Middle card gets featured boost (if no explicit featured flag)
                const isFeatured = pkg.featured || (displayPackages.length === 3 && i === 1);
                return <PackageCard key={pkg.id} pkg={pkg} index={i} featured={isFeatured} />;
              })}
        </div>

        <div className="mt-10 text-center">
          <Link href="/packages" className="btn-secondary">
            Compare All Packages <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}