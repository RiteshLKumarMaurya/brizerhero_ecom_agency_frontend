'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useServices } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import { SectionHeader } from '@/components/common/SectionHeader';
import { ServiceCardSkeleton } from '@/components/common/Skeletons';
import type { ServiceResponse } from '@/types';

function ServiceCard({ service }: { service: ServiceResponse }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group card-hover flex flex-col h-full"
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {service.iconImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={getOptimizedUrl(service.iconImage)} alt={service.name} className="w-6 h-6 object-contain" />
        ) : (
          <div className="w-6 h-6 rounded bg-brand-200 dark:bg-brand-800" />
        )}
      </div>

      <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
        {service.name}
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed flex-1 mb-4">
        {service.shortDescription}
      </p>

      {/* Features preview */}
      {service.features?.slice(0, 3).map((f) => (
        <div key={f.id} className="flex items-center gap-2 mb-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
          <span className="text-xs text-zinc-500 dark:text-zinc-400">{f.name}</span>
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
        <SectionHeader
          eyebrow="What We Build"
          title="Services That Drive Growth"
          subtitle="From concept to launch, we handle every aspect of your digital product with precision and craft."
          centered
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array(6).fill(0).map((_, i) => <ServiceCardSkeleton key={i} />)
            : featured.length > 0
            ? featured.map((service) => <ServiceCard key={service.id} service={service} />)
            : services?.slice(0, 6).map((service) => <ServiceCard key={service.id} service={service} />)
          }
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
