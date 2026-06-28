'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowRight, Sparkles, ShoppingBag, LayoutDashboard, Smartphone, Apple,
  Megaphone, Truck, Users, Layers, CheckCircle2,
} from 'lucide-react';
import { useServices } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import type { ServiceResponse, ServiceFeatureResponse } from '@/types';

// ─── Presentation layer only. Backend, hooks, and data models are untouched. ───
// Every service returned by the API is mapped to business-facing language.
// If a slug isn't mapped below, sensible business-flavored fallbacks are used
// so new services never break the section.

type BusinessMeta = {
  heading: string;
  description: string;
  category: string;
  value: string;
  icon: React.ElementType;
};

const BUSINESS_META: Record<string, BusinessMeta> = {
  'ecommerce-full-website': {
    heading: 'Give Your Business A Home Online',
    description:
      'A complete online store where customers browse, order, and come back — built around how grocery shoppers actually shop.',
    category: 'Online Storefront',
    value: 'More orders, less friction.',
    icon: ShoppingBag,
  },
  'admin-panel-website': {
    heading: 'Run Your Store From One Place',
    description:
      'See every order, every product, and every customer in one simple dashboard — no spreadsheets, no guesswork.',
    category: 'Store Operations',
    value: 'Less manual work, more control.',
    icon: LayoutDashboard,
  },
  'android-ecommerce-app': {
    heading: 'Give Customers A Better Way To Shop',
    description: 'Allow customers to browse, order and reorder groceries with ease from their phone.',
    category: 'Customer Experience',
    value: 'More repeat customers.',
    icon: Smartphone,
  },
  'ios-ecommerce-app': {
    heading: 'Meet Your Customers Where They Already Are',
    description: 'A fast, polished shopping experience built for iPhone shoppers who expect things to just work.',
    category: 'Customer Experience',
    value: 'A premium experience, every time.',
    icon: Apple,
  },
  'ecommerce-landing-page': {
    heading: 'Turn More Visitors Into Customers',
    description:
      'A focused, fast-loading page built to convert visitors into first orders — perfect for promotions and new locations.',
    category: 'Customer Acquisition',
    value: 'Higher conversion, lower ad spend.',
    icon: Megaphone,
  },
  'delivery-management-app': {
    heading: 'Offer Pickup & Delivery Without The Chaos',
    description:
      "Assign drivers, track deliveries, and keep customers updated automatically, so your team isn't fielding calls all day.",
    category: 'Pickup & Delivery',
    value: 'Happier customers, fewer calls.',
    icon: Truck,
  },
  'vendor-panel': {
    heading: 'Manage Suppliers More Efficiently',
    description:
      "Give suppliers their own simple portal to manage stock and orders, without handing over access to your whole business.",
    category: 'Supplier Management',
    value: 'Less coordination, fewer mistakes.',
    icon: Users,
  },
  'complete-ecommerce-ecosystem': {
    heading: 'Every Part Of Your Business, Connected',
    description:
      'Your store, app, delivery, and operations working together as one system, instead of five disconnected tools.',
    category: 'Complete Ecosystem',
    value: 'One partner. One system.',
    icon: Layers,
  },
};

// ─── Fallback for any service not yet mapped above ─────────────────────────
function inferCategory(slug: string): string {
  if (slug.includes('android') || slug.includes('ios')) return 'Customer Experience';
  if (slug.includes('admin')) return 'Store Operations';
  if (slug.includes('vendor')) return 'Supplier Management';
  if (slug.includes('landing')) return 'Customer Acquisition';
  if (slug.includes('delivery')) return 'Pickup & Delivery';
  if (slug.includes('complete') || slug.includes('ecosystem')) return 'Complete Ecosystem';
  return 'Online Storefront';
}

function getBusinessMeta(service: ServiceResponse): BusinessMeta {
  const mapped = BUSINESS_META[service.slug];
  if (mapped) return mapped;

  return {
    heading: service.name,
    description: service.shortDescription,
    category: inferCategory(service.slug),
    value: 'Built around how your store actually runs.',
    icon: ShoppingBag,
  };
}

// ─── Loading state, matched to the real card so the page never jumps ───────
function SolutionCardSkeleton() {
  return (
    <div className="rounded-[28px] bg-card border border-default overflow-hidden">
      <div className="skeleton aspect-[16/9] w-full" />
      <div className="p-6 space-y-3">
        <div className="skeleton h-3 w-20 rounded" />
        <div className="skeleton h-6 w-3/4 rounded" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-5/6 rounded" />
        <div className="skeleton h-8 w-32 rounded-full mt-2" />
      </div>
    </div>
  );
}

