'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTestimonials } from '@/hooks/useApi';
import { getThumbUrl } from '@/lib/cdn';
import { TestimonialCardSkeleton } from '@/components/common/Skeletons';
import { ContactCta } from '@/components/sections/ContactCta';
import type { TestimonialResponse } from '@/types';
import { cn } from '@/lib/utils';

function TestimonialCard({ t, index }: { t: TestimonialResponse; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 9) * 0.06 }}
      className="card-base flex flex-col h-full"
    >
      <Quote className="w-7 h-7 text-brand-500/30 mb-3" />
      <div className="flex gap-1 mb-3">
        {Array(5).fill(0).map((_, i) => (
          <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-200 dark:text-zinc-700'}`} />
        ))}
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed flex-1 mb-5">
        &ldquo;{t.review}&rdquo;
      </p>
      <div className="flex items-center gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-brand-100 dark:bg-brand-900/30 flex-shrink-0">
          {t.thumbImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={getThumbUrl(t.thumbImage)} alt={t.clientName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-brand-600 font-bold text-sm">
              {t.clientName.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{t.clientName}</p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            {t.designationType}{t.companyName ? ` · ${t.companyName}` : ''}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

export function TestimonialsPageClient() {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useTestimonials(page, 9);

  return (
    <>
      <section className="pt-32 pb-16 bg-zinc-50 dark:bg-zinc-950">
        <div className="section-container text-center max-w-2xl mx-auto">
          <p className="eyebrow justify-center">Client Love</p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-zinc-100 mb-5">
            Trusted by <span className="gradient-text">Builders Worldwide</span>
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Don&apos;t take our word for it — here&apos;s what our clients say after we deliver their projects.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? Array(9).fill(0).map((_, i) => <TestimonialCardSkeleton key={i} />)
              : data?.content.map((t, i) => <TestimonialCard key={t.id} t={t} index={i} />)
            }
          </div>

          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={data.first}
                className={cn('btn-secondary p-2.5', data.first && 'opacity-40 cursor-not-allowed')}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-zinc-500">Page {data.number + 1} of {data.totalPages}</span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={data.last}
                className={cn('btn-secondary p-2.5', data.last && 'opacity-40 cursor-not-allowed')}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      <ContactCta />
    </>
  );
}
