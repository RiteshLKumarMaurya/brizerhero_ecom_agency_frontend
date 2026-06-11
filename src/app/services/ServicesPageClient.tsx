'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useServices } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import { SectionHeader } from '@/components/common/SectionHeader';
import { ServiceCardSkeleton } from '@/components/common/Skeletons';
import { ContactCta } from '@/components/sections/ContactCta';
import type { ServiceResponse } from '@/types';

function ServiceCard({ service, index }: { service: ServiceResponse; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 3) * 0.08 }}
      className="group card-hover flex flex-col h-full"
    >
      {/* Icon */}
      <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
        {service.iconImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={getOptimizedUrl(service.iconImage)} alt={service.name} className="w-7 h-7 object-contain" />
        ) : (
          <div className="w-7 h-7 rounded bg-brand-200 dark:bg-brand-800" />
        )}
      </div>

      {service.featured && (
        <span className="tag text-xs mb-3 w-fit">Featured</span>
      )}

      <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
        {service.name}
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
        {service.shortDescription}
      </p>

      {/* Features */}
      {service.features?.length > 0 && (
        <ul className="space-y-1.5 mb-5 flex-1">
          {service.features.slice(0, 4).map((f) => (
            <li key={f.id} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
              <span className="text-xs text-zinc-600 dark:text-zinc-400">{f.name}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Technologies */}
      {service.technologies?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5">
          {service.technologies.slice(0, 5).map((t) => (
            <span key={t.id} className="text-xs px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
              {t.name}
            </span>
          ))}
        </div>
      )}

      <Link
        href={`/services/${service.slug}`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400 mt-auto group-hover:gap-3 transition-all"
      >
        View Service Details <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </motion.div>
  );
}

export function ServicesPageClient() {
  const { data: services, isLoading } = useServices();

  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 bg-zinc-50 dark:bg-zinc-950">
        <div className="section-container">
          <div className="max-w-2xl">
            <p className="eyebrow">What We Build</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-zinc-100 mb-5">
              Services Built for <span className="gradient-text">Real Business Growth</span>
            </h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
              From your first landing page to a fully scaled platform — we handle every stage of your digital journey with the expertise and care it deserves.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? Array(9).fill(0).map((_, i) => <ServiceCardSkeleton key={i} />)
              : services?.map((service, i) => (
                  <ServiceCard key={service.id} service={service} index={i} />
                ))
            }
          </div>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
