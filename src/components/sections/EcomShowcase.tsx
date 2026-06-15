'use client';

import { motion } from 'framer-motion';
import { Globe, Smartphone, LayoutDashboard, Truck, Server, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const deliverables = [
  {
    icon: Globe,
    title: 'E‑commerce Website',
    description: 'Fast, conversion‑optimised storefront with product catalog, cart, checkout, payments, and SEO.',
    tags: ['Next.js', 'React', 'Stripe', 'SEO'],
  },
  {
    icon: Smartphone,
    title: 'Android & iOS Apps',
    description: 'Native‑quality mobile apps for your customers — browse, buy, track orders, and re‑order easily.',
    tags: ['Flutter', 'React Native', 'Push Notifications'],
  },
  {
    icon: LayoutDashboard,
    title: 'Admin Panel',
    description: 'Full‑featured back‑office to manage products, orders, inventory, customers, and analytics.',
    tags: ['Orders', 'Inventory', 'Analytics', 'Reports'],
  },
  {
    icon: Truck,
    title: 'Delivery App',
    description: 'Rider‑facing mobile app with live GPS tracking, route optimisation, and proof of delivery.',
    tags: ['GPS Tracking', 'Live Updates', 'Route Optimiser'],
  },
  {
    icon: Server,
    title: 'Backend APIs',
    description: 'Scalable REST APIs, database design, auth, integrations, webhooks, and cloud infrastructure.',
    tags: ['Spring Boot', 'PostgreSQL', 'Redis', 'AWS'],
  },
  {
    icon: ShoppingBag,
    title: 'Complete Ecosystem',
    description: 'All five components built, integrated, tested, and handed over as one complete working system.',
    tags: ['End‑to‑End', 'Integrated', 'Production‑Ready'],
  },
];

export function EcomShowcase() {
  return (
    <section className="section-padding bg-white dark:bg-zinc-950">
      <div className="section-container">
        <div className="max-w-2xl mb-14">
          <span className="eyebrow">What You Get</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            Not Just a Website —{' '}
            <span className="bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
              A Complete System
            </span>
          </h2>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Every e‑commerce business needs more than a storefront. We build all the pieces that work together seamlessly — so your team, customers, and riders each have exactly the tool they need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deliverables.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="group relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center mb-5 shadow-md group-hover:scale-105 transition-transform">
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-5">
                {item.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/contact" className="btn-primary">
            Get the Full Stack Built <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/packages" className="btn-secondary">
            See Pricing & Packages
          </Link>
        </div>
      </div>
    </section>
  );
}