// app/services/ServicesPageClient.tsx
'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ShoppingBag,
  LayoutDashboard,
  Smartphone,
  Apple,
  Landmark,
  Truck,
  Users,
  Layers,
  Phone,
  ClipboardList,
  PackageOpen,
  ReceiptText,
  UserX,
} from 'lucide-react';
import { useServices } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import { ContactCta } from '@/components/sections/ContactCta';
import type { ServiceResponse } from '@/types';
import { cn } from '@/lib/utils';

// ─── Icon mapping ─────────────────────────────────────────────────────
const serviceIconMap: Record<string, React.ElementType> = {
  'ecommerce-full-website':     ShoppingBag,
  'admin-panel-website':        LayoutDashboard,
  'android-ecommerce-app':      Smartphone,
  'ios-ecommerce-app':          Apple,
  'ecommerce-landing-page':     Landmark,
  'delivery-management-app':    Truck,
  'vendor-panel':               Users,
  'complete-ecommerce-ecosystem': Layers,
};

// ─── Business challenges shown before services ───────────────────────
const CHALLENGES = [
  { icon: Phone,         text: 'Customers still call to place orders — instead of ordering themselves' },
  { icon: PackageOpen,   text: 'Inventory mistakes that lead to overselling or empty shelves' },
  { icon: ReceiptText,   text: 'Manual billing that eats hours every single day' },
  { icon: Truck,         text: 'Delivery confusion with no tracking or route clarity' },
  { icon: ClipboardList, text: 'Staff spending time on tasks a system could handle automatically' },
  { icon: UserX,         text: 'Repeat customers drifting away because staying in touch is too hard' },
];

