'use client';

import { motion } from 'framer-motion';
import {
  Compass, Target, Heart, Settings, Flag, Handshake,
} from 'lucide-react';

const steps = [
  {
    icon: Compass,
    label: 'Understand Your Store',
    desc: 'We sit down with you first. Your customers, your busiest hours, what slows your team down — before we ever talk about a website.',
  },
  {
    icon: Target,
    label: 'Create The Right Strategy',
    desc: 'A clear plan built around how your store actually makes money, not a generic checklist. You see the roadmap before anything is built.',
  },
  {
    icon: Heart,
    label: 'Design Around Your Customers',
    desc: "Every screen is designed for the person filling a cart, not for an award show. If it doesn't make shopping easier, it doesn't make the cut.",
  },
  {
    icon: Settings,
    label: 'Build Around Daily Operations',
    desc: 'Inventory, orders, deliveries, staff — your real day-to-day shapes how we build, so the system fits your business instead of fighting it.',
  },
  {
    icon: Flag,
    label: 'Launch With Confidence',
    desc: 'No surprises on launch day. We test against real orders and real traffic until you trust it completely — then we go live, together.',
  },
  {
    icon: Handshake,
    label: 'Grow Together',
    desc: "We don't disappear after launch. We stay close, watch how customers respond, and keep improving the experience as your business grows.",
  },
];

export function ProcessSection() {
  return (
    <section className="py-24 md:py-20 bg-surface">
      <div className="section-container">
        <div className="max-w-2xl mb-16 md:mb-24">
          <span className="text-xs font-semibold tracking-widest text-brand-400 uppercase">
            How We Work
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-primary mt-3 leading-tight">
            A Partner For Your Business,
            <br />
            Not Just A Vendor
          </h2>
          <p className="text-muted mt-4 text-base md:text-lg leading-relaxed">
            No jargon. No disappearing acts. Just a calm, steady process built
            to protect your business at every step.
          </p>
        </div>

        <div className="relative max-w-3xl">
          {/* Spine */}
          <div className="absolute left-[27px] md:left-[31px] top-2 bottom-2 w-px bg-gradient-to-b from-brand-500/40 via-brand-500/15 to-transparent" />

          <div className="space-y-12 md:space-y-16">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: 'easeOut' }}
                className="relative flex gap-6 md:gap-8"
              >
                <div className="relative z-10 flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-full bg-surface border border-brand-500/30 flex items-center justify-center">
                  <step.icon className="w-5 h-5 md:w-6 md:h-6 text-brand-400" strokeWidth={1.5} />
                </div>

                <div className="pt-1 md:pt-2">
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-xs text-brand-400/70 tracking-widest">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-display font-semibold text-primary text-xl md:text-2xl">
                      {step.label}
                    </h3>
                  </div>
                  <p className="text-secondary leading-relaxed mt-2 max-w-xl text-[15px] md:text-base">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}