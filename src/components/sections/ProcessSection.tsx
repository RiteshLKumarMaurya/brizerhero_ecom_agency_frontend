'use client';

import { motion } from 'framer-motion';
import { 
  Search, FileText, Palette, Code, Shield, Rocket, 
  TrendingUp, ArrowRight 
} from 'lucide-react';

const steps = [
  { icon: Search, label: 'Discovery', desc: 'Understand your business and goals.' },
  { icon: FileText, label: 'Planning', desc: 'Architecture, timeline, and tech stack.' },
  { icon: Palette, label: 'UI/UX', desc: 'High-fidelity designs and prototypes.' },
  { icon: Code, label: 'Development', desc: 'Agile sprints with weekly demos.' },
  { icon: Shield, label: 'Testing', desc: 'QA, security, and performance optimization.' },
  { icon: Rocket, label: 'Deployment', desc: 'Zero-downtime launch and handover.' },
  { icon: TrendingUp, label: 'Growth Support', desc: '3 months free post-launch support.' },
];

export function ProcessSection() {
  return (
    <section className="py-20 bg-zinc-950">
      <div className="section-container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold tracking-widest text-brand-400 uppercase">Process</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mt-2">
            How We Build Your Ecosystem
          </h2>
          <p className="text-zinc-400 mt-1">A transparent, collaborative process from idea to launch.</p>
        </div>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-brand-500/20 -translate-x-1/2 hidden md:block" />
          <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-12 md:gap-y-8 relative">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-start gap-4 ${i % 2 === 0 ? 'md:pr-12 md:text-right md:flex-row-reverse' : 'md:pl-12'}`}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-500/20 flex items-center justify-center border border-brand-500/30">
                  <step.icon className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-white text-lg">{step.label}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}