'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Quote, ChevronLeft, ChevronRight, Sparkles, X, ExternalLink,
  Image as ImageIcon, User, Briefcase, Calendar
} from 'lucide-react';
import { useTestimonials } from '@/hooks/useApi';
import { getOptimizedUrl, getThumbUrl } from '@/lib/cdn';
import { TestimonialCardSkeleton } from '@/components/common/Skeletons';
import { ContactCta } from '@/components/sections/ContactCta';
import type { TestimonialResponse } from '@/types';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// Testimonial Card (now clickable)
function TestimonialCard({
  t,
  index,
  onClick,
}: {
  t: TestimonialResponse;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 9) * 0.05, duration: 0.4 }}
      onClick={onClick}
      className="group relative rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    >
      {/* Decorative quote background */}
      <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
        <Quote className="w-12 h-12 text-brand-500" />
      </div>

      {/* Rating stars */}
      <div className="flex gap-1 mb-4">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <Star
              key={i}
              className={cn(
                'w-4 h-4 transition-all',
                i < t.rating
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-zinc-200 dark:text-zinc-700'
              )}
            />
          ))}
      </div>

      {/* Review text (truncated) */}
      <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-6 line-clamp-4">
        &ldquo;{t.review}&rdquo;
      </p>

      {/* Client info */}
      <div className="flex items-center gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-brand-100 to-purple-100 dark:from-brand-900/30 dark:to-purple-900/30 flex-shrink-0 shadow-sm">
          {t.thumbImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={getThumbUrl(t.thumbImage)}
              alt={t.clientName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-sm">
              {t.clientName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {t.clientName}
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            {t.designationType}
            {t.companyName ? ` · ${t.companyName}` : ''}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

// Modal Component for full testimonial details
function TestimonialModal({
  testimonial,
  onClose,
}: {
  testimonial: TestimonialResponse;
  onClose: () => void;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const bannerImages = testimonial.bannerImages?.sort((a, b) => a.displayOrder - b.displayOrder) || [];

  const nextImage = () => {
    if (bannerImages.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % bannerImages.length);
  };
  const prevImage = () => {
    if (bannerImages.length === 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 md:p-8">
            {/* Header: Client & Rating */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-brand-100 to-purple-100 dark:from-brand-900/30 dark:to-purple-900/30 shadow-md">
                  {testimonial.thumbImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={getThumbUrl(testimonial.thumbImage)}
                      alt={testimonial.clientName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-600 font-bold text-2xl">
                      {testimonial.clientName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    {testimonial.clientName}
                  </h2>
                  <p className="text-zinc-500 dark:text-zinc-400">
                    {testimonial.designationType}
                    {testimonial.companyName && ` @ ${testimonial.companyName}`}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-5 h-5',
                        i < testimonial.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-zinc-300 dark:text-zinc-600'
                      )}
                    />
                  ))}
              </div>
            </div>

            {/* Full review text */}
            <div className="mb-8">
              <Quote className="w-8 h-8 text-brand-500/30 mb-2" />
              <p className="text-base md:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {testimonial.review}
              </p>
            </div>

            {/* Banner Images (carousel) */}
            {bannerImages.length > 0 && (
              <div className="mb-8">
                <h3 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-brand-500" />
                  Project Gallery
                </h3>
                <div className="relative rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <div className="aspect-video relative">
                    {bannerImages[currentImageIndex]?.media?.optimizedKey && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={getOptimizedUrl(bannerImages[currentImageIndex].media)}
                        alt={`Project image ${currentImageIndex + 1}`}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                  {bannerImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {bannerImages.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={cn(
                              'w-2 h-2 rounded-full transition-all',
                              idx === currentImageIndex
                                ? 'bg-white w-4'
                                : 'bg-white/50'
                            )}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* External Links */}
            {testimonial.links && testimonial.links.length > 0 && (
              <div className="mb-6">
                <h3 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-brand-500" />
                  Related Links
                </h3>
                <div className="flex flex-wrap gap-3">
                  {testimonial.links.map((item) => (
                    <a
                      key={item.id}
                      href={item.link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium hover:border-brand-500/40 hover:text-brand-600 transition"
                    >
                      {item.link.name || 'Visit'}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Meta info (dates) */}
            <div className="text-xs text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-4 flex justify-between">
              <span>Client ID: {testimonial.clientId}</span>
              {testimonial.createdAt && (
                <span>Reviewed: {new Date(testimonial.createdAt).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function TestimonialsPageClient() {
  const [page, setPage] = useState(0);
  const [selectedTestimonial, setSelectedTestimonial] = useState<TestimonialResponse | null>(null);
  const { data, isLoading } = useTestimonials(page, 9);

  return (
    <>
      {/* Hero Section (unchanged) */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="section-container text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="eyebrow justify-center">Client Love</span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-zinc-100 mb-5">
              Trusted by{' '}
              <span className="bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
                Builders Worldwide
              </span>
            </h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Don't take our word for it — here's what our clients say after we deliver their projects.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Trust Badge */}
      <div className="flex justify-center pb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          100% Real Reviews · 4.9+ Average Rating
        </div>
      </div>

      {/* Testimonials Grid */}
      <section className="section-padding pt-0">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? Array(9)
                  .fill(0)
                  .map((_, i) => <TestimonialCardSkeleton key={i} />)
              : data?.content.map((t, i) => (
                  <TestimonialCard
                    key={t.id}
                    t={t}
                    index={i}
                    onClick={() => setSelectedTestimonial(t)}
                  />
                ))}
          </div>

          {/* Pagination (unchanged) */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={data.first}
                className={cn(
                  'btn-secondary p-2.5 rounded-full transition-all',
                  data.first && 'opacity-40 cursor-not-allowed'
                )}
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Page {data.number + 1} of {data.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={data.last}
                className={cn(
                  'btn-secondary p-2.5 rounded-full transition-all',
                  data.last && 'opacity-40 cursor-not-allowed'
                )}
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      <ContactCta />

      {/* Modal */}
      <AnimatePresence>
        {selectedTestimonial && (
          <TestimonialModal
            testimonial={selectedTestimonial}
            onClose={() => setSelectedTestimonial(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}