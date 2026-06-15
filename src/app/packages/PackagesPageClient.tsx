'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight, Search, ChevronDown, ChevronUp, Briefcase } from 'lucide-react';
import { usePackages } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import { formatPrice, cn } from '@/lib/utils';
import { ContactCta } from '@/components/sections/ContactCta';
import type { PackageResponse, PackageServiceResponse, CurrencyCode } from '@/types';

// Simple skeleton
function PackageCardSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 animate-pulse">
      <div className="skeleton w-12 h-12 rounded-lg mb-4" />
      <div className="skeleton h-5 w-3/4 rounded mb-2" />
      <div className="skeleton h-7 w-1/3 rounded mb-4" />
      <div className="skeleton h-4 w-full rounded mb-6" />
      <div className="space-y-2">
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-5/6 rounded" />
        <div className="skeleton h-4 w-4/6 rounded" />
      </div>
      <div className="mt-6 skeleton h-10 w-full rounded-lg" />
    </div>
  );
}

// Package card – clean and professional
function PackageCard({ pkg, index }: { pkg: PackageResponse; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const services = pkg.services || [];
  const visibleServices = expanded ? services : services.slice(0, 5);
  const hasMore = services.length > 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={cn(
        'rounded-xl border bg-white dark:bg-zinc-900 transition-all duration-200 hover:shadow-md',
        pkg.featured
          ? 'border-brand-200 dark:border-brand-800 shadow-sm'
          : 'border-zinc-200 dark:border-zinc-800'
      )}
    >
      <div className="p-6 flex flex-col h-full">
        {/* Icon */}
        <div className="w-12 h-12 rounded-lg bg-brand-50 dark:bg-brand-950/30 flex items-center justify-center mb-4">
          {pkg.iconImage ? (
            <Image
              src={getOptimizedUrl(pkg.iconImage)}
              alt={pkg.name}
              width={28}
              height={28}
              className="w-7 h-7 object-contain"
            />
          ) : (
            <Briefcase className="w-5 h-5 text-brand-600" />
          )}
        </div>

        {/* Title & Price */}
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="font-display text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            {pkg.name}
          </h3>
          {pkg.featured && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300">
              Popular
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-0.5 mb-3">
          <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {formatPrice(pkg.price, pkg.currencyCode as CurrencyCode)}
          </span>
          <span className="text-xs text-zinc-400">one-time</span>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-5 line-clamp-2">
          {pkg.shortDescription}
        </p>

        {/* Services list */}
        <div className="flex-1 mb-5">
          <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
            Included services
          </div>
          <ul className="space-y-2">
            {visibleServices.map((s: PackageServiceResponse) => (
              <li key={s.id} className="flex items-start gap-2 text-sm">
                <span className="text-brand-500 mt-0.5 flex-shrink-0">•</span>
                <span className="text-zinc-700 dark:text-zinc-300">
                  {s.serviceResponse?.name || 'Service'}
                </span>
              </li>
            ))}
          </ul>
          {hasMore && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-brand-600 dark:text-brand-400 mt-2 flex items-center gap-1 hover:underline"
            >
              {expanded ? (
                <>Show less <ChevronUp className="w-3 h-3" /></>
              ) : (
                <>+ {services.length - 5} more <ChevronDown className="w-3 h-3" /></>
              )}
            </button>
          )}
        </div>

        {/* CTA */}
        <Link
          href={`/packages/${pkg.slug}`}
          className="btn-secondary w-full justify-center text-sm py-2.5"
        >
          View details
        </Link>
      </div>
    </motion.div>
  );
}

// Main component
export function PackagesPageClient() {
  const { data: packages, isLoading, error } = usePackages();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [showCompare, setShowCompare] = useState(false);

  // Filter and sort
  const filtered = useMemo(() => {
    if (!packages) return [];
    let result = [...packages];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.services?.some(s => s.serviceResponse?.name?.toLowerCase().includes(q))
      );
    }
    if (sort === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (sort === 'default') result.sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
    return result;
  }, [packages, search, sort]);

  // Unique service names for comparison table
  const allServices = useMemo(() => {
    if (!packages) return [];
    const set = new Set<string>();
    packages.forEach(p => {
      p.services?.forEach(s => {
        if (s.serviceResponse?.name) set.add(s.serviceResponse.name);
      });
    });
    return Array.from(set);
  }, [packages]);

  if (error) {
    return (
      <div className="min-h-[60vh] pt-32 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">Unable to load packages.</p>
          <button onClick={() => window.location.reload()} className="btn-primary">Try again</button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero – clean and minimal */}
      <section className="pt-28 pb-12 bg-white dark:bg-zinc-950">
        <div className="section-container text-center max-w-2xl mx-auto">
          <h1 className="font-display text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
            Our Packages
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Choose the plan that fits your business. All packages include 3 months of free support.
          </p>
        </div>
      </section>

      {/* Search and sort bar */}
      {!isLoading && packages && packages.length > 0 && (
        <div className="section-container pb-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
            <div className="text-sm text-zinc-500">
              {filtered.length} of {packages.length} packages
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or service..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm"
                />
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm"
              >
                <option value="default">Recommended</option>
                <option value="price-asc">Price: Low to high</option>
                <option value="price-desc">Price: High to low</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Packages grid */}
      <section className="section-padding pt-0">
        <div className="section-container">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(3).fill(0).map((_, i) => <PackageCardSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">No packages match your search.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((pkg, i) => (
                <PackageCard key={pkg.id} pkg={pkg} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Comparison table toggle */}
      {!isLoading && packages && packages.length > 1 && allServices.length > 0 && (
        <div className="section-container pb-4">
          <button
            onClick={() => setShowCompare(!showCompare)}
            className="flex items-center gap-1 text-sm text-brand-600 hover:underline mx-auto"
          >
            {showCompare ? 'Hide comparison' : 'Compare packages'}
            {showCompare ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      )}

      {/* Comparison table */}
      {showCompare && !isLoading && packages && packages.length > 1 && allServices.length > 0 && (
        <section className="section-padding pt-0">
          <div className="section-container">
            <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">Service</th>
                    {packages.map(p => (
                      <th key={p.id} className="px-4 py-3 text-center font-medium">
                        {p.name}<br />
                        <span className="text-xs text-brand-600">{formatPrice(p.price, p.currencyCode as CurrencyCode)}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allServices.map((service, idx) => (
                    <tr key={service} className={cn('border-b border-zinc-100 dark:border-zinc-800', idx % 2 === 0 && 'bg-white dark:bg-zinc-900')}>
                      <td className="px-4 py-2.5">{service}</td>
                      {packages.map(p => {
                        const has = p.services?.some(s => s.serviceResponse?.name === service);
                        return (
                          <td key={p.id} className="px-4 py-2.5 text-center">
                            {has ? (
                              <Check className="w-4 h-4 text-brand-500 mx-auto" />
                            ) : (
                              <X className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-600 mx-auto" />
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

      {/* Bottom CTA (optional – keep ContactCta only) */}
      <ContactCta />
    </>
  );
}