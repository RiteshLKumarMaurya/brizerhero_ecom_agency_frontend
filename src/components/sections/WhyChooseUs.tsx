'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowRight, ChevronDown, Shield, Zap, Users, Award, Clock, HeartHandshake } from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { cn } from '@/lib/utils';

// ─── Why Choose Us ───────────────────────────────────────────
const reasons = [
  { icon: Zap, title: 'Fast Delivery', description: 'We move quickly without sacrificing quality. Most projects ship on time and within budget.' },
  { icon: Shield, title: 'Battle-tested Stack', description: 'We use modern, reliable technologies proven to scale for millions of users.' },
  { icon: Users, title: 'Dedicated Team', description: 'A senior team handles your project from day one — no juniors, no outsourcing.' },
  { icon: Award, title: 'Quality First', description: 'Clean code, detailed documentation, and thorough testing on every deliverable.' },
  { icon: Clock, title: 'Post-launch Support', description: '3 months of free support after launch. We don\'t disappear after delivery.' },
  { icon: HeartHandshake, title: 'Transparent Process', description: 'Weekly updates, open communication, and a dashboard to track your project in real time.' },
];

export function WhyChooseUs() {
  return (
    <section className="section-padding">
      <div className="section-container">
        <SectionHeader
          eyebrow="Why BrizerHero"
          title="The Agency That Actually Delivers"
          subtitle="We've heard the horror stories. Late projects, bloated budgets, unresponsive agencies. We're built to be different."
          centered
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex gap-4 p-5 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <reason.icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <h3 className="font-display font-bold text-zinc-900 dark:text-zinc-100 mb-1">{reason.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{reason.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Process Section ─────────────────────────────────────────
const steps = [
  { label: 'Discovery', description: 'We learn about your business, goals, audience, and requirements through structured discovery sessions.' },
  { label: 'Planning', description: 'Technical architecture, design system, sprint roadmap, and detailed project timeline agreed upfront.' },
  { label: 'Design', description: 'High-fidelity UI designs with interactive prototypes reviewed and approved before any code is written.' },
  { label: 'Development', description: 'Agile sprints with weekly demos. You see real progress every week, not a big reveal at the end.' },
  { label: 'Testing', description: 'Rigorous QA across devices and browsers. Performance, security, and accessibility audits included.' },
  { label: 'Launch', description: 'Smooth deployment with zero downtime. Full handover documentation and team training included.' },
];

export function ProcessSection() {
  return (
    <section className="section-padding bg-zinc-50 dark:bg-zinc-950">
      <div className="section-container">
        <SectionHeader
          eyebrow="Our Process"
          title="How We Build Your Product"
          subtitle="A proven 6-step process refined over dozens of successful projects."
          centered
        />

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-200 dark:bg-zinc-700 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white dark:bg-zinc-900 p-6 hover:bg-brand-50/30 dark:hover:bg-brand-950/20 transition-colors"
            >
              <div className="text-5xl font-display font-black text-zinc-100 dark:text-zinc-800 mb-3">
                0{i + 1}
              </div>
              <h3 className="font-display font-bold text-zinc-900 dark:text-zinc-100 mb-2">{step.label}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ Section ─────────────────────────────────────────────
const faqs = [
  { q: 'How long does it take to build a website?', a: 'A standard business website takes 4–8 weeks. Complex ecommerce or web apps take 8–16 weeks. We provide a detailed timeline after the discovery call.' },
  { q: 'What is included in post-launch support?', a: '3 months of free bug fixes, performance monitoring, and minor updates. Extended support plans are available for ongoing maintenance.' },
  { q: 'Do you work with international clients?', a: 'Absolutely. We work with clients worldwide and are experienced with remote collaboration, different time zones, and international payment methods.' },
  { q: 'Can I see your previous work?', a: 'Yes — check out our Projects page for case studies. We can also provide references and schedule calls with past clients on request.' },
  { q: 'What information do you need to get started?', a: 'A brief overview of your business, target audience, key features needed, preferred tech if any, and your timeline and budget range.' },
  { q: 'Do you offer custom pricing?', a: 'Yes. If our standard packages don\'t perfectly fit your needs, contact us for a custom quote. We\'re flexible and can work within most budgets.' },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-zinc-200 dark:border-zinc-800">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm md:text-base">{q}</span>
        <ChevronDown className={cn('w-5 h-5 text-zinc-400 flex-shrink-0 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="pb-5"
        >
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{a}</p>
        </motion.div>
      )}
    </div>
  );
}

export function FaqSection() {
  return (
    <section className="section-padding">
      <div className="section-container">
        <div className="grid lg:grid-cols-5 gap-16">
          <div className="lg:col-span-2">
            <SectionHeader
              eyebrow="FAQ"
              title="Questions? We Have Answers."
              subtitle="The most common questions from our clients before they start working with us."
            />
            <Link href="/contact" className="btn-primary mt-6 inline-flex">
              Ask a Question <ArrowRight className="w-4 h-4" />
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

// ─── Contact CTA ─────────────────────────────────────────────
export function ContactCta() {
  return (
    <section className="section-padding">
      <div className="section-container">
        <div className="relative rounded-3xl overflow-hidden bg-hero-gradient p-12 md:p-16 text-center">
          <div className="absolute inset-0 bg-dot-pattern opacity-20" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-brand-500/20 blur-[80px]" />
          <div className="relative z-10">
            <p className="eyebrow justify-center text-brand-300 mb-4">Ready to Build?</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-5 max-w-2xl mx-auto text-balance">
              Let's Turn Your Vision Into Reality
            </h2>
            <p className="text-white/70 text-lg max-w-xl mx-auto mb-10">
              Book a free 30-minute consultation. We'll review your project, answer your questions, and outline a plan to get you to launch.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-brand-700 font-bold text-base hover:bg-white/90 transition-colors shadow-lg">
                Book Free Consultation <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/packages" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/20 bg-white/10 text-white font-semibold text-base hover:bg-white/15 transition-colors">
                View Packages
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
