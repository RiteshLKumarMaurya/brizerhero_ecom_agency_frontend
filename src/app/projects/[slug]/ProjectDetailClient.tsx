// app/projects/[slug]/ProjectDetailClient.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Calendar,
  Eye,
  Copy,
  Check,
  Facebook,
  Twitter,
  Linkedin,
  MonitorSmartphone,
  Zap,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useState, useRef } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import { useProject } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import { formatDate } from '@/lib/utils';
import { ContactCta } from '@/components/sections/ContactCta';
import type { ProjectBannerImageResponse } from '@/types';
import { projectCaseStudyMap } from '@/lib/projectMetadata';
import { cn } from '@/lib/utils';

interface Props {
  slug: string;
}

// ─── Animation presets ────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

// ─── Section wrapper ──────────────────────────────────────────────────
function Section({
  children,
  className,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <motion.section
      aria-label={label}
      initial={false}
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={stagger}
      className={cn('py-24', className)}
    >
      {children}
    </motion.section>
  );
}

// ─── Eyebrow ─────────────────────────────────────────────────────────
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <motion.p
      variants={fadeUp}
      className="text-xs font-semibold tracking-[0.18em] uppercase text-brand-600 dark:text-brand-400 mb-4"
    >
      {children}
    </motion.p>
  );
}

// ─── Section heading ──────────────────────────────────────────────────
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2
      variants={fadeUp}
      className="font-display text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight mb-5"
    >
      {children}
    </motion.h2>
  );
}

