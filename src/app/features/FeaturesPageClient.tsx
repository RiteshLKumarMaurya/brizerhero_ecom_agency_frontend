'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  ArrowRight,
  Package,
  ShoppingCart,
  CreditCard,
  BarChart3,
  Smartphone,
  LayoutDashboard,
  Shield,
  Mail,
  Zap,
  Users,
  Truck,
  Store,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { useFeatures } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import { ContactCta } from '@/components/sections/ContactCta';
import type { FeatureResponse } from '@/types';
import { cn } from '@/lib/utils';

// ─── Category mapping ────────────────────────────────────────────────
const getFeatureCategory = (feature: FeatureResponse): string => {
  const text = (feature.name + ' ' + (feature.description || '')).toLowerCase();
  if (text.includes('inventory') || text.includes('stock')) return 'Inventory';
  if (text.includes('order') || text.includes('checkout')) return 'Orders';
  if (text.includes('payment') || text.includes('gateway') || text.includes('razorpay')) return 'Payments';
  if (text.includes('analytics') || text.includes('report') || text.includes('dashboard')) return 'Analytics';
  if (text.includes('mobile') || text.includes('app') || text.includes('android') || text.includes('ios')) return 'Mobile';
  if (text.includes('admin') || text.includes('panel')) return 'Admin';
  if (text.includes('security') || text.includes('auth') || text.includes('ssl')) return 'Security';
  if (text.includes('marketing') || text.includes('email') || text.includes('promotion')) return 'Marketing';
  if (text.includes('delivery') || text.includes('dispatch') || text.includes('logistics')) return 'Delivery';
  if (text.includes('customer') || text.includes('experience') || text.includes('loyalty')) return 'Customer Experience';
  if (text.includes('store') || text.includes('catalog') || text.includes('product')) return 'Store Operations';
  return 'Store Operations';
};

const ALL_CATEGORIES = [
  'All',
  'Store Operations',
  'Customer Experience',
  'Inventory',
  'Orders',
  'Delivery',
  'Payments',
  'Marketing',
  'Analytics',
  'Security',
  'Mobile',
  'Admin',
];

