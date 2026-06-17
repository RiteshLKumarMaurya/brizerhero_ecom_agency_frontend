'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  ArrowRight,
  Sparkles,
  Package,
  ShoppingCart,
  CreditCard,
  BarChart3,
  Smartphone,
  LayoutDashboard,
  TrendingUp,
  Shield,
  Mail,
  Zap,
  Filter,
  ChevronDown,
  CheckCircle,
} from 'lucide-react';
import { useFeatures } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import { ContactCta } from '@/components/sections/ContactCta';
import type { FeatureResponse } from '@/types';
import { cn } from '@/lib/utils';

// ─── Category mapping (dynamic, based on feature name/description) ──
const getFeatureCategory = (feature: FeatureResponse): string => {
  const text = (feature.name + ' ' + (feature.description || '')).toLowerCase();
  if (text.includes('inventory') || text.includes('stock')) return 'Inventory';
  if (text.includes('order') || text.includes('checkout')) return 'Orders';
  if (text.includes('payment') || text.includes('gateway') || text.includes('razorpay')) return 'Payments';
  if (text.includes('analytics') || text.includes('report') || text.includes('dashboard')) return 'Analytics';
  if (text.includes('mobile') || text.includes('app') || text.includes('android') || text.includes('ios')) return 'Mobile Apps';
  if (text.includes('admin') || text.includes('panel')) return 'Admin Panel';
  if (text.includes('security') || text.includes('auth') || text.includes('ssl')) return 'Security';
  if (text.includes('marketing') || text.includes('email') || text.includes('promotion')) return 'Marketing';
  if (text.includes('growth') || text.includes('scale') || text.includes('upsell')) return 'Growth';
  if (text.includes('store') || text.includes('catalog') || text.includes('product')) return 'Store Management';
  return 'General';
};

// ─── Categories for filter ────────────────────────────────────────────
const ALL_CATEGORIES = [
  'All',
  'Store Management',
  'Inventory',
  'Orders',
  'Payments',
  'Marketing',
  'Analytics',
  'Security',
  'Mobile Apps',
  'Admin Panel',
  'Growth',
  'General',
];

// ─── Skeleton card ────────────────────────────────────────────────────
function FeatureCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white/5 dark:bg-zinc-900/50 border border-zinc-200/20 dark:border-zinc-800/50 p-6 animate-pulse">
      <div className="skeleton w-12 h-12 rounded-xl mb-4" />
      <div className="skeleton h-6 w-3/4 rounded mb-2" />
      <div className="skeleton h-4 w-full rounded mb-1" />
      <div className="skeleton h-4 w-5/6 rounded" />
    </div>
  );
}

// ─── Feature Card ─────────────────────────────────────────────────────
function FeatureCard({ feature, index }: { feature: FeatureResponse; index: number }) {
  const category = getFeatureCategory(feature);
  const iconSrc = feature.iconImage ? getOptimizedUrl(feature.iconImage) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 12) * 0.05, duration: 0.4 }}
      whileHover={{ y: -6 }}
      className="group relative rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-white/20 dark:border-zinc-800/50 p-6 hover:shadow-2xl hover:border-brand-400/50 transition-all duration-300"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
          {iconSrc ? (
            <Image
              src={iconSrc}
              alt={feature.name}
              width={28}
              height={28}
              className="w-7 h-7 object-contain"
            />
          ) : (
            <Zap className="w-6 h-6 text-brand-500" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          {/* Category badge */}
          <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300 mb-1.5">
            {category}
          </span>
          <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            {feature.name}
          </h3>
          {feature.description && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mt-1 line-clamp-2">
              {feature.description}
            </p>
          )}
        </div>
      </div>

      {/* Learn more indicator */}
      <div className="mt-4 text-xs font-semibold text-brand-600 dark:text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1">
        Learn more <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </motion.div>
  );
}

// ─── Feature Highlight Card (for the featured section) ──────────────
function HighlightCard({
  feature,
  icon: Icon,
}: {
  feature: FeatureResponse;
  icon: React.ElementType;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="p-6 rounded-2xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm border border-white/20 dark:border-zinc-800/50 shadow-lg hover:shadow-xl transition-all"
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-brand-500" />
      </div>
      <h3 className="font-display font-semibold text-lg text-zinc-900 dark:text-zinc-100 mb-1">
        {feature.name}
      </h3>
      {feature.description && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
          {feature.description}
        </p>
      )}
    </motion.div>
  );
}

