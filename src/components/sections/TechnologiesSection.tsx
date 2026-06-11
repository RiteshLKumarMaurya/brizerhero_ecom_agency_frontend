'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTechnologies } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import { SectionHeader } from '@/components/common/SectionHeader';
import { TechBadgeSkeleton } from '@/components/common/Skeletons';

export function TechnologiesSection() {
  const { data: technologies, isLoading } = useTechnologies();

  return (
    <section className="section-padding">
      <div className="section-container">
        <SectionHeader
          eyebrow="Tech Stack"
          title="Modern Technologies We Use"
          subtitle="We choose the right tool for the job — battle-tested frameworks and cutting-edge innovations."
          centered
        />

        <div className="mt-12 flex flex-wrap justify-center gap-3">
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
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-brand-500/40 hover:bg-brand-50/50 dark:hover:bg-brand-950/20 transition-all duration-200 group"
                  >
                    {tech.iconImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={getOptimizedUrl(tech.iconImage)} alt={tech.name} className="w-5 h-5 object-contain" />
                    )}
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {tech.name}
                    </span>
                  </Link>
                </motion.div>
              ))
          }
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
