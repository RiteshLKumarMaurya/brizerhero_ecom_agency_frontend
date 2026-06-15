'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useTechnologies } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import { ContactCta } from '@/components/sections/ContactCta';
import type { TechnologyResponse } from '@/types';

function TechCard({ tech, index }: { tech: TechnologyResponse; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 20) * 0.02, duration: 0.3 }}
      className="group flex flex-col items-center text-center p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:shadow-md hover:border-brand-200 dark:hover:border-brand-800 transition-all"
    >
      {/* Icon - large enough to see, not overwhelming */}
      <div className="w-16 h-16 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
        {tech.iconImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={getOptimizedUrl(tech.iconImage)}
            alt={tech.name}
            className="w-8 h-8 object-contain"
          />
        ) : (
          <span className="text-xl font-bold text-brand-500">
            {tech.name.charAt(0)}
          </span>
        )}
      </div>

      <h3 className="font-display font-semibold text-sm text-zinc-900 dark:text-zinc-100">
        {tech.name}
      </h3>

      {tech.description && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 px-1 line-clamp-2">
          {tech.description.length > 60 ? tech.description.slice(0, 60) + '…' : tech.description}
        </p>
      )}

      {tech.links?.length > 0 && (
        <Link
          href={`/technologies/${tech.slug}`}
          className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400 hover:gap-2 transition-all"
        >
          Learn more <ArrowRight className="w-3 h-3" />
        </Link>
      )}
    </motion.div>
  );
}

export function TechnologiesPageClient() {
  const { data: technologies, isLoading } = useTechnologies();

  return (
    <>
      {/* Hero – clean, centered */}
      <section className="relative pt-32 pb-12 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
        <div className="section-container text-center max-w-2xl mx-auto">
          <span className="eyebrow justify-center">Our Stack</span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-zinc-100 mt-2 mb-4">
            Technologies We{' '}
            <span className="bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
              Master
            </span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg">
            Modern, battle‑tested frameworks and tools — chosen for performance, not hype.
          </p>
        </div>
      </section>

      {/* Trust badge (dynamic count) */}
      {!isLoading && technologies && technologies.length > 0 && (
        <div className="flex justify-center pb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-950/20 text-brand-700 dark:text-brand-300 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            {technologies.length}+ Technologies • 50+ Projects • Global Clients
          </div>
        </div>
      )}

      {/* Tech Grid */}
      <section className="section-padding pt-0">
        <div className="section-container">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {isLoading
              ? Array(18).fill(0).map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 animate-pulse"
                  >
                    <div className="skeleton w-16 h-16 rounded-xl" />
                    <div className="skeleton h-4 w-20 mt-3" />
                  </div>
                ))
              : technologies?.map((tech, i) => (
                  <TechCard key={tech.id} tech={tech} index={i} />
                ))}
          </div>
        </div>
      </section>

      <ContactCta />
    </>
  );
}