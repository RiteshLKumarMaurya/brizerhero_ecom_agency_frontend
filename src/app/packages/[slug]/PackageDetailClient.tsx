// app/packages/[slug]/PackageDetailClient.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Check, X, ChevronRight, Plus,
  Package, ShoppingCart, Truck, BarChart3, CreditCard,
  Smartphone, LayoutDashboard, Settings, Users, Shield,
  Clock, Star, Leaf, Store, Wheat, Milk,
} from 'lucide-react';
import { usePackage, usePackages } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import { formatPrice } from '@/lib/utils';
import { ContactCta } from '@/components/sections/ContactCta';
import type { CurrencyCode } from '@/types';

interface Props { slug: string; }

// ─── Animation preset ─────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

// ─── Service category grouping heuristic ──────────────────────────────────────
const CATEGORY_KEYWORDS: { label: string; icon: React.ElementType; keywords: string[] }[] = [
  { label: 'Customer Experience', icon: ShoppingCart, keywords: ['order', 'cart', 'product', 'catalog', 'search', 'wishlist', 'customer', 'app', 'mobile', 'notification'] },
  { label: 'Store Operations', icon: Store, keywords: ['inventory', 'stock', 'barcode', 'supplier', 'purchase', 'expiry', 'shelf'] },
  { label: 'Delivery & Logistics', icon: Truck, keywords: ['delivery', 'route', 'dispatch', 'driver', 'tracking', 'slot', 'pickup'] },
  { label: 'Payments', icon: CreditCard, keywords: ['payment', 'wallet', 'refund', 'invoice', 'billing', 'subscription', 'credit'] },
  { label: 'Admin & Staff', icon: LayoutDashboard, keywords: ['admin', 'staff', 'role', 'permission', 'dashboard', 'management', 'pos'] },
  { label: 'Analytics & Growth', icon: BarChart3, keywords: ['report', 'analytics', 'sales', 'insight', 'loyalty', 'marketing', 'seo'] },
];

function categoriseServices<T extends { id: string | number; displayOrder: number; serviceResponse?: { name?: string; shortDescription?: string } | null }>(services: T[]) {
  const result: Record<string, T[]> = {};
  const uncategorised: T[] = [];
  CATEGORY_KEYWORDS.forEach(cat => { result[cat.label] = []; });

  services.forEach(svc => {
    const name = (svc.serviceResponse?.name || '').toLowerCase();
    const desc = (svc.serviceResponse?.shortDescription || '').toLowerCase();
    const text = name + ' ' + desc;
    let placed = false;
    for (const cat of CATEGORY_KEYWORDS) {
      if (cat.keywords.some(kw => text.includes(kw))) {
        result[cat.label].push(svc);
        placed = true;
        break;
      }
    }
    if (!placed) uncategorised.push(svc);
  });

  if (uncategorised.length) result['Everything Else'] = uncategorised;
  return result;
}

// ─── Static problem/solution pairs – grocery-specific ────────────────────────
const PROBLEMS = [
  {
    problem: 'Customers still calling or WhatsApp-ing orders every morning.',
    solution: 'A professional online store with a mobile app they can shop from at midnight.',
  },
  {
    problem: "Stock running out — or worse, you're ordering things already fully stocked.",
    solution: 'Real-time inventory that updates the moment an order is placed.',
  },
  {
    problem: 'Delivery is a guessing game. Drivers, times, addresses — all on sticky notes.',
    solution: 'A delivery management system with route planning and live tracking.',
  },
  {
    problem: 'Loyal customers come back, but you have no way to reward or retain them.',
    solution: 'Built-in loyalty points, personalised offers, and automated re-order nudges.',
  },
];

const TRANSFORMATIONS = [
  { before: 'Phone orders, missed items, daily chaos', after: 'Customers self-serve online, 24 hours a day' },
  { before: 'Spreadsheet inventory that\'s always wrong', after: 'Live stock levels synced to every order' },
  { before: 'Payments via cash or UPI screenshots', after: 'Integrated checkout with every payment method' },
  { before: 'No idea what sells, when, or to whom', after: 'Clear sales data to make buying decisions' },
];