// ─── Static capability sections ──────────────────────────────────────
const CAPABILITY_SECTIONS = [
  {
    id: 'customer-experience',
    label: 'Customer Experience',
    icon: Users,
    color: 'emerald',
    headline: 'Customers order the way they prefer.',
    problem: 'When ordering is inconvenient, customers call instead. Or they order from someone else.',
    solution: 'A fast, familiar storefront — on web and mobile — that remembers each customer, shows real-time stock, and lets them reorder last week\'s basket in two taps.',
    outcomes: [
      'Repeat customers order without calling',
      'Average order value increases',
      'Fewer "is this available?" messages',
    ],
  },
  {
    id: 'store-operations',
    label: 'Store Operations',
    icon: Store,
    color: 'amber',
    headline: 'Your catalog, always accurate.',
    problem: 'Prices change daily in grocery. Seasonal items come and go. Keeping the website in sync with the actual shelf costs staff hours every morning.',
    solution: 'Update prices, availability, and descriptions from one screen. Changes go live in seconds across every sales channel.',
    outcomes: [
      'Staff spend less time on manual updates',
      'Customers see accurate prices before arriving',
      'Seasonal catalogs launch in minutes, not days',
    ],
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: Package,
    color: 'blue',
    headline: 'Stock levels you can trust.',
    problem: 'Selling items that are out of stock damages trust. Ordering too much causes spoilage. Most grocery businesses manage this with guesswork or manual spreadsheets.',
    solution: 'Inventory adjusts automatically with every sale, return, and restock. Low-stock alerts give your team time to reorder before shelves empty.',
    outcomes: [
      'Out-of-stock orders drop significantly',
      'Spoilage from over-ordering decreases',
      'Staff spend less time counting stock manually',
    ],
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: ShoppingCart,
    color: 'violet',
    headline: 'Every order, visible and managed.',
    problem: 'Orders that come through WhatsApp, phone, and the website create chaos. Things get missed. Customers call to ask where their order is.',
    solution: 'All orders from every channel appear in one place, in real time. Staff see what needs picking, what\'s ready, and what\'s already out.',
    outcomes: [
      'No more missed orders',
      'Customers get accurate status updates',
      'Staff handle more orders without more headcount',
    ],
  },
  {
    id: 'delivery',
    label: 'Delivery',
    icon: Truck,
    color: 'orange',
    headline: 'Deliveries that arrive on time.',
    problem: 'Scheduling delivery slots, planning routes, and keeping customers informed requires someone\'s full attention — time your staff don\'t have.',
    solution: 'Customers choose delivery slots at checkout. Routes are planned automatically. Drivers know exactly what to carry and where to go.',
    outcomes: [
      'Delivery complaints decrease',
      'Drivers complete more runs per day',
      'Customers track their order without calling',
    ],
  },
  {
    id: 'payments',
    label: 'Payments',
    icon: CreditCard,
    color: 'teal',
    headline: 'Payment that just works.',
    problem: 'When payment fails or feels unsafe, customers abandon their cart. Chasing cash and manual reconciliation wastes time at closing.',
    solution: 'UPI, cards, wallets, and cash-on-delivery — all in one checkout. Payments reconcile automatically. No manual tallying at end of day.',
    outcomes: [
      'Fewer abandoned checkouts',
      'Daily reconciliation takes minutes',
      'Zero payment-related support calls',
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    color: 'indigo',
    headline: 'Know what\'s working and what isn\'t.',
    problem: 'Most owners only find out something went wrong after it already hurt the business. Revenue reports take hours to compile manually.',
    solution: 'Your dashboard shows revenue, top products, peak hours, and customer return rates — updated throughout the day, not at month end.',
    outcomes: [
      'Identify slow-moving stock before it spoils',
      'Know which promotions actually increased orders',
      'Make buying decisions with confidence',
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    icon: Mail,
    color: 'rose',
    headline: 'Stay in front of your customers.',
    problem: 'Getting customers to come back requires reminders. Running promotions manually is time-consuming and easy to get wrong.',
    solution: 'Send targeted offers to the right customers at the right time. Loyalty points and referral programs run themselves once you set them up.',
    outcomes: [
      'Lapsed customers return with timely offers',
      'Referrals bring in new customers automatically',
      'Promotions reach customers before a competitor does',
    ],
  },
  {
    id: 'security',
    label: 'Security',
    icon: Shield,
    color: 'slate',
    headline: 'Your data and your customers\' data stay protected.',
    problem: 'A data breach or payment fraud incident can permanently damage a local store\'s reputation. Most owners don\'t know what security measures they have.',
    solution: 'SSL encryption, role-based staff access, and automated backups are included by default — not optional add-ons.',
    outcomes: [
      'Customer payment data is always protected',
      'Staff only access what they need to',
      'Your store data is backed up every night',
    ],
  },
  {
    id: 'admin',
    label: 'Admin',
    icon: LayoutDashboard,
    color: 'zinc',
    headline: 'Run everything from one place.',
    problem: 'Managing staff access, handling refunds, and generating reports across multiple tools wastes hours every week.',
    solution: 'One admin panel for your entire business: staff roles, order management, refunds, reports, and store settings — all together.',
    outcomes: [
      'No switching between tools',
      'Owners stay in control even when not in the store',
      'New staff are productive from their first day',
    ],
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; dot: string; iconBg: string }> = {
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/20',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800/50',
    dot: 'bg-emerald-500',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800/50',
    dot: 'bg-amber-500',
    iconBg: 'bg-amber-100 dark:bg-amber-900/40',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800/50',
    dot: 'bg-blue-500',
    iconBg: 'bg-blue-100 dark:bg-blue-900/40',
  },
  violet: {
    bg: 'bg-violet-50 dark:bg-violet-950/20',
    text: 'text-violet-700 dark:text-violet-400',
    border: 'border-violet-200 dark:border-violet-800/50',
    dot: 'bg-violet-500',
    iconBg: 'bg-violet-100 dark:bg-violet-900/40',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-950/20',
    text: 'text-orange-700 dark:text-orange-400',
    border: 'border-orange-200 dark:border-orange-800/50',
    dot: 'bg-orange-500',
    iconBg: 'bg-orange-100 dark:bg-orange-900/40',
  },
  teal: {
    bg: 'bg-teal-50 dark:bg-teal-950/20',
    text: 'text-teal-700 dark:text-teal-400',
    border: 'border-teal-200 dark:border-teal-800/50',
    dot: 'bg-teal-500',
    iconBg: 'bg-teal-100 dark:bg-teal-900/40',
  },
  indigo: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/20',
    text: 'text-indigo-700 dark:text-indigo-400',
    border: 'border-indigo-200 dark:border-indigo-800/50',
    dot: 'bg-indigo-500',
    iconBg: 'bg-indigo-100 dark:bg-indigo-900/40',
  },
  rose: {
    bg: 'bg-rose-50 dark:bg-rose-950/20',
    text: 'text-rose-700 dark:text-rose-400',
    border: 'border-rose-200 dark:border-rose-800/50',
    dot: 'bg-rose-500',
    iconBg: 'bg-rose-100 dark:bg-rose-900/40',
  },
  slate: {
    bg: 'bg-slate-50 dark:bg-slate-900/30',
    text: 'text-slate-700 dark:text-slate-400',
    border: 'border-slate-200 dark:border-slate-700/50',
    dot: 'bg-slate-500',
    iconBg: 'bg-slate-100 dark:bg-slate-800/60',
  },
  zinc: {
    bg: 'bg-zinc-50 dark:bg-zinc-900/30',
    text: 'text-zinc-700 dark:text-zinc-400',
    border: 'border-zinc-200 dark:border-zinc-700/50',
    dot: 'bg-zinc-500',
    iconBg: 'bg-zinc-100 dark:bg-zinc-800/60',
  },
};

// ─── Daily Problem Item ───────────────────────────────────────────────
const DAILY_PROBLEMS = [
  {
    problem: 'Customers calling to place orders',
    cost: 'Your phone rings all day. Staff stop what they\'re doing to take orders, read back items, confirm prices. Half the time the item isn\'t even in stock.',
  },
  {
    problem: 'Inventory mistakes costing money',
    cost: 'You sell an item that ran out yesterday. Or you over-order something that spoils before it moves. Both hurt margins and customer trust.',
  },
  {
    problem: 'Delivery scheduling done on paper',
    cost: 'Delivery slots get double-booked. Drivers head out without the right route. Customers call asking where their order is.',
  },
  {
    problem: 'Manual billing and reconciliation',
    cost: 'End-of-day cash reconciliation takes two hours. Refunds need back-and-forth calls. Discrepancies go unexplained until month end.',
  },
  {
    problem: 'Slow checkout frustrating customers',
    cost: 'A long queue in the morning rush drives customers to the next store. Payment friction at checkout costs you the sale at the final step.',
  },
  {
    problem: 'No visibility into what\'s actually selling',
    cost: 'You reorder based on gut feel. Slow-moving items occupy shelf space. Your best-sellers run out on weekends when reorder is impossible.',
  },
];

// ─── Skeleton ─────────────────────────────────────────────────────────
function FeatureCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50 p-6 animate-pulse">
      <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-5" />
      <div className="h-5 w-3/5 rounded-lg bg-zinc-100 dark:bg-zinc-800 mb-3" />
      <div className="h-4 w-full rounded bg-zinc-100 dark:bg-zinc-800 mb-2" />
      <div className="h-4 w-4/5 rounded bg-zinc-100 dark:bg-zinc-800" />
    </div>
  );
}

