// app/packages/PackagesPageClient.tsx
'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Check, X, ChevronDown, ChevronUp,
  Store, Leaf, Wheat, Milk, Package, Truck,
  ShoppingCart, BarChart3, CreditCard, Smartphone,
  LayoutDashboard, Settings, Users, Shield, Clock, Star,
} from 'lucide-react';
import { usePackages } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import { formatPrice, cn } from '@/lib/utils';
import { ContactCta } from '@/components/sections/ContactCta';
import type { PackageResponse, CurrencyCode } from '@/types';

// ─── Animation preset ─────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

// ─── Skeleton ──────────────────────────────────────────────────────────────────
function PackageSkeleton() {
  return (
    <div className="pt-5">
      <div className="bg-card border border-default rounded-2xl p-7 animate-pulse space-y-4 h-full">
        <div className="h-3 w-16 rounded skeleton-fill" />
        <div className="h-7 w-2/3 rounded skeleton-fill" />
        <div className="h-4 w-1/3 rounded skeleton-fill" />
        <div className="h-4 w-full rounded skeleton-fill" />
        <div className="h-4 w-4/5 rounded skeleton-fill" />
        <div className="flex-1" />
        <div className="h-11 w-full rounded-xl skeleton-fill" />
      </div>
    </div>
  );
}

