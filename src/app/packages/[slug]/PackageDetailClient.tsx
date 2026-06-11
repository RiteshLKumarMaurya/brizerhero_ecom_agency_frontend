'use client';

import Link from 'next/link';
import { ArrowLeft, Check, ArrowRight, Zap } from 'lucide-react';
import { usePackage } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import { formatPrice } from '@/lib/utils';
import { ContactCta } from '@/components/sections/ContactCta';

interface Props { slug: string; }

export function PackageDetailClient({ slug }: Props) {
  const { data: pkg, isLoading, error } = usePackage(slug);

  if (isLoading) return (
    <div className="min-h-screen pt-32">
      <div className="section-container space-y-4 animate-pulse">
        <div className="skeleton h-10 w-1/4" />
        <div className="skeleton h-14 w-1/2" />
        <div className="skeleton h-6 w-2/3" />
      </div>
    </div>
  );

  if (error || !pkg) return (
    <div className="min-h-screen pt-32 flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold mb-3">Package Not Found</h1>
        <Link href="/packages" className="btn-primary">Back to Packages</Link>
      </div>
    </div>
  );

  return (
    <>
      <section className="pt-32 pb-16 bg-zinc-50 dark:bg-zinc-950">
        <div className="section-container">
          <Link href="/packages" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-brand-500 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Packages
          </Link>

          <div className="grid lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-2">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/30 flex items-center justify-center mb-5">
                {pkg.iconImage
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={getOptimizedUrl(pkg.iconImage)} alt={pkg.name} className="w-7 h-7 object-contain" />
                  : <Zap className="w-6 h-6 text-brand-600 dark:text-brand-400" />}
              </div>
              {pkg.featured && <span className="tag mb-3 inline-block">Most Popular</span>}
              <h1 className="font-display text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">{pkg.name}</h1>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="font-display text-4xl font-bold gradient-text">{formatPrice(pkg.price, pkg.currencyCode)}</span>
              </div>
              <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">{pkg.shortDescription}</p>
            </div>

            {/* CTA Card */}
            <div className="card-base p-6 space-y-4">
              <div className="text-center border-b border-zinc-200 dark:border-zinc-700 pb-4 mb-4">
                <p className="font-display text-2xl font-bold gradient-text">{formatPrice(pkg.price, pkg.currencyCode)}</p>
                <p className="text-xs text-zinc-400 mt-1">One-time project fee</p>
              </div>
              <Link href="/contact" className="btn-primary w-full justify-center py-3.5">
                Get Started Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="btn-secondary w-full justify-center">
                Book Free Consultation
              </Link>
              <p className="text-xs text-center text-zinc-400">No commitment required. Free 30-min discovery call.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Long Description */}
      {pkg.longDescription && (
        <section className="section-padding">
          <div className="section-container max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">What You Get</h2>
            <div className="space-y-4 text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
              {pkg.longDescription.split('\n').filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
        </section>
      )}

      {/* Services Included */}
      {pkg.services?.length > 0 && (
        <section className="section-padding bg-zinc-50 dark:bg-zinc-950">
          <div className="section-container">
            <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">Services Included</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pkg.services.sort((a, b) => a.displayOrder - b.displayOrder).map((mapping) => (
                <div key={mapping.id} className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <Check className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{mapping.service?.name}</p>
                    {mapping.service?.shortDescription && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{mapping.service.shortDescription}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <ContactCta />
    </>
  );
}
