'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Quote, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { useFeaturedTestimonials } from '@/hooks/useApi';
import { getThumbUrl } from '@/lib/cdn';
import { TestimonialCardSkeleton } from '@/components/common/Skeletons';
import { testimonialMetadataMap } from '@/lib/testimonialMetadata';
import type { TestimonialResponse } from '@/types';
import { cn } from '@/lib/utils';

// ─── Testimonial Card — trust first, sales later ───────────────────────────
function TestimonialCard({ testimonial }: { testimonial: TestimonialResponse }) {
  const metadata = testimonialMetadataMap[testimonial.clientName] ?? null;
  const services = metadata?.services ?? [];
  const result = metadata?.result ?? '';
  const industry = metadata?.industry ?? '';
  const location = metadata?.location ?? '';

  return (
    <div
      className={cn(
        'group relative flex flex-col h-full min-w-[300px] md:min-w-[380px] p-7 rounded-2xl',
        'bg-white/90 dark:bg-zinc-900/80 backdrop-blur-sm',
        'border border-zinc-200/70 dark:border-zinc-800/70',
        'shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)]',
        'hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.45)]',
        'hover:border-zinc-300/80 dark:hover:border-zinc-700/80 hover:-translate-y-1',
        'transition-all duration-300'
      )}
    >
      {/* Subtle quotation mark — decorative only, never the focal point */}
      <div className="absolute top-5 right-5 opacity-5 pointer-events-none" aria-hidden="true">
        <Quote className="w-7 h-7 text-zinc-900 dark:text-white" />
      </div>

      {/* Rating — a quiet, supporting cue, not the headline */}
      <div className="flex gap-0.5 mb-5" aria-label={`Rated ${testimonial.rating} out of 5 stars`}>
        {Array(5).fill(0).map((_, i) => (
          <Star
            key={i}
            className={cn(
              'w-3.5 h-3.5',
              i < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-300 dark:text-zinc-700'
            )}
          />
        ))}
      </div>

      {/* The quote is the headline of this card, not the stars */}
      <p className="font-display text-[1.05rem] sm:text-lg leading-relaxed text-zinc-800 dark:text-zinc-50 flex-1 mb-6 line-clamp-5">
        “{testimonial.review}”
      </p>

      {/* What we actually helped with */}
      {services.length > 0 && (
        <div className="mb-5">
          <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-zinc-400 dark:text-zinc-500 mb-2.5">
            What We Helped With
          </p>
          <div className="flex flex-wrap gap-1.5">
            {services.slice(0, 4).map((s, i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300"
              >
                {s}
              </span>
            ))}
            {services.length > 4 && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/60 text-zinc-400">
                +{services.length - 4}
              </span>
            )}
          </div>
        </div>
      )}

      {/* One honest, observable change — the trust signal, with no invented numbers */}
      {result && (
        <div className="flex items-start gap-2 mb-6 text-sm text-zinc-600 dark:text-zinc-400">
          <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
          <span>{result}</span>
        </div>
      )}

      {/* Owner, store, business type, location */}
      <div className="pt-5 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 flex-shrink-0 ring-1 ring-zinc-200/80 dark:ring-zinc-700/80">
          {testimonial.thumbImage ? (
            <img
              src={getThumbUrl(testimonial.thumbImage)}
              alt={testimonial.clientName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-500 dark:text-zinc-400 font-semibold text-sm">
              {testimonial.clientName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
            {testimonial.clientName}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-500 truncate">
            {testimonial.designationType}
            {testimonial.companyName && ` · ${testimonial.companyName}`}
          </p>
          {(industry || location) && (
            <p className="text-[11px] text-zinc-400 dark:text-zinc-600 mt-0.5 truncate flex items-center gap-1">
              {industry && (
                <span className="inline-flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-current opacity-60" />
                  {industry}
                </span>
              )}
              {industry && location && '·'}
              {location}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export function TestimonialsSection() {
  const { data: testimonials, isLoading } = useFeaturedTestimonials();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: true });

  return (
    <section className="py-20 bg-surface border-t border-default">
      <div className="section-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-muted">
              Trusted By Grocery Businesses
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mt-3 leading-tight tracking-tight">
              Conversations With Store Owners,{' '}
              <span className="text-secondary font-light italic">Not Case Studies</span>
            </h2>
            <p className="text-secondary mt-3 leading-relaxed">
              Every quote here comes from someone we've actually worked with —
              about the systems we built and the problems they solved.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={() => emblaApi?.scrollPrev()}
              aria-label="Previous testimonial"
              className="w-10 h-10 rounded-full border border-default flex items-center justify-center hover:bg-[var(--color-card-hover)] hover:border-[var(--color-border-glow)] transition-colors text-muted hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              aria-label="Next testimonial"
              className="w-10 h-10 rounded-full border border-default flex items-center justify-center hover:bg-[var(--color-card-hover)] hover:border-[var(--color-border-glow)] transition-colors text-muted hover:text-primary"
            >
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
            Hear From More Store Owners <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}