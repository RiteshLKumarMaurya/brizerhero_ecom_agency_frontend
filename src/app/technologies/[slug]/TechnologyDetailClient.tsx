'use client';

import Link from 'next/link';
import { ArrowLeft, ExternalLink, ArrowRight } from 'lucide-react';
import { useTechnology } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import { ContactCta } from '@/components/sections/ContactCta';

interface Props { slug: string; }

export function TechnologyDetailClient({ slug }: Props) {
  const { data: tech, isLoading, error } = useTechnology(slug);

  if (isLoading) return (
    <div className="min-h-screen pt-32">
      <div className="section-container space-y-4 animate-pulse">
        <div className="skeleton h-10 w-1/3" />
        <div className="skeleton h-6 w-2/3" />
      </div>
    </div>
  );

  if (error || !tech) return (
    <div className="min-h-screen pt-32 flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold mb-3">Technology Not Found</h1>
        <Link href="/technologies" className="btn-primary">Back to Technologies</Link>
      </div>
    </div>
  );

  return (
    <>
      <section className="pt-32 pb-16 bg-zinc-50 dark:bg-zinc-950">
        <div className="section-container">
          <Link href="/technologies" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-brand-500 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Technologies
          </Link>
          <div className="grid lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-2">
              <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mb-6">
                {tech.iconImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={getOptimizedUrl(tech.iconImage)} alt={tech.name} className="w-8 h-8 object-contain" />
                ) : (
                  <span className="text-2xl font-bold text-zinc-400">{tech.name.charAt(0)}</span>
                )}
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">{tech.name}</h1>
              {tech.description && (
                <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">{tech.description}</p>
              )}
              {tech.links?.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-6">
                  {tech.links.map((link) => (
                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium hover:border-brand-500/40 hover:text-brand-600 dark:hover:text-brand-400 transition-all">
                      {link.name} <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ))}
                </div>
              )}
            </div>
            <div className="card-base p-5 space-y-4">
              <h3 className="font-display font-bold text-zinc-900 dark:text-zinc-100">Build With This Tech</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Interested in using {tech.name} for your project?</p>
              <Link href="/contact" className="btn-primary w-full justify-center">
                Start a Project <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <ContactCta />
    </>
  );
}