// ─── Showcase Section (alternating) ──────────────────────────────────
function ShowcaseItem({
  feature,
  index,
}: {
  feature: FeatureResponse;
  index: number;
}) {
  const isEven = index % 2 === 0;
  const iconSrc = feature.iconImage ? getOptimizedUrl(feature.iconImage) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 py-12 border-b border-zinc-200/20 dark:border-zinc-800/30 last:border-0`}
    >
      <div className="flex-1 space-y-4">
        <span className="inline-block text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
          Feature Highlight
        </span>
        <h3 className="font-display text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          {feature.name}
        </h3>
        {feature.description && (
          <p className="text-zinc-600 dark:text-zinc-300 text-lg leading-relaxed">
            {feature.description}
          </p>
        )}
        <div className="flex items-center gap-2 text-sm text-brand-600 dark:text-brand-400">
          <CheckCircle className="w-4 h-4" />
          <span>Included in all our packages</span>
        </div>
      </div>
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-sm aspect-video rounded-2xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 flex items-center justify-center p-8 shadow-inner">
          {iconSrc ? (
            <Image
              src={iconSrc}
              alt={feature.name}
              width={120}
              height={120}
              className="w-32 h-32 object-contain opacity-80"
            />
          ) : (
            <Zap className="w-24 h-24 text-brand-500/40" />
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────
export function FeaturesPageClient() {
  const { data: features, isLoading, error } = useFeatures();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSticky, setIsSticky] = useState(false);

  // ── Filter and search ───────────────────────────────────────────────
  const filteredFeatures = useMemo(() => {
    if (!features) return [];
    let result = features;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          (f.description && f.description.toLowerCase().includes(q))
      );
    }
    if (selectedCategory !== 'All') {
      result = result.filter((f) => getFeatureCategory(f) === selectedCategory);
    }
    return result;
  }, [features, searchQuery, selectedCategory]);

  // ── Highlight features (first 5) ──────────────────────────────────
  const highlightFeatures = useMemo(() => {
    if (!features) return [];
    return features.slice(0, 5);
  }, [features]);

  // ── Showcase features (alternating – pick a few) ──────────────────
  const showcaseFeatures = useMemo(() => {
    if (!features) return [];
    // Pick features that have descriptions, maybe every 3rd
    const withDesc = features.filter((f) => f.description);
    return withDesc.slice(0, 6);
  }, [features]);

  // ── Sticky search on scroll ────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsSticky(offset > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Error state ────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="font-display text-2xl font-bold mb-2">Failed to load features</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">
            {error.message || 'Please check your connection and try again.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ─── Hero Section ───────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-brand-500/20 to-transparent pointer-events-none" />

        <div className="section-container text-center max-w-3xl mx-auto relative">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="eyebrow justify-center text-brand-400"
          >
            Ecommerce Ecosystem Features
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-2 mb-5"
          >
            Everything Your{' '}
            <span className="bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
              Ecommerce Business Needs
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-300 leading-relaxed"
          >
            Discover the complete suite of powerful features designed to launch, manage and scale modern ecommerce businesses.
          </motion.p>

          {/* Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-2xl mx-auto mt-8"
          >
            <div className="text-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <p className="text-xl font-bold text-brand-400">50+</p>
              <p className="text-xs text-zinc-400">Premium Features</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <p className="text-xl font-bold text-brand-400">✓</p>
              <p className="text-xs text-zinc-400">Website + Mobile</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <p className="text-xl font-bold text-brand-400">✓</p>
              <p className="text-xs text-zinc-400">Admin Dashboard</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <p className="text-xl font-bold text-brand-400">✓</p>
              <p className="text-xs text-zinc-400">Payment Integrations</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <p className="text-xl font-bold text-brand-400">✓</p>
              <p className="text-xs text-zinc-400">Inventory Management</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Feature Highlights ────────────────────────────────────────── */}
      {!isLoading && highlightFeatures.length > 0 && (
        <section className="py-16 bg-zinc-950 border-b border-zinc-800">
          <div className="section-container">
            <div className="text-center mb-10">
              <span className="eyebrow justify-center text-brand-400">Built For Modern Ecommerce Growth</span>
              <h2 className="font-display text-3xl font-bold text-white mt-2">
                Core Capabilities
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {highlightFeatures.map((feature, idx) => {
                const iconMap: Record<string, React.ElementType> = {
                  Inventory: Package,
                  Orders: ShoppingCart,
                  Payments: CreditCard,
                  Analytics: BarChart3,
                  'Mobile Apps': Smartphone,
                  'Admin Panel': LayoutDashboard,
                  Growth: TrendingUp,
                  Security: Shield,
                  Marketing: Mail,
                  'Store Management': Package,
                };
                const category = getFeatureCategory(feature);
                const Icon = iconMap[category] || Zap;
                return (
                  <HighlightCard key={feature.id} feature={feature} icon={Icon} />
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── Search & Filter (sticky) ──────────────────────────────────── */}
      <div
        className={cn(
          'sticky top-0 z-20 py-4 transition-all duration-300',
          isSticky
            ? 'bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800'
            : 'bg-transparent'
        )}
      >
        <div className="section-container">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search features by name or description..."
                className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            {/* Category filter */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-end">
              {ALL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap',
                    selectedCategory === cat
                      ? 'bg-brand-500 text-white shadow-md'
                      : 'bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/10'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Feature Grid ────────────────────────────────────────────────── */}
      <section className="py-12 bg-zinc-950">
        <div className="section-container">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {Array(9)
                  .fill(0)
                  .map((_, i) => (
                    <FeatureCardSkeleton key={i} />
                  ))}
              </motion.div>
            ) : filteredFeatures.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                  <Search className="w-10 h-10 text-zinc-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No Features Found</h3>
                <p className="text-zinc-400">
                  Try searching with different keywords or clear the filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="btn-secondary mt-6"
                >
                  Clear filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredFeatures.map((feature, i) => (
                  <FeatureCard key={feature.id} feature={feature} index={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ─── Feature Showcase (alternating) ────────────────────────────── */}
      {!isLoading && showcaseFeatures.length > 0 && (
        <section className="py-16 bg-zinc-900 border-t border-zinc-800">
          <div className="section-container">
            <div className="text-center mb-10">
              <span className="eyebrow justify-center text-brand-400">Deep Dive</span>
              <h2 className="font-display text-3xl font-bold text-white mt-2">
                Featured Capabilities
              </h2>
            </div>
            <div className="max-w-4xl mx-auto">
              {showcaseFeatures.map((feature, idx) => (
                <ShowcaseItem key={feature.id} feature={feature} index={idx} />
              ))}
            </div>
          </div>
        </section>
      )}

          {/* Contact CTA (optional, we already have final CTA) */}
      <ContactCta />
    </>
  );
}