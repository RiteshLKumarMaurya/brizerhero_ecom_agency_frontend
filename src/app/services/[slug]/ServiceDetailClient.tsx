// app/services/[slug]/ServiceDetailClient.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ShoppingBag,
  LayoutDashboard,
  Smartphone,
  Apple,
  Landmark,
  Truck,
  Users,
  Layers,
  ChevronDown,
  ChevronRight as ChevronRightIcon,
} from 'lucide-react';
import { useService } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import { ContactCta } from '@/components/sections/ContactCta';
import type { ServiceFeatureResponse, ServiceTechnologyResponse } from '@/types';
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

// ─── Icon map ─────────────────────────────────────────────────────────
const serviceIconMap: Record<string, React.ElementType> = {
  'ecommerce-full-website':       ShoppingBag,
  'admin-panel-website':          LayoutDashboard,
  'android-ecommerce-app':        Smartphone,
  'ios-ecommerce-app':            Apple,
  'ecommerce-landing-page':       Landmark,
  'delivery-management-app':      Truck,
  'vendor-panel':                 Users,
  'complete-ecommerce-ecosystem': Layers,
};

// ─── Business framing per service ─────────────────────────────────────
// Extend this map as your services grow.
const SERVICE_BUSINESS_FRAMING: Record<string, {
  challenge: string;
  whyItMatters: string;
  approach: string;
  process: { step: string; description: string }[];
  faq: { question: string; answer: string }[];
}> = {
  'ecommerce-full-website': {
    challenge:
      'Most grocery stores still rely on phone calls and WhatsApp messages to take orders. That creates a chaotic paper trail, missed orders, and customers who eventually stop calling.',
    whyItMatters:
      'When your store has a proper online platform, customers order themselves, at any hour. Your team sees every order clearly. Inventory updates as items sell. No phone tag.',
    approach:
      'We start by mapping how your store currently operates — what gets sold, how orders flow, how delivery works. Then we build a platform that fits your actual process, not a generic template.',
    process: [
      { step: 'Discovery',    description: 'We spend time learning how your business operates today — what works, what causes the most friction, and what your customers expect.' },
      { step: 'Planning',     description: 'We put together a clear plan: what the platform will do, how long it will take, and what you will own when it is done.' },
      { step: 'Build',        description: 'Your platform is built by the same team from start to finish. You see progress throughout, not just at the end.' },
      { step: 'Launch',       description: 'We go live with you, handle the handover carefully, and make sure your team knows how to use everything.' },
      { step: 'Support',      description: 'After launch, we are available. If something needs adjusting as your business grows, we handle it.' },
    ],
    faq: [
      { question: 'How long does this take to build?',          answer: 'Most projects are complete within 8–14 weeks depending on scope. We agree on a timeline before we start.' },
      { question: 'Will I be able to manage it myself?',        answer: 'Yes. We build an admin panel that lets you update products, prices, and orders without any technical knowledge.' },
      { question: 'What happens if something breaks?',          answer: 'We provide ongoing support after launch. You contact us directly — not a support ticket system.' },
      { question: 'Do I need to switch my current systems?',    answer: 'Not necessarily. We can integrate with what you already use or help you migrate at a pace that works for your business.' },
    ],
  },
};

