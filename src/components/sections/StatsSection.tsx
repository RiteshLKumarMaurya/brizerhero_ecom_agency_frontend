'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';

const stats = [
  { value: 5, suffix: '+', label: 'Projects Delivered', description: 'Successful digital products shipped' },
  { value: 3, suffix: '+', label: 'Happy Clients', description: 'Startups to enterprise businesses' },
  { value: 5, suffix: '★', label: 'Average Rating', description: 'Across all client reviews' },
  { value: 3, suffix: '+', label: 'Months of Excellence', description: 'Building premium digital products' },
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

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="py-16 bg-white dark:bg-zinc-900 border-y border-zinc-100 dark:border-zinc-800">
      <div className="section-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="font-display text-4xl md:text-5xl font-bold bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent mb-2">
                <Counter target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm mb-1">{stat.label}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}