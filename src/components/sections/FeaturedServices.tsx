'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useServices } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import { ServiceCardSkeleton } from '@/components/common/Skeletons';
import type { ServiceResponse } from '@/types';

function ServiceCard({ service }: { service: ServiceResponse }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-50 to-purple-50 dark:from-brand-950/30 dark:to-purple-950/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
        {service.iconImage ? (
          <img src={getOptimizedUrl(service.iconImage)} alt={service.name} className="w-7 h-7 object-contain" />
        ) : (
          <div className="w-7 h-7 rounded-full bg-brand-200 dark:bg-brand-800 flex items-center justify-center text-brand-700 font-bold">
            {service.name.charAt(0)}
          </div>
        )}
      </div>
      <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">{service.name}</h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4 line-clamp-2">
        {service.shortDescription}
      </p>
      {service.features?.slice(0, 3).map((f) => (
        <div key={f.id} className="flex items-center gap-2 mb-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
          <span className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">{f.feature?.name || f.feature.name}</span>
        </div>
      ))}
      <Link
        href={`/services/${service.slug}`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400 mt-4 group-hover:gap-2.5 transition-all"
      >
        Learn More <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </motion.div>
  );
}

export function FeaturedServices() {
  const { data: services, isLoading } = useServices();
  const featured = services?.filter((s) => s.featured).slice(0, 6) ?? [];

  return (
    <section className="section-padding bg-zinc-50 dark:bg-zinc-950">
      <div className="section-container">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="text-xs font-semibold tracking-widest text-brand-500 uppercase">What We Build</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">
            Services That Drive Growth
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            From concept to launch, we handle every aspect of your digital product with precision and craft.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array(6).fill(0).map((_, i) => <ServiceCardSkeleton key={i} />)
            : featured.map((service) => <ServiceCard key={service.id} service={service} />)}
        </div>
        <div className="mt-10 text-center">
          <Link href="/services" className="btn-secondary">
            View All Services <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}