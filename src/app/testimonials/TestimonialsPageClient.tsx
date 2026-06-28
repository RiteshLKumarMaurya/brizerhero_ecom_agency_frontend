'use client';

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
  ExternalLink,
  Image as ImageIcon,
  User,
  Briefcase,
  Calendar,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  ShoppingBag,
  Smartphone,
  LayoutDashboard,
  Zap,
  Award,
  Users,
  Clock,
  Shield,
} from 'lucide-react';
import { useTestimonials } from '@/hooks/useApi';
import { getOptimizedUrl, getThumbUrl } from '@/lib/cdn';
import { TestimonialCardSkeleton } from '@/components/common/Skeletons';
import { ContactCta } from '@/components/sections/ContactCta';
import { TestimonialMetadata, testimonialMetadataMap } from '@/lib/testimonialMetadata';
type TestimonialMetadataWithProjectType = TestimonialMetadata & {
  projectType?: string;
};
import type { TestimonialResponse } from '@/types';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

// ─── Featured Success Story Card ──────────────────────────────────────
function FeaturedStory({
  testimonial,
  metadata,
}: {
  testimonial: TestimonialResponse;
  metadata: TestimonialMetadataWithProjectType | null;
}) {
  const services = metadata?.services || ['Ecommerce Solution'];
  const result = metadata?.result || 'Business Growth';
  const hasBanner = testimonial.bannerImages && testimonial.bannerImages.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl hover:shadow-2xl transition-all group"
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-purple-500/5 pointer-events-none" />

      <div className="grid md:grid-cols-2 gap-6 p-6">
        {/* Left: Client info & review */}
        <div className="flex flex-col">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-brand-100 to-purple-100 dark:from-brand-900/30 dark:to-purple-900/30 shadow-md flex-shrink-0">
              {testimonial.thumbImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={getThumbUrl(testimonial.thumbImage)}
                  alt={testimonial.clientName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-xl">
                  {testimonial.clientName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-zinc-100">
                {testimonial.clientName}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {testimonial.designationType}
                {testimonial.companyName && ` · ${testimonial.companyName}`}
              </p>
              {metadata?.industry && (
                <span className="text-xs text-brand-600 dark:text-brand-400 font-medium">
                  {metadata.industry}
                </span>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="flex gap-1 mb-3">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'w-4 h-4',
                    i < testimonial.rating
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-zinc-300 dark:text-zinc-600'
                  )}
                />
              ))}
          </div>

          {/* Review excerpt */}
          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4 line-clamp-3">
            “{testimonial.review}”
          </p>

          {/* Services delivered */}
          <div className="mb-3">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Services Delivered
            </p>
            <div className="flex flex-wrap gap-1.5">
              {services.slice(0, 4).map((service: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, idx: Key | null | undefined) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300"
                >
                  <CheckCircle className="w-3 h-3" />
                  {service}
                </span>
              ))}
              {services.length > 4 && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                  +{services.length - 4}
                </span>
              )}
            </div>
          </div>

          {/* Result badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium self-start border border-emerald-200 dark:border-emerald-800">
            <TrendingUp className="w-3.5 h-3.5" />
            {result}
          </div>
        </div>

        {/* Right: Image / Gallery */}
        <div className="relative rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 min-h-[180px]">
          {hasBanner ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={getOptimizedUrl(testimonial.bannerImages[0].media)}
              alt={`${testimonial.clientName} project`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-400">
              <ImageIcon className="w-12 h-12 opacity-30" />
            </div>
          )}
          {metadata?.projectType && (
            <span className="absolute bottom-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full bg-black/60 text-white backdrop-blur-sm">
              {metadata.projectType}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Testimonial Card (redesigned) ──────────────────────────────────────
function TestimonialCard({
  t,
  index,
  onClick,
}: {
  t: TestimonialResponse;
  index: number;
  onClick: () => void;
}) {
  const metadata = testimonialMetadataMap[t.clientName] || null;
  const services = metadata?.services || ['Ecommerce Solution'];
  const result = metadata?.result || '';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 9) * 0.05, duration: 0.4 }}
      onClick={onClick}
      className="group relative rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-white/20 dark:border-zinc-800/50 p-6 hover:shadow-2xl hover:border-brand-300/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    >
      {/* Glassmorphism glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Decorative quote */}
      <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
        <Quote className="w-10 h-10 text-brand-500" />
      </div>

      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <Star
              key={i}
              className={cn(
                'w-4 h-4',
                i < t.rating
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-zinc-200 dark:text-zinc-700'
              )}
            />
          ))}
      </div>

      {/* Review */}
      <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-6 line-clamp-4">
        “{t.review}”
      </p>

      {/* Delivered Services (badges) */}
      {services.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {services.slice(0, 3).map((s, i) => (
            <span
              key={i}
              className="text-xs px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300"
            >
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

      {/* Client info + result */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-3">
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
              {t.companyName && ` · ${t.companyName}`}
            </p>
          </div>
        </div>
        {result && (
          <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            {result}
          </div>
        )}
      </div>

      {/* View Full Story CTA */}
      <div className="mt-4 text-xs font-semibold text-brand-600 dark:text-brand-400 group-hover:gap-2 transition-all inline-flex items-center gap-1">
        View Full Story <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </motion.article>
  );
}

// ─── Modal (updated with metadata) ──────────────────────────────────────
function TestimonialModal({
  testimonial,
  onClose,
}: {
  testimonial: TestimonialResponse;
  onClose: () => void;
}) {
  const metadata = testimonialMetadataMap[testimonial.clientName] || null;
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
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 md:p-8">
            {/* Client header */}
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
                  {metadata?.industry && (
                    <span className="text-xs text-brand-600 dark:text-brand-400 font-medium">
                      {metadata.industry}
                    </span>
                  )}
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

            {/* Review */}
            <div className="mb-6">
              <Quote className="w-8 h-8 text-brand-500/30 mb-2" />
              <p className="text-base md:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {testimonial.review}
              </p>
            </div>

            {/* Services & Result */}
            {metadata && (
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-2">
                    Services Delivered
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {metadata.services.map((s, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-2">
                    Business Result
                  </p>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium border border-emerald-200 dark:border-emerald-800">
                    <TrendingUp className="w-4 h-4" />
                    {metadata.result}
                  </div>
                </div>
              </div>
            )}

            {/* Banner Images */}
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

            {/* Meta */}
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

// ─── Trust Wall (Static) ──────────────────────────────────────────────
function TrustWall() {
  const industries = [
    'Fashion Retail',
    'Food Delivery',
    'D2C Brands',
    'Wholesale',
    'Electronics',
    'Health & Beauty',
  ];
  const logos = [
    { name: 'Shopify', icon: <ShoppingBag className="w-8 h-8" /> },
    { name: 'WooCommerce', icon: <ShoppingBag className="w-8 h-8" /> },
    { name: 'Magento', icon: <ShoppingBag className="w-8 h-8" /> },
    { name: 'BigCommerce', icon: <ShoppingBag className="w-8 h-8" /> },
  ];

  return (
    <section className="py-16 bg-zinc-50 dark:bg-zinc-950">
      <div className="section-container">
        <div className="text-center mb-10">
          <span className="eyebrow justify-center">Trusted By</span>
          <h2 className="font-display text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Brands & Industries We Serve
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {industries.map((industry) => (
            <span
              key={industry}
              className="px-4 py-2 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-300 shadow-sm"
            >
              {industry}
            </span>
          ))}
        </div>
        {/* Placeholder for client logos – can be replaced with actual images */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 opacity-50 grayscale">
          {logos.map((logo, i) => (
            <div
              key={i}
              className="flex items-center justify-center p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800"
            >
              {logo.icon}
              <span className="ml-2 text-sm text-zinc-500">{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Video Testimonials (Placeholder) ──────────────────────────────────
function VideoTestimonials() {
  return (
    <section className="py-16 bg-white dark:bg-zinc-900">
      <div className="section-container">
        <div className="text-center mb-10">
          <span className="eyebrow justify-center">Video Stories</span>
          <h2 className="font-display text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            See Our Clients in Action
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Real stories from real business owners. (Coming soon)
          </p>
        </div>
        <div className="relative max-w-3xl mx-auto rounded-2xl overflow-hidden bg-gradient-to-br from-brand-900/20 to-purple-900/20 border border-zinc-200 dark:border-zinc-800 aspect-video flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-brand-600/20 flex items-center justify-center mx-auto mb-4">
              <div className="w-16 h-16 rounded-full bg-brand-600 flex items-center justify-center shadow-lg">
                <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1" />
              </div>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Video testimonials coming soon.
              <br />
              <span className="text-xs">Submit your video story to be featured.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Success Metrics ──────────────────────────────────────────────────
function SuccessMetrics() {
  const metrics = [
    { icon: Award, label: 'Ecommerce Features Delivered', value: '100+' },
    { icon: Clock, label: 'Development Hours', value: '100+' },
    { icon: Smartphone, label: 'Platforms Supported', value: 'Multiple' },
    { icon: Shield, label: 'End-to-End Solutions', value: '100%' },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-brand-50 to-purple-50 dark:from-brand-950/20 dark:to-purple-950/20">
      <div className="section-container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {metrics.map((metric, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center p-6 rounded-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-white/20 dark:border-zinc-800/50 shadow-sm"
            >
              <metric.icon className="w-8 h-8 text-brand-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {metric.value}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {metric.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ──────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-brand-600 to-purple-600">
      <div className="section-container text-center max-w-2xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
          Ready To Launch Your Ecommerce Business?
        </h2>
        <p className="text-brand-100 text-lg mb-8">
          Let's build your ecommerce ecosystem together.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-brand-600 px-8 py-3.5 rounded-xl font-semibold hover:shadow-lg transition-all group"
          >
            Get Free Consultation <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all"
          >
            Request Custom Quote
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────
export function TestimonialsPageClient() {
  const [page, setPage] = useState(0);
  const [selectedTestimonial, setSelectedTestimonial] = useState<TestimonialResponse | null>(null);
  const { data, isLoading } = useTestimonials(page, 9);

  // Filter featured testimonials (first 2 or those with metadata)
  const featuredTestimonials = data?.content?.slice(0, 2) || [];

  return (
    <>
      {/* ─── Hero Section ────────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-16 overflow-hidden bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-brand-500/10 to-transparent pointer-events-none" />

        <div className="section-container text-center max-w-3xl mx-auto relative">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="eyebrow justify-center"
          >
            Client Success Stories
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-zinc-100 mt-2 mb-5"
          >
            Trusted By{' '}
            <span className="bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
              Growing Ecommerce Businesses
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed"
          >
            Real feedback from business owners who trusted BrizerHero to build their ecommerce ecosystem.
          </motion.p>

          {/* Premium Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mt-8"
          >
            <div className="text-center p-3 rounded-xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-white/20 dark:border-zinc-800/50">
              <div className="flex justify-center gap-0.5 text-amber-400">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              <p className="text-sm font-bold text-zinc-900 dark:text-white">4.9 Average Rating</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-white/20 dark:border-zinc-800/50">
              <p className="text-xl font-bold text-brand-600">5+</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Projects Delivered</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-white/20 dark:border-zinc-800/50">
              <p className="text-xl font-bold text-brand-600">98%</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Client Satisfaction</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-white/20 dark:border-zinc-800/50">
              <p className="text-xl font-bold text-brand-600">100%</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Custom Ecommerce Solutions</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Trust Badge ────────────────────────────────────────────────── */}
      <div className="flex justify-center pb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          100% Real Reviews · 4.9+ Average Rating
        </div>
      </div>

      {/* ─── Featured Success Stories ───────────────────────────────────── */}
      {!isLoading && featuredTestimonials.length > 0 && (
        <section className="section-padding pt-0">
          <div className="section-container">
            <div className="text-center mb-8">
              <span className="eyebrow justify-center">Featured Stories</span>
              <h2 className="font-display text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                Success Stories
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredTestimonials.map((t) => {
                const metadata = testimonialMetadataMap[t.clientName] || null;
                return <FeaturedStory key={t.id} testimonial={t} metadata={metadata} />;
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── Testimonials Grid ──────────────────────────────────────────── */}
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

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={data.first}
                className={cn(
                  'btn-secondary p-2.5 rounded-full transition-all',
                  data.first && 'opacity-40 cursor-not-allowed'
                )}
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
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ─── Trust Wall ──────────────────────────────────────────────────── */}
      {/* <TrustWall /> */}

      {/* ─── Video Testimonials ──────────────────────────────────────────── */}
      {/* <VideoTestimonials /> */}

      {/* ─── Success Metrics ─────────────────────────────────────────────── */}
      {/* <SuccessMetrics /> */}

      {/* ─── Final CTA ──────────────────────────────────────────────────── */}
      <ContactCta />

      {/* ─── Modal ────────────────────────────────────────────────────────── */}
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