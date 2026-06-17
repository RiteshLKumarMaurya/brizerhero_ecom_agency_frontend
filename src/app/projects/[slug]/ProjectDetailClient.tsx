'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowLeft,
  ExternalLink,
  ArrowRight,
  AlertCircle,
  Calendar,
  Award,
  Eye,
  Copy,
  Check,
  Facebook,
  Twitter,
  Linkedin,
  TrendingUp,
  ShoppingBag,
  Users,
  Smartphone,
  CheckCircle,
  Clock,
  Layers,
  Shield,
} from 'lucide-react';
import { useState, useRef } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import { useProject } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import { formatDate } from '@/lib/utils';
import { ContactCta } from '@/components/sections/ContactCta';
import { projectCaseStudyMap } from '@/lib/projectMetadata';
import type { ProjectBannerImageResponse } from '@/types';

interface Props {
  slug: string;
}

// ─── Animations ──────────────────────────────────────────────────────────
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

export function ProjectDetailClient({ slug }: Props) {
  const { data: project, isLoading, error, refetch } = useProject(slug);
  const [copied, setCopied] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const mainContentRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: mainContentRef,
    offset: ['start start', 'end start'],
  });
  const width = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = project?.title || 'Check out this project';

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: 'facebook' | 'twitter' | 'linkedin') => {
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`,
    };
    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  const lightboxImages =
    project?.bannerImages?.map((img: ProjectBannerImageResponse) => ({
      src: getOptimizedUrl(img.media),
      alt: project.title,
    })) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32">
        <div className="section-container space-y-8 animate-pulse">
          <div className="skeleton h-6 w-32 rounded-full" />
          <div className="skeleton h-12 w-2/3 rounded-xl" />
          <div className="skeleton h-6 w-1/2 rounded-lg" />
          <div className="skeleton w-full aspect-video rounded-2xl" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="skeleton h-6 w-40 rounded-lg" />
              <div className="skeleton h-24 w-full rounded-xl" />
            </div>
            <div className="space-y-4">
              <div className="skeleton h-6 w-40 rounded-lg" />
              <div className="skeleton h-24 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-[70vh] pt-32 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-3">Project Not Found</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">
            {error?.message || "The project you're looking for doesn't exist or was removed."}
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/projects" className="btn-primary px-6 py-2.5">
              Back to Projects
            </Link>
            <button onClick={() => refetch()} className="btn-secondary px-6 py-2.5">
              Try Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const caseStudy = projectCaseStudyMap[project.slug];
  const stats = caseStudy?.stats || {};

  return (
    <>
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-purple-500 z-50 origin-left"
        style={{ scaleX: width }}
      />

      <main ref={mainContentRef}>
        {/* ─── Hero Section ────────────────────────────────────────────── */}
        <section className="relative pt-32 pb-16 overflow-hidden bg-gradient-to-b from-zinc-50 via-white to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-900">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-40 -left-20 w-72 h-72 bg-brand-500/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-20 -right-20 w-96 h-96 bg-violet-500/10 rounded-full blur-[100px]" />
          </div>

          <div className="section-container relative">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-brand-500 mb-8 transition-all group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back to all case studies
              </Link>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-12 items-start">
              {/* Left: Title, description, stats */}
              <div className="lg:col-span-2 space-y-6">
                {project.projectBundle && (
                  <motion.div variants={fadeInUp}>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 text-xs font-medium border border-brand-200 dark:border-brand-800">
                      <Award className="w-3 h-3" />
                      {project.projectBundle.projectBundleName}
                    </span>
                  </motion.div>
                )}

                <motion.h1
                  variants={fadeInUp}
                  className="font-display text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent"
                >
                  {project.title}
                </motion.h1>

                {caseStudy?.industry && (
                  <motion.p variants={fadeInUp} className="text-sm text-brand-600 dark:text-brand-400 font-medium">
                    {caseStudy.industry} • {project.projectDeliverableType?.replace(/_/g, ' ') || 'Project'}
                  </motion.p>
                )}

                <motion.p
                  variants={fadeInUp}
                  className="text-lg md:text-xl text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-2xl"
                >
                  {project.shortDescription}
                </motion.p>

                {/* Stats Row */}
                <motion.div
                  variants={fadeInUp}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4"
                >
                  {stats.products && (
                    <div className="text-center p-3 rounded-xl bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                      <p className="text-2xl font-bold text-brand-600">{stats.products}</p>
                      <p className="text-xs text-zinc-500">Products</p>
                    </div>
                  )}
                  {stats.users && (
                    <div className="text-center p-3 rounded-xl bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                      <p className="text-2xl font-bold text-brand-600">{stats.users}</p>
                      <p className="text-xs text-zinc-500">Users</p>
                    </div>
                  )}
                  {stats.uptime && (
                    <div className="text-center p-3 rounded-xl bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                      <p className="text-2xl font-bold text-brand-600">{stats.uptime}</p>
                      <p className="text-xs text-zinc-500">Uptime</p>
                    </div>
                  )}
                  {stats.platform && (
                    <div className="text-center p-3 rounded-xl bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                      <p className="text-2xl font-bold text-brand-600">{stats.platform}</p>
                      <p className="text-xs text-zinc-500">Platforms</p>
                    </div>
                  )}
                </motion.div>

                {project.externalLinks && project.externalLinks.length > 0 && (
                  <motion.div variants={fadeInUp} className="flex flex-wrap gap-3 pt-2">
                    {project.externalLinks.map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400 transition-all group"
                      >
                        {link.name}
                        <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Right: Meta Card */}
              <motion.div
                variants={fadeInUp}
                className="lg:sticky lg:top-28"
              >
                <div className="card-base p-6 space-y-5 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border border-white/20 dark:border-zinc-800/50 shadow-xl rounded-2xl">
                  {project.projectDeliverableType && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-950/30">
                        <Award className="w-4 h-4 text-brand-600" />
                      </div>
                      <div>
                        <p className="text-xs text-zinc-400 uppercase tracking-wider">Project Type</p>
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                          {project.projectDeliverableType.replace(/_/g, ' ')}
                        </p>
                      </div>
                    </div>
                  )}

                  {caseStudy?.timeline && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                        <Clock className="w-4 h-4 text-zinc-500" />
                      </div>
                      <div>
                        <p className="text-xs text-zinc-400 uppercase tracking-wider">Timeline</p>
                        <p className="text-sm text-zinc-700 dark:text-zinc-300">{caseStudy.timeline}</p>
                      </div>
                    </div>
                  )}

                  {project.createdAt && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                        <Calendar className="w-4 h-4 text-zinc-500" />
                      </div>
                      <div>
                        <p className="text-xs text-zinc-400 uppercase tracking-wider">Delivered</p>
                        <p className="text-sm text-zinc-700 dark:text-zinc-300">{formatDate(project.createdAt)}</p>
                      </div>
                    </div>
                  )}

                  <Link href="/contact" className="btn-primary w-full justify-center gap-2 group">
                    Start a similar project
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── Gallery Section ──────────────────────────────────────────── */}
        {project.bannerImages && project.bannerImages.length > 0 && (
          <section className="py-12 bg-white dark:bg-zinc-950">
            <div className="section-container">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
              >
                {project.bannerImages.map((img, idx) => (
                  <motion.div
                    key={img.id}
                    variants={fadeInUp}
                    className={idx === 0 ? 'md:col-span-2' : ''}
                  >
                    <button
                      onClick={() => {
                        setLightboxIndex(idx);
                        setLightboxOpen(true);
                      }}
                      className="relative w-full group overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl"
                    >
                      <div className="relative aspect-video">
                        <Image
                          src={getOptimizedUrl(img.media)}
                          alt={`${project.title} screenshot ${idx + 1}`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                          <Eye className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0" />
                        </div>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        )}

        {/* ─── Case Study Details ────────────────────────────────────── */}
        <section className="py-16 bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950">
          <div className="section-container max-w-4xl">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
                Case Study
              </h2>
              {/* Share buttons */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 hidden sm:inline">Share:</span>
                <button
                  onClick={() => handleShare('facebook')}
                  className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 hover:bg-[#1877f2] hover:text-white transition-all"
                >
                  <Facebook className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 hover:bg-[#1da1f2] hover:text-white transition-all"
                >
                  <Twitter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 hover:bg-[#0a66c2] hover:text-white transition-all"
                >
                  <Linkedin className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCopyLink}
                  className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 hover:bg-brand-500 hover:text-white transition-all"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Full Description (if no case study mapping, fallback to fullDescription) */}
            {project.fullDescription && (
              <div className="prose prose-zinc dark:prose-invert max-w-none prose-lg mb-8">
                {project.fullDescription.split('\n').filter(Boolean).map((para, i) => (
                  <p key={i} className="text-base md:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed mb-5">
                    {para}
                  </p>
                ))}
              </div>
            )}

            {/* Problem, Solution, Results from metadata */}
            {caseStudy && (
              <div className="space-y-8">
                {caseStudy.problem && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="font-display text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
                      The Challenge
                    </h3>
                    <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      {caseStudy.problem}
                    </p>
                  </motion.div>
                )}

                {caseStudy.solution && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                  >
                    <h3 className="font-display text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
                      Our Solution
                    </h3>
                    <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      {caseStudy.solution}
                    </p>
                  </motion.div>
                )}

                {caseStudy.results && caseStudy.results.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="font-display text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
                      Key Results
                    </h3>
                    <ul className="space-y-3">
                      {caseStudy.results.map((result, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                          <span className="text-base text-zinc-600 dark:text-zinc-300">{result}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ─── Trust Section: Technologies, Features, Platforms ────────── */}
        <section className="py-16 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800">
          <div className="section-container max-w-4xl">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Technologies */}
              {project.technologies && project.technologies.length > 0 && (
                <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-brand-500" /> Technologies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((t) => (
                      <span
                        key={t.id}
                        className="text-xs px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                      >
                        {t.technology.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Features (if available) */}
              {caseStudy?.features && (
                <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-brand-500" /> Features Delivered
                  </h4>
                  <ul className="space-y-1.5">
                    {caseStudy.features.map((f, i) => (
                      <li key={i} className="text-sm text-zinc-600 dark:text-zinc-400 flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Platform Coverage */}
              {stats.platform && (
                <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-brand-500" /> Platform Coverage
                  </h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{stats.platform}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ─── Final CTA ─────────────────────────────────────────────────── */}
        <ContactCta />
      </main>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={lightboxImages}
        plugins={[Zoom]}
        carousel={{ finite: false }}
        zoom={{ maxZoomPixelRatio: 3 }}
        controller={{ closeOnBackdropClick: true }}
      />
    </>
  );
}