'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Star, Zap } from 'lucide-react';
import { useFeaturedPackages } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import { formatPrice } from '@/lib/utils';
import { SectionHeader } from '@/components/common/SectionHeader';
import { PackageCardSkeleton } from '@/components/common/Skeletons';
import type { PackageResponse } from '@/types';
import { cn } from '@/lib/utils';

function PackageCard({ pkg, index }: { pkg: PackageResponse; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        'relative rounded-2xl border p-6 flex flex-col h-full transition-all duration-300',
        pkg.featured
          ? 'border-brand-500 bg-brand-600 text-white shadow-glow-md scale-[1.02]'
          : 'card-hover'
      )}
    >
      {pkg.featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400 text-amber-900 text-xs font-bold">
            <Star className="w-3 h-3 fill-current" /> Most Popular
          </span>
        </div>
      )}

      {/* Icon */}
      <div className={cn(
        'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
        pkg.featured ? 'bg-white/20' : 'bg-brand-50 dark:bg-brand-950/30'
      )}>
        {pkg.iconImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={getOptimizedUrl(pkg.iconImage)} alt={pkg.name} className="w-6 h-6 object-contain" />
        ) : (
          <Zap className={cn('w-5 h-5', pkg.featured ? 'text-white' : 'text-brand-600 dark:text-brand-400')} />
        )}
      </div>

      <h3 className={cn(
        'font-display text-xl font-bold mb-1',
        pkg.featured ? 'text-white' : 'text-zinc-900 dark:text-zinc-100'
      )}>
        {pkg.name}
      </h3>

      <div className="flex items-baseline gap-1 mb-2">
        <span className={cn('font-display text-3xl font-bold', pkg.featured ? 'text-white' : 'gradient-text')}>
          {formatPrice(pkg.price, pkg.currencyCode)}
        </span>
      </div>

      <p className={cn('text-sm leading-relaxed mb-5', pkg.featured ? 'text-white/80' : 'text-zinc-500 dark:text-zinc-400')}>
        {pkg.shortDescription}
      </p>

      {/* Included services */}
      <ul className="space-y-2 flex-1 mb-6">
        {pkg.services?.slice(0, 5).map((s) => (
          <li key={s.id} className="flex items-center gap-2.5">
            <Check className={cn('w-4 h-4 flex-shrink-0', pkg.featured ? 'text-white' : 'text-brand-500')} />
            <span className={cn('text-sm', pkg.featured ? 'text-white/90' : 'text-zinc-600 dark:text-zinc-400')}>
              {s.service?.name}
            </span>
          </li>
        ))}
      </ul>

      <Link
        href={`/packages/${pkg.slug}`}
        className={cn(
          'w-full text-center inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-sm px-5 py-3 transition-all duration-200',
          pkg.featured
            ? 'bg-white text-brand-600 hover:bg-white/90'
            : 'btn-primary'
        )}
      >
        Get Started <ArrowRight className="w-4 h-4" />
      </Link>
    </motion.div>
  );
}

export function FeaturedPackages() {
  const { data: packages, isLoading } = useFeaturedPackages();

  return (
    <section className="section-padding bg-zinc-50 dark:bg-zinc-950">
      <div className="section-container">
        <SectionHeader
          eyebrow="Pricing"
          title="Transparent Packages"
          subtitle="No hidden fees. Pick the package that fits your project, or reach out for a custom quote."
          centered
        />

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {isLoading
            ? Array(3).fill(0).map((_, i) => <PackageCardSkeleton key={i} />)
            : packages?.slice(0, 3).map((pkg, i) => <PackageCard key={pkg.id} pkg={pkg} index={i} />)
          }
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