// ─── Feature Card ─────────────────────────────────────────────────────
function FeatureCard({ feature, index }: { feature: FeatureResponse; index: number }) {
  const category = getFeatureCategory(feature);
  const iconSrc = feature.iconImage ? getOptimizedUrl(feature.iconImage) : null;
  const colors = colorMap[
    (['Store Operations', 'Customer Experience'].includes(category) ? 'amber' :
      category === 'Inventory' ? 'blue' :
      category === 'Orders' ? 'violet' :
      category === 'Delivery' ? 'orange' :
      category === 'Payments' ? 'teal' :
      category === 'Analytics' ? 'indigo' :
      category === 'Marketing' ? 'rose' :
      category === 'Security' ? 'slate' :
      'zinc')
  ] || colorMap.zinc;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 9) * 0.04, duration: 0.35 }}
      className="group relative rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 hover:shadow-lg hover:border-zinc-200 dark:hover:border-zinc-700 transition-all duration-300"
    >
      {/* Icon */}
      <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-105', colors.iconBg)}>
        {iconSrc ? (
          <Image src={iconSrc} alt={feature.name} width={32} height={32} className="w-8 h-8 object-contain" />
        ) : (
          <Zap className={cn('w-7 h-7', colors.text)} />
        )}
      </div>

      {/* Category */}
      <span className={cn('inline-block text-xs font-semibold tracking-wide uppercase mb-2', colors.text)}>
        {category}
      </span>

      {/* Name */}
      <h3 className="font-display font-bold text-base text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors leading-snug">
        {feature.name}
      </h3>

      {/* Description */}
      {feature.description && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-3">
          {feature.description}
        </p>
      )}
    </motion.div>
  );
}

