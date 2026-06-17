'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShoppingBag, LayoutDashboard, Smartphone, Apple, Landmark, Truck, Users, Layers } from 'lucide-react';
import { useServices } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import { ServiceCardSkeleton } from '@/components/common/Skeletons';
import type { ServiceResponse, ServiceFeatureResponse, ServiceTechnologyResponse } from '@/types';

// ─── Icon mapping for service thumbnails ──────────────────────────────────
const serviceIconMap: Record<string, React.ElementType> = {
  'ecommerce-full-website': ShoppingBag,
  'admin-panel-website': LayoutDashboard,
  'android-ecommerce-app': Smartphone,
  'ios-ecommerce-app': Apple,
  'ecommerce-landing-page': Landmark,
  'delivery-management-app': Truck,
  'vendor-panel': Users,
  'complete-ecommerce-ecosystem': Layers,
};

// ─── Category mapping ──────────────────────────────────────────────────────
const getCategory = (slug: string): string => {
  if (slug.includes('android') || slug.includes('ios')) return 'Mobile App';
  if (slug.includes('admin') || slug.includes('vendor')) return 'Admin Panel';
  if (slug.includes('landing')) return 'Landing Page';
  if (slug.includes('delivery')) return 'Logistics';
  return 'Ecommerce';
};

// ─── Premium Service Card ─────────────────────────────────────────────────
function ServiceCard({ service, index }: { service: ServiceResponse; index: number }) {
  const IconComponent = serviceIconMap[service.slug] || ShoppingBag;
  const category = getCategory(service.slug);
  const hasImage = service.iconImage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: (index % 9) * 0.05, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -8 }}
      className="group relative rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
    >
      {/* ─── Thumbnail Banner (16:9) ─────────────────────────────────── */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-brand-600 to-purple-600">
        {hasImage ? (
          <Image
            src={getOptimizedUrl(service.iconImage)}
            alt={service.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-600/80 to-purple-600/80">
            <IconComponent className="w-20 h-20 text-white/70" strokeWidth={1.5} />
          </div>
        )}

        {/* Category Badge */}
        <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white text-xs font-semibold tracking-wide border border-white/10">
          <Sparkles className="w-3 h-3" />
          {category}
        </span>

        {/* Featured Badge */}
        {service.featured && (
          <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400/90 text-amber-950 text-xs font-bold tracking-wide backdrop-blur-sm">
            <Sparkles className="w-3 h-3" />
            Featured
          </span>
        )}

        {hasImage && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        )}
      </div>

      {/* ─── Content ────────────────────────────────────────────────────── */}
      <div className="flex-1 p-5 flex flex-col">
        <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1.5 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {service.name}
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2 flex-1">
          {service.shortDescription}
        </p>

        {/* Key Features */}
        {service.features && service.features.length > 0 && (
          <div className="mt-3">
            <ul className="space-y-1">
              {service.features.slice(0, 2).map((feature: ServiceFeatureResponse) => (
                <li key={feature.id} className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
                  <span className="line-clamp-1">{feature.feature?.name || 'Feature'}</span>
                </li>
              ))}
              {service.features.length > 2 && (
                <li className="text-xs text-brand-500">+{service.features.length - 2} more</li>
              )}
            </ul>
          </div>
        )}

        {/* Technologies */}
        {service.technologies && service.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {service.technologies.slice(0, 3).map((tech: ServiceTechnologyResponse) => (
              <span
                key={tech.id}
                className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium"
              >
                {tech.technology?.name || 'Tech'}
              </span>
            ))}
            {service.technologies.length > 3 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                +{service.technologies.length - 3}
              </span>
            )}
          </div>
        )}

        {/* CTA */}
        <Link
          href={`/services/${service.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400 mt-4 group-hover:gap-3 transition-all duration-200"
        >
          Explore Service
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Homepage Services Section ──────────────────────────────────────────
export function ServicesSection() {
  const { data: services, isLoading } = useServices();

  // Show only featured services, or first 6 if none featured
  const featuredServices = services?.filter(s => s.featured) || [];
  const displayServices = featuredServices.length > 0 ? featuredServices.slice(0, 6) : (services?.slice(0, 6) || []);

  return (
    <section className="py-20 bg-zinc-950">
      <div className="section-container">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-semibold tracking-widest text-brand-400 uppercase">Services</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mt-2">
            Complete Ecosystem Modules
          </h2>
          <p className="text-zinc-400 mt-1">Every part of your ecommerce business, covered.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array(6).fill(0).map((_, i) => <ServiceCardSkeleton key={i} />)
            : displayServices.map((service, i) => (
                <ServiceCard key={service.id} service={service} index={i} />
              ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/services" className="btn-secondary">
            View All Services <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}