export function ProjectDetailClient({ slug }: Props) {
  const { data: project, isLoading, error, refetch } = useProject(slug);
  const [copied, setCopied] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const mainRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: mainRef,
    offset: ['start start', 'end start'],
  });
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const shareUrl   = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = project?.title ?? 'Check out this case study';

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: 'facebook' | 'twitter' | 'linkedin') => {
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter:  `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`,
    };
    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  // Enrich with case study metadata if available
  const meta = projectCaseStudyMap[slug];

  const bannerImages = project?.bannerImages
    ? [...project.bannerImages].sort((a, b) => a.displayOrder - b.displayOrder)
    : [];

  const lightboxSlides = bannerImages.map((img: ProjectBannerImageResponse) => ({
    src: getOptimizedUrl(img.media),
    alt: project?.title ?? '',
  }));

  // ─── Loading ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 animate-pulse" aria-busy="true" aria-label="Loading project">
        <div className="section-container space-y-10">
          <div className="h-3 w-28 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
          <div className="h-14 w-2/3 bg-zinc-100 dark:bg-zinc-800 rounded-2xl" />
          <div className="h-5 w-1/2 bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
          <div className="w-full aspect-video bg-zinc-100 dark:bg-zinc-800 rounded-3xl" />
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <div className="h-5 w-36 bg-zinc-100 dark:bg-zinc-800 rounded-lg" />
              <div className="h-28 bg-zinc-100 dark:bg-zinc-800 rounded-2xl" />
            </div>
            <div className="space-y-4">
              <div className="h-5 w-36 bg-zinc-100 dark:bg-zinc-800 rounded-lg" />
              <div className="h-28 bg-zinc-100 dark:bg-zinc-800 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Error ──────────────────────────────────────────────────────────
  if (error || !project) {
    return (
      <div className="min-h-[70vh] pt-24 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-400" aria-hidden="true" />
          </div>
          <h1 className="font-display text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
            Project not found
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8 text-[15px]">
            {error?.message ?? "We couldn't find this case study. It may have moved or been removed."}
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/projects" className="btn-primary px-6 py-2.5">
              All case studies
            </Link>
            <button onClick={() => refetch()} className="btn-secondary px-6 py-2.5">
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Reading progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-brand-500 z-50 origin-left"
        style={{ scaleX: progressWidth }}
        aria-hidden="true"
      />

      <main ref={mainRef} id="main-content">

        {/* ═══════════════════════════════════════════════════════════════
            HERO
        ═══════════════════════════════════════════════════════════════ */}
        <section
          className="pt-24 pb-0 bg-white dark:bg-zinc-950"
          aria-label="Project overview"
        >
          <div className="section-container">
            {/* Back link */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-sm text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors mb-12 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
              >
                <ArrowLeft
                  className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
                  aria-hidden="true"
                />
                All case studies
              </Link>
            </motion.div>

            {/* Title area */}
            <motion.div
              initial={false}
              animate="visible"
              variants={stagger}
              className="max-w-3xl mb-16"
            >
              {project.projectBundle && (
                <motion.div variants={fadeUp} className="mb-5">
                  <span className="text-xs font-semibold tracking-[0.18em] uppercase text-brand-600 dark:text-brand-400">
                    {project.projectBundle.projectBundleName}
                  </span>
                </motion.div>
              )}

              <motion.h1
                variants={fadeUp}
                className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-zinc-50 leading-[1.06] tracking-tight mb-6"
              >
                {project.title}
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed"
              >
                {project.shortDescription}
              </motion.p>
            </motion.div>

            {/* Meta strip */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="flex flex-wrap gap-x-10 gap-y-4 pb-12 border-b border-zinc-100 dark:border-zinc-800"
            >
              {project.projectDeliverableType && (
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-zinc-400 dark:text-zinc-500 mb-1">
                    Platform
                  </p>
                  <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    {project.projectDeliverableType.replace(/_/g, ' ')}
                  </p>
                </div>
              )}
              {meta?.timeline && (
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-zinc-400 dark:text-zinc-500 mb-1">
                    Timeline
                  </p>
                  <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    {meta.timeline}
                  </p>
                </div>
              )}
              {meta?.industry && (
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-zinc-400 dark:text-zinc-500 mb-1">
                    Industry
                  </p>
                  <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    {meta.industry}
                  </p>
                </div>
              )}
              {project.createdAt && (
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-zinc-400 dark:text-zinc-500 mb-1">
                    Delivered
                  </p>
                  <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    {formatDate(project.createdAt)}
                  </p>
                </div>
              )}
              {meta?.stats && (
                <>
                  {meta.stats.platform && (
                    <div>
                      <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-zinc-400 dark:text-zinc-500 mb-1">
                        Available On
                      </p>
                      <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                        {meta.stats.platform}
                      </p>
                    </div>
                  )}
                  {meta.stats.uptime && (
                    <div>
                      <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-zinc-400 dark:text-zinc-500 mb-1">
                        Uptime
                      </p>
                      <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                        {meta.stats.uptime}
                      </p>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </div>

          {/* Hero image — full bleed */}
          {bannerImages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mt-16 px-4 md:px-8 lg:px-12 xl:px-16 max-w-[1400px] mx-auto"
            >
              <button
                onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}
                className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl shadow-[0_32px_80px_-16px_rgba(0,0,0,0.15)] dark:shadow-[0_32px_80px_-16px_rgba(0,0,0,0.5)] group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500 focus-visible:ring-offset-4"
                aria-label="View full-size screenshot"
              >
                <div className="relative aspect-[16/9]">
                  <Image
                    src={getOptimizedUrl(bannerImages[0].media)}
                    alt={`${project.title} — main screenshot`}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 90vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 shadow-lg">
                      <Eye className="w-5 h-5 text-zinc-700 dark:text-zinc-200" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          )}
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            BUSINESS CHALLENGE
        ═══════════════════════════════════════════════════════════════ */}
        {(meta?.problem || project.fullDescription) && (
          <Section
            className="bg-white dark:bg-zinc-950"
            label="Business challenge"
          >
            <div className="section-container max-w-4xl">
              <Eyebrow>The Challenge</Eyebrow>
              <SectionHeading>
                What problem needed solving
              </SectionHeading>
              <motion.div
                variants={fadeUp}
                className="prose-custom"
              >
                {(meta?.problem ?? project.fullDescription ?? '')
                  .split('\n')
                  .filter(Boolean)
                  .map((para, i) => (
                    <p
                      key={i}
                      className="text-lg text-zinc-600 dark:text-zinc-300 leading-[1.8] mb-5 last:mb-0"
                    >
                      {para}
                    </p>
                  ))}
              </motion.div>
            </div>
          </Section>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            THE SOLUTION
        ═══════════════════════════════════════════════════════════════ */}
        {meta?.solution && (
          <Section
            className="bg-zinc-50 dark:bg-zinc-900 border-t border-b border-zinc-100 dark:border-zinc-800"
            label="Our solution"
          >
            <div className="section-container max-w-4xl">
              <Eyebrow>How We Solved It</Eyebrow>
              <SectionHeading>
                The platform we built
              </SectionHeading>
              <motion.p
                variants={fadeUp}
                className="text-lg text-zinc-600 dark:text-zinc-300 leading-[1.8]"
              >
                {meta.solution}
              </motion.p>
            </div>
          </Section>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            KEY FEATURES
        ═══════════════════════════════════════════════════════════════ */}
        {meta?.features && meta.features.length > 0 && (
          <Section
            className="bg-white dark:bg-zinc-950"
            label="Key capabilities"
          >
            <div className="section-container">
              <div className="max-w-4xl">
                <Eyebrow>What It Does</Eyebrow>
                <SectionHeading>
                  Capabilities built into the platform
                </SectionHeading>
              </div>
              <motion.div
                variants={stagger}
                className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
              >
                {meta.features.map((feature, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    className="p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center mb-4">
                      <Zap className="w-4 h-4 text-brand-600 dark:text-brand-400" aria-hidden="true" />
                    </div>
                    <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 leading-snug">
                      {feature}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </Section>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            TECHNOLOGY (in business language)
        ═══════════════════════════════════════════════════════════════ */}
        {project.technologies && project.technologies.length > 0 && (
          <Section
            className="bg-zinc-50 dark:bg-zinc-900 border-t border-b border-zinc-100 dark:border-zinc-800"
            label="Technology"
          >
            <div className="section-container max-w-4xl">
              <Eyebrow>Under the Hood</Eyebrow>
              <SectionHeading>
                Built for reliability and scale
              </SectionHeading>
              <motion.p
                variants={fadeUp}
                className="text-lg text-zinc-600 dark:text-zinc-300 leading-[1.8] mb-10"
              >
                We select the tools that match the job — not the tools that look
                impressive on paper. Every technology here was chosen because it
                keeps your store running fast, secure, and available, day and night.
              </motion.p>
              <motion.div
                variants={fadeUp}
                className="flex flex-wrap gap-2"
              >
                {project.technologies.map((t) => (
                  <span
                    key={t.id}
                    className="text-[13px] font-medium px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                  >
                    {t.technology.name}
                  </span>
                ))}
              </motion.div>
            </div>
          </Section>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            GALLERY
        ═══════════════════════════════════════════════════════════════ */}
        {bannerImages.length > 1 && (
          <Section
            className="bg-white dark:bg-zinc-950"
            label="Project gallery"
          >
            <div className="section-container">
              <div className="max-w-4xl mb-12">
                <Eyebrow>Gallery</Eyebrow>
                <SectionHeading>
                  A closer look at the experience
                </SectionHeading>
              </div>

              <motion.div
                variants={stagger}
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
              >
                {bannerImages.slice(1).map((img, idx) => (
                  <motion.div key={img.id} variants={fadeUp}>
                    <button
                      onClick={() => {
                        setLightboxIndex(idx + 1);
                        setLightboxOpen(true);
                      }}
                      className="relative w-full overflow-hidden rounded-2xl group shadow-sm hover:shadow-xl transition-shadow duration-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500 focus-visible:ring-offset-4"
                      aria-label={`View screenshot ${idx + 2}`}
                    >
                      <div className="relative aspect-video">
                        <Image
                          src={getOptimizedUrl(img.media)}
                          alt={`${project.title} — screenshot ${idx + 2}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-white/90 dark:bg-zinc-900/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 shadow-sm">
                            <Eye className="w-4 h-4 text-zinc-700 dark:text-zinc-200" aria-hidden="true" />
                          </div>
                        </div>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </Section>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            OUTCOMES
        ═══════════════════════════════════════════════════════════════ */}
        {meta?.results && meta.results.length > 0 && (
          <Section
            className="bg-zinc-50 dark:bg-zinc-900 border-t border-b border-zinc-100 dark:border-zinc-800"
            label="Project outcomes"
          >
            <div className="section-container max-w-4xl">
              <Eyebrow>What Changed</Eyebrow>
              <SectionHeading>
                Outcomes after going live
              </SectionHeading>
              <motion.ul
                variants={stagger}
                className="mt-8 space-y-4"
                role="list"
              >
                {meta.results.map((result, i) => (
                  <motion.li
                    key={i}
                    variants={fadeUp}
                    className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700/50"
                  >
                    <CheckCircle2
                      className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <p className="text-[15px] text-zinc-700 dark:text-zinc-300 leading-snug">
                      {result}
                    </p>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </Section>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            PLATFORM STATS
        ═══════════════════════════════════════════════════════════════ */}
        {meta?.stats && Object.values(meta.stats).some(Boolean) && (
          <Section
            className="bg-white dark:bg-zinc-950"
            label="Platform scale"
          >
            <div className="section-container max-w-4xl">
              <Eyebrow>By the Numbers</Eyebrow>
              <SectionHeading>
                Scale at a glance
              </SectionHeading>
              <motion.div
                variants={stagger}
                className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6"
              >
                {Object.entries(meta.stats)
                  .filter(([, v]) => v)
                  .map(([key, value]) => (
                    <motion.div
                      key={key}
                      variants={fadeUp}
                      className="p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-center"
                    >
                      <p className="text-2xl md:text-3xl font-display font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                        {value}
                      </p>
                      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                        {key === 'products' ? 'Products'
                          : key === 'orders'   ? 'Orders/Day'
                          : key === 'users'    ? 'Users'
                          : key === 'platform' ? 'Platform'
                          : key === 'uptime'   ? 'Uptime'
                          : key}
                      </p>
                    </motion.div>
                  ))}
              </motion.div>
            </div>
          </Section>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            SHARE + NEXT STEPS
        ═══════════════════════════════════════════════════════════════ */}
        <Section
          className="bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800"
          label="Share this case study"
        >
          <div className="section-container max-w-4xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Share this case study
              </p>
              <div className="flex items-center gap-2" role="group" aria-label="Share options">
                {[
                  { platform: 'facebook' as const, Icon: Facebook, label: 'Share on Facebook', hoverBg: 'hover:bg-[#1877f2]' },
                  { platform: 'twitter'  as const, Icon: Twitter,  label: 'Share on Twitter',  hoverBg: 'hover:bg-[#1da1f2]' },
                  { platform: 'linkedin' as const, Icon: Linkedin, label: 'Share on LinkedIn', hoverBg: 'hover:bg-[#0a66c2]' },
                ].map(({ platform, Icon, label, hoverBg }) => (
                  <button
                    key={platform}
                    onClick={() => handleShare(platform)}
                    aria-label={label}
                    className={cn(
                      'w-9 h-9 rounded-full border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                      hoverBg
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                ))}
                <button
                  onClick={handleCopyLink}
                  aria-label={copied ? 'Link copied' : 'Copy link'}
                  className="w-9 h-9 rounded-full border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:bg-brand-500 hover:border-brand-500 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  {copied
                    ? <Check className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
                    : <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  }
                </button>
              </div>
            </div>

            {/* Inline CTA */}
            <motion.div
              variants={fadeUp}
              className="mt-12 p-8 md:p-10 rounded-3xl bg-white dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-700 flex flex-col md:flex-row md:items-center gap-6"
            >
              <div className="flex-1">
                <p className="text-xs font-semibold tracking-[0.16em] uppercase text-brand-600 dark:text-brand-400 mb-2">
                  Ready to get started?
                </p>
                <h3 className="font-display text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  We'd love to build something like this for your business.
                </h3>
              </div>
              <Link
                href="/contact"
                className="flex-shrink-0 inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 text-sm font-semibold hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
              >
                Start a conversation
                <ArrowRight
                  className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </motion.div>
          </div>
        </Section>

        <ContactCta />
      </main>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={lightboxSlides}
        plugins={[Zoom]}
        carousel={{ finite: false }}
        zoom={{ maxZoomPixelRatio: 3 }}
        controller={{ closeOnBackdropClick: true }}
      />
    </>
  );
}