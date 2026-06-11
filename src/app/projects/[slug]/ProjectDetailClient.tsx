'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, ArrowRight } from 'lucide-react';
import { useProject } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import { formatDate } from '@/lib/utils';
import { ContactCta } from '@/components/sections/ContactCta';

interface Props { slug: string; }

export function ProjectDetailClient({ slug }: Props) {
  const { data: project, isLoading, error } = useProject(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32">
        <div className="section-container space-y-6 animate-pulse">
          <div className="skeleton h-8 w-1/4" />
          <div className="skeleton h-12 w-2/3" />
          <div className="skeleton h-5 w-1/2" />
          <div className="skeleton w-full aspect-video rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold mb-3">Project Not Found</h1>
          <Link href="/projects" className="btn-primary">Back to Projects</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-zinc-50 dark:bg-zinc-950">
        <div className="section-container">
          <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-brand-500 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Projects
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

              {/* External Links */}
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

            {/* Meta */}
            <div className="card-base p-5 space-y-4">
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
                      <span key={t.id} className="text-xs px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">{t.name}</span>
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
              <Link href="/contact" className="btn-primary w-full justify-center">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.bannerImages.map((img, i) => (
                <motion.div
                  key={img.publicId || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={i === 0 ? 'md:col-span-2' : ''}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getOptimizedUrl(img)}
                    alt={`${project.title} screenshot ${i + 1}`}
                    className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-elevated"
                  />
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getOptimizedUrl(project.thumbImage)}
              alt={project.title}
              className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-elevated"
            />
          </div>
        </section>
      )}

      {/* Full Description */}
      {project.fullDescription && (
        <section className="section-padding">
          <div className="section-container max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">About This Project</h2>
            <div className="space-y-4">
              {project.fullDescription.split('\n').filter(Boolean).map((paragraph, i) => (
                <p key={i} className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      <ContactCta />
    </>
  );
}
