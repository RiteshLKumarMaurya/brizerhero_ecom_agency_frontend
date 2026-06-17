'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export function ContactCta() {
  return (
    <section className="py-12 relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-600/5 via-purple-600/5 to-transparent" />
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-brand-500/10 blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-purple-500/10 blur-[80px] pointer-events-none" />

      <div className="section-container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-brand-600 to-purple-700 p-8 md:p-10 text-center shadow-xl shadow-brand-500/20"
        >
          {/* Decorative sparkles – smaller */}
          <div className="absolute top-4 right-6 text-white/10">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="absolute bottom-4 left-6 text-white/10 rotate-12">
            <Sparkles className="w-6 h-6" />
          </div>

          <div className="relative z-10">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-block text-[10px] font-semibold tracking-[0.12em] uppercase text-white/70 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full mb-4 border border-white/10"
            >
              Start Your Journey
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="font-display text-2xl md:text-4xl font-bold text-white mb-2"
            >
              Ready To Build Your{' '}
              <span className="bg-gradient-to-r from-amber-200 to-white bg-clip-text text-transparent">
                Ecommerce Ecosystem?
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-white/80 text-sm md:text-base max-w-xl mx-auto mb-6"
            >
              Website, Mobile Apps, Admin Panel, Inventory, Order Management &amp; Payments — everything you need to scale.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-3"
            >
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-white text-brand-700 font-semibold text-sm shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
              >
                Get Free Consultation
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
              </Link>

              <Link
                href="/packages"
                className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-white/30 text-white font-semibold text-sm hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm"
              >
                View Packages
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            {/* Trust micro‑badges – more compact */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-5 flex items-center justify-center gap-4 text-[10px] text-white/60"
            >
              <span className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                No obligation
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                Free 30‑min consultation
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                100% confidential
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}