// ─── Industries served ───────────────────────────────────────────────
const INDUSTRIES = [
  { name: 'Indian Grocery Stores', description: 'From daily staples to specialty imports — manage everything online, in one place.', color: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800', dot: 'bg-emerald-500' },
  { name: 'Organic Food Stores',   description: 'Build the trust your products deserve with a clean, honest online storefront.', color: 'bg-lime-50 dark:bg-lime-950/40 border-lime-200 dark:border-lime-800',     dot: 'bg-lime-500' },
  { name: 'Bakeries',              description: 'Pre-orders, custom cakes, daily specials — all handled without a phone call.', color: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800', dot: 'bg-amber-500' },
  { name: 'Dairy Businesses',      description: 'Subscriptions, route-based delivery, and freshness tracking — simplified.', color: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800',         dot: 'bg-sky-500' },
  { name: 'Produce Markets',       description: 'Seasonal products, variable pricing, local delivery — built for how you operate.', color: 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800', dot: 'bg-orange-500' },
];

// ─── Why us ──────────────────────────────────────────────────────────
const WHY_US = [
  { title: 'We only work with food businesses', body: 'Not a generic agency. Every system we have built is for a grocery store, bakery, or food brand — so we already understand your problems before you explain them.' },
  { title: 'Business outcomes before technology', body: 'We start by understanding how your store operates. The technology follows the business need, not the other way around.' },
  { title: 'One team, start to finish', body: 'The same people who plan your project build it and support it. No handoffs. No surprises.' },
  { title: 'You own everything we build', body: 'Your code, your data, your domain. We hand over everything when the project ships and stay available for whatever comes next.' },
];

// ─── Animations ──────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// ─── Skeleton ─────────────────────────────────────────────────────────
function ServiceCardSkeleton() {
  return (
    <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 overflow-hidden animate-pulse" style={{ minHeight: 480 }}>
      <div className="h-52 bg-zinc-100 dark:bg-zinc-800" />
      <div className="p-8 space-y-4">
        <div className="h-3 w-20 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
        <div className="h-6 w-3/4 bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
        <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg" />
        <div className="h-4 w-5/6 bg-zinc-100 dark:bg-zinc-800 rounded-lg" />
        <div className="pt-2 h-10 w-36 bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
      </div>
    </div>
  );
}

// ─── Service Card ─────────────────────────────────────────────────────
function ServiceCard({ service, index }: { service: ServiceResponse; index: number }) {
  const Icon = serviceIconMap[service.slug] ?? ShoppingBag;

  return (
    <motion.article
      variants={fadeUp}
      className="group relative rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 overflow-hidden flex flex-col transition-all duration-500 hover:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.11)] dark:hover:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.45)] hover:-translate-y-1 hover:border-zinc-200 dark:hover:border-zinc-700"
      style={{ minHeight: 480 }}
    >
      {/* Image / illustration area */}
      <div className="relative h-52 flex-shrink-0 overflow-hidden bg-zinc-50 dark:bg-zinc-800">
        {service.iconImage ? (
          <Image
            src={getOptimizedUrl(service.iconImage)}
            alt={service.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon
              className="w-16 h-16 text-zinc-300 dark:text-zinc-600 transition-transform duration-500 group-hover:scale-110"
              strokeWidth={1.25}
              aria-hidden="true"
            />
          </div>
        )}

        {/* Featured */}
        {service.featured && (
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-3 py-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 text-zinc-800 dark:text-zinc-100 backdrop-blur-sm border border-white/50 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" aria-hidden="true" />
              Popular
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col flex-1">
        <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-brand-600 dark:text-brand-400 mb-3">
          Business Solution
        </p>

        <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-3 leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-300">
          {service.name}
        </h3>

        <p className="text-[15px] text-zinc-500 dark:text-zinc-400 leading-relaxed flex-1 line-clamp-3 mb-6">
          {service.shortDescription}
        </p>

        <Link
          href={`/services/${service.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 group/cta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
          aria-label={`Learn about ${service.name}`}
        >
          <span className="underline underline-offset-4 decoration-zinc-300 dark:decoration-zinc-600 group-hover/cta:decoration-brand-500 dark:group-hover/cta:decoration-brand-400 transition-all">
            See how it works
          </span>
          <ArrowRight
            className="w-4 h-4 text-brand-500 transition-transform duration-300 group-hover/cta:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </div>
    </motion.article>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────
export function ServicesPageClient() {
  const { data: services, isLoading, error } = useServices();

  const sortedServices = useMemo(
    () => (services ? [...services].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)) : []),
    [services]
  );

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
            <span className="text-2xl" role="img" aria-hidden="true">⚠</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
            Something went wrong
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6 text-[15px]">
            {error.message || 'Unable to load services right now. Please try again.'}
          </p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="pt-24 pb-20 bg-white dark:bg-zinc-950"
        aria-label="Page introduction"
      >
        <div className="section-container">
          <motion.div
            initial={false}
            animate="visible"
            variants={stagger}
            className="max-w-3xl"
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold tracking-[0.18em] uppercase text-brand-600 dark:text-brand-400 mb-5"
            >
              Business Solutions
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-zinc-900 dark:text-zinc-50 leading-[1.05] tracking-tight mb-7"
            >
              Your store,{' '}
              <span className="text-brand-600 dark:text-brand-400">
                running itself.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl"
            >
              We build software for Indian grocery stores, bakeries, dairy businesses,
              organic food retailers, and produce markets. Not generic apps — systems
              that match how your specific business already works.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-wrap gap-3 mt-10"
            >
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 text-sm font-semibold hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
              >
                Talk to us about your store
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
              <a
                href="#solutions"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
              >
                See what we build
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Divider ──────────────────────────────────────────────────── */}
      <div className="border-t border-zinc-100 dark:border-zinc-800" />

      {/* ═══════════════════════════════════════════════════════════════
          BUSINESS CHALLENGES
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="py-24 bg-zinc-50 dark:bg-zinc-900"
        aria-label="Business challenges we solve"
      >
        <div className="section-container">
          <motion.div
            initial={false}
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="max-w-2xl mb-14"
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold tracking-[0.18em] uppercase text-brand-600 dark:text-brand-400 mb-4"
            >
              Sound familiar?
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight"
            >
              These are the problems food businesses tell us about every week.
            </motion.h2>
          </motion.div>

          <motion.ul
            initial={false}
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            role="list"
            aria-label="Common business problems"
          >
            {CHALLENGES.map(({ icon: Icon, text }) => (
              <motion.li
                key={text}
                variants={fadeUp}
                className="flex items-start gap-4 p-6 rounded-2xl bg-white dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-700/60"
              >
                <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-red-500 dark:text-red-400" aria-hidden="true" />
                </div>
                <p className="text-[15px] text-zinc-700 dark:text-zinc-300 leading-snug">{text}</p>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SOLUTIONS GRID
      ═══════════════════════════════════════════════════════════════ */}
      <section
        id="solutions"
        className="py-24 bg-white dark:bg-zinc-950"
        aria-label="Our solutions"
      >
        <div className="section-container">
          <motion.div
            initial={false}
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="max-w-2xl mb-14"
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold tracking-[0.18em] uppercase text-brand-600 dark:text-brand-400 mb-4"
            >
              What We Build
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight"
            >
              A solution for every part of your business.
            </motion.h2>
          </motion.div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                aria-busy="true"
                aria-label="Loading solutions"
              >
                {Array(6).fill(0).map((_, i) => <ServiceCardSkeleton key={i} />)}
              </motion.div>
            ) : sortedServices.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center"
              >
                <p className="text-zinc-400 text-lg">More solutions coming soon.</p>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={false}
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={stagger}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {sortedServices.map((service, i) => (
                  <ServiceCard key={service.id} service={service} index={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ─── Divider ──────────────────────────────────────────────────── */}
      <div className="border-t border-zinc-100 dark:border-zinc-800" />

      {/* ═══════════════════════════════════════════════════════════════
          INDUSTRIES
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="py-24 bg-zinc-50 dark:bg-zinc-900"
        aria-label="Industries we serve"
      >
        <div className="section-container">
          <motion.div
            initial={false}
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="max-w-2xl mb-14"
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold tracking-[0.18em] uppercase text-brand-600 dark:text-brand-400 mb-4"
            >
              Who We Work With
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight"
            >
              Five types of food businesses. That's it.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-lg text-zinc-500 dark:text-zinc-400 mt-4 leading-relaxed"
            >
              We turned down general software work years ago so we could go deep on what
              food businesses actually need. That focus is why our clients stop looking
              for other solutions.
            </motion.p>
          </motion.div>

          <motion.ul
            initial={false}
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            role="list"
          >
            {INDUSTRIES.map(({ name, description, color, dot }) => (
              <motion.li
                key={name}
                variants={fadeUp}
                className={cn(
                  'p-7 rounded-2xl border flex flex-col gap-3 transition-shadow hover:shadow-sm',
                  color
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span className={cn('w-2 h-2 rounded-full flex-shrink-0', dot)} aria-hidden="true" />
                  <p className="font-display font-bold text-zinc-900 dark:text-zinc-50">{name}</p>
                </div>
                <p className="text-[14px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {description}
                </p>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* ─── Divider ──────────────────────────────────────────────────── */}
      <div className="border-t border-zinc-100 dark:border-zinc-800" />

      {/* ═══════════════════════════════════════════════════════════════
          WHY US
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="py-24 bg-white dark:bg-zinc-950"
        aria-label="Why businesses choose BrizerHero"
      >
        <div className="section-container">
          <motion.div
            initial={false}
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="max-w-2xl mb-14"
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold tracking-[0.18em] uppercase text-brand-600 dark:text-brand-400 mb-4"
            >
              Why Us
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight"
            >
              Why grocery businesses keep choosing us.
            </motion.h2>
          </motion.div>

          <motion.div
            initial={false}
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {WHY_US.map(({ title, body }, i) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900"
              >
                <p className="text-[11px] font-semibold tracking-widest uppercase text-zinc-400 dark:text-zinc-500 mb-3">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-3">
                  {title}
                </h3>
                <p className="text-[15px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {body}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <ContactCta />
    </>
  );
}