// ─── Premium Solution Card ───────────────────────────────────────────────
function SolutionCard({ service, index }: { service: ServiceResponse; index: number }) {
  const meta = getBusinessMeta(service);
  const Icon = meta.icon;
  const hasImage = Boolean(service.iconImage);
  const topFeatures = service.features?.slice(0, 2) ?? [];
  const extraFeatureCount = (service.features?.length ?? 0) - topFeatures.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: (index % 9) * 0.05, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      className="group relative rounded-[28px] bg-card border border-default overflow-hidden transition-shadow duration-300 hover:shadow-[0_30px_70px_-25px_rgba(0,0,0,0.6)] hover:shadow-brand-500/10 flex flex-col h-full"
    >
      {/* Full-card link. The visible "See How It Works" below is decorative
          so the card has a single accessible link, not a nested anchor. */}
      <Link
        href={`/services/${service.slug}`}
        aria-label={`Explore the ${meta.heading} solution`}
        className="absolute inset-0 z-10 rounded-[28px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]"
      />

      {/* ─── Banner (16:9) ─────────────────────────────────────────── */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-brand-600 to-purple-600">
        {hasImage ? (
          <Image
            src={getOptimizedUrl(service.iconImage)}
            alt={meta.heading}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-600/80 to-purple-600/80">
            <Icon className="w-16 h-16 text-white/70" strokeWidth={1.5} />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/10 to-transparent" />

        <span className="absolute top-4 left-4 inline-flex items-center px-3 py-1.5 rounded-full bg-zinc-950/70 backdrop-blur-md text-white text-[11px] font-semibold tracking-wide uppercase border border-white/10">
          {meta.category}
        </span>

        {service.featured && (
          <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400/90 text-amber-950 text-[11px] font-bold tracking-wide">
            <Sparkles className="w-3 h-3" />
            Most Popular
          </span>
        )}
      </div>

      {/* ─── Content ──────────────────────────────────────────────── */}
      <div className="flex-1 p-6 flex flex-col">
        <h3 className="font-display text-xl md:text-2xl font-bold text-primary leading-snug group-hover:text-brand-400 transition-colors">
          {meta.heading}
        </h3>
        <p className="text-[11px] uppercase tracking-wider text-muted mt-1">{service.name}</p>

        <p className="text-sm text-secondary leading-relaxed mt-3 line-clamp-3 flex-1">
          {meta.description}
        </p>

        {topFeatures.length > 0 && (
          <ul className="space-y-1.5 mt-4">
            {topFeatures.map((feature: ServiceFeatureResponse) => (
              <li key={feature.id} className="flex items-start gap-2 text-xs text-muted">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-1">{feature.feature?.name || 'Included'}</span>
              </li>
            ))}
            {extraFeatureCount > 0 && (
              <li className="text-xs text-brand-400 pl-5">+{extraFeatureCount} more included</li>
            )}
          </ul>
        )}

        <span className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-medium mt-4">
          <CheckCircle2 className="w-3 h-3" />
          {meta.value}
        </span>

        <div
          aria-hidden="true"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-400 mt-5 group-hover:gap-3 transition-all duration-200"
        >
          See How It Works
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Homepage Business Solutions Section ────────────────────────────────
export function ServicesSection() {
  const { data: services, isLoading } = useServices();

  // Show only featured services, or first 6 if none featured
  const featuredServices = services?.filter(s => s.featured) || [];
  const displayServices = featuredServices.length > 0 ? featuredServices.slice(0, 6) : (services?.slice(0, 6) || []);

  return (
    <section className="py-24 md:py-20 bg-surface">
      <div className="section-container">
        <div className="max-w-2xl mb-16 md:mb-20">
          <span className="text-xs font-semibold tracking-widest text-brand-400 uppercase">Solutions</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-primary mt-3 leading-tight">
            Solutions That Run Your Store,
            <br />
            Not Just Your Website
          </h2>
          <p className="text-muted mt-4 text-base md:text-lg leading-relaxed">
            Every part of your grocery business — connected, simplified, and
            built to grow with you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {isLoading
            ? Array(6).fill(0).map((_, i) => <SolutionCardSkeleton key={i} />)
            : displayServices.map((service, i) => (
                <SolutionCard key={service.id} service={service} index={i} />
              ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/services" className="btn-secondary">
            Explore The Full Platform <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}