'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ShoppingCart, Smartphone, LayoutDashboard, Truck, Server, Zap } from 'lucide-react';

const fadeUp = { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 } };
const stagger = { animate: { transition: { staggerChildren: 0.1 } } };

// Trust badges
const trustItems = [
  'Complete Ecosystem',
  '5+ Projects Shipped',
  '4.9★ Client Rating',
  '30‑day Delivery',
];

// Preview mockups – we'll use simple icons with hover animations
const previewItems = [
  { icon: ShoppingCart, label: 'Storefront' },
  { icon: Smartphone, label: 'Mobile Apps' },
  { icon: LayoutDashboard, label: 'Admin Panel' },
  { icon: Truck, label: 'Delivery App' },
  { icon: Server, label: 'Backend APIs' },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-zinc-950">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-600/5 via-transparent to-purple-600/5" />
      <div className="absolute top-1/3 -left-32 w-[600px] h-[600px] rounded-full bg-brand-500/20 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full bg-purple-500/15 blur-[120px] pointer-events-none" />

      <div className="relative z-10 section-container py-28 md:py-36">
        <motion.div variants={stagger} initial="initial" animate="animate" className="max-w-5xl">
          {/* Eyebrow */}
          <motion.div variants={fadeUp} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/25 text-brand-300 text-sm font-medium backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
              Complete E‑commerce Ecosystem Agency
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.04] tracking-tight mb-6"
          >
            Build Your{' '}
            <span className="bg-gradient-to-r from-brand-400 via-white to-brand-300 bg-clip-text text-transparent">
              Complete Ecommerce Ecosystem
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            className="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-2xl mb-8"
          >
            Website, Mobile Apps, Admin Panel, Delivery App, Inventory, and Payment Infrastructure — 
            everything required to run and scale a modern ecommerce business.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-10">
            <Link href="/contact" className="btn-primary text-base px-8 py-4 shadow-xl hover:shadow-brand-500/30 transition-all duration-300">
              Get Free Consultation <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/packages" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-base transition-all backdrop-blur-sm">
              View Packages
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-4 items-center mb-10">
            {trustItems.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-zinc-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {item}
              </div>
            ))}
          </motion.div>

          {/* Preview Pills – animated floating modules */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
            {previewItems.map(({ icon: Icon, label }) => (
              <motion.div
                key={label}
                whileHover={{ y: -4, scale: 1.02 }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-sm backdrop-blur-sm hover:bg-white/10 transition-all"
              >
                <Icon className="w-4 h-4 text-brand-400" />
                {label}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
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