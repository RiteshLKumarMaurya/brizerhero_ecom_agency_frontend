'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowLeft, ExternalLink, CheckCircle2, ArrowRight, 
  Sparkles, Clock, Shield, Zap, Award, ChevronRight 
} from 'lucide-react';
import { useService } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import { ContactCta } from '@/components/sections/ContactCta';
import type { ServiceResponse, ServiceFeatureResponse, ServiceTechnologyResponse } from '@/types';
import { useState } from 'react';

interface Props { 
  slug: string;
}

// ─── Animations ────────────────────────────────────────────────────────────
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

// ─── Component ────────────────────────────────────────────────────────────
export function ServiceDetailClient({ slug }: Props) {
  // ✅ ALL HOOKS – unconditionally, in the same order every render
  const { data: service, isLoading, error, refetch } = useService(slug);
  const { scrollYProgress } = useScroll();
  const width = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const [iconError, setIconError] = useState(false);

  // ── Early returns (safe – hooks already called) ──
  if (isLoading) {
    return (
      <div className="min-h-screen pt-32">
        <div className="section-container">
          <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
            <div className="skeleton h-8 w-32 rounded-full" />
            <div className="skeleton h-14 w-2/3 rounded-xl" />
            <div className="skeleton h-6 w-full rounded-lg" />
            <div className="skeleton h-6 w-5/6 rounded-lg" />
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="space-y-4">
                <div className="skeleton h-8 w-40 rounded-lg" />
                <div className="skeleton h-20 w-full rounded-xl" />
                <div className="skeleton h-20 w-full rounded-xl" />
              </div>
              <div className="space-y-4">
                <div className="skeleton h-8 w-40 rounded-lg" />
                <div className="flex flex-wrap gap-2">
                  <div className="skeleton h-10 w-24 rounded-full" />
                  <div className="skeleton h-10 w-28 rounded-full" />
                  <div className="skeleton h-10 w-20 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-[70vh] pt-32 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-3">Service Not Found</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">
            {error?.message || "The service you're looking for doesn't exist or was removed."}
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/services" className="btn-primary px-6 py-2.5">
              Back to Services
            </Link>
            <button onClick={() => refetch()} className="btn-secondary px-6 py-2.5">
              Try Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Derived values (after early returns, safe to use `service`) ──
  const iconSrc = service.iconImage ? getOptimizedUrl(service.iconImage) : null;

  // ── Success ──
  return (
    <>
      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-violet-500 z-50 origin-left"
        style={{ scaleX: width }}
      />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 -left-32 w-80 h-80 bg-brand-500/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 -right-32 w-96 h-96 bg-violet-500/15 rounded-full blur-[120px]" />
        </div>

        <div className="section-container relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-brand-500 mb-8 transition-all group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> 
              All Services
            </Link>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid lg:grid-cols-5 gap-12 items-start"
          >
            {/* Main content */}
            <div className="lg:col-span-3 space-y-6">
              {/* ─── Icon – prominent & safe ─── */}
              <motion.div variants={fadeInUp}>
                <div className="relative inline-flex">
                  <div className="absolute inset-0 bg-brand-500/20 rounded-2xl blur-2xl" />
                  <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 shadow-xl flex items-center justify-center">
                    {iconSrc && !iconError ? (
                      <Image
                        src={iconSrc}
                        alt={service.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 object-contain"
                        onError={() => setIconError(true)}
                        unoptimized // fallback if domain not configured
                      />
                    ) : (
                      <Zap className="w-10 h-10 text-white" />
                    )}
                  </div>
                </div>
              </motion.div>

              <motion.h1 
                variants={fadeInUp}
                className="font-display text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent"
              >
                {service.name}
              </motion.h1>
              
              <motion.p 
                variants={fadeInUp}
                className="text-lg md:text-xl text-zinc-600 dark:text-zinc-300 leading-relaxed"
              >
                {service.shortDescription}
              </motion.p>

              {/* External links */}
              {service.serviceLinks && service.serviceLinks.length > 0 && (
                <motion.div variants={fadeInUp} className="flex flex-wrap gap-3 pt-2">
                  {service.serviceLinks.map((linkItem) => (
                    <a
                      key={linkItem.id}
                      href={linkItem.link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400 transition-all group"
                    >
                      {linkItem.link.name}
                      <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  ))}
                </motion.div>
              )}
            </div>

            {/* CTA Card */}
            <motion.div 
              variants={fadeInUp}
              className="lg:col-span-2 lg:sticky lg:top-28"
            >
              <div className="card-base p-6 space-y-5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-white/20 dark:border-zinc-800/50 shadow-xl rounded-2xl">
                <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400">
                  <Award className="w-5 h-5" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Get Started</span>
                </div>
                <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  Ready to build this?
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Let's discuss your requirements and create something extraordinary together.
                </p>
                <Link href="/contact" className="btn-primary w-full justify-center gap-2 group">
                  Book Consultation 
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/packages" className="btn-secondary w-full justify-center">
                  View Packages
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Description */}
      {service.longDescription && (
        <section className="section-padding bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950">
          <div className="section-container max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent mb-8">
                Overview
              </h2>
              <div className="prose prose-zinc dark:prose-invert max-w-none prose-lg">
                {service.longDescription.split('\n').filter(Boolean).map((paragraph, idx) => (
                  <p key={idx} className="text-zinc-600 dark:text-zinc-300 leading-relaxed mb-5">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Features & Technologies */}
      <section className="section-padding">
        <div className="section-container">
          <div className="grid md:grid-cols-2 gap-12">
            {service.features && service.features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="font-display text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
                  What's Included
                </h2>
                <ul className="space-y-4">
                  {service.features.map((featureItem: ServiceFeatureResponse, idx: number) => (
                    <motion.li
                      key={featureItem.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 hover:border-brand-200 dark:hover:border-brand-800 transition-all group"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <CheckCircle2 className="w-4 h-4 text-brand-600" />
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {featureItem.feature.name}
                        </p>
                        {featureItem.feature.description && (
                          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                            {featureItem.feature.description}
                          </p>
                        )}
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}

            {service.technologies && service.technologies.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="font-display text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
                  Technologies We Use
                </h2>
                <div className="flex flex-wrap gap-3">
                  {service.technologies.map((techItem: ServiceTechnologyResponse) => (
                    <Link
                      key={techItem.id}
                      href={`/technologies/${techItem.technology.slug}`}
                      className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-brand-400 hover:shadow-md transition-all duration-200"
                    >
                      {techItem.technology.iconImage && (
                        <Image
                          src={getOptimizedUrl(techItem.technology.iconImage)}
                          alt={techItem.technology.name}
                          width={20}
                          height={20}
                          className="w-5 h-5 object-contain"
                        />
                      )}
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-brand-600 dark:group-hover:text-brand-400">
                        {techItem.technology.name}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-brand-500 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-gradient-to-r from-brand-50 to-violet-50 dark:from-brand-950/20 dark:to-violet-950/20">
        <div className="section-container">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex justify-center mb-3">
                <Clock className="w-8 h-8 text-brand-600" />
              </div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">Fast Delivery</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">On-time, every time</p>
            </div>
            <div>
              <div className="flex justify-center mb-3">
                <Shield className="w-8 h-8 text-brand-600" />
              </div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">Quality Assured</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Rigorous testing</p>
            </div>
            <div>
              <div className="flex justify-center mb-3">
                <Zap className="w-8 h-8 text-brand-600" />
              </div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">Scalable Solutions</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Grow with us</p>
            </div>
          </div>
        </div>
      </section>

      <ContactCta />
    </>
  );
}