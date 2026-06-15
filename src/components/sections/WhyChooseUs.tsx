'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowRight, ChevronDown, Shield, Zap, Users, Award, Clock, HeartHandshake } from 'lucide-react';
import { cn } from '@/lib/utils';

// Minimal header component (no extra padding)
function CompactHeader({ eyebrow, title, centered = false }: { eyebrow: string; title: string; centered?: boolean }) {
  return (
    <div className={cn('mb-8', centered && 'text-center')}>
      <span className="text-xs font-semibold tracking-wider text-brand-500 uppercase">{eyebrow}</span>
      <h2 className="font-display text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
        {title}
      </h2>
    </div>
  );
}

// ─── Why Choose Us – Compact ─────────────────────────────────
const reasons = [
  { icon: Zap, title: 'Fast Delivery', description: 'On time, within budget.' },
  { icon: Shield, title: 'Battle‑tested Stack', description: 'Modern, scalable tech.' },
  { icon: Users, title: 'Dedicated Team', description: 'Seniors only, no juniors.' },
  { icon: Award, title: 'Quality First', description: 'Clean code, full testing.' },
  { icon: Clock, title: 'Post‑launch Support', description: '3 months free.' },
  { icon: HeartHandshake, title: 'Transparent Process', description: 'Weekly updates.' },
];

export function WhyChooseUs() {
  return (
    <section className="py-12 border-y border-zinc-100 dark:border-zinc-800">
      <div className="section-container">
        <CompactHeader eyebrow="Why BrizerHero" title="The Agency That Actually Delivers" centered />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/30 flex items-center justify-center flex-shrink-0">
                <reason.icon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm text-zinc-900 dark:text-zinc-100">{reason.title}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-tight">{reason.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Process Section – Compact Grid ─────────────────────────
const steps = [
  { label: 'Discovery', description: 'Understand goals & requirements.' },
  { label: 'Planning', description: 'Architecture & timeline.' },
  { label: 'Design', description: 'High‑fidelity prototypes.' },
  { label: 'Development', description: 'Agile sprints, weekly demos.' },
  { label: 'Testing', description: 'QA, security, performance.' },
  { label: 'Launch', description: 'Zero‑downtime deployment.' },
];

export function ProcessSection() {
  return (
    <section className="py-12 bg-zinc-50 dark:bg-zinc-950">
      <div className="section-container">
        <CompactHeader eyebrow="Our Process" title="How We Build Your Product" centered />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-3 p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800"
            >
              <div className="text-xl font-display font-bold text-brand-500 w-7">0{i + 1}</div>
              <div>
                <h3 className="font-display font-semibold text-sm text-zinc-900 dark:text-zinc-100">{step.label}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-tight">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ Section – Compact Accordion ────────────────────────
const faqs = [
  { q: 'How long does it take to build a website?', a: '4–8 weeks for standard sites, 8–16 weeks for complex ecommerce or web apps.' },
  { q: 'What is included in post-launch support?', a: '3 months of free bug fixes, performance monitoring, and minor updates.' },
  { q: 'Do you work with international clients?', a: 'Yes, we work worldwide and are experienced with remote collaboration.' },
  { q: 'Can I see your previous work?', a: 'Yes – check our Projects page or ask for references.' },
  { q: 'What information do you need to get started?', a: 'Business overview, target audience, key features, timeline & budget.' },
  { q: 'Do you offer custom pricing?', a: 'Yes – contact us for a custom quote.' },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-zinc-100 dark:border-zinc-800">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-3 text-left"
      >
        <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{q}</span>
        <ChevronDown className={cn('w-4 h-4 text-zinc-400 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="pb-3"
        >
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{a}</p>
        </motion.div>
      )}
    </div>
  );
}

export function FaqSection() {
  return (
    <section className="py-12">
      <div className="section-container">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <CompactHeader eyebrow="FAQ" title="Questions? We Have Answers." />
            <Link href="/contact" className="btn-primary text-sm px-5 py-2.5 inline-flex mt-2">
              Ask a Question <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="lg:col-span-3">
            {faqs.map((faq) => <FaqItem key={faq.q} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Contact CTA – Compact but still inviting ───────────────
export function ContactCta() {
  return (
    <section className="py-12">
      <div className="section-container">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-brand-600 to-purple-700 p-8 text-center shadow-md">
          <div className="relative z-10">
            <p className="text-brand-100 text-xs font-semibold tracking-wider uppercase mb-2">Ready to Build?</p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
              Let's Turn Your Vision Into Reality
            </h2>
            <p className="text-white/70 text-sm mb-4">
              Free 30‑min consultation – no commitment.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-white text-brand-700 font-semibold text-sm hover:bg-white/90 transition shadow">
                Book Free Consultation <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link href="/packages" className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg border border-white/30 bg-white/10 text-white font-semibold text-sm hover:bg-white/15 transition">
                View Packages
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}