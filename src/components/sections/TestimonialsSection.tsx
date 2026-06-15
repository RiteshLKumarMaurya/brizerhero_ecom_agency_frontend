'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Quote, ArrowLeft, ArrowRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { useFeaturedTestimonials } from '@/hooks/useApi';
import { getThumbUrl } from '@/lib/cdn';
import { TestimonialCardSkeleton } from '@/components/common/Skeletons';
import type { TestimonialResponse } from '@/types';

function TestimonialCard({ testimonial }: { testimonial: TestimonialResponse }) {
  return (
    <div className="relative rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col h-full min-w-[320px] md:min-w-[380px] hover:shadow-xl transition-shadow">
      <Quote className="w-8 h-8 text-brand-500/40 mb-4" />
      <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed flex-1 mb-6 line-clamp-4">
        &ldquo;{testimonial.review}&rdquo;
      </p>
      <div className="flex gap-1 mb-4">
        {Array(5).fill(0).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-300 dark:text-zinc-600'}`}
          />
        ))}
      </div>
      <div className="flex items-center gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-brand-100 to-purple-100 dark:from-brand-900/30 dark:to-purple-900/30 flex-shrink-0">
          {testimonial.thumbImage ? (
            <img src={getThumbUrl(testimonial.thumbImage)} alt={testimonial.clientName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-brand-600 font-bold text-sm">
              {testimonial.clientName.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{testimonial.clientName}</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {testimonial.designationType}
            {testimonial.companyName ? ` @ ${testimonial.companyName}` : ''}
          </p>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const { data: testimonials, isLoading } = useFeaturedTestimonials();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: true });

  return (
    <section className="section-padding bg-zinc-50 dark:bg-zinc-950">
      <div className="section-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-semibold tracking-widest text-brand-500 uppercase">Client Love</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">
              What Our Clients Say
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">Real reviews from real businesses.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => emblaApi?.scrollPrev()}
              className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-700 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Previous testimonials"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-700 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Next testimonials"
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
            Read All Reviews <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}