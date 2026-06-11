'use client';


import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight, Zap, Star } from 'lucide-react';
import { usePackages } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import { formatPrice, cn } from '@/lib/utils';
import { PackageCardSkeleton } from '@/components/common/Skeletons';
import { ContactCta } from '@/components/sections/ContactCta';
import type { PackageResponse } from '@/types';

function PackageCard({ pkg, index }: { pkg: PackageResponse; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className={cn(
        'relative rounded-2xl border flex flex-col h-full transition-all duration-300',
        pkg.featured
          ? 'border-brand-500 bg-gradient-to-b from-brand-600 to-brand-700 text-white shadow-glow-md scale-[1.02]'
          : 'card-hover'
      )}
    >
      {pkg.featured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-400 text-amber-900 text-xs font-bold shadow-lg">
            <Star className="w-3 h-3 fill-current" /> Most Popular
          </span>
        </div>
      )}

      <div className="p-7 flex flex-col h-full">
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-4', pkg.featured ? 'bg-white/20' : 'bg-brand-50 dark:bg-brand-950/30')}>
          {pkg.iconImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={getOptimizedUrl(pkg.iconImage)} alt={pkg.name} className="w-6 h-6 object-contain" />
          ) : (
            <Zap className={cn('w-5 h-5', pkg.featured ? 'text-white' : 'text-brand-600 dark:text-brand-400')} />
          )}
        </div>

        <h3 className={cn('font-display text-xl font-bold mb-1', pkg.featured ? 'text-white' : 'text-zinc-900 dark:text-zinc-100')}>
          {pkg.name}
        </h3>

        <div className="flex items-baseline gap-1 mb-2">
          <span className={cn('font-display text-3xl font-bold', pkg.featured ? 'text-white' : 'gradient-text')}>
            {formatPrice(pkg.price, pkg.currencyCode)}
          </span>
        </div>

        <p className={cn('text-sm mb-6 leading-relaxed', pkg.featured ? 'text-white/80' : 'text-zinc-500 dark:text-zinc-400')}>
          {pkg.shortDescription}
        </p>

        {/* Services list */}
        <ul className="space-y-2.5 flex-1 mb-7">
          {pkg.services?.map((s) => (
            <li key={s.id} className="flex items-center gap-2.5">
              <Check className={cn('w-4 h-4 flex-shrink-0', pkg.featured ? 'text-white' : 'text-brand-500')} />
              <span className={cn('text-sm', pkg.featured ? 'text-white/90' : 'text-zinc-600 dark:text-zinc-400')}>
                {s.service?.name}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-2.5">
          <Link
            href={`/packages/${pkg.slug}`}
            className={cn(
              'w-full text-center inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-sm px-5 py-3 transition-all',
              pkg.featured ? 'bg-white text-brand-600 hover:bg-white/90' : 'btn-primary'
            )}
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/contact"
            className={cn(
              'w-full text-center text-sm font-medium transition-colors',
              pkg.featured ? 'text-white/70 hover:text-white' : 'text-zinc-500 hover:text-brand-600 dark:hover:text-brand-400'
            )}
          >
            Or book a consultation →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export function PackagesPageClient() {
  const { data: packages, isLoading } = usePackages();

  // All unique service names across all packages for comparison table
  const allServices = packages
    ? Array.from(new Set(packages.flatMap((p) => p.services?.map((s) => s.service?.name) ?? [])))
    : [];

  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 bg-zinc-50 dark:bg-zinc-950">
        <div className="section-container text-center max-w-2xl mx-auto">
          <p className="eyebrow justify-center">Pricing</p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-zinc-100 mb-5">
            Simple, <span className="gradient-text">Transparent Pricing</span>
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
            No surprise invoices. Pick a package, know what you get, start building. Need something custom? We&apos;ll build a tailored quote.
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="section-padding">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {isLoading
              ? Array(3).fill(0).map((_, i) => <PackageCardSkeleton key={i} />)
              : packages?.sort((a, b) => a.displayOrder - b.displayOrder).map((pkg, i) => (
                  <PackageCard key={pkg.id} pkg={pkg} index={i} />
                ))
            }
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      {!isLoading && packages && packages.length > 1 && allServices.length > 0 && (
        <section className="section-padding bg-zinc-50 dark:bg-zinc-950">
          <div className="section-container">
            <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-8 text-center">
              Compare Packages
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <table className="w-full">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-900">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-500 w-1/3">Feature</th>
                    {packages.map((pkg) => (
                      <th key={pkg.id} className="px-6 py-4 text-center">
                        <div className="font-display font-bold text-zinc-900 dark:text-zinc-100 text-sm">{pkg.name}</div>
                        <div className="text-brand-500 font-bold text-base mt-0.5">{formatPrice(pkg.price, pkg.currencyCode)}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
               <tbody>
  {allServices.map((serviceName, i) => (
    <tr
      key={`${serviceName}-${i}`}
      className={
        i % 2 === 0
          ? 'bg-white dark:bg-zinc-950'
          : 'bg-zinc-50/50 dark:bg-zinc-900/30'
      }
    >
      <td className="px-6 py-3.5 text-sm text-zinc-700 dark:text-zinc-300 font-medium">
        {serviceName}
      </td>

      {packages.map((pkg, pkgIndex) => {
        const hasIt = pkg.services?.some(
          (s) => s.service?.name === serviceName
        );

        return (
          <td
            key={`${pkg.id}-${pkgIndex}`}
            className="px-6 py-3.5 text-center"
          >
            {hasIt ? (
              <Check className="w-5 h-5 text-brand-500 mx-auto" />
            ) : (
              <X className="w-4 h-4 text-zinc-300 dark:text-zinc-600 mx-auto" />
            )}
          </td>
        );
      })}
    </tr>
  ))}
</tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Custom CTA */}
      <section className="py-16">
        <div className="section-container text-center">
          <h2 className="font-display text-2xl font-bold mb-3 text-zinc-900 dark:text-zinc-100">Need something custom?</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">Tell us about your project and we&apos;ll build a tailored proposal within 24 hours.</p>
          <Link href="/contact" className="btn-primary">
            Request Custom Quote <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
