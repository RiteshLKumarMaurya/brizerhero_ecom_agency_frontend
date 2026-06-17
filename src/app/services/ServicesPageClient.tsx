'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Search,
  Filter,
  X,
  ShoppingBag,
  LayoutDashboard,
  Smartphone,
  Apple,
  Landmark,
  Truck,
  Users,
  Layers,
} from 'lucide-react';
import { useServices } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import { ContactCta } from '@/components/sections/ContactCta';
import type { ServiceResponse, ServiceFeatureResponse, ServiceTechnologyResponse } from '@/types';

// ─── Icon mapping for service thumbnails ──────────────────────────────────
const serviceIconMap: Record<string, React.ElementType> = {
  'ecommerce-full-website': ShoppingBag,
  'admin-panel-website': LayoutDashboard,
  'android-ecommerce-app': Smartphone,
  'ios-ecommerce-app': Apple,
  'ecommerce-landing-page': Landmark,
  'delivery-management-app': Truck,
  'vendor-panel': Users,
  'complete-ecommerce-ecosystem': Layers,
};

// ─── Category mapping ──────────────────────────────────────────────────────
const getCategory = (slug: string): string => {
  if (slug.includes('android') || slug.includes('ios')) return 'Mobile App';
  if (slug.includes('admin') || slug.includes('vendor')) return 'Admin Panel';
  if (slug.includes('landing')) return 'Landing Page';
  if (slug.includes('delivery')) return 'Logistics';
  return 'Ecommerce';
};

// ─── Skeleton Loader ──────────────────────────────────────────────────────
function ServiceCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-[16/9] bg-zinc-200 dark:bg-zinc-800" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-6 w-3/4 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-5/6 rounded" />
        <div className="flex gap-2 pt-2">
          <div className="skeleton h-6 w-16 rounded-full" />
          <div className="skeleton h-6 w-16 rounded-full" />
        </div>
        <div className="skeleton h-5 w-28 rounded mt-2" />
      </div>
    </div>
  );
}

// ─── Service Card ────────────────────────────────────────────────────────
function ServiceCard({ service, index }: { service: ServiceResponse; index: number }) {
  const IconComponent = serviceIconMap[service.slug] || ShoppingBag;
  const category = getCategory(service.slug);
  const hasImage = service.iconImage; // we'll use iconImage as fallback; ideally a separate thumbnail field

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: (index % 9) * 0.05, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -8 }}
      className="group relative rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
    >
      {/* ─── Thumbnail Banner (16:9) ─────────────────────────────────── */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-brand-600 to-purple-600">
        {/* If an image exists, show it; otherwise a gradient + icon */}
        {hasImage ? (
          <Image
            src={getOptimizedUrl(service.iconImage)}
            alt={service.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-600/80 to-purple-600/80">
            <IconComponent className="w-20 h-20 text-white/70" strokeWidth={1.5} />
          </div>
        )}

        {/* Category Badge */}
        <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white text-xs font-semibold tracking-wide border border-white/10">
          <Sparkles className="w-3 h-3" />
          {category}
        </span>

        {/* Featured Badge */}
        {service.featured && (
          <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400/90 text-amber-950 text-xs font-bold tracking-wide backdrop-blur-sm">
            <Sparkles className="w-3 h-3" />
            Featured
          </span>
        )}

        {/* Gradient overlay for text readability (if image is present) */}
        {hasImage && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        )}
      </div>

      {/* ─── Content ────────────────────────────────────────────────────── */}
      <div className="flex-1 p-5 flex flex-col">
        <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1.5 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {service.name}
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2 flex-1">
          {service.shortDescription}
        </p>

        {/* Key Features */}
        {service.features && service.features.length > 0 && (
          <div className="mt-3">
            <ul className="space-y-1">
              {service.features.slice(0, 2).map((feature: ServiceFeatureResponse) => (
                <li key={feature.id} className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
                  <span className="line-clamp-1">{feature.feature?.name || 'Feature'}</span>
                </li>
              ))}
              {service.features.length > 2 && (
                <li className="text-xs text-brand-500">+{service.features.length - 2} more</li>
              )}
            </ul>
          </div>
        )}

        {/* Technologies */}
        {service.technologies && service.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {service.technologies.slice(0, 3).map((tech: ServiceTechnologyResponse) => (
              <span
                key={tech.id}
                className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium"
              >
                {tech.technology?.name || 'Tech'}
              </span>
            ))}
            {service.technologies.length > 3 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                +{service.technologies.length - 3}
              </span>
            )}
          </div>
        )}

        {/* CTA */}
        <Link
          href={`/services/${service.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400 mt-4 group-hover:gap-3 transition-all duration-200"
        >
          Explore Service
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────
export function ServicesPageClient() {
  const { data: services, isLoading, error } = useServices();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  const filteredServices = useMemo(() => {
    if (!services) return [];
    let filtered = [...services];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.shortDescription.toLowerCase().includes(q)
      );
    }
    if (showFeaturedOnly) {
      filtered = filtered.filter((s) => s.featured);
    }
    return filtered.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, [services, searchQuery, showFeaturedOnly]);

  if (error) {
    return (
      <div className="min-h-[70vh] pt-32 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <X className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="font-display text-2xl font-bold mb-3">Unable to load services</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">
            {error.message || 'Please check your connection and try again.'}
          </p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-zinc-50 dark:bg-zinc-950">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-brand-500/10 to-transparent pointer-events-none" />

        <div className="section-container text-center max-w-3xl mx-auto relative">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="eyebrow justify-center"
          >
            What We Build
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-zinc-100 mt-2 mb-5"
          >
            Services Built for{' '}
            <span className="bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
              Real Business Growth
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed"
          >
            From your first landing page to a fully scaled platform — we handle every stage of your digital journey with expertise and care.
          </motion.p>
        </div>
      </section>

      {/* Stats Badge */}
      {!isLoading && services && services.length > 0 && (
        <div className="flex justify-center -mt-4 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300 text-sm font-medium shadow-sm backdrop-blur-sm border border-brand-200/50 dark:border-brand-800/50">
            <Sparkles className="w-4 h-4" />
            {services.length} Expert Services • 5+ Successful Projects
          </div>
        </div>
      )}

      {/* Search & Filter */}
      <div className="section-container mb-8">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services by name or description..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
            />
          </div>
          <button
            onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap
              ${showFeaturedOnly
                ? 'bg-brand-500 text-white shadow-md'
                : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-brand-300'
              }
            `}
          >
            <Filter className="w-4 h-4" />
            {showFeaturedOnly ? 'Featured Only' : 'All Services'}
            {showFeaturedOnly && (
              <X
                className="w-3.5 h-3.5 ml-1 cursor-pointer hover:text-white/80"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFeaturedOnly(false);
                }}
              />
            )}
          </button>
        </div>
      </div>

      {/* Grid */}
      <section className="section-padding pt-0">
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
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <ServiceCardSkeleton key={i} />
                  ))}
              </motion.div>
            ) : filteredServices.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <Search className="w-6 h-6 text-zinc-400" />
                </div>
                <p className="text-zinc-500 dark:text-zinc-400">No services match your search.</p>
                <button
                  onClick={() => { setSearchQuery(''); setShowFeaturedOnly(false); }}
                  className="btn-secondary mt-4"
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
                {filteredServices.map((service, i) => (
                  <ServiceCard key={service.id} service={service} index={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <ContactCta />
    </>
  );
}