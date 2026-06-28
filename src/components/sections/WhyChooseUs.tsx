'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// All section copy lives here, separate from layout/motion logic.
const SECTION_CONTENT = {
  eyebrow: 'Not Another Software Pitch',
  headlineLine1: "The Trust You've Built In-Store",
  headlineLine2: 'Deserves to Carry Online.',
  subtitle: 'We start with how grocery stores earn customers back. Technology comes second.',
  closingStatement:
    "However many years you've spent earning their trust, we make sure your website never undoes it.",
  ctaPrompt: 'Ready to see what this could look like for your grocery business?',
  ctaButton: { label: 'Book Free Strategy Call', href: '/contact' },
};

// Each entry is a lived outcome for the store owner — never a feature.
const reasons = [
  {
    title: 'Customers Find What They Need, Every Time.',
    desc: "When your shelves and your website finally agree, nobody clicks away disappointed — and nobody walks out empty-handed.",
  },
  {
    title: 'Checkout Feels Effortless.',
    desc: "A few taps, and they're done. No second-guessing, no abandoned carts, no reason to go elsewhere.",
  },
  {
    title: 'Customers Come Back More Often.',
    desc: 'A good first order is luck. A good experience every single time is what brings them back next week, and the week after.',
  },
  {
    title: 'Running the Store Feels Lighter.',
    desc: 'Less time untangling orders and updates. More time on the floor, with your customers, where it actually matters.',
  },
  {
    title: 'Pickup and Delivery, On Their Terms.',
    desc: "Today's shoppers expect to choose how they get their groceries. Now you can offer it without adding to your workload.",
  },
  {
    title: 'A Partner Who Stays.',
    desc: "We don't disappear after launch. As your store grows, we're still here — adjusting, improving, showing up.",
  },
];

export function WhyChooseUs() {
  const prefersReducedMotion = useReducedMotion();

  const introContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.12 } },
  };
  const introItem = {
    initial: { opacity: 0, y: 24 },
    whileInView: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section className="relative overflow-hidden bg-raised py-20 md:py-36">
      {/* Ambient depth — subtle, no flashy effects */}
      <div
        aria-hidden="true"
        className="absolute -top-32 right-0 w-[500px] h-[500px] rounded-full bg-brand-500/5 blur-[160px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 -left-32 w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[160px] pointer-events-none"
      />

      <div className="relative z-10 section-container">
        {/* Eyebrow + headline + subtitle */}
        <motion.div
          variants={introContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: '-100px' }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <motion.span
            variants={introItem}
            className="text-xs font-semibold tracking-widest text-brand-400 uppercase"
          >
            {SECTION_CONTENT.eyebrow}
          </motion.span>
          <motion.h2
            variants={introItem}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary mt-4 tracking-tight leading-[1.1]"
          >
            {SECTION_CONTENT.headlineLine1}
            <br />
            <span className="bg-gradient-to-r from-brand-400 via-[var(--color-text-primary)] to-brand-300 bg-clip-text text-transparent">
              {SECTION_CONTENT.headlineLine2}
            </span>
          </motion.h2>
          <motion.p variants={introItem} className="text-lg md:text-xl text-secondary mt-6 leading-relaxed">
            {SECTION_CONTENT.subtitle}
          </motion.p>
        </motion.div>

        {/* Transformation cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                delay: i * 0.08,
                duration: prefersReducedMotion ? 0 : 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={prefersReducedMotion ? undefined : { y: -4 }}
              className="group p-8 rounded-2xl bg-card border border-default hover:bg-[var(--color-card-hover)] hover:border-brand-500/30 hover:shadow-2xl hover:shadow-black/20 transition-all duration-300"
            >
              <div className="h-px w-12 bg-gradient-to-r from-brand-400 to-transparent mb-6 transition-all duration-300 group-hover:w-16" />
              <h3 className="font-display font-semibold text-primary text-xl mb-3 leading-snug">
                {reason.title}
              </h3>
              <p className="text-base text-secondary leading-relaxed">{reason.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Closing statement + CTA — a continuation, not a banner */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mt-24 pt-16 border-t border-default"
        >
          <p className="font-display text-2xl md:text-3xl font-semibold text-primary leading-snug mb-8">
            {SECTION_CONTENT.closingStatement}
          </p>
          <p className="text-lg text-secondary mb-6">{SECTION_CONTENT.ctaPrompt}</p>
          <Link
            href={SECTION_CONTENT.ctaButton.href}
            className="btn-primary text-base px-8 py-4 shadow-xl hover:shadow-brand-500/30 transition-all duration-300 inline-flex"
          >
            {SECTION_CONTENT.ctaButton.label} <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}