'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';

const metrics = [
  { label: 'Orders Managed', value: 6, suffix: '+' },
  { label: 'Features Delivered', value: 100, suffix: '+' },
  { label: 'Apps Developed', value: 2, suffix: '+' },
  { label: 'Websites Built', value: 5, suffix: '+' },
  { label: 'Admin Panels Delivered', value: 3, suffix: '+' },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 40;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 30);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export function ClientResults() {
  return (
    <section className="py-16 bg-zinc-950 border-t border-zinc-800">
      <div className="section-container">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold tracking-widest text-brand-400 uppercase">Client Results</span>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mt-2">Trusted by Growing Businesses</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
            >
              <div className="text-3xl font-bold text-brand-400">
                <Counter target={metric.value} suffix={metric.suffix} />
              </div>
              <p className="text-xs text-zinc-400 mt-1">{metric.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}