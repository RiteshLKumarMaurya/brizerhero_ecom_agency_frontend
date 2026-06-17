'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code,
  Rocket,
  Check,
  X,
  ArrowRight,
  Search,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Star,
  Zap,
  Clock,
  Users,
  Settings,
  Shield,
  TrendingUp,
  ShoppingCart,
  Package,
  Truck,
  CreditCard,
  BarChart3,
  Smartphone,
  LayoutDashboard,
  Globe,
} from 'lucide-react';
import { usePackages } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import { formatPrice, cn } from '@/lib/utils';
import { ContactCta } from '@/components/sections/ContactCta';
import { packageMetadataMap } from '@/lib/packageMetadata';
import type { PackageResponse, PackageServiceResponse, CurrencyCode } from '@/types';

// ─── Skeleton ──────────────────────────────────────────────────────────────
function PackageCardSkeleton() {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-[16/9] bg-zinc-200 dark:bg-zinc-800" />
      <div className="p-6 space-y-4">
        <div className="skeleton h-6 w-3/4 rounded" />
        <div className="skeleton h-4 w-1/3 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-5/6 rounded" />
        <div className="flex gap-2">
          <div className="skeleton h-6 w-16 rounded-full" />
          <div className="skeleton h-6 w-16 rounded-full" />
        </div>
        <div className="skeleton h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}

// ─── Package Card ──────────────────────────────────────────────────────────
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

  // Use thumbnail from metadata, fallback to iconImage
  const thumbnailSrc = metadata.thumbnail && !imageError
    ? metadata.thumbnail
    : pkg.iconImage
    ? getOptimizedUrl(pkg.iconImage)
    : null;

  // Get service names for highlights
  const serviceNames = services.map(s => s.serviceResponse?.name).filter(Boolean) as string[];
  // Show up to 6 services
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
      {/* Glow effect for featured */}
      {isFeatured && (
        <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-purple-500/10 pointer-events-none" />
      )}

      {/* Thumbnail Banner */}
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

        {/* Best For badge at bottom of thumbnail */}
        <div className="absolute bottom-4 left-4 right-4">
          <span className="inline-block px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-xs font-medium">
            Best for: {metadata.bestFor}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col">
        {/* Title & Price */}
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

        {/* Short description */}
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4 line-clamp-2">
          {pkg.shortDescription}
        </p>

        {/* Highlights – now from actual services */}
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

// ─── Comparison Table (unchanged) ──────────────────────────────────────
function ComparisonTable({ packages, allServices }: { packages: PackageResponse[]; allServices: string[] }) {
  const categories: Record<string, string[]> = {
    'Core Ecommerce': ['Ecommerce Website', 'Admin Dashboard', 'Product Management', 'Inventory Management'],
    'Mobile Apps': ['Android Ecommerce App', 'iOS Ecommerce App'],
    'Advanced Features': ['Multi‑vendor Support', 'Delivery Management App', 'Vendor Panel', 'AI Recommendations'],
    'Integrations': ['Razorpay Integration', 'Payment Gateway', 'Email Automation', 'Chat Support'],
    'Performance': ['SEO Optimization', 'Advanced Analytics', 'Headless CMS'],
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
      <table className="w-full min-w-[800px] text-sm">
        <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
          <tr>
            <th className="text-left px-5 py-4 font-semibold text-zinc-700 dark:text-zinc-300">Feature</th>
            {packages.map(p => (
              <th key={p.id} className="px-5 py-4 text-center font-semibold text-zinc-700 dark:text-zinc-300">
                {p.name}
                <div className="text-xs font-medium text-brand-600 dark:text-brand-400 mt-0.5">
                  {formatPrice(p.price, p.currencyCode as CurrencyCode)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(categories).map(([category, features]) => (
            <React.Fragment key={category}>
              <tr className="bg-zinc-50/50 dark:bg-zinc-900/30">
                <td colSpan={packages.length + 1} className="px-5 py-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  {category}
                </td>
              </tr>
              {features.map((feature, idx) => {
                const included = packages.map(p =>
                  p.services?.some(s => s.serviceResponse?.name === feature)
                );
                return (
                  <tr key={feature} className="border-t border-zinc-100 dark:border-zinc-800">
                    <td className="px-5 py-3 text-zinc-700 dark:text-zinc-300">{feature}</td>
                    {included.map((has, i) => (
                      <td key={i} className="px-5 py-3 text-center">
                        {has ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300 text-xs font-medium">
                            <Check className="w-3 h-3" /> Included
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 text-xs">
                            <X className="w-3 h-3" /> Not included
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────
export function PackagesPageClient() {
  const { data: packages, isLoading, error } = usePackages();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [showCompare, setShowCompare] = useState(false);

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

  const trustMetrics = [
    { label: 'Features', value: allServices.length + 20, suffix: '+' },
    { label: 'Mobile Apps', value: 'Included' },
    { label: 'Admin Dashboard', value: 'Yes' },
    { label: 'Secure Payments', value: 'Razorpay' },
  ];

  const faqs = [
    {
      q: 'What is included in the packages?',
      a: 'Each package includes a complete ecommerce solution with all necessary features to launch and grow your business. See the comparison table for detailed features.',
    },
    {
      q: 'How long does it take to deliver?',
      a: 'Delivery times vary by package: Starter (2-3 weeks), Growth (3-4 weeks), Professional (4-6 weeks). We also offer express delivery for an additional fee.',
    },
    {
      q: 'Do you offer post‑launch support?',
      a: 'Yes! All packages include free support for 3 to 12 months depending on the package. We also offer extended support plans.',
    },
    {
      q: 'Can I upgrade my package later?',
      a: 'Absolutely. You can upgrade to a higher package at any time; we’ll migrate your data and add the new features seamlessly.',
    },
  ];

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
      {/* ─── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-12 overflow-hidden bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-brand-500/10 to-transparent pointer-events-none" />
        <div className="section-container text-center max-w-3xl mx-auto relative">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="eyebrow justify-center"
          >
            Solutions
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-zinc-100 mt-2 mb-5"
          >
            Ecommerce Solutions{' '}
            <span className="bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
              Built For Growth
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed"
          >
            Launch, manage and scale your ecommerce business with complete ecommerce ecosystem packages.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mt-8"
          >
            {trustMetrics.map((metric, idx) => (
              <div key={idx} className="text-center p-3 rounded-xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-white/20 dark:border-zinc-800/50">
                <p className="text-xl font-bold text-zinc-900 dark:text-white">{metric.value}{metric.suffix || ''}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{metric.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Search & Filter ─────────────────────────────────────────────── */}
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
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                />
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              >
                <option value="default">Recommended</option>
                <option value="price-asc">Price: Low to high</option>
                <option value="price-desc">Price: High to low</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ─── Packages Grid ────────────────────────────────────────────────── */}
      <section className="section-padding pt-0">
        <div className="section-container">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {Array(3).fill(0).map((_, i) => <PackageCardSkeleton key={i} />)}
              </motion.div>
            ) : filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12 text-zinc-500"
              >
                No packages match your search.
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start"
              >
                {filtered.map((pkg, i) => {
                  const isFeatured = pkg.featured || (filtered.length === 3 && i === 1);
                  return <PackageCard key={pkg.id} pkg={pkg} index={i} featured={isFeatured} />;
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ─── Comparison Table Toggle ─────────────────────────────────────── */}
      {!isLoading && packages && packages.length > 1 && allServices.length > 0 && (
        <div className="section-container pb-4">
          <button
            onClick={() => setShowCompare(!showCompare)}
            className="flex items-center gap-1 text-sm text-brand-600 hover:underline mx-auto transition-colors"
          >
            {showCompare ? 'Hide comparison' : 'Compare packages'}
            {showCompare ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      )}

      {/* ─── Comparison Table ────────────────────────────────────────────── */}
      {showCompare && !isLoading && packages && packages.length > 1 && allServices.length > 0 && (
        <section className="section-padding pt-0">
          <div className="section-container">
            <ComparisonTable packages={packages} allServices={allServices} />
          </div>
        </section>
      )}

      {/* ─── What Happens After Purchase ────────────────────────────────── */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-950">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-10"
          >
            <span className="eyebrow justify-center">Process</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
              What Happens After Purchase
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">
              We guide you through every step from discovery to launch.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: Users, label: 'Discovery Call' },
              { icon: LayoutDashboard, label: 'Design' },
              { icon: Code, label: 'Development' },
              { icon: Shield, label: 'Testing' },
              { icon: Rocket, label: 'Launch' },
              { icon: Settings, label: 'Support' },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="flex flex-col items-center p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all text-center"
              >
                <div className="w-12 h-12 rounded-full bg-brand-50 dark:bg-brand-950/30 flex items-center justify-center mb-2">
                  <step.icon className="w-5 h-5 text-brand-600" />
                </div>
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{step.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ROI Section ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-zinc-900">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-10"
          >
            <span className="eyebrow justify-center">ROI</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
              Why Businesses Choose Our Packages
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">
              Accelerate your growth with a complete ecommerce ecosystem.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: TrendingUp, label: 'Increase Online Sales' },
              { icon: Settings, label: 'Automate Operations' },
              { icon: Package, label: 'Manage Inventory' },
              { icon: Truck, label: 'Track Orders' },
              { icon: CreditCard, label: 'Accept Payments' },
              { icon: BarChart3, label: 'Scale Faster' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-4 p-5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-brand-200 dark:hover:border-brand-800 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-950/30 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-brand-600" />
                </div>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ Section ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-950">
        <div className="section-container max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="eyebrow justify-center">FAQ</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
              Frequently Asked Questions
            </h2>
          </motion.div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5"
              >
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{faq.q}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ContactCta />
    </>
  );
}