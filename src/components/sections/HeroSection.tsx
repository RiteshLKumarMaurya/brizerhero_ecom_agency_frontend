'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingCart, Smartphone, Globe, Package, ChevronRight, CheckCircle2 } from 'lucide-react';

const fadeUp = { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 } };
const stagger = { animate: { transition: { staggerChildren: 0.12 } } };

const deliverables = [
  { icon: Globe, label: 'E‑commerce Website' },
  { icon: Smartphone, label: 'iOS & Android Apps' },
  { icon: Package, label: 'Admin Panel' },
  { icon: ShoppingCart, label: 'Backend APIs' },
];

const proofPoints = ['5+ stores launched', 'Full‑stack delivery', '30‑day handover'];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-zinc-950">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-600/5 via-transparent to-purple-600/5" />
      <div className="absolute top-1/3 -left-32 w-[600px] h-[600px] rounded-full bg-brand-500/20 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full bg-purple-500/15 blur-[120px] pointer-events-none" />

      <div className="relative z-10 section-container py-28 md:py-36">
        <motion.div variants={stagger} initial="initial" animate="animate" className="max-w-5xl">
          <motion.div variants={fadeUp} className="mb-7">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/25 text-brand-300 text-sm font-medium backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
              Complete E‑commerce Software Agency
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.04] tracking-tight mb-6">
            Your Entire
            <br />
            <span className="bg-gradient-to-r from-brand-400 via-white to-brand-300 bg-clip-text text-transparent">Ecommerce Stack</span>
            <br />
            <span className="text-zinc-300">Built & Delivered</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-2xl mb-8">
            We don't sell subscriptions. We build <strong className="text-white">production‑ready e‑commerce ecosystems</strong> — website, mobile apps, admin panel, delivery app, and APIs — tailored for your business.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-10">
            {deliverables.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-sm backdrop-blur-sm">
                <Icon className="w-3.5 h-3.5 text-brand-400" />
                {label}
              </div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-12">
            <Link href="/contact" className="btn-primary text-base px-8 py-4 shadow-xl hover:shadow-brand-500/30 transition-all duration-300">
              Get a Free Quote <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/packages" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-base transition-all backdrop-blur-sm">
              View Packages
            </Link>
            <Link href="/projects" className="inline-flex items-center gap-2 px-6 py-4 text-zinc-400 hover:text-white font-semibold text-base transition-colors">
              See Our Work <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-6 items-center">
            {proofPoints.map((p) => (
              <div key={p} className="flex items-center gap-2 text-sm text-zinc-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {p}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-5 h-8 rounded-full border-2 border-white/20 flex justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}