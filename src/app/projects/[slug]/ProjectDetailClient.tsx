'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, ArrowRight, AlertCircle } from 'lucide-react';
import { useProject } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import { formatDate } from '@/lib/utils';
import { ContactCta } from '@/components/sections/ContactCta';

interface Props {
  slug: string;
}

export function ProjectDetailClient({ slug }: Props) {
  const { data: project, isLoading, error, refetch } = useProject(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32">
        <div className="section-container space-y-6 animate-pulse">
          <div className="skeleton h-6 w-32" />
          <div className="skeleton h-12 w-2/3" />
          <div className="skeleton h-6 w-1/2" />
          <div className="skeleton w-full aspect-video rounded-2xl" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="skeleton h-6 w-40" />
              <div className="skeleton h-20 w-full" />
            </div>
            <div className="space-y-4">
              <div className="skeleton h-6 w-40" />
              <div className="skeleton h-20 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-[70vh] pt-32 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold mb-3">Project Not Found</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">
            {error?.message || "The project you're looking for doesn't exist or was removed."}
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/projects" className="btn-primary">
              Back to Projects
            </Link>
            <button onClick={() => refetch()} className="btn-secondary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
        <div className="section-container">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-brand-500 mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" /> Back to Projects
          </Link>

          <div className="grid lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-2">
              {project.projectBundle && (
                <span className="tag mb-3 inline-block">{project.projectBundle.projectBundleName}</span>
              )}
              <h1 className="font-display text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                {project.title}
              </h1>
              <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
                {project.shortDescription}
              </p>

              {project.externalLinks?.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {project.externalLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium hover:border-brand-500/40 hover:text-brand-600 dark:hover:text-brand-400 transition-all"
                    >
                      {link.name} <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Meta Card */}
            <div className="card-base p-6 space-y-5 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
              {project.projectDeliverableType && (
                <div>
                  <p className="text-xs text-zinc-400 mb-1 font-medium uppercase tracking-wider">Type</p>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{project.projectDeliverableType}</p>
                </div>
              )}
              {project.technologies?.length > 0 && (
                <div>
                  <p className="text-xs text-zinc-400 mb-2 font-medium uppercase tracking-wider">Technologies</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((t) => (
                      <span key={t.id} className="text-xs px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                        {t.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {project.createdAt && (
                <div>
                  <p className="text-xs text-zinc-400 mb-1 font-medium uppercase tracking-wider">Delivered</p>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">{formatDate(project.createdAt)}</p>
                </div>
              )}
              <Link href="/contact" className="btn-primary w-full justify-center gap-2">
                Start Similar Project <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Banner Images Gallery */}
      {project.bannerImages?.length > 0 && (
        <section className="py-10">
          <div className="section-container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {project.bannerImages.map((img, i) => (
                <motion.div
                  key={img.publicId || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ delay: i * 0.1 }}
                  className={i === 0 ? 'md:col-span-2' : ''}
                >
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-elevated">
                    <Image
                      src={getOptimizedUrl(img)}
                      alt={`${project.title} screenshot ${i + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                      className="object-cover"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Thumb Image fallback */}
      {project.bannerImages?.length === 0 && project.thumbImage && (
        <section className="py-10">
          <div className="section-container">
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-elevated">
              <Image
                src={getOptimizedUrl(project.thumbImage)}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* Full Description */}
      {project.fullDescription && (
        <section className="section-padding">
          <div className="section-container max-w-3xl">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">
              About This Project
            </h2>
            <div className="prose prose-zinc dark:prose-invert max-w-none">
              {project.fullDescription.split('\n').filter(Boolean).map((paragraph, i) => (
                <p key={i} className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      <ContactCta />
    </>
  );
}