// app/packages/[slug]/PackageDetailClient.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, ArrowRight, Zap, Clock, Package, Users, Settings, Shield, Star } from 'lucide-react';
import { usePackage } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import { formatPrice } from '@/lib/utils';
import { ContactCta } from '@/components/sections/ContactCta';

interface Props { slug: string; }

// ─── Static benefits (can be moved to API later) ───────────────────────
const benefits = [
  { icon: Clock, text: '30‑day delivery (typical)' },
  { icon: Users, text: 'Dedicated project manager' },
  { icon: Settings, text: '3 months free support' },
  { icon: Shield, text: '100% money‑back guarantee' },
];

export function PackageDetailClient({ slug }: Props) {
  const { data: pkg, isLoading, error } = usePackage(slug);

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="min-h-screen pt-32">
        <div className="section-container space-y-6 animate-pulse">
          <div className="skeleton h-8 w-32" />
          <div className="skeleton h-14 w-2/3" />
          <div className="skeleton h-6 w-1/2" />
          <div className="skeleton h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error || !pkg) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold mb-3">Package Not Found</h1>
          <p className="text-zinc-500 mb-6">The package you're looking for doesn't exist or was removed.</p>
          <Link href="/packages" className="btn-primary">Back to Packages</Link>
        </div>
      </div>
    );
  }

  const iconSrc = pkg.iconImage ? getOptimizedUrl(pkg.iconImage) : null;
  const services = pkg.services || [];

  return (
    <>
      {/* ─── Hero Section ────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-16 bg-white dark:bg-zinc-900 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        <div className="section-container">
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-brand-500 mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to Packages
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* ─── Left: Content ────────────────────────────────────────── */}
            <div>
              {/* Thumbnail Banner */}
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-xl mb-6 bg-gradient-to-br from-brand-600 to-purple-600">
                {iconSrc ? (
                  <Image
                    src={iconSrc}
                    alt={pkg.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-16 h-16 text-white/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>

              {/* Title & Price */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/30 flex items-center justify-center flex-shrink-0">
                  {iconSrc ? (
                    <Image
                      src={iconSrc}
                      alt={pkg.name}
                      width={32}
                      height={32}
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    <Zap className="w-7 h-7 text-brand-600 dark:text-brand-400" />
                  )}
                </div>
                {pkg.featured && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold">
                    <Star className="w-3 h-3 fill-current" /> Most Popular
                  </span>
                )}
              </div>

              <h1 className="font-display text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                {pkg.name}
              </h1>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="font-display text-3xl font-bold text-brand-600 dark:text-brand-400">
                  {formatPrice(pkg.price, pkg.currencyCode)}
                </span>
                <span className="text-zinc-500">one‑time payment</span>
              </div>

              <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                {pkg.shortDescription}
              </p>

              {/* Benefits row */}
              <div className="flex flex-wrap gap-4">
                {benefits.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <Icon className="w-4 h-4 text-brand-500" />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* ─── Right: CTA Card ──────────────────────────────────────── */}
            <div className="lg:sticky lg:top-24">
              <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl p-6 space-y-5">
                <div className="text-center border-b border-zinc-100 dark:border-zinc-800 pb-4">
                  <p className="font-display text-3xl font-bold text-brand-600 dark:text-brand-400">
                    {formatPrice(pkg.price, pkg.currencyCode)}
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">Fixed price · No hidden fees</p>
                </div>
                <Link
                  href="/contact"
                  className="btn-primary w-full justify-center py-3.5 text-base shadow-md"
                >
                  Get Started Now <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="btn-secondary w-full justify-center"
                >
                  Book Free Consultation
                </Link>
                <p className="text-xs text-center text-zinc-400">
                  Free 30‑min discovery call. No obligation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Long Description ───────────────────────────────────────────── */}
      {pkg.longDescription && (
        <section className="section-padding">
          <div className="section-container max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
                What's Included
              </h2>
              <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 text-base leading-relaxed space-y-4">
                {pkg.longDescription.split('\n').filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── Services Included ──────────────────────────────────────────── */}
      {services.length > 0 && (
        <section className="section-padding bg-zinc-50 dark:bg-zinc-950">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto mb-10"
            >
              <span className="eyebrow justify-center">Services</span>
              <h2 className="font-display text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                Everything You Need
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 mt-2">
                All services listed below are included in this package
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {services
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((mapping, idx) => (
                  <motion.div
                    key={mapping.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="group flex gap-4 p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:shadow-md hover:border-brand-200 dark:hover:border-brand-800 transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-950/30 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <Check className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base">
                        {mapping.serviceResponse?.name}
                      </h3>
                      {mapping.serviceResponse?.shortDescription && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                          {mapping.serviceResponse.shortDescription}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Final CTA ──────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="section-container text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
              Ready to build your {pkg.name}?
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-8">
              Let's discuss your requirements and get started within 48 hours.
            </p>
            <Link href="/contact" className="btn-primary px-8 py-4 text-base shadow-lg">
              Book Free Consultation <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <ContactCta />
    </>
  );
}