'use client';

import { motion } from 'framer-motion';
import { 
  ShoppingCart, Smartphone, LayoutDashboard, Truck, 
  Server, Database, CreditCard, BarChart3, Users
} from 'lucide-react';

const modules = [
  { icon: ShoppingCart, label: 'Website' },
  { icon: Smartphone, label: 'Android App' },
  { icon: Smartphone, label: 'iOS App' },
  { icon: LayoutDashboard, label: 'Admin Panel' },
  { icon: Truck, label: 'Delivery App' },
  { icon: Database, label: 'Inventory' },
  { icon: CreditCard, label: 'Payments' },
  { icon: BarChart3, label: 'Analytics' },
  { icon: Users, label: 'CRM' },
];

export function EcosystemVisual() {
  return (
    <section className="py-20 bg-zinc-950 border-t border-zinc-800">
      <div className="section-container text-center">
        <span className="text-xs font-semibold tracking-widest text-brand-400 uppercase">Ecosystem</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-white mt-2 mb-4">
          One Connected Ecommerce Ecosystem
        </h2>
        <p className="text-zinc-400 max-w-2xl mx-auto mb-12">
          Every component works together seamlessly – from storefront to delivery.
        </p>

        <div className="relative max-w-4xl mx-auto">
          {/* Central hub */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-brand-600 to-purple-600 flex items-center justify-center shadow-2xl shadow-brand-500/30 z-10">
            <span className="text-white font-bold text-sm px-2 text-center leading-tight">
              Your Ecommerce Business
            </span>
          </div>

          {/* Connecting lines (CSS-only for simplicity) */}
          <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 800 400">
              <circle cx="400" cy="200" r="140" fill="none" stroke="rgba(99,102,241,0.15)" strokeWidth="2" strokeDasharray="6 6" />
              {modules.map((_, i) => {
                const angle = (i / modules.length) * 2 * Math.PI - Math.PI / 2;
                const x = 400 + 150 * Math.cos(angle);
                const y = 200 + 150 * Math.sin(angle);
                return (
                  <line
                    key={i}
                    x1="400"
                    y1="200"
                    x2={x}
                    y2={y}
                    stroke="rgba(99,102,241,0.2)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                );
              })}
            </svg>
          </div>

          {/* Module cards positioned around the hub */}
          <div className="relative grid grid-cols-3 md:grid-cols-3 gap-4 pt-8">
            {modules.map((mod, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-brand-500/50 transition-all"
              >
                <mod.icon className="w-8 h-8 text-brand-400 mb-2" />
                <span className="text-xs text-zinc-300 font-medium">{mod.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}