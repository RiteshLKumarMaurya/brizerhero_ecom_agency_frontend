'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowLeft, ExternalLink, ArrowRight, 
  Sparkles, Code, Briefcase, Zap, Award, CheckCircle2 
} from 'lucide-react';
import { useTechnology } from '@/hooks/useApi';
import { getOptimizedUrl } from '@/lib/cdn';
import { ContactCta } from '@/components/sections/ContactCta';
import type { TechnologyResponse, TechnologyLinkResponse } from '@/types';

interface Props { 
  slug: string;
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 }
  }
};

export function TechnologyDetailClient({ slug }: Props) {
  const { data: tech, isLoading, error, refetch } = useTechnology(slug);
  
  // Scroll progress bar
  const { scrollYProgress } = useScroll();
  const width = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32">
        <div className="section-container max-w-5xl mx-auto">
          <div className="space-y-8 animate-pulse">
            <div className="skeleton h-8 w-32 rounded-full" />
            <div className="flex items-start gap-6">
              <div className="skeleton w-20 h-20 rounded-2xl" />
              <div className="flex-1 space-y-4">
                <div className="skeleton h-12 w-2/3 rounded-xl" />
                <div className="skeleton h-6 w-full rounded-lg" />
                <div className="skeleton h-6 w-5/6 rounded-lg" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div className="space-y-3">
                <div className="skeleton h-6 w-40 rounded-lg" />
                <div className="skeleton h-16 w-full rounded-xl" />
                <div className="skeleton h-16 w-full rounded-xl" />
              </div>
              <div className="space-y-3">
                <div className="skeleton h-6 w-40 rounded-lg" />
                <div className="flex flex-wrap gap-2">
                  <div className="skeleton h-10 w-28 rounded-full" />
                  <div className="skeleton h-10 w-32 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !tech) {
    return (
      <div className="min-h-[70vh] pt-32 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-3">Technology Not Found</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">
            {error?.message || "The technology you're looking for doesn't exist or was removed."}
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/technologies" className="btn-primary px-6 py-2.5">
              Back to Technologies
            </Link>
            <button onClick={() => refetch()} className="btn-secondary px-6 py-2.5">
              Try Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {/* Reading Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-cyan-500 z-50 origin-left"
        style={{ scaleX: width }}
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 -left-32 w-80 h-80 bg-brand-500/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 -right-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px]" />
        </div>

        <div className="section-container max-w-5xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              href="/technologies"
              className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-brand-500 mb-8 transition-all group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> 
              All Technologies
            </Link>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid lg:grid-cols-3 gap-12 items-start"
          >
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Icon */}
              <motion.div variants={fadeInUp}>
                <div className="relative inline-flex">
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-cyan-500 rounded-2xl blur-xl opacity-50" />
                  <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 shadow-lg flex items-center justify-center">
                    {tech.iconImage ? (
                      <Image
                        src={getOptimizedUrl(tech.iconImage)}
                        alt={tech.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 object-contain brightness-0 invert"
                      />
                    ) : (
                      <Code className="w-8 h-8 text-white" />
                    )}
                  </div>
                </div>
              </motion.div>

              <motion.h1 
                variants={fadeInUp}
                className="font-display text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent"
              >
                {tech.name}
              </motion.h1>
              
              {tech.description && (
                <motion.p 
                  variants={fadeInUp}
                  className="text-lg md:text-xl text-zinc-600 dark:text-zinc-300 leading-relaxed"
                >
                  {tech.description}
                </motion.p>
              )}

              {/* External Links - FIXED: links array contains TechnologyLinkResponse with nested link property */}
              {tech.links && tech.links.length > 0 && (
                <motion.div variants={fadeInUp} className="flex flex-wrap gap-3 pt-2">
                  {tech.links.map((linkItem: TechnologyLinkResponse) => (
                    <a
                      key={linkItem.id}
                      href={linkItem.link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400 transition-all group"
                    >
                      {linkItem.link.name}
                      <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  ))}
                </motion.div>
              )}
            </div>

            {/* CTA Card */}
            <motion.div 
              variants={fadeInUp}
              className="lg:sticky lg:top-28"
            >
              <div className="card-base p-6 space-y-5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-white/20 dark:border-zinc-800/50 shadow-xl rounded-2xl">
                <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400">
                  <Zap className="w-5 h-5" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Build With This Tech</span>
                </div>
                <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  Ready to use {tech.name}?
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Let's build something amazing with {tech.name}. We specialize in modern, scalable solutions.
                </p>
                <Link href="/contact" className="btn-primary w-full justify-center gap-2 group">
                  Start a Project 
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose This Technology Section */}
      <section className="py-20 bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950">
        <div className="section-container max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
              Why {tech.name}?
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-4 max-w-2xl mx-auto">
              Modern, fast, and developer-friendly technology for building cutting-edge applications.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: 'Lightning Fast', desc: 'Optimized performance and blazing fast execution.' },
              { icon: Shield, title: 'Secure & Reliable', desc: 'Built with security best practices and robust architecture.' },
              { icon: Award, title: 'Industry Standard', desc: 'Widely adopted and trusted by leading companies.' }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-xl bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 text-center hover:border-brand-200 dark:hover:border-brand-800 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/30 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6 text-brand-600" />
                </div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects & Showcase CTA */}
      <section className="py-16">
        <div className="section-container max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 to-violet-600 p-8 md:p-12 text-center">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none" />
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
              See {tech.name} in Action
            </h3>
            <p className="text-brand-100 mb-6 max-w-lg mx-auto">
              Explore our projects built with {tech.name} and get inspired for your next big idea.
            </p>
            <Link href="/projects" className="inline-flex items-center gap-2 bg-white text-brand-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all group">
              View Projects
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <ContactCta />
    </>
  );
}

// Import missing icons
import { Shield } from 'lucide-react';