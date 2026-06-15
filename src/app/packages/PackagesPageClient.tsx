'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight, Zap, Star, Clock, Shield, Globe } from 'lucide-react';
import { usePackages } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import { formatPrice, cn } from '@/lib/utils';
import { PackageCardSkeleton } from '@/components/common/Skeletons';
import { ContactCta } from '@/components/sections/ContactCta';
import type { PackageResponse } from '@/types';

function PackageCard({ pkg, index }: { pkg: PackageResponse; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={cn(
        'relative rounded-2xl flex flex-col h-full transition-all duration-300 group',
        pkg.featured
          ? 'bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-2xl scale-[1.02] border-0'
          : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:shadow-xl hover:-translate-y-1'
      )}
    >
      {pkg.featured && (
        <>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-400 text-amber-900 text-xs font-bold shadow-lg">
              <Star className="w-3 h-3 fill-current" /> Most Popular
            </span>
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent rounded-2xl pointer-events-none" />
        </>
      )}

      <div className="p-7 flex flex-col h-full relative z-10">
        {/* Icon */}
        <div className={cn(
          'w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-105',
          pkg.featured ? 'bg-white/20' : 'bg-brand-50 dark:bg-brand-950/30'
        )}>
          {pkg.iconImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={getOptimizedUrl(pkg.iconImage)} alt={pkg.name} className="w-7 h-7 object-contain" />
          ) : (
            <Zap className={cn('w-6 h-6', pkg.featured ? 'text-white' : 'text-brand-600 dark:text-brand-400')} />
          )}
        </div>

        <h3 className={cn('font-display text-2xl font-bold mb-1', pkg.featured ? 'text-white' : 'text-zinc-900 dark:text-zinc-100')}>
          {pkg.name}
        </h3>

        <div className="flex items-baseline gap-1 mt-1 mb-3">
          <span className={cn('font-display text-4xl font-bold', pkg.featured ? 'text-white' : 'bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent')}>
            {formatPrice(pkg.price, pkg.currencyCode)}
          </span>
          <span className={cn('text-sm', pkg.featured ? 'text-white/70' : 'text-zinc-400')}>one-time</span>
        </div>

        <p className={cn('text-sm mb-6 leading-relaxed', pkg.featured ? 'text-white/80' : 'text-zinc-500 dark:text-zinc-400')}>
          {pkg.shortDescription}
        </p>

        {/* Services list */}
        <ul className="space-y-3 flex-1 mb-8">
          {pkg.services?.slice(0, 5).map((s) => (
            <li key={s.id} className="flex items-start gap-2.5">
              <Check className={cn('w-4 h-4 flex-shrink-0 mt-0.5', pkg.featured ? 'text-white' : 'text-brand-500')} />
              <span className={cn('text-sm', pkg.featured ? 'text-white/90' : 'text-zinc-600 dark:text-zinc-400')}>
                {s.serviceResponse?.name}
              </span>
            </li>
          ))}
          {pkg.services && pkg.services.length > 5 && (
            <li className="text-xs text-zinc-400 pl-6">+ {pkg.services.length - 5} more services</li>
          )}
        </ul>

        <div className="flex flex-col gap-3">
          <Link
            href={`/packages/${pkg.slug}`}
            className={cn(
              'w-full text-center inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-sm px-5 py-3 transition-all duration-200',
              pkg.featured
                ? 'bg-white text-brand-700 hover:bg-white/90 shadow-lg'
                : 'btn-primary'
            )}
          >
            View Details <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/contact"
            className={cn(
              'w-full text-center text-sm font-medium transition-colors',
              pkg.featured ? 'text-white/70 hover:text-white' : 'text-zinc-500 hover:text-brand-600 dark:hover:text-brand-400'
            )}
          >
            Book a Consultation →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export function PackagesPageClient() {
  const { data: packages, isLoading } = usePackages();

  const allServices = packages
    ? Array.from(new Set(packages.flatMap((p) => p.services?.map((s) => s.serviceResponse?.name) ?? [])))
    : [];

  return (
    <>
      {/* Hero Header */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="section-container text-center max-w-3xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="eyebrow justify-center">Pricing</span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-zinc-900 dark:text-zinc-100 mb-5">
              Simple,{' '}
              <span className="bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
                Transparent Pricing
              </span>
            </h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
              No surprise invoices. Pick a package, know exactly what you get, and start building. <br />
              Need something custom? We'll build a tailored quote.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Package Cards */}
      <section className="section-padding pt-0">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {isLoading
              ? Array(3).fill(0).map((_, i) => <PackageCardSkeleton key={i} />)
              : packages?.sort((a, b) => a.displayOrder - b.displayOrder).map((pkg, i) => (
                  <PackageCard key={pkg.id} pkg={pkg} index={i} />
                ))
            }
          </div>
        </div>
      </section>

      {/* Comparison Table (only if multiple packages) */}
      {!isLoading && packages && packages.length > 1 && allServices.length > 0 && (
        <section className="section-padding bg-zinc-50 dark:bg-zinc-950">
          <div className="section-container">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="eyebrow justify-center">Compare</span>
              <h2 className="font-display text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                Find the Perfect Fit
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 mt-2">
                See exactly what's included in each package
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="bg-zinc-100 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-700">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-zinc-600 dark:text-zinc-300 w-1/3">
                      Feature
                    </th>
                    {packages.map((pkg) => (
                      <th key={pkg.id} className="px-6 py-4 text-center">
                        <div className="font-display font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                          {pkg.name}
                        </div>
                        <div className="text-brand-600 dark:text-brand-400 font-bold text-base mt-1">
                          {formatPrice(pkg.price, pkg.currencyCode)}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allServices.map((serviceName, i) => (
                    <tr
                      key={serviceName}
                      className={cn(
                        'border-b border-zinc-100 dark:border-zinc-800/50',
                        i % 2 === 0 ? 'bg-white dark:bg-zinc-900' : 'bg-zinc-50/50 dark:bg-zinc-800/30'
                      )}
                    >
                      <td className="px-6 py-3.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {serviceName}
                      </td>
                      {packages.map((pkg) => {
                        const hasIt = pkg.services?.some((s) => s.serviceResponse?.name === serviceName);
                        return (
                          <td key={pkg.id} className="px-6 py-3.5 text-center">
                            {hasIt ? (
                              <Check className="w-5 h-5 text-brand-500 mx-auto" strokeWidth={2} />
                            ) : (
                              <X className="w-4 h-4 text-zinc-300 dark:text-zinc-600 mx-auto" strokeWidth={2} />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-center text-xs text-zinc-400 mt-6">
              * All packages include 3 months of free support and deployment assistance.
            </p>
          </div>
        </section>
      )}

      {/* Custom Quote CTA */}
      <section className="py-20">
        <div className="section-container">
          <div className="relative rounded-3xl bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-950/20 dark:to-purple-950/20 border border-brand-100 dark:border-brand-800/50 p-10 md:p-14 text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-sm font-semibold mb-5">
                <Shield className="w-4 h-4" /> Need Something Unique?
              </div>
              <h2 className="font-display text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
                Don't see the perfect package?
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto mb-8">
                Tell us about your project and we'll build a custom proposal within 24 hours — completely free.
              </p>
              <Link href="/contact" className="btn-primary px-8 py-4 text-base shadow-lg">
                Request Custom Quote <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ContactCta />
    </>
  );
}