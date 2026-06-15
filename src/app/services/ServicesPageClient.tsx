'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Search, Filter, X } from 'lucide-react';
import { useServices } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import { ContactCta } from '@/components/sections/ContactCta';
import type { ServiceResponse, ServiceFeatureResponse, ServiceTechnologyResponse } from '@/types';

// ============================================================
// Skeleton Loader Component
// ============================================================
function ServiceCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 animate-pulse">
      <div className="skeleton w-16 h-16 rounded-xl mb-4" />
      <div className="skeleton h-6 w-3/4 rounded mb-3" />
      <div className="skeleton h-4 w-full rounded mb-2" />
      <div className="skeleton h-4 w-5/6 rounded mb-4" />
      <div className="flex gap-2 mb-4">
        <div className="skeleton h-5 w-16 rounded-full" />
        <div className="skeleton h-5 w-16 rounded-full" />
      </div>
      <div className="skeleton h-5 w-28 rounded" />
    </div>
  );
}

// ============================================================
// Service Card Component
// ============================================================
function ServiceCard({ service, index }: { service: ServiceResponse; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: (index % 9) * 0.05, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -8 }}
      className="group relative rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      {/* Icon with gradient background */}
      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-50 to-purple-50 dark:from-brand-950/40 dark:to-purple-950/40 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
        {service.iconImage ? (
          <Image
            src={getOptimizedUrl(service.iconImage)}
            alt={service.name}
            width={32}
            height={32}
            className="w-8 h-8 object-contain"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-brand-200 dark:bg-brand-800 flex items-center justify-center text-brand-700 dark:text-brand-300 font-bold text-lg">
            {service.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Featured badge */}
      {service.featured && (
        <span className="absolute top-4 right-4 inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400">
          <Sparkles className="w-3 h-3" />
          Featured
        </span>
      )}

      {/* Title & Description */}
      <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
        {service.name}
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4 line-clamp-2 flex-1">
        {service.shortDescription}
      </p>

      {/* Features (key highlights) */}
      {service.features && service.features.length > 0 && (
        <div className="mb-4">
          <ul className="space-y-1.5">
            {service.features.slice(0, 3).map((feature: ServiceFeatureResponse) => (
              <li key={feature.id} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
                <span className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-1">
                  {feature.feature?.name || 'Feature'}
                </span>
              </li>
            ))}
          </ul>
          {service.features.length > 3 && (
            <p className="text-xs text-brand-500 mt-1 ml-2">+{service.features.length - 3} more</p>
          )}
        </div>
      )}

      {/* Tech stack pills */}
      {service.technologies && service.technologies.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5">
          {service.technologies.slice(0, 3).map((tech: ServiceTechnologyResponse) => (
            <span
              key={tech.id}
              className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
            >
              {tech.technology?.name || 'Tech'}
            </span>
          ))}
          {service.technologies.length > 3 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
              +{service.technologies.length - 3}
            </span>
          )}
        </div>
      )}

      {/* CTA Link */}
      <Link
        href={`/services/${service.slug}`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400 mt-auto group-hover:gap-3 transition-all duration-200"
      >
        Explore {service.name}
        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
      </Link>
    </motion.div>
  );
}

// ============================================================
// Main Page Component
// ============================================================
export function ServicesPageClient() {
  const { data: services, isLoading, error } = useServices();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  // Filter and sort services
  const filteredServices = useMemo(() => {
    if (!services) return [];
    let filtered = [...services];
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.shortDescription.toLowerCase().includes(query)
      );
    }
    if (showFeaturedOnly) {
      filtered = filtered.filter((s) => s.featured);
    }
    // Sort by displayOrder (if exists) or name
    return filtered.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, [services, searchQuery, showFeaturedOnly]);

  // Error state
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
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-brand-500/5 to-transparent pointer-events-none" />

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

      {/* Stat Badge */}
      {!isLoading && services && services.length > 0 && (
        <div className="flex justify-center -mt-4 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300 text-sm font-medium shadow-sm backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            {services.length} Expert Services • 5+ Successful Projects
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
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

      {/* Services Grid */}
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
                {Array(6).fill(0).map((_, i) => (
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