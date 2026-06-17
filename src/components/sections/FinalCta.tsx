'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function FinalCta() {
  return (
    <section className="py-20 bg-gradient-to-r from-brand-600 to-purple-600">
      <div className="section-container text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Ready To Launch Your Ecommerce Business?
          </h2>
          <p className="text-brand-100 text-lg mb-8">
            Let's build your complete ecommerce ecosystem — from storefront to delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-brand-600 px-8 py-3.5 rounded-xl font-semibold hover:shadow-lg transition-all group"
            >
              Get Free Consultation <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all"
            >
              Request Custom Proposal
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}