const WHO_FOR = [
  { icon: Store, label: 'Indian Grocery Stores', note: 'Small to mid-size, neighbourhood to regional' },
  { icon: Leaf, label: 'Organic & Health Food Stores', note: 'Single location or multi-store chains' },
  { icon: Wheat, label: 'Bakeries & Confectioneries', note: 'Pre-order, subscription, and walk-in' },
  { icon: Milk, label: 'Dairy Businesses', note: 'Daily delivery and subscription model' },
  { icon: Package, label: 'Produce Markets', note: 'Fresh inventory, daily pricing' },
  { icon: Truck, label: 'Wholesalers & Distributors', note: 'B2B ordering and bulk management' },
];

const JOURNEY = [
  { phase: 'Discovery', duration: '1–2 days', detail: 'We learn your store, your customers, and how you operate today.' },
  { phase: 'Planning', duration: '2–3 days', detail: 'Scope, timeline, tech stack, and a project plan you approve.' },
  { phase: 'Design', duration: '5–7 days', detail: 'Your brand, your colours, built into every screen.' },
  { phase: 'Development', duration: '2–5 weeks', detail: 'Built and tested against your actual workflows.' },
  { phase: 'Testing', duration: '3–5 days', detail: 'You test it. Your staff tests it. We fix everything.' },
  { phase: 'Launch', duration: '1 day', detail: 'We go live together and stay on call for the first week.' },
  { phase: 'Support', duration: 'Ongoing', detail: 'Post-launch support included. You are never on your own.' },
];