const DEFAULT_FRAMING = {
  challenge:
    "Running a food business involves managing inventory, customers, orders, and delivery — usually across tools that don't talk to each other. That slows your team down and creates room for errors.",
  whyItMatters:
  "The right software doesn't just digitise what you already do. It removes friction from every part of your day, so your team can focus on the business instead of the admin.",
  approach:
    'We start with your business, not with technology. Once we understand how you operate and where the problems are, we build a solution that fits — without overcomplicating things.',
  process: [
    { step: 'Discovery',    description: 'We learn how your business operates — what sells, what causes problems, and what your customers expect from you.' },
    { step: 'Planning',     description: 'A clear plan covering scope, timeline, and ownership — agreed before any work begins.' },
    { step: 'Build',        description: 'Your solution is built by one consistent team, with progress visible to you throughout.' },
    { step: 'Launch',       description: 'A careful go-live, full handover, and training so your team can use everything with confidence.' },
    { step: 'Support',      description: 'We stay available after launch for questions, adjustments, and growth.' },
  ],
  faq: [
    { question: 'How long does this take?',                   answer: 'Most projects complete within 8–16 weeks. We agree on a clear timeline before work begins.' },
    { question: 'Do I need technical knowledge to use it?',   answer: 'No. We build everything to be managed by your team without any technical background.' },
    { question: 'What does ongoing support look like?',       answer: 'You contact us directly after launch. We do not hand you off to a ticket system.' },
    { question: 'Will this work with my current setup?',      answer: 'Usually, yes. We assess your existing tools and integrate where possible, or help you migrate where it makes sense.' },
  ],
};

// ─── Animation presets ────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09 } },
};

// ─── Section wrapper ─────────────────────────────────────────────────
function Section({
  children,
  className,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <motion.section
      aria-label={label}
      initial={false}
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={stagger}
      className={cn('py-24', className)}
    >
      {children}
    </motion.section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <motion.p
      variants={fadeUp}
      className="text-xs font-semibold tracking-[0.18em] uppercase text-brand-600 dark:text-brand-400 mb-4"
    >
      {children}
    </motion.p>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2
      variants={fadeUp}
      className="font-display text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight mb-5"
    >
      {children}
    </motion.h2>
  );
}

// ─── FAQ Item ─────────────────────────────────────────────────────────
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-zinc-100 dark:border-zinc-800 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
      >
        <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-[15px] group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {question}
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-zinc-400 flex-shrink-0 transition-transform duration-300',
            open && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>
      <AnimateHeight open={open}>
        <p className="text-[15px] text-zinc-500 dark:text-zinc-400 leading-relaxed pb-5">
          {answer}
        </p>
      </AnimateHeight>
    </div>
  );
}

