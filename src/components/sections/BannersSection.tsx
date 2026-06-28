'use client';

import { useBanners, useProjects, useServices, usePackages, useTestimonials, useTechnologies } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { BannerResponse } from '@/types';

// ─── Helper: get full‑resolution image URL ──────────────────
function getOriginalUrl(key: string): string {
  const base = process.env.NEXT_PUBLIC_CDN_URL || '';
  return key.startsWith('http') ? key : `${base}/${key}`;
}

// ─── Slug helpers ────────────────────────────────────────────────

function buildSlugMap<T extends { id: number; slug?: string | null }>(
  items: T[] | undefined
): Map<number, string> {
  const map = new Map<number, string>();
  if (!items) return map;
  for (const item of items) {
    if (item.slug) map.set(item.id, item.slug);
  }
  return map;
}

function buildSlugMapFromContent<T extends { id: number; slug?: string | null }>(
  paginated: { content?: T[] } | undefined
): Map<number, string> {
  return buildSlugMap(paginated?.content);
}

function getBannerHref(
  banner: BannerResponse,
  slugMaps: {
    projects: Map<number, string>;
    services: Map<number, string>;
    packages: Map<number, string>;
    testimonials: Map<number, string>;
    technologies: Map<number, string>;
  }
): string {
  const { type, referenceId, redirectUrl } = banner;
  if (type === 'URL') return redirectUrl || '#';
  if (!referenceId) return '#';

  const slugMap = {
    PROJECT: slugMaps.projects,
    SERVICE: slugMaps.services,
    PACKAGE: slugMaps.packages,
    TESTIMONIAL: slugMaps.testimonials,
    TECHNOLOGY: slugMaps.technologies,
  }[type];
  const slug = slugMap?.get(referenceId);
  return slug ? `/${type.toLowerCase()}s/${slug}` : '#';
}

function isExternalLink(banner: BannerResponse): boolean {
  return banner.type === 'URL';
}

// ─── Component ──────────────────────────────────────────────────

export function BannersSection() {
  const { data: banners } = useBanners();
  const { data: projects } = useProjects(0, 1000);
  const { data: services } = useServices();
  const { data: packages } = usePackages();
  const { data: testimonials } = useTestimonials(0, 1000);
  const { data: technologies } = useTechnologies();

  const slugMaps = useMemo(
    () => ({
      projects: buildSlugMapFromContent(projects),
      services: buildSlugMap(services),
      packages: buildSlugMap(packages),
      testimonials: buildSlugMapFromContent(testimonials),
      technologies: buildSlugMap(technologies),
    }),
    [projects, services, packages, testimonials, technologies]
  );

  const [current, setCurrent] = useState(0);

  const active = (banners ?? [])
    .filter((b) => b.active)
    .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));

  useEffect(() => {
    if (active.length <= 1) return;
    const t = setInterval(() => setCurrent((c) => (c + 1) % active.length), 5000);
    return () => clearInterval(t);
  }, [active.length]);

  if (!active.length) return null;

  const banner = active[current];
  const href = getBannerHref(banner, slugMaps);
  const isExternal = isExternalLink(banner);
  const target = isExternal ? '_blank' : undefined;
  const rel = isExternal ? 'noopener noreferrer' : undefined;

  // ✅ Use originalKey without TypeScript errors
  const imageUrl = banner.bannerImage?.originalKey
    ? getOriginalUrl(banner.bannerImage.originalKey)
    : null;

  return (
    <section className="relative w-full overflow-hidden bg-surface py-6 md:py-10">
      <div className="section-container">
        {/* ─── Card shell — this is what actually gives it rounded corners.
            Previously `shadow-2xl` sat on a div with no radius and no
            overflow-hidden, so the image's hard square edges always showed
            through regardless of the shadow. Border + radius + clip now
            live on the same element as the shadow. ─── */}
        <div
          className="
            relative w-full mx-auto
            rounded-2xl md:rounded-3xl
            overflow-hidden
            border border-default
            shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)]
            dark:shadow-[0_20px_60px_-12px_rgba(0,0,0,0.55)]
          "
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.7, ease: 'easeInOut' }}
              /* Progressive aspect ratio: tall enough on mobile that text and
                 image both breathe, wide and cinematic on desktop. */
              className="relative w-full aspect-[16/10] sm:aspect-[16/7] md:aspect-[18/7] lg:aspect-[21/7]"
            >
              <Link href={href} target={target} rel={rel} className="block w-full h-full">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={banner.heading || `Banner ${banner.id}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-card)]" />
                )}

                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex items-center justify-start px-6 md:px-12 lg:px-20">
                  <div className="max-w-2xl text-white space-y-4">
                    {banner.heading && (
                      <motion.h2
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display font-bold leading-tight drop-shadow-2xl"
                      >
                        {banner.heading}
                      </motion.h2>
                    )}
                    {banner.subHeading && (
                      <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 drop-shadow-lg max-w-xl"
                      >
                        {banner.subHeading}
                      </motion.p>
                    )}
                    {banner.cta && (
                      <motion.span
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="inline-block mt-2 px-6 py-3 md:px-8 md:py-4 bg-white text-zinc-900 font-semibold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
                      >
                        {banner.cta}
                      </motion.span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Navigation controls — inset a touch further so they sit cleanly
              inside the rounded card instead of bleeding past the corner. */}
          {active.length > 1 && (
            <>
              <button
                onClick={() => setCurrent((c) => (c - 1 + active.length) % active.length)}
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 z-20 shadow-lg"
                aria-label="Previous banner"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={() => setCurrent((c) => (c + 1) % active.length)}
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 z-20 shadow-lg"
                aria-label="Next banner"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {active.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === current
                        ? 'w-8 bg-white shadow-lg'
                        : 'w-2 bg-white/40 hover:bg-white/60'
                    }`}
                    aria-label={`Go to banner ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}