const FAQS_GROCERY = [
  { q: 'Will my staff actually be able to use this?', a: "Yes. We've built admin panels specifically for store managers and delivery staff — not developers. We also do a full onboarding session with your team before launch." },
  { q: 'What if I sell by weight or have daily changing prices?', a: "Both are handled. Variable pricing, weight-based products, and daily price updates are core features — not afterthoughts." },
  { q: 'Can I add delivery zones and charge differently for each?', a: 'Yes. You set delivery zones by pin code or radius, assign fees, and set minimum order values per zone.' },
  { q: 'What happens to the app if a product goes out of stock?', a: 'The product automatically hides or shows an out-of-stock label depending on your preference. No manual updates needed.' },
  { q: 'Is this only for one store, or can I manage multiple branches?', a: 'Depending on your package, multi-branch management is available with separate inventory, staff, and reporting per location.' },
  { q: 'Do I need someone technical to manage this?', a: "No. You manage your store the same way you'd manage any smartphone app. We handle all the technical infrastructure." },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-default last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group focus:outline-none"
        aria-expanded={open}
      >
        <span className="text-[15px] font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-primary transition-colors pr-6 leading-snug">
          {q}
        </span>
        <span
          className="flex-shrink-0 w-6 h-6 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center transition-transform duration-200"
          style={{ transform: open ? 'rotate(45deg)' : 'none' }}
          aria-hidden
        >
          <Plus className="w-3 h-3 text-muted" />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="text-[14px] text-secondary leading-relaxed pb-5">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function PackageDetailClient({ slug }: Props) {
  const { data: pkg, isLoading, error } = usePackage(slug);
  const { data: allPackages } = usePackages();

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 bg-surface">
        <div className="max-w-5xl mx-auto px-6 md:px-10 space-y-6 animate-pulse">
          <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-14 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-6 w-1/3 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-64 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error || !pkg) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4 bg-surface">
        <div className="text-center">
          <h1 className="text-3xl font-light text-primary mb-3">Package Not Found</h1>
          <p className="text-secondary mb-8">The package you're looking for doesn't exist or was removed.</p>
          <Link href="/packages" className="inline-flex items-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[14px] font-semibold px-6 py-3 rounded-full transition hover:opacity-90">
            Back to Packages
          </Link>
        </div>
      </div>
    );
  }

  const iconSrc = pkg.iconImage ? getOptimizedUrl(pkg.iconImage) : null;
  const services = (pkg.services || []).sort((a, b) => a.displayOrder - b.displayOrder);
  const grouped = categoriseServices(services);
  const otherPackages = (allPackages || []).filter(p => p.id !== pkg.id);

  return (
    <div className="bg-surface text-primary">

      {/* ── 1. HERO ───────────────────────────────────────────────────────── */}
      <section className="pt-24 pb-0 px-6 md:px-10 max-w-7xl mx-auto">
        <Link
          href="/packages"
          className="inline-flex items-center gap-1.5 text-[13px] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors mb-10 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          All packages
        </Link>

        <div className="grid lg:grid-cols-[1fr_340px] gap-16 items-start">
          {/* Left */}
          <div>
            <motion.div {...fadeUp(0)}>
              {pkg.featured && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.15em] uppercase text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 px-3 py-1.5 rounded-full mb-6">
                  <Star className="w-3 h-3 fill-current" aria-hidden /> Most popular
                </span>
              )}
              <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-zinc-400 mb-4">
                BrizerHero Package
              </p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.02] mb-6">
                {pkg.name}
              </h1>
              <p className="text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl mb-8">
                {pkg.shortDescription}
              </p>

              <div className="flex items-baseline gap-3 mb-10">
                <span className="text-4xl font-semibold text-zinc-900 dark:text-zinc-50">
                  {formatPrice(pkg.price, pkg.currencyCode as CurrencyCode)}
                </span>
                <span className="text-zinc-400 text-[14px]">fixed price · no hidden fees</span>
              </div>

              {/* Trust signals */}
              <div className="flex flex-wrap gap-x-8 gap-y-3">
                {[
                  { icon: Clock, text: '30-day delivery' },
                  { icon: Shield, text: 'Money-back guarantee' },
                  { icon: Users, text: 'Dedicated project lead' },
                  { icon: Settings, text: '3 months free support' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-[13px] text-zinc-500 dark:text-zinc-400">
                    <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-500" aria-hidden />
                    {text}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right — sticky CTA card */}
          <div className="lg:sticky lg:top-24">
            <motion.div
              {...fadeUp(0.08)}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-7 shadow-sm"
            >
              {iconSrc && (
                <div className="relative aspect-video rounded-xl overflow-hidden mb-6 bg-zinc-100 dark:bg-zinc-800">
                  <Image src={iconSrc} alt={pkg.name} fill className="object-cover" priority />
                </div>
              )}
              <p className="text-[28px] font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
                {formatPrice(pkg.price, pkg.currencyCode as CurrencyCode)}
              </p>
              <p className="text-[12px] text-zinc-400 mb-6">Fixed price. One-time payment.</p>

              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 w-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-semibold text-[14px] py-3.5 rounded-xl hover:opacity-90 transition-opacity mb-3"
              >
                Start this project <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 w-full bg-transparent border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium text-[14px] py-3.5 rounded-xl hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors mb-5"
              >
                Book a free 30-min call
              </Link>
              <p className="text-center text-[11px] text-zinc-400">
                No commitment. We reply within 24 hours.
              </p>

              {services.length > 0 && (
                <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                  <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-zinc-400 mb-3">
                    Includes {services.length} features
                  </p>
                  <ul className="space-y-2">
                    {services.slice(0, 5).map((s) => (
                      <li key={s.id} className="flex items-center gap-2 text-[13px] text-zinc-600 dark:text-zinc-400">
                        <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" aria-hidden />
                        {s.serviceResponse?.name}
                      </li>
                    ))}
                    {services.length > 5 && (
                      <li className="text-[12px] text-zinc-400">+{services.length - 5} more below</li>
                    )}
                  </ul>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Hero image — full width banner below the two-column */}
        {iconSrc && (
          <motion.div {...fadeUp(0.12)} className="relative mt-16 aspect-[21/7] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 hidden lg:block">
            <Image src={iconSrc} alt={pkg.name} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          </motion.div>
        )}
      </section>

      {/* ── 2. WHO THIS IS FOR ───────────────────────────────────────────── */}
      <section className="px-6 md:px-10 max-w-7xl mx-auto py-20 border-t border-zinc-200 dark:border-zinc-800 mt-20">
        <motion.div {...fadeUp()} className="mb-14">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-zinc-400 mb-4">Built for</p>
          <h2 className="text-4xl md:text-5xl font-light text-zinc-900 dark:text-zinc-50 leading-tight">
            Who this package is<br />
            <span className="text-secondary">designed for.</span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {WHO_FOR.map(({ icon: Icon, label, note }, i) => (
            <motion.div
              key={label}
              {...fadeUp(i * 0.05)}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mb-4">
                <Icon className="w-4.5 h-4.5 text-emerald-700 dark:text-emerald-400" aria-hidden />
              </div>
              <h3 className="text-[15px] font-semibold text-zinc-900 dark:text-zinc-100 mb-1">{label}</h3>
              <p className="text-[13px] text-zinc-500">{note}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 3. PROBLEMS THIS SOLVES ──────────────────────────────────────── */}
      <section className="bg-zinc-900 dark:bg-zinc-950 px-6 md:px-10 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp()} className="mb-14">
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-4">The real problem</p>
            <h2 className="text-4xl md:text-5xl font-light text-zinc-100 leading-tight max-w-2xl">
              Running a grocery store is hard.<br />
              <span className="text-zinc-500">The software shouldn't make it harder.</span>
            </h2>
          </motion.div>
          <div className="space-y-px rounded-2xl overflow-hidden border border-zinc-800">
            {PROBLEMS.map((item, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.06)}
                className="grid md:grid-cols-2 gap-0 bg-zinc-800/30"
              >
                <div className="px-8 py-7 border-b md:border-b-0 md:border-r border-zinc-800 flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-red-950/60 border border-red-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-3 h-3 text-red-400" aria-hidden />
                  </div>
                  <p className="text-[15px] text-zinc-300 leading-relaxed">{item.problem}</p>
                </div>
                <div className="px-8 py-7 flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-emerald-950/60 border border-emerald-800/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-emerald-400" aria-hidden />
                  </div>
                  <p className="text-[15px] text-zinc-300 leading-relaxed">{item.solution}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. TRANSFORMATIONS (BEFORE → AFTER) ─────────────────────────── */}
      <section className="px-6 md:px-10 max-w-7xl mx-auto py-20">
        <motion.div {...fadeUp()} className="mb-14">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-zinc-400 mb-4">The shift</p>
          <h2 className="text-4xl md:text-5xl font-light text-zinc-900 dark:text-zinc-50 leading-tight">
            What your store looks like<br />
            <span className="text-secondary">six months after launch.</span>
          </h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 gap-4">
          {TRANSFORMATIONS.map((t, i) => (
            <motion.div
              key={i}
              {...fadeUp(i * 0.06)}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden"
            >
              <div className="px-7 py-5 border-b border-zinc-100 dark:border-zinc-800">
                <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-zinc-400 mb-2">Before</p>
                <p className="text-[15px] text-zinc-500 leading-snug">{t.before}</p>
              </div>
              <div className="px-7 py-5 bg-emerald-50/50 dark:bg-emerald-950/10">
                <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-emerald-600 dark:text-emerald-400 mb-2">After</p>
                <p className="text-[15px] text-zinc-800 dark:text-zinc-100 font-medium leading-snug">{t.after}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 5. EVERYTHING INCLUDED (GROUPED) ─────────────────────────────── */}
      {services.length > 0 && (
        <section className="bg-zinc-50 dark:bg-zinc-900/40 px-6 md:px-10 py-20">
          <div className="max-w-7xl mx-auto">
            <motion.div {...fadeUp()} className="mb-14">
              <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-zinc-400 mb-4">
                {services.length} features included
              </p>
              <h2 className="text-4xl md:text-5xl font-light text-zinc-900 dark:text-zinc-50 leading-tight">
                Everything in this package.
              </h2>
            </motion.div>

            {pkg.longDescription && (
              <motion.div {...fadeUp(0.04)} className="mb-14 max-w-2xl">
                <div className="space-y-3">
                  {pkg.longDescription.split('\n').filter(Boolean).map((para, i) => (
                    <p key={i} className="text-[15px] text-zinc-500 dark:text-zinc-400 leading-relaxed">{para}</p>
                  ))}
                </div>
              </motion.div>
            )}

            <div className="space-y-10">
              {Object.entries(grouped).map(([category, svcs], catIdx) => {
                if (!svcs.length) return null;
                const catMeta = CATEGORY_KEYWORDS.find(c => c.label === category);
                const CatIcon = catMeta?.icon ?? Package;
                return (
                  <motion.div key={category} {...fadeUp(catIdx * 0.04)}>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <CatIcon className="w-4 h-4 text-zinc-500" aria-hidden />
                      </div>
                      <h3 className="text-[13px] font-semibold text-zinc-600 dark:text-zinc-400 tracking-wide">{category}</h3>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 pl-11">
                      {svcs.map((s) => (
                        <div
                          key={s.id}
                          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden />
                            <div>
                              <p className="text-[14px] font-medium text-zinc-900 dark:text-zinc-100 leading-snug">
                                {s.serviceResponse?.name}
                              </p>
                              {s.serviceResponse?.shortDescription && (
                                <p className="text-[12px] text-zinc-400 mt-1 leading-relaxed">
                                  {s.serviceResponse.shortDescription}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── 6. IMPLEMENTATION JOURNEY ────────────────────────────────────── */}
      <section className="px-6 md:px-10 max-w-7xl mx-auto py-20">
        <motion.div {...fadeUp()} className="mb-14">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-zinc-400 mb-4">How it works</p>
          <h2 className="text-4xl md:text-5xl font-light text-zinc-900 dark:text-zinc-50 leading-tight">
            From first call to<br />
            <span className="text-secondary">live store.</span>
          </h2>
        </motion.div>

        <div className="relative">
          <div className="hidden md:block absolute left-[116px] top-6 bottom-6 w-px bg-zinc-200 dark:bg-zinc-800" />
          <div className="space-y-0">
            {JOURNEY.map((step, i) => (
              <motion.div
                key={step.phase}
                {...fadeUp(i * 0.06)}
                className="flex gap-8 md:gap-12 py-7 border-b border-zinc-100 dark:border-zinc-800 last:border-0 items-start"
              >
                <div className="flex flex-col items-end flex-shrink-0 w-24 pt-0.5">
                  <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-zinc-400">{step.duration}</p>
                </div>
                <div className="relative flex-shrink-0 hidden md:flex items-center justify-center w-6">
                  <div className="w-3 h-3 rounded-full bg-white dark:bg-zinc-950 border-2 border-emerald-500 relative z-10" />
                </div>
                <div>
                  <h3 className="text-[17px] font-semibold text-zinc-900 dark:text-zinc-100 mb-1">{step.phase}</h3>
                  <p className="text-[14px] text-zinc-500 leading-relaxed">{step.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. COMPARISON WITH OTHER PACKAGES ───────────────────────────── */}
      {otherPackages.length > 0 && (
        <section className="bg-zinc-50 dark:bg-zinc-900/40 px-6 md:px-10 py-20">
          <div className="max-w-7xl mx-auto">
            <motion.div {...fadeUp()} className="mb-14">
              <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-zinc-400 mb-4">Compare</p>
              <h2 className="text-4xl md:text-5xl font-light text-zinc-900 dark:text-zinc-50">
                Not sure this is the right fit?
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Current package card */}
              <motion.div
                {...fadeUp(0)}
                className="bg-white dark:bg-zinc-900 border-2 border-emerald-500/40 dark:border-emerald-700/40 rounded-2xl p-7"
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-emerald-600 dark:text-emerald-400">Current selection</p>
                  <span className="text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/50">
                    Selected
                  </span>
                </div>
                <h3 className="text-[20px] font-semibold text-zinc-900 dark:text-zinc-50 mb-1">{pkg.name}</h3>
                <p className="text-2xl font-light text-zinc-900 dark:text-zinc-50 mb-3">
                  {formatPrice(pkg.price, pkg.currencyCode as CurrencyCode)}
                </p>
                <p className="text-[13px] text-zinc-500 mb-5">{pkg.shortDescription}</p>
                <p className="text-[13px] font-medium text-zinc-600 dark:text-zinc-400">{services.length} features included</p>
              </motion.div>

              {/* Other packages */}
              <div className="space-y-4">
                {otherPackages.slice(0, 3).map((other, i) => (
                  <motion.div
                    key={other.id}
                    {...fadeUp(i * 0.05 + 0.04)}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-[15px] font-semibold text-zinc-900 dark:text-zinc-100 mb-0.5">{other.name}</h4>
                        <p className="text-[13px] text-zinc-400 mb-2 line-clamp-1">{other.shortDescription}</p>
                        <p className="text-[18px] font-light text-zinc-900 dark:text-zinc-100">
                          {formatPrice(other.price, other.currencyCode as CurrencyCode)}
                        </p>
                      </div>
                      <Link
                        href={`/packages/${other.slug}`}
                        className="flex-shrink-0 flex items-center gap-1 text-[13px] font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mt-1"
                      >
                        View <ChevronRight className="w-3.5 h-3.5" aria-hidden />
                      </Link>
                    </div>
                  </motion.div>
                ))}
                <Link
                  href="/packages"
                  className="block text-center text-[13px] font-medium text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors pt-2"
                >
                  See all packages →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 8. FAQ ───────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 max-w-7xl mx-auto py-20">
        <div className="grid md:grid-cols-[260px_1fr] gap-12 md:gap-20">
          <motion.div {...fadeUp()}>
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-zinc-400 mb-4">FAQ</p>
            <h2 className="text-3xl font-light text-zinc-900 dark:text-zinc-50 leading-snug">
              Questions grocery<br />owners ask us.
            </h2>
          </motion.div>
          <motion.div {...fadeUp(0.05)}>
            {FAQS_GROCERY.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 9. FINAL CTA ─────────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 pb-20 max-w-7xl mx-auto">
        <motion.div
          {...fadeUp()}
          className="relative bg-zinc-900 dark:bg-zinc-800/60 rounded-3xl px-10 md:px-16 py-16 md:py-20 overflow-hidden"
          role="complementary"
          aria-label="Call to action"
        >
          {/* Subtle texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            aria-hidden
            style={{
              backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
          <div className="relative max-w-2xl">
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-5">
              Ready to start?
            </p>
            <h2 className="text-4xl md:text-5xl font-light text-white leading-tight mb-5">
              Your store, online.<br />
              <span className="text-secondary">In 30 days or less.</span>
            </h2>
            <p className="text-zinc-400 text-[16px] leading-relaxed mb-10 max-w-lg">
              Every grocery business we've worked with said the same thing after launch: "We should have done this two years ago."
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-zinc-900 font-semibold text-[14px] px-7 py-3.5 rounded-full hover:bg-zinc-100 transition-colors"
              >
                Start this project <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-500 font-medium text-[14px] px-7 py-3.5 rounded-full transition-colors"
              >
                Book a free call
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <ContactCta />
    </div>
  );
}