// ─── Capability Block ─────────────────────────────────────────────────
function CapabilityBlock({
  section,
  index,
  dynamicFeatures,
}: {
  section: typeof CAPABILITY_SECTIONS[0];
  index: number;
  dynamicFeatures: FeatureResponse[];
}) {
  const Icon = section.icon;
  const colors = colorMap[section.color] || colorMap.zinc;
  const isAlternate = index % 2 !== 0;
  const related = dynamicFeatures.filter(
    (f) => getFeatureCategory(f).toLowerCase() === section.id.replace('-', ' ') ||
           getFeatureCategory(f) === section.label
  ).slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div
        className={cn(
          'grid md:grid-cols-2 gap-12 lg:gap-20 items-center',
          isAlternate && 'md:[&>*:first-child]:order-2'
        )}
      >
        {/* Text side */}
        <div className="space-y-6">
          {/* Label */}
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', colors.iconBg)}>
              <Icon className={cn('w-5 h-5', colors.text)} />
            </div>
            <span className={cn('text-sm font-semibold tracking-wide uppercase', colors.text)}>
              {section.label}
            </span>
          </div>

          {/* Headline */}
          <h2 className="font-display text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
            {section.headline}
          </h2>

          {/* Problem */}
          <div className={cn('rounded-xl p-4 border', colors.bg, colors.border)}>
            <div className="flex gap-3">
              <AlertCircle className={cn('w-5 h-5 flex-shrink-0 mt-0.5', colors.text)} />
              <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {section.problem}
              </p>
            </div>
          </div>

          {/* Solution */}
          <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
            {section.solution}
          </p>

          {/* Outcomes */}
          <ul className="space-y-3">
            {section.outcomes.map((outcome) => (
              <li key={outcome} className="flex items-start gap-3">
                <div className={cn('w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5', colors.iconBg)}>
                  <CheckCircle2 className={cn('w-3.5 h-3.5', colors.text)} />
                </div>
                <span className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">{outcome}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Visual side */}
        <div
          className={cn(
            'rounded-3xl p-8 border min-h-[280px] flex flex-col justify-between',
            colors.bg,
            colors.border
          )}
        >
          {/* Large icon */}
          <div className={cn('w-20 h-20 rounded-3xl flex items-center justify-center mb-6', colors.iconBg)}>
            <Icon className={cn('w-10 h-10', colors.text)} />
          </div>

          {/* Related features from API */}
          {related.length > 0 ? (
            <ul className="space-y-3">
              {related.map((f) => (
                <li
                  key={f.id}
                  className="flex items-center gap-3 rounded-xl bg-white/70 dark:bg-zinc-900/60 border border-white/80 dark:border-zinc-700/50 px-4 py-3"
                >
                  <div className={cn('w-2 h-2 rounded-full flex-shrink-0', colors.dot)} />
                  <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{f.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="space-y-3">
              {section.outcomes.slice(0, 3).map((o, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl bg-white/70 dark:bg-zinc-900/60 border border-white/80 dark:border-zinc-700/50 px-4 py-3"
                >
                  <div className={cn('w-2 h-2 rounded-full flex-shrink-0', colors.dot)} />
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{o}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────
export function FeaturesPageClient() {
  const { data: features, isLoading, error } = useFeatures();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSticky, setIsSticky] = useState(false);

  const filteredFeatures = useMemo(() => {
    if (!features) return [];
    let result = features;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          (f.description && f.description.toLowerCase().includes(q))
      );
    }
    if (selectedCategory !== 'All') {
      result = result.filter((f) => getFeatureCategory(f) === selectedCategory);
    }
    return result;
  }, [features, searchQuery, selectedCategory]);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="font-display text-2xl font-bold mb-2 text-zinc-900 dark:text-white">
            Failed to load features
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">
            {error.message || 'Please check your connection and try again.'}
          </p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ─── Hero ──────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="hero-heading"
        className="relative pt-24 pb-24 overflow-hidden bg-white dark:bg-zinc-950"
      >
        {/* Subtle background pattern */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 80% 20%, rgba(var(--color-brand-500-rgb, 34,197,94), 0.06) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(251,191,36,0.05) 0%, transparent 50%)',
          }}
        />

        <div className="section-container max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="space-y-7">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-400 tracking-widest uppercase border border-brand-200 dark:border-brand-800/60 rounded-full px-3 py-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                Built for Indian Grocery &amp; Food Businesses
              </motion.div>

              <motion.h1
                id="hero-heading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="font-display text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white leading-[1.15] tracking-tight"
              >
                Every part of this platform was{' '}
                <em className="not-italic text-brand-600 dark:text-brand-400">
                  built around how your store actually operates.
                </em>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14 }}
                className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed"
              >
                From the moment a customer places an order to the moment it arrives at their door — BrizerHero handles the operations so your team doesn&apos;t have to.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-4"
              >
                <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
                  See it for your store <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#capabilities"
                  className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  Explore capabilities <ChevronRight className="w-4 h-4" />
                </a>
              </motion.div>
            </div>

            {/* Right: quick stats */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="grid grid-cols-2 gap-4"
              aria-label="Platform highlights"
            >
              {[
                { value: '50+', label: 'Built-in capabilities' },
                { value: 'Web + App', label: 'Customer channels' },
                { value: 'One dashboard', label: 'For everything' },
                { value: 'Day one', label: 'Ready to go live' },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-5 text-center"
                >
                  <p className="font-display text-2xl font-bold text-zinc-900 dark:text-white mb-1">{value}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Daily Problems ─────────────────────────────────────────────── */}
      <section
        aria-labelledby="problems-heading"
        className="py-24 bg-zinc-50 dark:bg-zinc-900 border-y border-zinc-100 dark:border-zinc-800"
      >
        <div className="section-container max-w-5xl mx-auto">
          <div className="mb-14 max-w-xl">
            <span className="text-xs font-semibold tracking-widest uppercase text-amber-600 dark:text-amber-500">
              Why it matters
            </span>
            <h2
              id="problems-heading"
              className="font-display text-3xl font-bold text-zinc-900 dark:text-white mt-2 mb-4"
            >
              Problems every grocery owner recognises.
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
              These aren&apos;t edge cases. They happen every day in stores across India. The platform was designed specifically to eliminate them.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {DAILY_PROBLEMS.map((item, i) => (
              <motion.div
                key={item.problem}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6"
              >
                <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center mb-4">
                  <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400" />
                </div>
                <h3 className="font-display font-bold text-base text-zinc-900 dark:text-zinc-100 mb-3 leading-snug">
                  {item.problem}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {item.cost}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Capabilities ───────────────────────────────────────────────── */}
      <section
        id="capabilities"
        aria-labelledby="capabilities-heading"
        className="py-24 bg-white dark:bg-zinc-950"
      >
        <div className="section-container max-w-5xl mx-auto">
          <div className="mb-20 max-w-xl">
            <span className="text-xs font-semibold tracking-widest uppercase text-brand-600 dark:text-brand-400">
              Platform capabilities
            </span>
            <h2
              id="capabilities-heading"
              className="font-display text-3xl font-bold text-zinc-900 dark:text-white mt-2"
            >
              What the platform does for your store.
            </h2>
          </div>

          <div className="space-y-28">
            {CAPABILITY_SECTIONS.map((section, i) => (
              <div key={section.id} id={section.id}>
                <CapabilityBlock
                  section={section}
                  index={i}
                  dynamicFeatures={features || []}
                />
                {i < CAPABILITY_SECTIONS.length - 1 && (
                  <div className="mt-28 border-t border-zinc-100 dark:border-zinc-800" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Divider ─────────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-700 to-transparent"
      />

      {/* ─── All Features: Search & Filter ──────────────────────────────── */}
      <section
        aria-labelledby="all-features-heading"
        className="py-24 bg-zinc-50 dark:bg-zinc-900"
      >
        <div className="section-container max-w-6xl mx-auto">
          <div className="mb-10 max-w-xl">
            <span className="text-xs font-semibold tracking-widest uppercase text-brand-600 dark:text-brand-400">
              Full capability list
            </span>
            <h2
              id="all-features-heading"
              className="font-display text-3xl font-bold text-zinc-900 dark:text-white mt-2 mb-3"
            >
              Everything that&apos;s included.
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Every capability below comes with your platform. Nothing is an extra cost add-on.
            </p>
          </div>

          {/* Sticky search bar */}
          <div
            role="search"
            className={cn(
              'sticky top-0 z-20 py-4 -mx-4 px-4 transition-all duration-300',
              isSticky
                ? 'bg-zinc-50/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 shadow-sm'
                : 'bg-transparent'
            )}
          >
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 items-start md:items-center">
              {/* Search */}
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" aria-hidden="true" />
                <label htmlFor="feature-search" className="sr-only">Search capabilities</label>
                <input
                  id="feature-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search capabilities…"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder:text-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Category pills */}
              <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-label="Filter by category"
              >
                {ALL_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    aria-pressed={selectedCategory === cat}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                      selectedCategory === cat
                        ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm'
                        : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700'
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="mt-8">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                  aria-busy="true"
                  aria-label="Loading capabilities"
                >
                  {Array(9).fill(0).map((_, i) => <FeatureCardSkeleton key={i} />)}
                </motion.div>
              ) : filteredFeatures.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-24"
                  role="status"
                >
                  <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <Search className="w-8 h-8 text-zinc-400" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                    No capabilities match
                  </h3>
                  <p className="text-zinc-500 dark:text-zinc-400 mb-6 text-sm">
                    Try a different keyword or clear the current filter.
                  </p>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                    className="btn-secondary"
                  >
                    Clear filters
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                  role="list"
                  aria-label={`${filteredFeatures.length} capabilities`}
                >
                  {filteredFeatures.map((feature, i) => (
                    <div key={feature.id} role="listitem">
                      <FeatureCard feature={feature} index={i} />
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ─── Bottom trust strip ─────────────────────────────────────────── */}
      <section
        aria-labelledby="trust-heading"
        className="py-20 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800"
      >
        <div className="section-container max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2
              id="trust-heading"
              className="font-display text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white"
            >
              Every capability above is included.<br />
              <span className="text-zinc-400 dark:text-zinc-500">Nothing is locked behind a higher tier.</span>
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
              Most platforms charge extra for analytics, marketing tools, or mobile apps. With BrizerHero, the complete platform is what you get from day one.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
                Talk to us about your store <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/packages" className="btn-secondary inline-flex items-center gap-2">
                See pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <ContactCta />
    </>
  );
}