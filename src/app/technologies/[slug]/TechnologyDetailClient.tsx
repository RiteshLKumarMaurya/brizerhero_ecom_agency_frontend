'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowLeft,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Code,
  Zap,
  Award,
  CheckCircle2,
  Shield,
  Server,
  Cloud,
  Database,
  Smartphone,
  Settings,
} from 'lucide-react';
import { useTechnology } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import { ContactCta } from '@/components/sections/ContactCta';
import { getTechMetadata } from '@/lib/techMetadata';
import type { TechnologyResponse, TechnologyLinkResponse } from '@/types';
import { useState } from 'react';

interface Props {
  slug: string;
}

// ─── Category Icons ──────────────────────────────────────────────────────
const categoryIconMap: Record<string, React.ElementType> = {
  Backend: Server,
  Frontend: Code,
  Database: Database,
  Cloud: Cloud,
  Mobile: Smartphone,
  DevOps: Settings,
  // Add more categories as needed
};

// ─── Animation Variants ──────────────────────────────────────────────────
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

// ─── Main Component ──────────────────────────────────────────────────────
export function TechnologyDetailClient({ slug }: Props) {
  const { data: tech, isLoading, error, refetch } = useTechnology(slug);
  const { scrollYProgress } = useScroll();
  const width = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const [iconError, setIconError] = useState(false);

  // ── Loading State ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen pt-32">
        <div className="section-container max-w-5xl mx-auto">
          <div className="space-y-8 animate-pulse">
            <div className="skeleton h-8 w-32 rounded-full" />
            <div className="flex items-start gap-6">
              <div className="skeleton w-24 h-24 rounded-2xl" />
              <div className="flex-1 space-y-4">
                <div className="skeleton h-12 w-2/3 rounded-xl" />
                <div className="skeleton h-6 w-full rounded-lg" />
                <div className="skeleton h-6 w-5/6 rounded-lg" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div className="space-y-3">
                <div className="skeleton h-6 w-40 rounded-lg" />
                <div className="skeleton h-16 w-full rounded-xl" />
                <div className="skeleton h-16 w-full rounded-xl" />
              </div>
              <div className="space-y-3">
                <div className="skeleton h-6 w-40 rounded-lg" />
                <div className="flex flex-wrap gap-2">
                  <div className="skeleton h-10 w-28 rounded-full" />
                  <div className="skeleton h-10 w-32 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Error State ────────────────────────────────────────────────────────
  if (error || !tech) {
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
          <h1 className="font-display text-3xl font-bold mb-3">Technology Not Found</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">
            {error?.message || "The technology you're looking for doesn't exist or was removed."}
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/technologies" className="btn-primary px-6 py-2.5">
              Back to Technologies
            </Link>
            <button onClick={() => refetch()} className="btn-secondary px-6 py-2.5">
              Try Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Derived Values ─────────────────────────────────────────────────────
  const iconSrc = tech.iconImage ? getOptimizedUrl(tech.iconImage) : null;
  const metadata = getTechMetadata(tech.slug);
  const CategoryIcon = categoryIconMap[metadata.category] || Code;
  const usedInProjects = metadata.usedInProjects;

  // Static benefits (can be extended later)
  const benefits = [
    'Blazing fast performance for high-traffic ecommerce',
    'Scalable microservices architecture',
    'Enterprise-grade security and compliance',
    'Seamless integration with payment gateways',
    'Real-time analytics and reporting',
    'Headless CMS and API-first design',
  ];

  // Related technologies (hardcoded for demo; could be fetched later)
  const relatedTechs = [
    { name: 'Spring Boot', slug: 'spring-boot' },
    { name: 'PostgreSQL', slug: 'postgresql' },
    { name: 'Redis', slug: 'redis' },
    { name: 'Kafka', slug: 'kafka' },
  ];

  // ── Success Render ─────────────────────────────────────────────────────
  return (
    <>
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-cyan-500 z-50 origin-left"
        style={{ scaleX: width }}
      />

      {/* ─── Hero Section ────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-brand-500/10 to-transparent pointer-events-none" />

        <div className="section-container max-w-5xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              href="/technologies"
              className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-brand-500 mb-8 transition-all group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              All Technologies
            </Link>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col md:flex-row gap-8 items-start"
          >
            {/* Left: Logo, Title, Description, Badges, Links */}
            <div className="flex-1 space-y-4">
              {/* Logo */}
              <motion.div variants={fadeInUp} className="relative inline-flex">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-cyan-500 rounded-2xl blur-xl opacity-50" />
                <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 shadow-lg flex items-center justify-center">
                  {iconSrc && !iconError ? (
                    <Image
                      src={iconSrc}
                      alt={tech.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-contain"
                      onError={() => setIconError(true)}
                      unoptimized
                    />
                  ) : (
                    <CategoryIcon className="w-10 h-10 text-white" />
                  )}
                </div>
              </motion.div>

              {/* Badges */}
              <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm font-medium">
                  <CategoryIcon className="w-4 h-4" />
                  {metadata.category}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                  {metadata.experienceLevel}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                variants={fadeInUp}
                className="font-display text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent"
              >
                {tech.name}
              </motion.h1>

              {/* Description */}
              {tech.description && (
                <motion.p
                  variants={fadeInUp}
                  className="text-lg md:text-xl text-zinc-600 dark:text-zinc-300 leading-relaxed"
                >
                  {tech.description}
                </motion.p>
              )}

              {/* External Links */}
              {tech.links && tech.links.length > 0 && (
                <motion.div variants={fadeInUp} className="flex flex-wrap gap-3 pt-2">
                  {tech.links.map((linkItem: TechnologyLinkResponse) => (
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

            {/* Right: CTA Card */}
            <motion.div
              variants={fadeInUp}
              className="md:w-72 flex-shrink-0"
            >
              <div className="card-base p-6 space-y-5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-white/20 dark:border-zinc-800/50 shadow-xl rounded-2xl">
                <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400">
                  <Zap className="w-5 h-5" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Build With This Tech</span>
                </div>
                <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  Ready to use {tech.name}?
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Let's build something amazing with {tech.name}. We specialize in modern, scalable solutions.
                </p>
                <Link href="/contact" className="btn-primary w-full justify-center gap-2 group">
                  Start a Project
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Why We Use This Technology ────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-zinc-900">
        <div className="section-container max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
              Why We Use <span className="text-brand-600">{tech.name}</span>
            </h2>
            <div className="prose prose-zinc dark:prose-invert max-w-none">
              <p className="text-zinc-600 dark:text-zinc-300 text-lg leading-relaxed">
                {tech.name} enables us to build robust, high-performance ecommerce solutions that scale with your business.
                Its modern architecture and extensive ecosystem make it the perfect choice for enterprise-grade applications.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Benefits for Ecommerce ────────────────────────────────────── */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-950">
        <div className="section-container max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-8 text-center">
              Benefits for Ecommerce
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((benefit, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-brand-200 dark:hover:border-brand-800 transition-all"
                >
                  <CheckCircle2 className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-700 dark:text-zinc-300">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Projects Using This Technology ────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-zinc-900">
        <div className="section-container max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
              Used In Our Projects
            </h2>
            <div className="flex flex-wrap gap-3">
              {usedInProjects.map((project, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-medium"
                >
                  <CheckCircle2 className="w-4 h-4 text-brand-500" />
                  {project}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Architecture Showcase ────────────────────────────────────── */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-950">
        <div className="section-container max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 text-center">
              How {tech.name} Powers Our Ecosystem
            </h2>
            <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
              <div className="w-full p-4 bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-zinc-200 dark:border-zinc-800 text-center">
                <span className="font-semibold text-zinc-900 dark:text-white">Customer App</span>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">React Native / Next.js</p>
              </div>
              <ArrowDownIcon />
              <div className="w-full p-4 bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-zinc-200 dark:border-zinc-800 text-center">
                <span className="font-semibold text-zinc-900 dark:text-white">API Gateway</span>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Kong / GraphQL</p>
              </div>
              <ArrowDownIcon />
              <div className="w-full p-4 bg-brand-50 dark:bg-brand-950/20 border-2 border-brand-300 dark:border-brand-700 rounded-xl shadow-md text-center">
                <span className="font-semibold text-brand-700 dark:text-brand-300">{tech.name}</span>
                <p className="text-xs text-brand-600 dark:text-brand-400">Backend Core</p>
              </div>
              <ArrowDownIcon />
              <div className="w-full p-4 bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-zinc-200 dark:border-zinc-800 text-center">
                <span className="font-semibold text-zinc-900 dark:text-white">PostgreSQL</span>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Relational Database</p>
              </div>
              <ArrowDownIcon />
              <div className="w-full p-4 bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-zinc-200 dark:border-zinc-800 text-center">
                <span className="font-semibold text-zinc-900 dark:text-white">Redis Cache</span>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">In-memory Data Store</p>
              </div>
              <ArrowDownIcon />
              <div className="w-full p-4 bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-zinc-200 dark:border-zinc-800 text-center">
                <span className="font-semibold text-zinc-900 dark:text-white">Admin Dashboard</span>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">React + Tailwind</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Related Technologies ────────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-zinc-900">
        <div className="section-container max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
              Related Technologies
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedTechs.map((related) => (
                <Link
                  key={related.slug}
                  href={`/technologies/${related.slug}`}
                  className="p-4 text-center rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-brand-400 hover:shadow-md transition-all group"
                >
                  <p className="font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-brand-600">
                    {related.name}
                  </p>
                  <span className="text-xs text-zinc-500">Learn More →</span>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Final CTA ────────────────────────────────────────────────── */}
      <ContactCta />
    </>
  );
}

// ─── Helper: Arrow Down Icon ─────────────────────────────────────────────
function ArrowDownIcon() {
  return (
    <svg
      className="w-6 h-6 text-zinc-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  );
}