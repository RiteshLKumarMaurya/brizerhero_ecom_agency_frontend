'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Quote, ArrowLeft, ArrowRight, CheckCircle, TrendingUp } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { useFeaturedTestimonials } from '@/hooks/useApi';
import { getThumbUrl } from '@/lib/cdn';
import { TestimonialCardSkeleton } from '@/components/common/Skeletons';
import { testimonialMetadataMap } from '@/lib/testimonialMetadata';
import type { TestimonialResponse } from '@/types';
import { cn } from '@/lib/utils';

// ─── Premium Testimonial Card ──────────────────────────────────────────
function TestimonialCard({ testimonial }: { testimonial: TestimonialResponse }) {
  const metadata = testimonialMetadataMap[testimonial.clientName] || null;
  const services = metadata?.services || ['Ecommerce Solution'];
  const result = metadata?.result || '';

  return (
    <div className="relative rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-white/20 dark:border-zinc-800/50 p-6 flex flex-col h-full min-w-[320px] md:min-w-[380px] hover:shadow-2xl hover:border-brand-300/50 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <div className="absolute top-6 right-6 opacity-10">
        <Quote className="w-10 h-10 text-brand-500" />
      </div>

      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {Array(5).fill(0).map((_, i) => (
          <Star key={i} className={cn(
            'w-4 h-4',
            i < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-300 dark:text-zinc-600'
          )} />
        ))}
      </div>

      {/* Review */}
      <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed flex-1 mb-6 line-clamp-4">
        “{testimonial.review}”
      </p>

      {/* Services badges */}
      {services.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {services.slice(0, 3).map((s, i) => (
            <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300">
              {s}
            </span>
          ))}
          {services.length > 3 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
              +{services.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Client + Result */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-brand-100 to-purple-100 dark:from-brand-900/30 dark:to-purple-900/30 flex-shrink-0 shadow-sm">
            {testimonial.thumbImage ? (
              <img src={getThumbUrl(testimonial.thumbImage)} alt={testimonial.clientName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-sm">
                {testimonial.clientName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{testimonial.clientName}</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              {testimonial.designationType}{testimonial.companyName && ` · ${testimonial.companyName}`}
            </p>
          </div>
        </div>
        {result && (
          <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" /> {result}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────
export function TestimonialsSection() {
  const { data: testimonials, isLoading } = useFeaturedTestimonials();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: true });

  return (
    <section className="py-20 bg-zinc-950 border-t border-zinc-800">
      <div className="section-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-semibold tracking-widest text-brand-400 uppercase">Client Love</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mt-2">What Our Clients Say</h2>
            <p className="text-zinc-400 mt-1">Real reviews from real businesses.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => emblaApi?.scrollPrev()} className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center hover:bg-white/10 transition-colors text-zinc-400 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button onClick={() => emblaApi?.scrollNext()} className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center hover:bg-white/10 transition-colors text-zinc-400 hover:text-white">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-5">
            {isLoading
              ? Array(4).fill(0).map((_, i) => <TestimonialCardSkeleton key={i} />)
              : testimonials?.map((t) => <TestimonialCard key={t.id} testimonial={t} />)}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/testimonials" className="btn-secondary">
            Read All Reviews <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}