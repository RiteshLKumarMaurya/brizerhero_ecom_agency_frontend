'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTechnologies } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import { TechBadgeSkeleton } from '@/components/common/Skeletons';

export function TechnologiesSection() {
  const { data: technologies, isLoading } = useTechnologies();

  return (
    <section className="section-padding">
      <div className="section-container">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="text-xs font-semibold tracking-widest text-brand-500 uppercase">Tech Stack</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">
            Modern Technologies We Use
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            We choose the right tool for the job — battle‑tested frameworks and cutting‑edge innovations.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {isLoading
            ? Array(18).fill(0).map((_, i) => <TechBadgeSkeleton key={i} />)
            : technologies?.map((tech, i) => (
                <motion.div
                  key={tech.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Link
                    href={`/technologies/${tech.slug}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-brand-500/40 hover:bg-brand-50/50 transition-all group"
                  >
                    {tech.iconImage && (
                      <img src={getOptimizedUrl(tech.iconImage)} alt={tech.name} className="w-5 h-5 object-contain" />
                    )}
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-brand-600">
                      {tech.name}
                    </span>
                  </Link>
                </motion.div>
              ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/technologies" className="btn-secondary">
            View All Technologies <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}