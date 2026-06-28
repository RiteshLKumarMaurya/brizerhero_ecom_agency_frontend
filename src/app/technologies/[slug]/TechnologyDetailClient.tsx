'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Boxes,
  Gauge,
  Layers,
  Cpu,
  AlertTriangle,
} from 'lucide-react';
import { useTechnology } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import { ContactCta } from '@/components/sections/ContactCta';
import { getTechMetadata } from '@/lib/techMetadata';
import { getTechBusinessContent, type TrustIndicator } from '@/lib/techBusinessContent';
import type { TechnologyLinkResponse } from '@/types';

interface Props {
  slug: string;
}

// ─── Trust Indicator Icons ──────────────────────────────────────────────
const trustIconMap: Record<TrustIndicator, React.ElementType> = {
  'Production Ready': ShieldCheck,
  'Enterprise Standard': Layers,
  'Battle Tested': Gauge,
  'Core Infrastructure': Cpu,
  'Customer Experience': Boxes,
};

const EASE = [0.16, 1, 0.3, 1] as const;

// ─── Animation Variants ──────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

// ─── Main Component ──────────────────────────────────────────────────────
export function TechnologyDetailClient({ slug }: Props) {
  const { data: tech, isLoading, error, refetch } = useTechnology(slug);
  const [iconError, setIconError] = useState(false);

  // ── Loading State ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 bg-[#FBFBF9] dark:bg-[#0A0A0B]">
        <div className="section-container max-w-3xl mx-auto">
          <div className="space-y-7 animate-pulse">
            <div className="skeleton h-4 w-28 rounded" />
            <div className="flex items-center gap-4">
              <div className="skeleton h-20 w-20 rounded-[20px]" />
              <div className="skeleton h-4 w-40 rounded" />
            </div>
            <div className="skeleton h-12 w-2/3 rounded-xl" />
            <div className="skeleton h-5 w-full rounded-lg" />
            <div className="skeleton h-5 w-5/6 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  // ── Error State ────────────────────────────────────────────────────────
  if (error || !tech) {
    return (
      <div className="min-h-[70vh] pt-24 flex items-center justify-center px-4 bg-[#FBFBF9] dark:bg-[#0A0A0B]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 mx-auto mb-7 rounded-[20px] bg-[#F3F1EB] dark:bg-[#16161A] ring-1 ring-inset ring-[#EAE8E1] dark:ring-[#222226] flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-[#8A8472] dark:text-[#7A7A85]" strokeWidth={1.75} />
          </div>
          <h1 className="font-display text-[28px] font-semibold text-[#14171A] dark:text-[#F7F7F8] mb-3 tracking-tight">
            We couldn't find this capability
          </h1>
          <p className="text-[#6B6F73] dark:text-[#9A9AA3] text-[15px] leading-relaxed mb-9">
            {error?.message || "This page may have moved or no longer exists. Let's get you back to the full list."}
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/technologies" className="btn-primary px-6 py-2.5">
              Back to Technologies
            </Link>
            <button onClick={() => refetch()} className="btn-secondary px-6 py-2.5">
              Try Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Derived Values ─────────────────────────────────────────────────────
  const iconSrc = tech.iconImage ? getOptimizedUrl(tech.iconImage) : null;
  const metadata = getTechMetadata(tech.slug);
  const content = getTechBusinessContent(tech.slug, tech.name, tech.description);
  const TrustIcon = trustIconMap[content.trust];
  const usedInProjects = metadata.usedInProjects;

  // Related technologies (kept as existing static demo data; presentation only)
  const relatedTechs = [
    { name: 'Spring Boot', slug: 'spring-boot' },
    { name: 'PostgreSQL', slug: 'postgresql' },
    { name: 'Redis', slug: 'redis' },
    { name: 'Kafka', slug: 'kafka' },
  ].filter((r) => r.slug !== tech.slug);

  return (
    <div className="bg-[#FBFBF9] dark:bg-[#0A0A0B]">
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-24 border-b border-[#ECEBE6] dark:border-[#1A1A1E]">
        <div className="section-container max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <Link
              href="/technologies"
              className="inline-flex items-center gap-2 text-[13.5px] font-medium text-[#9C9B91] dark:text-[#73737E] hover:text-[#14171A] dark:hover:text-[#F3F3F5] mb-12 transition-colors duration-300 group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
              All Technologies
            </Link>
          </motion.div>

          <motion.div variants={stagger} initial={false} animate="visible">
            {/* Icon stage + identity */}
            <motion.div variants={fadeUp} className="flex items-center gap-5 mb-9">
              <div
                className="
                  relative flex h-20 w-20 items-center justify-center rounded-[20px] flex-shrink-0
                  bg-gradient-to-b from-[#FBFAF7] to-[#F3F1EB]
                  ring-1 ring-inset ring-[#EAE8E1]
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_1px_2px_rgba(20,23,26,0.04)]
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

              <div className="flex flex-col gap-1.5">
                <span className="text-[12.5px] font-medium uppercase tracking-[0.07em] text-[#ADABA1] dark:text-[#5C5C66]">
                  {metadata.category}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[#1F4D3D] dark:text-[#5FBE9B]">
                  <TrustIcon className="h-3.5 w-3.5" strokeWidth={2} />
                  {content.trust}
                </span>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={fadeUp}
              className="font-display text-[44px] md:text-[54px] font-semibold leading-[1.05] tracking-tight text-[#14171A] dark:text-[#F7F7F8] mb-6"
            >
              {tech.name}
            </motion.h1>

            {/* What it is */}
            <motion.p variants={fadeUp} className="text-[18px] md:text-[19px] leading-relaxed text-[#3C3F42] dark:text-[#C2C2C9] mb-9 max-w-2xl">
              {content.whatItIs}
            </motion.p>

            {/* External links, de-emphasized */}
            {tech.links && tech.links.length > 0 && (
              <motion.div variants={fadeUp} className="flex flex-wrap gap-2.5">
                {tech.links.map((linkItem: TechnologyLinkResponse) => (
                  <a
                    key={linkItem.id}
                    href={linkItem.link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      inline-flex items-center gap-1.5 px-4 py-2 rounded-full
                      border border-[#ECEBE6] text-[13px] font-medium text-[#6B6F73]
                      hover:border-[#D5D2C8] hover:text-[#14171A]
                      dark:border-[#222226] dark:text-[#9A9AA3]
                      dark:hover:border-[#34343B] dark:hover:text-[#F3F3F5]
                      transition-all duration-300
                    "
                  >
                    {linkItem.link.name}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ─── Why We Chose This Technology ──────────────────────────────── */}
      <section className="page-section">
        <div className="section-container max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#B5B3A8] dark:text-[#5C5C66] mb-4">
              Why we chose it
            </p>
            <h2 className="font-display text-[30px] md:text-[36px] font-semibold tracking-tight text-[#14171A] dark:text-[#F7F7F8] mb-7">
              A deliberate decision, not a default
            </h2>
            <p className="text-[17px] leading-relaxed text-[#3C3F42] dark:text-[#C2C2C9]">
              {content.whyWeUseIt}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Where We Use It ───────────────────────────────────────────── */}
      <section className="py-24 border-y border-[#ECEBE6] dark:border-[#1A1A1E]">
        <div className="section-container max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#B5B3A8] dark:text-[#5C5C66] mb-4">
              Where it shows up
            </p>
            <h2 className="font-display text-[30px] md:text-[36px] font-semibold tracking-tight text-[#14171A] dark:text-[#F7F7F8] mb-10">
              Inside your grocery platform
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {content.whereWeUseIt.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, duration: 0.5, ease: EASE }}
                  className="
                    rounded-2xl px-6 py-5
                    bg-white border border-[#ECEBE6] shadow-[0_1px_2px_rgba(20,23,26,0.03)]
                    dark:bg-[#131316] dark:border-[#222226] dark:shadow-none
                  "
                >
                  <p className="text-[14.5px] leading-relaxed text-[#3C3F42] dark:text-[#C2C2C9]">{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Business Benefit (anchor moment) ──────────────────────────── */}
      <section className="py-20">
        <div className="section-container max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="
              rounded-[28px] px-9 py-14 md:px-14 md:py-16
              bg-[#14171A] dark:bg-[#111114]
              ring-1 ring-inset ring-white/[0.06]
              shadow-[0_32px_64px_-24px_rgba(20,23,26,0.35)] dark:shadow-none
            "
          >
            <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#7FAE99] mb-5">
              What it means for your business
            </p>
            <p className="font-display text-[26px] md:text-[31px] font-medium leading-[1.3] tracking-tight text-white max-w-2xl">
              {content.businessBenefit}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Key Capabilities ──────────────────────────────────────────── */}
      <section className="py-24 border-t border-[#ECEBE6] dark:border-[#1A1A1E]">
        <div className="section-container max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#B5B3A8] dark:text-[#5C5C66] mb-4">
              Key capabilities
            </p>
            <h2 className="font-display text-[30px] md:text-[36px] font-semibold tracking-tight text-[#14171A] dark:text-[#F7F7F8] mb-10">
              What this actually does for you
            </h2>
            <div className="space-y-3.5">
              {content.capabilities.map((capability, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, duration: 0.5, ease: EASE }}
                  className="
                    flex items-start gap-4 rounded-2xl px-6 py-5
                    bg-white border border-[#ECEBE6] shadow-[0_1px_2px_rgba(20,23,26,0.03)]
                    dark:bg-[#131316] dark:border-[#222226] dark:shadow-none
                  "
                >
                  <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-[#1F4D3D] dark:bg-[#5FBE9B] flex-shrink-0" />
                  <span className="text-[15px] leading-relaxed text-[#3C3F42] dark:text-[#C2C2C9]">{capability}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Projects Using This ───────────────────────────────────────── */}
      {usedInProjects && usedInProjects.length > 0 && (
        <section className="py-24 border-t border-[#ECEBE6] dark:border-[#1A1A1E]">
          <div className="section-container max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#B5B3A8] dark:text-[#5C5C66] mb-4">
                Proven in production
              </p>
              <h2 className="font-display text-[30px] md:text-[36px] font-semibold tracking-tight text-[#14171A] dark:text-[#F7F7F8] mb-10">
                Already running in platforms like yours
              </h2>
              <div className="flex flex-wrap gap-3">
                {usedInProjects.map((project, idx) => (
                  <span
                    key={idx}
                    className="
                      inline-flex items-center px-5 py-2.5 rounded-full text-[13.5px] font-medium
                      bg-[#F3F1EB] text-[#3C3F42]
                      dark:bg-[#16161A] dark:text-[#C2C2C9] dark:ring-1 dark:ring-inset dark:ring-[#222226]
                    "
                  >
                    {project}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── Related Technologies ──────────────────────────────────────── */}
      {relatedTechs.length > 0 && (
        <section className="py-24 border-t border-[#ECEBE6] dark:border-[#1A1A1E]">
          <div className="section-container max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#B5B3A8] dark:text-[#5C5C66] mb-4">
                Works alongside
              </p>
              <h2 className="font-display text-[30px] md:text-[36px] font-semibold tracking-tight text-[#14171A] dark:text-[#F7F7F8] mb-10">
                Related parts of your platform
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedTechs.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/technologies/${related.slug}`}
                    className="
                      group rounded-2xl px-5 py-6 text-center
                      bg-white border border-[#ECEBE6] shadow-[0_1px_2px_rgba(20,23,26,0.03)]
                      hover:-translate-y-[2px] hover:border-[#DEDCD4] hover:shadow-[0_16px_32px_-12px_rgba(20,23,26,0.10)]
                      dark:bg-[#131316] dark:border-[#222226] dark:shadow-none
                      dark:hover:border-[#34343B] dark:hover:bg-[#16161A]
                      transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]
                    "
                  >
                    <p className="text-[14.5px] font-medium text-[#14171A] dark:text-[#F3F3F5] mb-1">{related.name}</p>
                    <span className="text-[12.5px] text-[#ADABA1] dark:text-[#5C5C66] group-hover:text-[#6B6F73] dark:group-hover:text-[#9A9AA3] transition-colors duration-300">
                      View details →
                    </span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── FAQ ────────────────────────────────────────────────────────── */}
      <section className="py-24 border-t border-[#ECEBE6] dark:border-[#1A1A1E]">
        <div className="section-container max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#B5B3A8] dark:text-[#5C5C66] mb-4">
              Common questions
            </p>
            <h2 className="font-display text-[30px] md:text-[36px] font-semibold tracking-tight text-[#14171A] dark:text-[#F7F7F8] mb-10">
              What business owners ask us
            </h2>
            <div className="rounded-[24px] border border-[#ECEBE6] dark:border-[#222226] divide-y divide-[#ECEBE6] dark:divide-[#222226] overflow-hidden bg-white dark:bg-[#131316] shadow-[0_1px_2px_rgba(20,23,26,0.03)] dark:shadow-none">
              {content.faqs.map((faq, idx) => (
                <details key={idx} className="group px-7 py-6">
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <span className="text-[15.5px] font-medium text-[#14171A] dark:text-[#F3F3F5] pr-6">{faq.question}</span>
                    <span className="flex-shrink-0 h-6 w-6 rounded-full border border-[#ECEBE6] dark:border-[#2A2A31] flex items-center justify-center text-[#ADABA1] dark:text-[#73737E] text-[14px] group-open:rotate-45 transition-transform duration-300">
                      +
                    </span>
                  </summary>
                  <p className="text-[14.5px] leading-relaxed text-[#6B6F73] dark:text-[#9A9AA3] mt-3.5 pr-10">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Closing CTA ───────────────────────────────────────────────── */}
      <section className="py-20 border-t border-[#ECEBE6] dark:border-[#1A1A1E]">
        <div className="section-container max-w-3xl mx-auto text-center">
          <h2 className="font-display text-[30px] md:text-[36px] font-semibold tracking-tight text-[#14171A] dark:text-[#F7F7F8] mb-5">
            Curious how this fits your business?
          </h2>
          <p className="text-[16px] leading-relaxed text-[#6B6F73] dark:text-[#9A9AA3] mb-10 max-w-lg mx-auto">
            We'll walk you through exactly how {tech.name} — and everything around it — works
            together to support the way you run your stores.
          </p>
          <Link
            href="/contact"
            className="
              inline-flex items-center gap-2 px-8 py-3.5 rounded-full
              bg-[#14171A] text-white text-[14.5px] font-medium
              hover:bg-[#23262A]
              dark:bg-[#F3F3F5] dark:text-[#0A0A0B] dark:hover:bg-white
              shadow-[0_1px_2px_rgba(20,23,26,0.06)]
              transition-all duration-300 group
            "
          >
            Talk to us
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <ContactCta />
    </div>
  );
}