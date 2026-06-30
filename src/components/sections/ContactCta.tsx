'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface ContactCtaProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  trustLine?: string;
}

export function ContactCta({
  eyebrow = "For businesses that have already earned their reputation",
  title = "Your store took years to earn that trust.\nYour digital presence should be no different.",
  subtitle = "BrizerHero partners with grocery businesses to build digital experiences that reflect the care, quality, and trust you've already built — without disrupting what makes you exceptional.",
  primaryCtaText = "Book a Free Strategy Call",
  primaryCtaHref = "/contact",
  secondaryCtaText = "View Case Studies",
  secondaryCtaHref = "/projects",
  trustLine = "A focused conversation. No templates, no pressure — just a candid look at what's possible for your store.",
}: ContactCtaProps) {
  const ease = [0.25, 0.1, 0.25, 1] as const;

  return (
    <section
      aria-labelledby="cta-heading"
      className="
        relative overflow-hidden
        py-20 md:py-36
        /* Light: warm off-white, NOT white */
        bg-[#F7F6F3]
        /* Dark: near-black charcoal */
        dark:bg-[#09090B]
      "
    >
      {/* ── Background atmosphere ─────────────────────────────────────── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* LIGHT MODE */}
        {/* Centre warm glow */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
            w-[800px] h-[500px] rounded-full
            opacity-100 dark:opacity-0"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(22,163,74,0.07) 0%, transparent 65%)',
          }}
        />
        {/* Upper-left amber warmth */}
        <div
          className="absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full
            opacity-100 dark:opacity-0"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(251,191,36,0.05) 0%, transparent 60%)',
          }}
        />
        {/* Lower-right teal depth */}
        <div
          className="absolute -bottom-16 -right-16 w-[380px] h-[380px] rounded-full
            opacity-100 dark:opacity-0"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(20,184,166,0.04) 0%, transparent 60%)',
          }}
        />
        {/* Top hairline — light */}
        <div
          className="absolute top-0 inset-x-0 h-px opacity-100 dark:opacity-0"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.06) 30%, rgba(22,163,74,0.18) 50%, rgba(0,0,0,0.06) 70%, transparent 100%)',
          }}
        />
        {/* Bottom hairline — light */}
        <div
          className="absolute bottom-0 inset-x-0 h-px opacity-100 dark:opacity-0"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.05) 50%, transparent 100%)',
          }}
        />

        {/* DARK MODE */}
        {/* Centre emerald glow */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
            w-[900px] h-[600px] rounded-full
            opacity-0 dark:opacity-100"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(22,163,74,0.06) 0%, transparent 65%)',
          }}
        />
        {/* Upper-left amber */}
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full
            opacity-0 dark:opacity-100"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(251,191,36,0.04) 0%, transparent 65%)',
          }}
        />
        {/* Lower-right violet */}
        <div
          className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full
            opacity-0 dark:opacity-100"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(124,58,237,0.05) 0%, transparent 65%)',
          }}
        />
        {/* Top hairline — dark */}
        <div
          className="absolute top-0 inset-x-0 h-px opacity-0 dark:opacity-100"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 30%, rgba(134,239,172,0.12) 50%, rgba(255,255,255,0.05) 70%, transparent 100%)',
          }}
        />
        {/* Noise — dark only */}
        <div
          className="absolute inset-0 opacity-0 dark:opacity-[0.018]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '128px',
          }}
        />
      </div>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div className="section-container relative max-w-3xl mx-auto px-6 text-center">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease }}
        >
          <span
            className="
              inline-block text-[11px] font-medium tracking-[0.16em] uppercase mb-8 md:mb-10
              text-zinc-400 dark:text-white/35
            "
          >
            {eyebrow}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          id="cta-heading"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease, delay: 0.08 }}
          className="
            font-display font-semibold tracking-[-0.022em] whitespace-pre-line
            text-[2rem] leading-[1.18] md:text-[3.1rem] md:leading-[1.12]
            mb-6 md:mb-7
            text-zinc-900 dark:text-white
          "
        >
          {title}
        </motion.h2>

        {/* Supporting copy */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease, delay: 0.14 }}
          className="
            text-base md:text-[1.0625rem] leading-[1.75] max-w-xl mx-auto
            mb-11 md:mb-12
            text-zinc-500 dark:text-white/45
          "
        >
          {subtitle}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease, delay: 0.21 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 md:mb-9"
        >
          {/* Primary — dark surface on light bg, white surface on dark bg */}
          <Link
            href={primaryCtaHref}
            className="
              group inline-flex items-center gap-2.5
              px-7 py-3.5 rounded-[10px]
              text-[0.9375rem] font-semibold tracking-[-0.01em]
              transition-all duration-250 ease-out
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-offset-2

              /* Light: dark button */
              bg-zinc-900 text-white
              hover:bg-zinc-800
              focus-visible:ring-zinc-700 focus-visible:ring-offset-[#F7F6F3]
              [box-shadow:0_1px_2px_rgba(0,0,0,0.14),inset_0_1px_0_rgba(255,255,255,0.06)]
              hover:[box-shadow:0_4px_16px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.07)]

              /* Dark: white button */
              dark:bg-white dark:text-[#09090B]
              dark:hover:bg-white/92
              dark:focus-visible:ring-white/50 dark:focus-visible:ring-offset-[#09090B]
              dark:[box-shadow:0_1px_2px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.10)]
              dark:hover:[box-shadow:0_0_0_1px_rgba(255,255,255,0.12),0_8px_28px_rgba(0,0,0,0.35)]
            "
          >
            {primaryCtaText}
            <ArrowRight
              className="w-4 h-4 transition-transform duration-250 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>

          {/* Secondary */}
          <Link
            href={secondaryCtaHref}
            className="
              group inline-flex items-center gap-2.5
              px-7 py-3.5 rounded-[10px]
              text-[0.9375rem] font-semibold tracking-[-0.01em]
              transition-all duration-250 ease-out
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-offset-2

              /* Light */
              border border-black/[0.10] bg-white text-zinc-700
              hover:border-black/[0.16] hover:text-zinc-900 hover:bg-white
              focus-visible:ring-zinc-400 focus-visible:ring-offset-[#F7F6F3]
              [box-shadow:0_1px_2px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.04)]
              hover:[box-shadow:0_4px_12px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.07)]

              /* Dark */
              dark:border-white/[0.12] dark:bg-white/[0.04] dark:text-white/75
              dark:hover:border-white/[0.22] dark:hover:bg-white/[0.07] dark:hover:text-white
              dark:focus-visible:ring-white/35 dark:focus-visible:ring-offset-[#09090B]
              dark:[box-shadow:none]
            "
            style={{ backdropFilter: 'blur(8px)' }}
          >
            {secondaryCtaText}
            <ArrowRight
              className="w-4 h-4 transition-transform duration-250 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </motion.div>

        {/* Trust line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.30 }}
          className="
            text-[0.8125rem] leading-relaxed max-w-xs mx-auto
            text-zinc-400 dark:text-white/25
          "
        >
          {trustLine}
        </motion.p>
      </div>
    </section>
  );
}