function AnimateHeight({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <motion.div
      initial={false}
      animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{ overflow: 'hidden' }}
    >
      {children}
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────
export function ServiceDetailClient({ slug }: { slug: string }) {
  const { data: service, isLoading, error, refetch } = useService(slug);
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const [iconError, setIconError] = useState(false);

  const Icon = serviceIconMap[slug] ?? ShoppingBag;
  const framing = SERVICE_BUSINESS_FRAMING[slug] ?? DEFAULT_FRAMING;
  const iconSrc = service?.iconImage ? getOptimizedUrl(service.iconImage) : null;

  // ─── Loading ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 animate-pulse" aria-busy="true" aria-label="Loading service">
        <div className="section-container space-y-10 max-w-4xl">
          <div className="h-3 w-28 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
          <div className="h-14 w-2/3 bg-zinc-100 dark:bg-zinc-800 rounded-2xl" />
          <div className="h-5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
          <div className="h-5 w-5/6 bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
          <div className="grid md:grid-cols-2 gap-10 mt-6">
            <div className="h-40 bg-zinc-100 dark:bg-zinc-800 rounded-2xl" />
            <div className="h-40 bg-zinc-100 dark:bg-zinc-800 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  // ─── Error ────────────────────────────────────────────────────────
  if (error || !service) {
    return (
      <div className="min-h-[70vh] pt-24 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
            <span className="text-2xl" role="img" aria-hidden="true">⚠</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
            Page not found
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8 text-[15px]">
            {error?.message ?? "This service page doesn't exist or has moved."}
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/services" className="btn-primary px-6 py-2.5">All solutions</Link>
            <button onClick={() => refetch()} className="btn-secondary px-6 py-2.5">Try again</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Reading progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-brand-500 z-50 origin-left"
        style={{ scaleX: progressWidth }}
        aria-hidden="true"
      />

      <main id="main-content">

        {/* ═════════════════════════════════════════════════════════════
            HERO — split: copy left, big image card right
        ═════════════════════════════════════════════════════════════ */}
        <section
          className="pt-24 pb-24 bg-white dark:bg-zinc-950 overflow-hidden"
          aria-label="Service overview"
        >
          <div className="section-container">
            {/* Back */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-sm text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors mb-12 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
                All solutions
              </Link>
            </motion.div>

            <div className="grid lg:grid-cols-[1.05fr_1fr] gap-14 lg:gap-10 items-center">
              {/* ─── Left: copy ─────────────────────────────────────── */}
              <motion.div
                initial={false}
                animate="visible"
                variants={stagger}
              >
                {/* Icon */}
                <motion.div variants={fadeUp} className="mb-8">
                  <div className="w-14 h-14 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-brand-600 dark:text-brand-400" strokeWidth={1.5} aria-hidden="true" />
                  </div>
                </motion.div>

                <motion.p
                  variants={fadeUp}
                  className="text-xs font-semibold tracking-[0.18em] uppercase text-brand-600 dark:text-brand-400 mb-4"
                >
                  Built for Grocery, Bakery & Specialty Food Businesses
                </motion.p>

                <motion.h1
                  variants={fadeUp}
                  className="font-display text-4xl md:text-5xl lg:text-[3.4rem] font-bold text-zinc-900 dark:text-zinc-50 leading-[1.06] tracking-tight mb-6"
                >
                  {service.name}
                </motion.h1>

                <motion.p
                  variants={fadeUp}
                  className="text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl mb-10"
                >
                  {service.shortDescription}
                </motion.p>

                <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 text-sm font-semibold hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                  >
                    Discuss this for your store
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                  <span className="text-sm text-zinc-400 dark:text-zinc-500">
                    Free 20-minute grocery strategy call
                  </span>
                </motion.div>
              </motion.div>

              {/* ─── Right: big image card ──────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                className="relative"
              >
                <div className="relative aspect-[4/5] sm:aspect-[5/5.2] lg:aspect-[4/5] w-full rounded-[2rem] overflow-hidden border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.18)] dark:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
                  {iconSrc && !iconError ? (
                    <Image
                      src={iconSrc}
                      alt={service.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      className="object-cover"
                      onError={() => setIconError(true)}
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 via-zinc-50 to-amber-50 dark:from-emerald-950/30 dark:via-zinc-900 dark:to-amber-950/20">
                      <Icon
                        className="w-28 h-28 text-brand-500/40 dark:text-brand-400/30"
                        strokeWidth={1}
                        aria-hidden="true"
                      />
                    </div>
                  )}

                  {/* Subtle gradient for legibility if badges sit on top */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none" />

                  {/* Floating badge */}
                  <div className="absolute top-5 left-5">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3.5 py-2 rounded-full bg-white/95 dark:bg-zinc-900/90 text-zinc-800 dark:text-zinc-100 backdrop-blur-sm border border-white/60 dark:border-zinc-700 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" aria-hidden="true" />
                      For Food & Grocery Businesses
                    </span>
                  </div>
                </div>

                {/* Decorative accent block behind the card */}
                <div
                  className="absolute -z-10 -bottom-6 -right-6 w-2/3 h-2/3 rounded-[2rem] bg-gradient-to-br from-brand-100 to-amber-100 dark:from-brand-900/20 dark:to-amber-900/10"
                  aria-hidden="true"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── Divider ──────────────────────────────────────────────── */}
        <div className="border-t border-zinc-100 dark:border-zinc-800" />

        {/* ═════════════════════════════════════════════════════════════
            BUSINESS CHALLENGE
        ═════════════════════════════════════════════════════════════ */}
        <Section
          className="bg-zinc-50 dark:bg-zinc-900"
          label="Business challenge"
        >
          <div className="section-container max-w-3xl">
            <Eyebrow>The Problem</Eyebrow>
            <SectionHeading>What your business is dealing with right now</SectionHeading>
            <motion.p
              variants={fadeUp}
              className="text-lg text-zinc-600 dark:text-zinc-300 leading-[1.8]"
            >
              {framing.challenge}
            </motion.p>
          </div>
        </Section>

        {/* ═════════════════════════════════════════════════════════════
            WHY IT MATTERS
        ═════════════════════════════════════════════════════════════ */}
        <Section
          className="bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800"
          label="Why this matters"
        >
          <div className="section-container max-w-3xl">
            <Eyebrow>Why This Matters</Eyebrow>
            <SectionHeading>What changes when you solve it</SectionHeading>
            <motion.p
              variants={fadeUp}
              className="text-lg text-zinc-600 dark:text-zinc-300 leading-[1.8]"
            >
              {framing.whyItMatters}
            </motion.p>
          </div>
        </Section>

        {/* ═════════════════════════════════════════════════════════════
            OUR APPROACH
        ═════════════════════════════════════════════════════════════ */}
        <Section
          className="bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800"
          label="Our approach"
        >
          <div className="section-container max-w-3xl">
            <Eyebrow>How We Think</Eyebrow>
            <SectionHeading>Our approach before we write any code</SectionHeading>
            <motion.p
              variants={fadeUp}
              className="text-lg text-zinc-600 dark:text-zinc-300 leading-[1.8]"
            >
              {framing.approach}
            </motion.p>
          </div>
        </Section>

        {/* ═════════════════════════════════════════════════════════════
            WHAT'S INCLUDED (FEATURES)
        ═════════════════════════════════════════════════════════════ */}
        {service.features && service.features.length > 0 && (
          <Section
            className="bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800"
            label="What is included"
          >
            <div className="section-container max-w-4xl">
              <Eyebrow>What's Included</Eyebrow>
              <SectionHeading>Everything your business gets</SectionHeading>
              <motion.ul
                variants={stagger}
                className="mt-4 space-y-3"
                role="list"
              >
                {service.features.map((item: ServiceFeatureResponse, idx: number) => (
                  <motion.li
                    key={item.id}
                    variants={fadeUp}
                    className="flex items-start gap-4 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors"
                  >
                    <CheckCircle2
                      className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-[15px]">
                        {item.feature.name}
                      </p>
                      {item.feature.description && (
                        <p className="text-[14px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                          {item.feature.description}
                        </p>
                      )}
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </Section>
        )}

        {/* ═════════════════════════════════════════════════════════════
            IMPLEMENTATION PROCESS
        ═════════════════════════════════════════════════════════════ */}
        <Section
          className="bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800"
          label="How we work"
        >
          <div className="section-container max-w-4xl">
            <Eyebrow>How We Work</Eyebrow>
            <SectionHeading>From conversation to running system</SectionHeading>
            <motion.ol
              variants={stagger}
              className="mt-8 space-y-0"
              role="list"
              aria-label="Implementation process"
            >
              {framing.process.map(({ step, description }, i) => (
                <motion.li
                  key={step}
                  variants={fadeUp}
                  className="relative flex gap-6 pb-10 last:pb-0"
                >
                  {/* Vertical connector */}
                  {i < framing.process.length - 1 && (
                    <div className="absolute left-5 top-10 bottom-0 w-px bg-zinc-200 dark:bg-zinc-700" aria-hidden="true" />
                  )}
                  {/* Step number */}
                  <div className="w-10 h-10 rounded-full border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 flex items-center justify-center flex-shrink-0 z-10">
                    <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="pt-1.5">
                    <p className="font-display font-bold text-zinc-900 dark:text-zinc-50 mb-1.5">
                      {step}
                    </p>
                    <p className="text-[15px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {description}
                    </p>
                  </div>
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </Section>

        {/* ═════════════════════════════════════════════════════════════
            TECHNOLOGY (business language)
        ═════════════════════════════════════════════════════════════ */}
        {service.technologies && service.technologies.length > 0 && (
          <Section
            className="bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800"
            label="Technology"
          >
            <div className="section-container max-w-4xl">
              <Eyebrow>Under the Hood</Eyebrow>
              <SectionHeading>Built to stay reliable</SectionHeading>
              <motion.p
                variants={fadeUp}
                className="text-lg text-zinc-600 dark:text-zinc-300 leading-[1.8] mb-10"
              >
                We choose tools based on how well they serve a grocery, bakery, or specialty
                food business — not how recently they were released. Every tool in this stack
                was chosen because it keeps your store fast, secure, and running without you
                needing to think about it.
              </motion.p>
              <motion.div
                variants={fadeUp}
                className="flex flex-wrap gap-2"
              >
                {service.technologies.map((item: ServiceTechnologyResponse) => (
                  <Link
                    key={item.id}
                    href={`/technologies/${item.technology.slug}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-[13px] font-medium text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-500 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  >
                    {item.technology.iconImage && (
                      <Image
                        src={getOptimizedUrl(item.technology.iconImage)}
                        alt=""
                        width={16}
                        height={16}
                        className="w-4 h-4 object-contain"
                      />
                    )}
                    {item.technology.name}
                    <ChevronRightIcon className="w-3 h-3 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                ))}
              </motion.div>
            </div>
          </Section>
        )}

        {/* ═════════════════════════════════════════════════════════════
            LONG DESCRIPTION (if provided)
        ═════════════════════════════════════════════════════════════ */}
        {service.longDescription && (
          <Section
            className="bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800"
            label="Full description"
          >
            <div className="section-container max-w-3xl">
              <Eyebrow>More Detail</Eyebrow>
              <SectionHeading>A closer look</SectionHeading>
              <motion.div variants={fadeUp}>
                {service.longDescription.split('\n').filter(Boolean).map((para, i) => (
                  <p key={i} className="text-lg text-zinc-600 dark:text-zinc-300 leading-[1.8] mb-5 last:mb-0">
                    {para}
                  </p>
                ))}
              </motion.div>
            </div>
          </Section>
        )}

        {/* ═════════════════════════════════════════════════════════════
            FAQ
        ═════════════════════════════════════════════════════════════ */}
        <Section
          className="bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800"
          label="Frequently asked questions"
        >
          <div className="section-container max-w-3xl">
            <Eyebrow>Questions</Eyebrow>
            <SectionHeading>Things business owners usually ask us</SectionHeading>
            <motion.div variants={fadeUp} className="mt-8">
              {framing.faq.map(({ question, answer }) => (
                <FaqItem key={question} question={question} answer={answer} />
              ))}
            </motion.div>
          </div>
        </Section>

        {/* ═════════════════════════════════════════════════════════════
            INLINE CTA
        ═════════════════════════════════════════════════════════════ */}
        <Section
          className="bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800"
          label="Get started"
        >
          <div className="section-container max-w-4xl">
            <motion.div
              variants={fadeUp}
              className="p-10 md:p-14 rounded-3xl bg-white dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-700 flex flex-col md:flex-row md:items-center gap-8"
            >
              <div className="flex-1">
                <p className="text-xs font-semibold tracking-[0.16em] uppercase text-brand-600 dark:text-brand-400 mb-3">
                  Ready to move forward?
                </p>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-50 leading-snug">
                  Let's talk about your store and what this would look like for you.
                </h3>
              </div>
              <div className="flex flex-col gap-3 flex-shrink-0">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 text-sm font-semibold hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                >
                  Start the conversation
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                >
                  See our case studies
                </Link>
              </div>
            </motion.div>
          </div>
        </Section>

        <ContactCta />
      </main>
    </>
  );
}