// ─── Package Card ─────────────────────────────────────────────────────────────
function PackageCard({ pkg, index, featured }: { pkg: PackageResponse; index: number; featured?: boolean }) {
  const [imgError, setImgError] = useState(false);
  const iconSrc = pkg.iconImage ? getOptimizedUrl(pkg.iconImage) : null;
  const allServices = pkg.services || [];
  const highlights = allServices.slice(0, 5);
  const extraCount = allServices.length - highlights.length;

  return (
    <div className="pt-5 h-full">
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'relative h-full flex flex-col rounded-2xl transition-all duration-200 group',
          featured
            ? [
                'bg-card',
                'border border-emerald-300/70 dark:border-emerald-700/50',
                'shadow-[0_4px_24px_-4px_rgba(16,185,129,0.12),0_1px_4px_-1px_rgba(0,0,0,0.06)]',
                'dark:shadow-[0_4px_32px_-4px_rgba(16,185,129,0.08)]',
                'hover:-translate-y-1 hover:shadow-[0_8px_32px_-4px_rgba(16,185,129,0.18),0_2px_8px_-2px_rgba(0,0,0,0.08)]',
              ].join(' ')
            : [
                'bg-card',
                'border border-default',
                'shadow-sm',
                'hover:-translate-y-1 hover:shadow-md hover:border-strong dark:hover:border-strong',
              ].join(' '),
        )}
        aria-label={`Package: ${pkg.name}`}
      >
        {/* Badge */}
        {featured && (
          <div className="absolute -top-[18px] left-6 z-10" aria-label="Most popular package">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.14em] uppercase text-emerald-700 dark:text-emerald-300 bg-card border border-emerald-300 dark:border-emerald-700 px-3 py-1.5 rounded-full shadow-sm">
              <Star className="w-2.5 h-2.5 fill-current" aria-hidden /> Most popular
            </span>
          </div>
        )}

        {/* Accent line */}
        {featured && (
          <div className="h-[2px] w-full rounded-t-2xl bg-gradient-to-r from-emerald-400/0 via-emerald-400/70 to-emerald-400/0" aria-hidden />
        )}

        {/* Image */}
        <div className={cn(
          'relative overflow-hidden flex-shrink-0',
          featured ? 'rounded-t-[calc(1rem-1px)]' : 'rounded-t-2xl',
        )}>
          {iconSrc && !imgError ? (
            <div className="aspect-[16/7] bg-zinc-100 dark:bg-zinc-800">
              <img
                src={iconSrc}
                alt={pkg.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                onError={() => setImgError(true)}
                loading="lazy"
              />
            </div>
          ) : (
            <div className="aspect-[16/7] bg-zinc-50 dark:bg-zinc-800/80 flex items-center justify-center">
              <Package className="w-9 h-9 text-zinc-300 dark:text-zinc-600" aria-hidden />
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col px-7 pt-6 pb-7">

          {/* Header zone */}
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-muted mb-3">
            BrizerHero Package
          </p>
          <h2 className="text-[20px] font-semibold text-primary leading-snug mb-1">
            {pkg.name}
          </h2>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-[28px] font-light leading-none text-primary">
              {formatPrice(pkg.price, pkg.currencyCode as CurrencyCode)}
            </span>
            <span className="text-[12px] text-muted">one-time</span>
          </div>

          <p className="text-[13px] text-secondary leading-relaxed line-clamp-2 mb-5">
            {pkg.shortDescription}
          </p>

          {/* Divider */}
          <div className="h-px bg-zinc-100 dark:bg-zinc-800 mb-5" aria-hidden />

          {/* Feature list */}
          {highlights.length > 0 && (
            <ul className="space-y-2.5 mb-1" aria-label="Package highlights">
              {highlights.map((s) => (
                <li key={s.id} className="flex items-center gap-2.5 min-w-0">
                  <span className={cn(
                    'flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center',
                    featured
                      ? 'bg-emerald-100 dark:bg-emerald-950/50'
                      : 'bg-zinc-100 dark:bg-zinc-800',
                  )}>
                    <Check className={cn(
                      'w-2.5 h-2.5',
                      featured ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-500 dark:text-zinc-400',
                    )} aria-hidden />
                  </span>
                  <span className="text-[13px] text-secondary truncate leading-none">
                    {s.serviceResponse?.name}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {/* Extra count */}
          <div className="h-6 flex items-center mt-1 mb-0">
            {extraCount > 0 && (
              <span className="text-[12px] text-muted pl-[26px]">
                +{extraCount} more {extraCount === 1 ? 'feature' : 'features'}
              </span>
            )}
          </div>

          <div className="flex-1" aria-hidden />

          {/* CTA */}
          <Link
            href={`/packages/${pkg.slug}`}
            className={cn(
              'mt-5 flex items-center justify-center gap-2 font-semibold text-[14px] py-3.5 rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              featured
                ? 'bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-200'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-500',
            )}
          >
            View this package
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>
      </motion.article>
    </div>
  );
}

// ─── Comparison Table ─────────────────────────────────────────────────────────
function ComparisonTable({ packages }: { packages: PackageResponse[] }) {
  const allServices = useMemo(() => {
    const set = new Set<string>();
    packages.forEach(p => p.services?.forEach(s => {
      if (s.serviceResponse?.name) set.add(s.serviceResponse.name);
    }));
    return Array.from(set).sort();
  }, [packages]);

  if (!allServices.length) return null;

  return (
    <div className="overflow-x-auto rounded-2xl border border-default bg-card">
      <table className="w-full min-w-[540px] text-[13px]" role="table" aria-label="Package comparison">
        <thead>
          <tr className="border-b border-default bg-raised">
            <th className="text-left px-6 py-4 font-semibold text-secondary w-1/2 table-header-cell">Feature</th>
            {packages.map(p => (
              <th key={p.id} className="px-4 py-4 text-center table-header-cell">
                <p className="font-semibold text-primary">{p.name}</p>
                <p className="text-[11px] text-muted font-normal mt-0.5">
                  {formatPrice(p.price, p.currencyCode as CurrencyCode)}
                </p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allServices.map((name, i) => (
            <tr
              key={name}
              className={cn(
                'border-t border-default transition-colors',
                i % 2 !== 0 ? 'table-row-alt' : '',
              )}
            >
              <td className="px-6 py-3.5 text-secondary">{name}</td>
              {packages.map(p => {
                const has = p.services?.some(s => s.serviceResponse?.name === name);
                return (
                  <td key={p.id} className="px-4 py-3.5 text-center">
                    {has ? (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/40" aria-label="Included">
                        <Check className="w-3 h-3 text-emerald-700 dark:text-emerald-400" aria-hidden />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800" aria-label="Not included">
                        <X className="w-3 h-3 text-zinc-400 dark:text-zinc-600" aria-hidden />
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-default bg-raised">
            <td className="px-6 py-4" />
            {packages.map(p => (
              <td key={p.id} className="px-4 py-4 text-center">
                <Link
                  href={`/packages/${p.slug}`}
                  className="inline-flex items-center gap-1 text-[13px] font-medium text-secondary hover:text-primary transition-colors"
                >
                  View <ArrowRight className="w-3 h-3" aria-hidden />
                </Link>
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function PackagesPageClient() {
  const { data: packages, isLoading, error } = usePackages();
  const [sort, setSort] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [showCompare, setShowCompare] = useState(false);

  const sorted = useMemo(() => {
    if (!packages) return [];
    const result = [...packages];
    if (sort === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
    else result.sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
    return result;
  }, [packages, sort]);

  const allServiceCount = useMemo(() => {
    if (!packages) return 0;
    const set = new Set<string>();
    packages.forEach(p => p.services?.forEach(s => { if (s.serviceResponse?.name) set.add(s.serviceResponse.name); }));
    return set.size;
  }, [packages]);

  if (error) {
    return (
      <div className="min-h-[60vh] pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-secondary mb-4">Unable to load packages.</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 text-[14px] font-semibold px-5 py-2.5 rounded-full hover:opacity-90 transition focus-ring"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface text-primary">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 max-w-7xl mx-auto pt-24 pb-20">
        <motion.div {...fadeUp()}>
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted mb-5">
            Software packages
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-primary leading-[1.04] mb-6 max-w-3xl">
            Built for the way<br />
            <span className="text-secondary">grocery stores actually work.</span>
          </h1>
          <p className="text-[18px] text-secondary max-w-xl leading-relaxed mb-10">
            Every package is purpose-built for Indian grocery, organic, bakery, dairy, and produce businesses — not adapted from a generic template.
          </p>
          <div className="flex flex-wrap gap-8">
            {[
              { value: packages?.length ?? '—', suffix: '', label: 'packages' },
              { value: allServiceCount || '—', suffix: '+', label: 'features included' },
              { value: '30', suffix: ' days', label: 'average delivery' },
              { value: '3', suffix: ' months', label: 'free support' },
            ].map(({ value, suffix, label }) => (
              <div key={label}>
                <p className="text-[26px] font-light text-primary">{value}{suffix}</p>
                <p className="text-[12px] text-muted mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── WHO THESE ARE FOR ────────────────────────────────────────────── */}
      {/*
        This band must look premium-dark in BOTH themes.
        bg-inverse + card-inverse + store-type-pill-* tokens handle the switch.
      */}
      <section className="bg-inverse px-6 md:px-10 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.p {...fadeUp()} className="text-[11px] font-bold tracking-[0.2em] uppercase text-inverse-muted mb-10">
            Designed for
          </motion.p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { icon: Store, label: 'Indian Grocery' },
              { icon: Leaf, label: 'Organic Stores' },
              { icon: Wheat, label: 'Bakeries' },
              { icon: Milk, label: 'Dairy Businesses' },
              { icon: Package, label: 'Produce Markets' },
              { icon: Truck, label: 'Distributors' },
            ].map(({ icon: Icon, label }, i) => (
              <motion.div
                key={label}
                {...fadeUp(i * 0.05)}
                className="store-type-pill"
              >
                <Icon className="w-5 h-5 store-type-pill-icon mx-auto mb-2.5" aria-hidden />
                <p className="text-[13px] store-type-pill-label font-medium">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PACKAGES GRID ────────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 max-w-7xl mx-auto py-24">
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <motion.div {...fadeUp()}>
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted mb-2">Choose your package</p>
            <h2 className="text-3xl font-light text-primary">
              {isLoading ? 'Loading packages…' : `${sorted.length} package${sorted.length !== 1 ? 's' : ''} available`}
            </h2>
          </motion.div>
          {!isLoading && sorted.length > 1 && (
            <motion.div {...fadeUp(0.05)}>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="text-[13px] bg-card border border-default rounded-lg px-3 py-2 text-secondary focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50"
                aria-label="Sort packages"
              >
                <option value="default">Recommended</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
              </select>
            </motion.div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[0, 1, 2].map(i => <PackageSkeleton key={i} />)}
            </motion.div>
          ) : sorted.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 text-muted">
              No packages found.
            </motion.div>
          ) : (
            <motion.div key="packages" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
              {sorted.map((pkg, i) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  index={i}
                  featured={pkg.featured || (sorted.length === 3 && i === 1)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compare toggle */}
        {!isLoading && sorted.length > 1 && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setShowCompare(v => !v)}
              className="inline-flex items-center gap-2 text-[13px] font-medium text-muted hover:text-primary transition-colors focus-ring rounded-full px-2 py-1"
              aria-expanded={showCompare}
              aria-controls="comparison-table"
            >
              {showCompare ? 'Hide' : 'Compare'} all packages
              {showCompare ? <ChevronUp className="w-4 h-4" aria-hidden /> : <ChevronDown className="w-4 h-4" aria-hidden />}
            </button>
          </div>
        )}

        <AnimatePresence>
          {showCompare && !isLoading && sorted.length > 1 && (
            <motion.div
              id="comparison-table"
              key="compare"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8 overflow-hidden"
            >
              <ComparisonTable packages={sorted} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── WHAT MAKES US DIFFERENT ──────────────────────────────────────── */}
      <section className="bg-raised px-6 md:px-10 py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp()} className="mb-14">
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted mb-4">Why BrizerHero</p>
            <h2 className="text-4xl md:text-5xl font-light text-primary leading-tight max-w-2xl">
              We've built this for<br />
              <span className="text-secondary">grocery businesses, specifically.</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: ShoppingCart,
                title: 'Online ordering, not just a website',
                body: 'Customers can browse, add to cart, pick a delivery slot, and pay — without calling you.',
              },
              {
                icon: Package,
                title: 'Inventory that talks to orders',
                body: 'When something sells out, it goes offline automatically. When stock arrives, it comes back.',
              },
              {
                icon: Truck,
                title: 'Delivery designed for daily routes',
                body: 'Slot-based scheduling, delivery zone management, and driver apps — not bolted on after the fact.',
              },
              {
                icon: CreditCard,
                title: 'Every payment method covered',
                body: 'UPI, cards, wallets, cash on delivery, credit accounts for loyal customers.',
              },
              {
                icon: Smartphone,
                title: 'Mobile apps for your customers',
                body: 'iOS and Android apps under your store name. Push notifications. Reorder in two taps.',
              },
              {
                icon: BarChart3,
                title: 'Numbers that mean something',
                body: 'Which products move, which customers return, what your peak hours are. All in one place.',
              },
            ].map(({ icon: Icon, title, body }, i) => (
              <motion.div
                key={title}
                {...fadeUp(i * 0.05)}
                className="bg-card border border-default rounded-2xl p-7 hover:border-strong dark:hover:border-strong transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mb-5">
                  <Icon className="w-4.5 h-4.5 text-emerald-700 dark:text-emerald-400" aria-hidden />
                </div>
                <h3 className="text-[15px] font-semibold text-primary mb-2">{title}</h3>
                <p className="text-[13px] text-secondary leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── IMPLEMENTATION JOURNEY ───────────────────────────────────────── */}
      <section className="px-6 md:px-10 max-w-7xl mx-auto py-24">
        <motion.div {...fadeUp()} className="mb-14">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted mb-4">How it works</p>
          <h2 className="text-4xl md:text-5xl font-light text-primary">
            From sign-off to store launch.
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { n: '01', step: 'Discovery', detail: 'We learn your store, your customers, and your daily operations.' },
            { n: '02', step: 'Planning', detail: 'We scope the project, agree on timeline, and you approve before we start.' },
            { n: '03', step: 'Design', detail: 'Your brand applied to every screen. You see it before we build it.' },
            { n: '04', step: 'Development', detail: 'Built and tested against your actual workflows — not a demo scenario.' },
            { n: '05', step: 'Testing', detail: "You and your staff test it. We fix anything that doesn't feel right." },
            { n: '06', step: 'Launch & Support', detail: 'We go live together. Three months of post-launch support, included.' },
          ].map(({ n, step, detail }, i) => (
            <motion.div
              key={n}
              {...fadeUp(i * 0.05)}
              className="bg-card border border-default rounded-2xl p-7"
            >
              {/* Step number: muted in light (zinc-300), muted in dark (zinc-700) */}
              <p className="text-[11px] font-bold text-zinc-300 dark:text-zinc-700 tracking-[0.15em] mb-4">{n}</p>
              <h3 className="text-[17px] font-semibold text-primary mb-2">{step}</h3>
              <p className="text-[13px] text-secondary leading-relaxed">{detail}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 max-w-7xl mx-auto pb-24">
        <motion.div
          {...fadeUp()}
          className="bg-inverse rounded-3xl px-10 md:px-16 py-16 md:py-20 text-center"
          role="complementary"
          aria-label="Call to action"
        >
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-inverse-muted mb-5">Not sure which to pick?</p>
          <h2 className="text-4xl md:text-5xl font-light text-inverse-primary mb-5 leading-tight">
            Talk to us first.<br />
            <span className="text-inverse-secondary">We'll tell you exactly what fits.</span>
          </h2>
          <p className="text-inverse-secondary text-[16px] mb-10 max-w-lg mx-auto leading-relaxed">
            A 30-minute call is all it takes. We'll map your business and recommend the right package — or tell you honestly if none of them are the right fit.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="btn-inverse-primary"
            >
              Book a free call <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            <Link
              href="/contact"
              className="btn-inverse-outline"
            >
              Send us a message
            </Link>
          </div>
        </motion.div>
      </section>

      <ContactCta />
    </div>
  );
}