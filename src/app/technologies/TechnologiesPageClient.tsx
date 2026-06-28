'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ShieldCheck,
  Boxes,
  Gauge,
  Layers,
  Cpu,
  AlertCircle,
} from 'lucide-react';
import { useTechnologies } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import { ContactCta } from '@/components/sections/ContactCta';
import { getTechMetadata } from '@/lib/techMetadata';
import { getTechBusinessContent, trustIndicatorMeta, type TrustIndicator } from '@/lib/techBusinessContent';
import type { TechnologyResponse } from '@/types';

// ─── Trust Indicator Icons ──────────────────────────────────────────────
const trustIconMap: Record<TrustIndicator, React.ElementType> = {
  'Production Ready': ShieldCheck,
  'Enterprise Standard': Layers,
  'Battle Tested': Gauge,
  'Core Infrastructure': Cpu,
  'Customer Experience': Boxes,
};

const EASE = [0.16, 1, 0.3, 1] as const;

// ─── Capability Card ─────────────────────────────────────────────────────
function CapabilityCard({ tech, index }: { tech: TechnologyResponse; index: number }) {
  const [iconError, setIconError] = useState(false);
  const iconSrc = tech.iconImage ? getOptimizedUrl(tech.iconImage) : null;
  const metadata = getTechMetadata(tech.slug);
  const content = getTechBusinessContent(tech.slug, tech.name, tech.description);
  const TrustIcon = trustIconMap[content.trust];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: Math.min(index * 0.035, 0.28), duration: 0.5, ease: EASE }}
      className="
        group relative flex h-full flex-col overflow-hidden rounded-[28px] p-8
        bg-white border border-[#ECEBE6]
        shadow-[0_1px_2px_rgba(20,23,26,0.03)]
        transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        hover:-translate-y-[3px] hover:border-[#DEDCD4]
        hover:shadow-[0_24px_48px_-16px_rgba(20,23,26,0.10)]
        dark:bg-[#131316] dark:border-[#222226]
        dark:shadow-none
        dark:hover:border-[#34343B] dark:hover:bg-[#16161A]
        dark:hover:shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_24px_48px_-20px_rgba(0,0,0,0.6)]
      "
    >
      {/* ─── Icon Stage ──────────────────────────────────────────────── */}
      <div className="mb-7 flex items-center justify-between">
        <div
          className="
            relative flex h-20 w-20 items-center justify-center rounded-[20px]
            bg-gradient-to-b from-[#FBFAF7] to-[#F3F1EB]
            ring-1 ring-inset ring-[#EAE8E1]
            shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_1px_2px_rgba(20,23,26,0.04)]
            transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
            group-hover:scale-[1.04]
            dark:bg-gradient-to-b dark:from-[#1C1C21] dark:to-[#17171B]
            dark:ring-[#2A2A31]
            dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]
          "
        >
          {iconSrc && !iconError ? (
            <Image
              src={iconSrc}
              alt={tech.name}
              width={44}
              height={44}
              className="h-11 w-11 object-contain dark:brightness-[1.15] dark:contrast-[1.05]"
              onError={() => setIconError(true)}
              unoptimized
            />
          ) : (
            <span className="text-[26px] font-semibold text-[#8A8472] dark:text-[#7A7A85]">
              {tech.name.charAt(0)}
            </span>
          )}
        </div>

        <span className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#ADABA1] dark:text-[#5C5C66]">
          {metadata.category}
        </span>
      </div>

      {/* Name + what it is */}
      <h3 className="font-display text-[21px] font-semibold leading-snug tracking-tight text-[#14171A] mb-2.5 dark:text-[#F3F3F5]">
        {tech.name}
      </h3>
      <p className="text-[14.5px] leading-relaxed text-[#6B6F73] mb-6 dark:text-[#9A9AA3]">
        {content.whatItIs}
      </p>

      {/* Why we use it */}
      <div className="mb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#B5B3A8] mb-2 dark:text-[#5C5C66]">
          Why we use it
        </p>
        <p className="text-[14px] leading-relaxed text-[#3C3F42] dark:text-[#C2C2C9]">
          {content.whyWeUseIt}
        </p>
      </div>

      {/* Business benefit — set apart visually */}
      <div
        className="
          mt-auto mb-7 rounded-2xl p-5
          bg-[#F8F7F3] dark:bg-[#1A1A1E]
          ring-1 ring-inset ring-[#F0EEE8] dark:ring-[#232328]
        "
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#7C8B81] mb-2 dark:text-[#5FA088]">
          What it means for your business
        </p>
        <p className="text-[14px] leading-relaxed text-[#1F2A24] dark:text-[#D6DAD7]">
          {content.businessBenefit}
        </p>
      </div>

      {/* Footer: trust indicator + link */}
      <div className="flex items-center justify-between pt-5 border-t border-[#F0EEE8] dark:border-[#222226]">
        <span className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[#3C3F42] dark:text-[#C2C2C9]">
          <TrustIcon className="h-3.5 w-3.5 text-[#1F4D3D] dark:text-[#5FBE9B]" strokeWidth={2} />
          {content.trust}
        </span>
        <Link
          href={`/technologies/${tech.slug}`}
          className="
            inline-flex items-center gap-1 text-[13px] font-medium
            text-[#14171A] dark:text-[#F3F3F5]
            transition-all duration-300 group-hover:gap-2
          "
        >
          Details
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────
export function TechnologiesPageClient() {
  const { data: technologies, isLoading } = useTechnologies();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => {
    if (!technologies) return ['All'];
    const cats = new Set(technologies.map((t) => getTechMetadata(t.slug).category));
    return ['All', ...Array.from(cats)];
  }, [technologies]);

  const filteredTechs = useMemo(() => {
    if (!technologies) return [];
    if (selectedCategory === 'All') return technologies;
    return technologies.filter((t) => getTechMetadata(t.slug).category === selectedCategory);
  }, [technologies, selectedCategory]);

  const trustSummary = [
    { label: 'Built for peak demand', sub: 'Engineered to hold steady during your busiest hours' },
    { label: 'Operated end-to-end', sub: 'We run and maintain it — your team runs the store' },
    { label: 'Proven before it reaches you', sub: 'Every layer has a track record at real business scale' },
  ];

  return (
    <div className="bg-[#FBFBF9] dark:bg-[#0A0A0B]">
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-24">
        <div className="section-container max-w-3xl mx-auto text-center">
          <span className="inline-block text-[12px] font-semibold uppercase tracking-[0.16em] text-[#1F4D3D] dark:text-[#5FBE9B] mb-6">
            The platform behind your platform
          </span>
          <h1 className="font-display text-[42px] md:text-[56px] font-semibold leading-[1.06] tracking-tight text-[#14171A] dark:text-[#F7F7F8] mb-7">
            The foundation your grocery business runs on
          </h1>
          <p className="text-[17px] md:text-[19px] leading-relaxed text-[#6B6F73] dark:text-[#9A9AA3] max-w-2xl mx-auto">
            Every component of your platform is chosen for one reason: it holds up when your
            business needs it most — at checkout, at restock, and on your busiest day of the year.
          </p>
        </div>

        {/* Trust summary strip */}
        <div className="section-container max-w-4xl mx-auto mt-20">
          <div
            className="
              grid grid-cols-1 md:grid-cols-3
              rounded-[24px] overflow-hidden
              border border-[#ECEBE6] dark:border-[#1F1F24]
              divide-y md:divide-y-0 md:divide-x divide-[#ECEBE6] dark:divide-[#1F1F24]
              bg-white dark:bg-[#111114]
              shadow-[0_1px_2px_rgba(20,23,26,0.03)] dark:shadow-none
            "
          >
            {trustSummary.map((item, idx) => (
              <div key={idx} className="px-8 py-8">
                <p className="text-[15px] font-semibold text-[#14171A] dark:text-[#F3F3F5] mb-1.5">{item.label}</p>
                <p className="text-[13.5px] leading-relaxed text-[#9C9B91] dark:text-[#73737E]">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Category Filter ─────────────────────────────────────────── */}
      <div className="section-container py-12 border-t border-b border-[#ECEBE6] dark:border-[#1A1A1E]">
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-[13.5px] font-medium transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-[#14171A] text-white dark:bg-[#F3F3F5] dark:text-[#0A0A0B]'
                  : 'bg-transparent border border-[#ECEBE6] text-[#6B6F73] hover:border-[#D5D2C8] hover:text-[#14171A] dark:border-[#222226] dark:text-[#9A9AA3] dark:hover:border-[#34343B] dark:hover:text-[#F3F3F5]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Grid ────────────────────────────────────────────────────── */}
      <section className="page-section">
        <div className="section-container">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
              >
                {Array(6).fill(0).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-[28px] border border-[#ECEBE6] bg-white p-8 dark:border-[#222226] dark:bg-[#131316]"
                  >
                    <div className="flex items-center justify-between mb-7">
                      <div className="skeleton h-20 w-20 rounded-[20px]" />
                      <div className="skeleton h-3 w-14 rounded" />
                    </div>
                    <div className="skeleton h-5 w-2/3 rounded mb-3" />
                    <div className="skeleton h-4 w-full rounded mb-2" />
                    <div className="skeleton h-4 w-5/6 rounded mb-6" />
                    <div className="skeleton h-24 w-full rounded-2xl mb-7" />
                    <div className="skeleton h-4 w-24 rounded" />
                  </div>
                ))}
              </motion.div>
            ) : filteredTechs.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center text-center py-24"
              >
                <AlertCircle className="h-6 w-6 text-[#D5D2C8] dark:text-[#3A3A42] mb-3" />
                <p className="text-[#9C9B91] dark:text-[#73737E] text-[14.5px]">
                  Nothing in this category yet — choose another above to keep exploring.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 items-stretch"
              >
                {filteredTechs.map((tech, i) => (
                  <CapabilityCard key={tech.id} tech={tech} index={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ─── How it comes together ──────────────────────────────────── */}
      <section className="py-20 border-t border-[#ECEBE6] dark:border-[#1A1A1E]">
        <div className="section-container max-w-3xl mx-auto text-center">
          <h2 className="font-display text-[32px] md:text-[40px] font-semibold tracking-tight text-[#14171A] dark:text-[#F7F7F8] mb-5">
            One platform, working as a single system
          </h2>
          <p className="text-[16.5px] leading-relaxed text-[#6B6F73] dark:text-[#9A9AA3] mb-16 max-w-xl mx-auto">
            You don't need to know how these pieces fit together — that's our job. What matters is
            what they do for your business, together, every single day.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
            <div className="rounded-[20px] bg-white border border-[#ECEBE6] p-7 shadow-[0_1px_2px_rgba(20,23,26,0.03)] dark:bg-[#131316] dark:border-[#222226] dark:shadow-none">
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.07em] text-[#1F4D3D] dark:text-[#5FBE9B] mb-3">Customer-facing</p>
              <p className="text-[14.5px] leading-relaxed text-[#3C3F42] dark:text-[#C2C2C9]">
                Your website and shopping app, built to stay fast and reliable under real shopping traffic.
              </p>
            </div>
            <div className="rounded-[20px] bg-white border border-[#ECEBE6] p-7 shadow-[0_1px_2px_rgba(20,23,26,0.03)] dark:bg-[#131316] dark:border-[#222226] dark:shadow-none">
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.07em] text-[#1F4D3D] dark:text-[#5FBE9B] mb-3">Operations</p>
              <p className="text-[14.5px] leading-relaxed text-[#3C3F42] dark:text-[#C2C2C9]">
                Inventory, pricing, and order logic that stays accurate across every store and channel.
              </p>
            </div>
            <div className="rounded-[20px] bg-white border border-[#ECEBE6] p-7 shadow-[0_1px_2px_rgba(20,23,26,0.03)] dark:bg-[#131316] dark:border-[#222226] dark:shadow-none">
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.07em] text-[#1F4D3D] dark:text-[#5FBE9B] mb-3">Trust &amp; security</p>
              <p className="text-[14.5px] leading-relaxed text-[#3C3F42] dark:text-[#C2C2C9]">
                Every connection and transaction protected to enterprise standards, by default.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ContactCta />
    </div>
  );
}