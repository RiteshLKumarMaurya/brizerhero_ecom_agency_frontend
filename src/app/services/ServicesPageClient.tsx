'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useServices } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import { ContactCta } from '@/components/sections/ContactCta';
import type { ServiceResponse } from '@/types';

// Skeleton loader (defined inside same file)
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

function ServiceCard({ service, index }: { service: ServiceResponse; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 6) * 0.07, duration: 0.4 }}
      className="group relative rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-50 to-purple-50 dark:from-brand-950/30 dark:to-purple-950/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
        {service.iconImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={getOptimizedUrl(service.iconImage)} alt={service.name} className="w-8 h-8 object-contain" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-brand-200 dark:bg-brand-800 flex items-center justify-center text-brand-700 dark:text-brand-300 font-bold text-lg">
            {service.name.charAt(0)}
          </div>
        )}
      </div>

      {service.featured && (
        <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 mb-3">
          Featured
        </span>
      )}

      <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-brand-600 transition-colors">
        {service.name}
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4 line-clamp-2">
        {service.shortDescription}
      </p>

      {service.features?.length > 0 && (
        <ul className="space-y-1.5 mb-4">
          {service.features.slice(0, 3).map((f) => (
            <li key={f.id} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
              <span className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-1">{f.feature?.name || f.feature.name}</span>
            </li>
          ))}
          {service.features.length > 3 && (
            <li className="text-xs text-brand-500 ml-2">+{service.features.length - 3} more</li>
          )}
        </ul>
      )}

      {service.technologies?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5">
          {service.technologies.slice(0, 3).map((t) => (
            <span key={t.id} className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
              {t.technology.name}
            </span>
          ))}
          {service.technologies.length > 3 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
              +{service.technologies.length - 3}
            </span>
          )}
        </div>
      )}

      <Link
        href={`/services/${service.slug}`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400 mt-auto group-hover:gap-3 transition-all"
      >
        Explore {service.name} <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </motion.div>
  );
}

export function ServicesPageClient() {
  const { data: services, isLoading } = useServices();

  return (
    <>
      <section className="relative pt-32 pb-16 overflow-hidden bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="section-container text-center max-w-3xl mx-auto">
          <span className="eyebrow justify-center">What We Build</span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-zinc-100 mt-2 mb-5">
            Services Built for{' '}
            <span className="bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
              Real Business Growth
            </span>
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
            From your first landing page to a fully scaled platform — we handle every stage of your digital journey with expertise and care.
          </p>
        </div>
      </section>

      {!isLoading && services && services.length > 0 && (
        <div className="flex justify-center pb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-950/20 text-brand-700 dark:text-brand-300 text-sm font-medium shadow-sm">
            <Sparkles className="w-4 h-4" />
            {services.length}+ Expert Services • 50+ Successful Projects
          </div>
        </div>
      )}

      <section className="section-padding pt-0">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? Array(6).fill(0).map((_, i) => <ServiceCardSkeleton key={i} />)
              : services?.map((service, i) => <ServiceCard key={service.id} service={service} index={i} />)}
          </div>
        </div>
      </section>

      <ContactCta />
    </>
  );
}