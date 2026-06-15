'use client';

import { useBanners } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function BannersSection() {
  const { data: banners } = useBanners();
  const [current, setCurrent] = useState(0);

  const active = (banners ?? [])
    .filter((b) => b.active)
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

  useEffect(() => {
    if (active.length <= 1) return;
    const t = setInterval(() => setCurrent((c) => (c + 1) % active.length), 5000);
    return () => clearInterval(t);
  }, [active.length]);

  if (!active.length) return null;

  const banner = active[current];

  return (
    <section className="relative overflow-hidden bg-zinc-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={banner.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full"
        >
          {banner.bannerImage ? (
            <Link href={banner.redirectUrl || '#'} target={banner.redirectUrl ? '_blank' : undefined}>
              <img
                src={getOptimizedUrl(banner.bannerImage)}
                alt={`Banner ${banner.id}`}
                className="w-full max-h-[480px] object-cover"
              />
            </Link>
          ) : null}
        </motion.div>
      </AnimatePresence>

      {active.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((c) => (c - 1 + active.length) % active.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
            aria-label="Previous banner"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrent((c) => (c + 1) % active.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
            aria-label="Next banner"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {active.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white w-6' : 'bg-white/40'}`}
                aria-label={`Go to banner ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}