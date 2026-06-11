'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTechnologies } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import { ContactCta } from '@/components/sections/ContactCta';
import type { TechnologyResponse } from '@/types';

function TechCard({ tech, index }: { tech: TechnologyResponse; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 12) * 0.04 }}
      className="group card-hover flex flex-col items-center text-center p-6"
    >
      <div className="w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-brand-500/40 transition-all">
        {tech.iconImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={getOptimizedUrl(tech.iconImage)} alt={tech.name} className="w-7 h-7 object-contain" />
        ) : (
          <div className="w-7 h-7 rounded bg-brand-200 dark:bg-brand-800 font-bold text-brand-700 dark:text-brand-300 text-sm flex items-center justify-center">
            {tech.name.charAt(0)}
          </div>
        )}
      </div>
      <h3 className="font-display font-bold text-zinc-900 dark:text-zinc-100 text-sm mb-1.5 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
        {tech.name}
      </h3>
      {tech.description && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
          {tech.description}
        </p>
      )}
      {tech.links?.length > 0 && (
        <Link
          href={`/technologies/${tech.slug}`}
          className="mt-3 text-xs text-brand-500 font-medium hover:underline inline-flex items-center gap-1"
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
      <section className="pt-32 pb-16 bg-zinc-50 dark:bg-zinc-950">
        <div className="section-container">
          <div className="max-w-2xl">
            <p className="eyebrow">Our Stack</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-zinc-100 mb-5">
              Technologies We <span className="gradient-text">Master</span>
            </h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
              We stay at the frontier of the tools that matter. Battle-tested frameworks, modern runtimes, and the latest AI tooling — chosen for performance, not hype.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {isLoading
              ? Array(24).fill(0).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 p-4 animate-pulse">
                    <div className="skeleton w-14 h-14 rounded-2xl" />
                    <div className="skeleton h-3 w-16 rounded" />
                  </div>
                ))
              : technologies?.map((tech, i) => (
                  <TechCard key={tech.id} tech={tech} index={i} />
                ))
            }
          </div>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
