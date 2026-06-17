'use client';

import { motion } from 'framer-motion';
import { 
  Shield, Zap, Users, Award, Clock, HeartHandshake, 
  ShoppingCart, Smartphone, LayoutDashboard, Truck, Database, CreditCard 
} from 'lucide-react';

const reasons = [
  { icon: Shield, title: 'Complete Ecosystem Delivery', desc: 'Website, apps, admin, delivery – all in one.' },
  { icon: Zap, title: 'Scalable Architecture', desc: 'Built to grow with your business.' },
  { icon: CreditCard, title: 'Payment Integrations', desc: 'Razorpay, Stripe, and more.' },
  { icon: Smartphone, title: 'Multi-Platform Support', desc: 'Web, Android, iOS – all covered.' },
  { icon: LayoutDashboard, title: 'Admin Dashboard Included', desc: 'Full control over your business.' },
  { icon: Database, title: 'Inventory Management', desc: 'Track stock, orders, and shipments.' },
  { icon: Truck, title: 'Delivery App Included', desc: 'Rider app with live tracking.' },
  { icon: Users, title: 'Dedicated Team', desc: 'Seniors only – no juniors.' },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-zinc-900">
      <div className="section-container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold tracking-widest text-brand-400 uppercase">Why BrizerHero</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mt-2">
            Enterprise-Grade Ecommerce Solutions
          </h2>
          <p className="text-zinc-400 mt-1">We don't just build websites – we build complete, scalable ecommerce ecosystems.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="p-5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-brand-500/50 transition-all"
            >
              <reason.icon className="w-8 h-8 text-brand-400 mb-3" />
              <h3 className="font-display font-semibold text-white text-base mb-1">{reason.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{reason.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}