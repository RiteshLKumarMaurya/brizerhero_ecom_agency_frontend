'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, CheckCircle2, ArrowRight } from 'lucide-react';
import { useService } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import { ContactCta } from '@/components/sections/ContactCta';

interface Props { slug: string; }

export function ServiceDetailClient({ slug }: Props) {
  const { data: service, isLoading, error } = useService(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32">
        <div className="section-container">
          <div className="space-y-4 animate-pulse">
            <div className="skeleton h-10 w-1/3" />
            <div className="skeleton h-6 w-2/3" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold mb-3">Service Not Found</h1>
          <Link href="/services" className="btn-primary">Back to Services</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-zinc-50 dark:bg-zinc-950">
        <div className="section-container">
          <Link href="/services" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-brand-500 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </Link>
          <div className="grid lg:grid-cols-5 gap-12 items-start">
            <div className="lg:col-span-3">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900/30 flex items-center justify-center mb-6">
                {service.iconImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={getOptimizedUrl(service.iconImage)} alt={service.name} className="w-8 h-8 object-contain" />
                ) : (
                  <div className="w-8 h-8 rounded bg-brand-200 dark:bg-brand-800" />
                )}
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                {service.name}
              </h1>
              <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
                {service.shortDescription}
              </p>

              {/* Links */}
              {service.serviceLinks?.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {service.serviceLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      {link.name} <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Quick stats */}
            <div className="lg:col-span-2">
              <div className="card-base p-6 space-y-4">
                <h3 className="font-display font-bold text-zinc-900 dark:text-zinc-100">Get Started</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Ready to build this service for your business?</p>
                <Link href="/contact" className="btn-primary w-full justify-center">
                  Book Consultation <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/packages" className="btn-secondary w-full justify-center">
                  View Packages
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full description */}
      {service.longDescription && (
        <section className="section-padding">
          <div className="section-container max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">Overview</h2>
            <div className="prose prose-zinc dark:prose-invert max-w-none text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {service.longDescription.split('\n').map((p, i) => (
                <p key={i} className="mb-4">{p}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features + Technologies */}
      <section className="section-padding bg-zinc-50 dark:bg-zinc-950">
        <div className="section-container">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Features */}
            {service.features?.length > 0 && (
              <div>
                <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">What's Included</h2>
                <ul className="space-y-4">
                  {service.features.map((feature, i) => (
                    <motion.li
                      key={feature.id}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{feature.name}</p>
                        {feature.description && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{feature.description}</p>
                        )}
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {/* Technologies */}
            {service.technologies?.length > 0 && (
              <div>
                <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">Technologies Used</h2>
                <div className="flex flex-wrap gap-2.5">
                  {service.technologies.map((tech) => (
                    <Link
                      key={tech.id}
                      href={`/technologies/${tech.slug}`}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-brand-500/40 transition-colors group"
                    >
                      {tech.iconImage && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={getOptimizedUrl(tech.iconImage)} alt={tech.name} className="w-4 h-4 object-contain" />
                      )}
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-brand-600 dark:group-hover:text-brand-400">{tech.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
