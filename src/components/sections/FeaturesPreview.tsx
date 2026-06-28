'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import { useFeatures } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import { FeatureCardSkeleton } from '@/components/common/Skeletons';

export function FeaturesPreview() {
  const { data: features, isLoading } = useFeatures();
  const topFeatures = features?.slice(0, 8) || [];

  return (
    <section className="py-20 bg-raised">
      <div className="section-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-semibold tracking-widest text-brand-400 uppercase">Features</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mt-2">
              Everything You Need to Scale
            </h2>
            <p className="text-muted mt-1">Powerful features built for modern ecommerce.</p>
          </div>
          <Link href="/features" className="btn-secondary flex-shrink-0">
            View All Features <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {isLoading
            ? Array(8).fill(0).map((_, i) => <FeatureCardSkeleton key={i} />)
            : topFeatures.map((feature, i) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="group rounded-2xl bg-card backdrop-blur-sm border border-default p-5 hover:border-brand-500/50 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    {feature.iconImage ? (
                      <img src={getOptimizedUrl(feature.iconImage)} alt="" className="w-6 h-6 object-contain" />
                    ) : (
                      <Zap className="w-6 h-6 text-brand-400" />
                    )}
                  </div>
                  <h3 className="font-display font-bold text-lg text-primary mb-1">{feature.name}</h3>
                  {feature.description && (
                    <p className="text-sm text-muted line-clamp-2">{feature.description}</p>
                  )}
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}