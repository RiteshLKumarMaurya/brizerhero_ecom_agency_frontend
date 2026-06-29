'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSubmitContact } from '@/hooks/useApi';
import { usePackages } from '@/hooks/useApi';
import toast from 'react-hot-toast';
import {
  ChevronDown, Send, ArrowRight, CheckCircle2,
  Mail, MessageSquare, Globe, ChevronRight, Plus, Minus
} from 'lucide-react';
import type { ContactRequestCreateRequest } from '@/types';

// ─── Types & Data ────────────────────────────────────────────────────────────

type BusinessType = 'ECOMMERCE_STORE_OWNER' | 'D2C_BRAND' | 'RETAIL_BUSINESS' | 'WHOLESALER_DISTRIBUTOR' | 'MANUFACTURER' | 'STARTUP' | 'OTHER';
type BusinessModelType = 'FULL_PAYMENT' | 'REVENUE_SHARE' | 'EQUITY_SHARE' | 'UNDECIDED';
type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED';

const BUSINESS_TYPES: { value: BusinessType; label: string; short: string }[] = [
  { value: 'ECOMMERCE_STORE_OWNER', label: 'Ecommerce Store Owner', short: 'E-commerce' },
  { value: 'D2C_BRAND', label: 'D2C Brand', short: 'D2C' },
  { value: 'RETAIL_BUSINESS', label: 'Retail Business', short: 'Retail' },
  { value: 'WHOLESALER_DISTRIBUTOR', label: 'Wholesaler / Distributor', short: 'Wholesale' },
  { value: 'MANUFACTURER', label: 'Manufacturer', short: 'Mfg.' },
  { value: 'STARTUP', label: 'Startup', short: 'Startup' },
  { value: 'OTHER', label: 'Other', short: 'Other' },
];

const BUSINESS_MODELS: { value: BusinessModelType; label: string; subtitle: string }[] = [
  { value: 'FULL_PAYMENT', label: 'Full Payment', subtitle: 'Upfront, clean engagement' },
  { value: 'REVENUE_SHARE', label: 'Revenue Share', subtitle: 'We grow together' },
  { value: 'EQUITY_SHARE', label: 'Equity Share', subtitle: 'Partner model for startups' },
  { value: 'UNDECIDED', label: 'Not Sure Yet', subtitle: "We'll figure it out together" },
];

const CURRENCIES: { code: CurrencyCode; symbol: string; flag: string }[] = [
  { code: 'USD', symbol: '$', flag: '🇺🇸' },
  { code: 'INR', symbol: '₹', flag: '🇮🇳' },
  { code: 'EUR', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', flag: '🇬🇧' },
  { code: 'AED', symbol: 'د.إ', flag: '🇦🇪' },
];

const BUDGET_RANGES = [
  { label: 'Under 5K', min: 0, max: 5000 },
  { label: '5K – 15K', min: 5000, max: 15000 },
  { label: '15K – 30K', min: 15000, max: 30000 },
  { label: '30K – 60K', min: 30000, max: 60000 },
  { label: '60K+', min: 60000, max: 999999 },
];

const COUNTRY_CODES = [
  { code: '+91', label: '🇮🇳 +91' },
  { code: '+1', label: '🇺🇸 +1' },
  { code: '+44', label: '🇬🇧 +44' },
  { code: '+971', label: '🇦🇪 +971' },
  { code: '+65', label: '🇸🇬 +65' },
  { code: '+61', label: '🇦🇺 +61' },
  { code: '+49', label: '🇩🇪 +49' },
  { code: '+33', label: '🇫🇷 +33' },
];

const FAQS = [
  {
    q: 'How soon do you respond after submission?',
    a: 'Every submission is reviewed within 24 hours. For larger scopes, we schedule a discovery call within 48 hours to understand your project in depth before sending any proposal.',
  },
  {
    q: 'Do you work with international clients?',
    a: 'Yes. We work across India, the US, UAE, UK, and Singapore. Our team is async-first and comfortable with time-zone distributed collaboration.',
  },
  {
    q: 'Is the revenue share model available to everyone?',
    a: 'Revenue share and equity engagements are selectively offered after a due-diligence review. We only partner when we genuinely believe in the business model and the founder.',
  },
  {
    q: 'What if I only have a rough idea right now?',
    a: "That's the best time to talk. Early-stage conversations help us shape scope intelligently. You don't need a spec — you need a direction.",
  },
  {
    q: 'Do you sign NDAs before discussion?',
    a: 'Absolutely. We sign NDAs before any detailed discovery call. Your IP is yours, always.',
  },
];

// ─── Animation helpers ────────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

// ─── Sub-components ───────────────────────────────────────────────────────────

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-zinc-500 dark:text-zinc-400 mb-2">
      {children}{required && <span className="text-amber-500 ml-1">*</span>}
    </p>
  );
}

function FieldInput({
  type = 'text', placeholder, value, onChange, required, className = '',
}: {
  type?: string; placeholder?: string; value: string; onChange: (v: string) => void;
  required?: boolean; className?: string;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className={`w-full bg-transparent border-b border-zinc-300 dark:border-zinc-700 py-3 text-[15px]
        text-zinc-900 dark:text-zinc-100
        placeholder:text-zinc-400 dark:placeholder:text-zinc-600
        focus:outline-none focus:border-amber-500 dark:focus:border-amber-400
        transition-colors duration-200 ${className}`}
    />
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 py-2">
      <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
      <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-zinc-400 dark:text-zinc-600">{label}</span>
      <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-zinc-200 dark:border-zinc-800">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-[15px] font-medium text-zinc-700 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors pr-4">{q}</span>
        <span className="text-zinc-400 dark:text-zinc-500 flex-shrink-0 transition-transform duration-200" style={{ transform: open ? 'rotate(45deg)' : 'none' }}>
          <Plus className="w-4 h-4" />
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="text-zinc-500 dark:text-zinc-400 text-[14px] leading-relaxed pb-5">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ContactPageClient() {
  const { mutateAsync: submitContact, isPending } = useSubmitContact();
  const { data: packages } = usePackages();
  const formRef = useRef<HTMLDivElement>(null);

  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<ContactRequestCreateRequest>({
    name: '',
    email: '',
    countryCode: '+91',
    phone: '',
    companyName: '',
    country: 'India',
    message: '',
    source: 'WEBSITE',
    currencyCode: 'USD',
    businessModelType: 'UNDECIDED',
    budgetMin: 0,
    budgetMax: 0,
    projectIdea: '',
    sharePercentage: undefined,
    packageId: undefined,
    businessType: undefined,
  });

  const setField = <K extends keyof ContactRequestCreateRequest>(key: K, value: ContactRequestCreateRequest[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.message) {
      toast.error('Please fill all required fields');
      return;
    }
    if ((form.businessModelType === 'REVENUE_SHARE' || form.businessModelType === 'EQUITY_SHARE') && !form.sharePercentage) {
      toast.error('Please enter the share percentage');
      return;
    }
    try {
      const payload = {
        ...form,
        budgetMin: Number(form.budgetMin),
        budgetMax: Number(form.budgetMax),
        sharePercentage: form.sharePercentage ? Number(form.sharePercentage) : undefined,
      };
      await submitContact(payload);
      setSubmitted(true);
    } catch {
      toast.error('Failed to send. Please try again.');
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ── Success state ──────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0A0B] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-lg"
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-7 h-7 text-amber-500 dark:text-amber-400" />
          </div>
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-amber-500 dark:text-amber-400 mb-4">Brief Received</p>
          <h2 className="text-4xl font-light text-zinc-900 dark:text-white mb-4 leading-tight">
            We'll be in touch<br />within 24 hours.
          </h2>
          <p className="text-zinc-500 text-[15px] leading-relaxed mb-10">
            Your brief has been assigned to our team. Expect a personal reply — not an automated one — with initial thoughts on your project.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors underline underline-offset-4"
          >
            Submit another brief
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────────

  return (
    <div className="bg-white dark:bg-[#0A0A0B] text-zinc-900 dark:text-white">

      {/* ── 1. HERO ───────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex flex-col justify-end px-6 md:px-16 pt-24 pb-20 overflow-hidden">
        {/* Ambient gradient */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-amber-400/5 dark:bg-amber-400/5 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-amber-600/4 blur-[100px]" />
        </div>

        {/* Grid lines — purely decorative */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        <div className="relative max-w-5xl">
          <motion.p
            {...fadeUp(0)}
            className="text-[11px] font-bold tracking-[0.22em] uppercase text-amber-600 dark:text-amber-400 mb-8"
          >
            Project Inquiries
          </motion.p>
          <motion.h1
            {...fadeUp(0.05)}
            className="text-5xl md:text-7xl lg:text-8xl font-light text-zinc-900 dark:text-white leading-[1.04] mb-8 tracking-tight"
          >
            Some projects deserve<br />
            <em className="not-italic font-extralight text-zinc-400 dark:text-zinc-400">more than a form.</em>
          </motion.h1>
          <motion.p
            {...fadeUp(0.1)}
            className="text-[17px] text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed mb-14"
          >
            We work with a small number of businesses at a time. Tell us about yours — we'll tell you honestly whether we're the right fit.
          </motion.p>
          <motion.div {...fadeUp(0.15)} className="flex flex-wrap gap-4 items-center">
            <button
              onClick={scrollToForm}
              className="inline-flex items-center gap-2.5 bg-amber-400 hover:bg-amber-300 text-black text-[14px] font-semibold px-6 py-3.5 rounded-full transition-colors duration-200"
            >
              Start your brief <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="mailto:brizerhero@gmail.com"
              className="inline-flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-[14px] transition-colors"
            >
              <Mail className="w-4 h-4" /> Or email us directly
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 right-8 md:right-16 flex flex-col items-center gap-2 opacity-30">
          <div className="w-px h-16 bg-gradient-to-b from-transparent to-zinc-900 dark:to-white" />
        </div>
      </section>

      {/* ── 2. WHY BUSINESSES WORK WITH US ───────────────────────────────── */}
      <section className="px-6 md:px-16 py-20 border-t border-zinc-100 dark:border-zinc-900">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp()} className="mb-16">
            <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-zinc-400 dark:text-zinc-600 mb-5">Why us</p>
            <h2 className="text-3xl md:text-5xl font-light text-zinc-900 dark:text-white leading-snug max-w-2xl">
              We're not an agency.<br />
              <span className="text-zinc-400 dark:text-zinc-500">We're your technical co-founder.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-200 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
            {[
              {
                n: '01',
                title: 'Ownership mindset',
                body: 'We think in revenue, retention, and scale — not tickets and sprints. Your KPIs become our design constraints.',
              },
              {
                n: '02',
                title: 'No project managers in the middle',
                body: 'You talk directly to the people building. Decisions happen in hours, not queues.',
              },
              {
                n: '03',
                title: 'Skin in the game',
                body: 'We offer revenue and equity engagements for businesses we believe in. Not every client qualifies — that\'s the point.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.n}
                {...fadeUp(i * 0.06)}
                className="bg-zinc-50 dark:bg-[#0F0F10] p-8 md:p-10"
              >
                <p className="text-[11px] font-bold tracking-[0.18em] text-zinc-300 dark:text-zinc-700 mb-6">{item.n}</p>
                <h3 className="text-[17px] font-medium text-zinc-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-zinc-500 text-[14px] leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. WHAT HAPPENS AFTER YOU SUBMIT ─────────────────────────────── */}
      <section className="px-6 md:px-16 py-20 border-t border-zinc-100 dark:border-zinc-900">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp()} className="mb-16">
            <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-zinc-400 dark:text-zinc-600 mb-5">The process</p>
            <h2 className="text-3xl md:text-5xl font-light text-zinc-900 dark:text-white leading-snug">
              What happens after<br />
              <span className="text-zinc-400 dark:text-zinc-500">you send your brief.</span>
            </h2>
          </motion.div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[19px] top-6 bottom-6 w-px bg-zinc-200 dark:bg-zinc-800 hidden md:block" />

            <div className="space-y-0">
              {[
                {
                  step: 'Within 24 hours',
                  title: 'Personal acknowledgement',
                  body: 'A real person reads your brief and acknowledges receipt with initial impressions — not a bot or autoresponder.',
                },
                {
                  step: 'Within 48 hours',
                  title: 'Discovery call (if scope warrants)',
                  body: 'For substantial projects, we schedule a 30-min discovery call to align on scope, timeline, and expectations before any proposal.',
                },
                {
                  step: 'Within 5 days',
                  title: 'Detailed proposal',
                  body: 'A scoped proposal with deliverables, timeline, and investment — no vague estimates, no hidden costs.',
                },
                {
                  step: 'Your call',
                  title: 'No pressure close',
                  body: "Take your time. We don't follow up every day. If it's right, we'll both know.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  {...fadeUp(i * 0.07)}
                  className="flex gap-8 md:gap-12 py-8 border-b border-zinc-100 dark:border-zinc-900 last:border-0"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#0A0A0B] flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                    </div>
                  </div>
                  <div className="pt-1">
                    <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-amber-500/70 dark:text-amber-400/70 mb-2">{item.step}</p>
                    <h3 className="text-[18px] font-medium text-zinc-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-zinc-500 text-[14px] leading-relaxed max-w-lg">{item.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. FOUNDER ───────────────────────────────────────────────────── */}
      <section className="px-6 md:px-16 py-20 border-t border-zinc-100 dark:border-zinc-900">
        <div className="max-w-5xl mx-auto">
          <motion.div
            {...fadeUp()}
            className="bg-zinc-50 dark:bg-[#111113] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 md:p-14 flex flex-col md:flex-row gap-10 md:gap-16 items-start"
          >
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-3xl select-none">
                👤
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-zinc-400 dark:text-zinc-600 mb-5">From the founder</p>
              <blockquote className="text-[20px] md:text-[24px] font-light text-zinc-700 dark:text-zinc-200 leading-relaxed mb-8 max-w-2xl">
                "We built this company to work deeply with a few clients — not shallowly with hundreds. If you're here, it means something brought you, and that matters to us."
              </blockquote>
              <div>
                <p className="text-[15px] font-semibold text-zinc-900 dark:text-white">Ritesh Kumar Maurya</p>
                <p className="text-zinc-400 dark:text-zinc-600 text-[13px]">Founder & CEO</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 5. CONTACT METHODS ───────────────────────────────────────────── */}
      <section className="px-6 md:px-16 py-20 border-t border-zinc-100 dark:border-zinc-900">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp()} className="mb-14">
            <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-zinc-400 dark:text-zinc-600 mb-5">Other channels</p>
            <h2 className="text-3xl md:text-4xl font-light text-zinc-900 dark:text-white">Reach us your way.</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: Mail,
                label: 'Email',
                value: 'brizerhero@gmail.com',
                href: 'mailto:brizerhero@gmail.com',
                note: 'Typically within 24h',
              },
              {
                icon: MessageSquare,
                label: 'WhatsApp',
                value: '+91 86516 00737',
                href: 'https://wa.me/918651600737',
                note: 'Quick questions welcome',
              },
              {
                icon: Globe,
                label: 'LinkedIn',
                value: 'Connect with us',
                href: 'https://linkedin.com',
                note: 'For professional enquiries',
              },
            ].map((item, i) => (
              <motion.a
                key={item.label}
                {...fadeUp(i * 0.06)}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="group block bg-zinc-50 hover:bg-zinc-100 dark:bg-[#0F0F10] dark:hover:bg-[#141416] border border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 rounded-2xl p-7 transition-all duration-200"
              >
                <item.icon className="w-5 h-5 text-zinc-400 dark:text-zinc-600 group-hover:text-amber-500 dark:group-hover:text-amber-400 mb-5 transition-colors" />
                <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-zinc-400 dark:text-zinc-600 mb-2">{item.label}</p>
                <p className="text-[16px] font-medium text-zinc-900 dark:text-white mb-1">{item.value}</p>
                <p className="text-zinc-400 dark:text-zinc-600 text-[13px]">{item.note}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. THE BRIEF (FORM) ───────────────────────────────────────────── */}
      <section ref={formRef} className="px-6 md:px-16 py-20 border-t border-zinc-100 dark:border-zinc-900">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp()} className="mb-16">
            <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-zinc-400 dark:text-zinc-600 mb-5">Start here</p>
            <h2 className="text-3xl md:text-5xl font-light text-zinc-900 dark:text-white leading-snug mb-4">
              Tell us about your project.
            </h2>
            <p className="text-zinc-500 text-[15px] max-w-lg">
              Fill in as much or as little as you know. We'll handle the rest in our first conversation.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-20 items-start">

              {/* Left column — form */}
              <motion.div {...fadeUp(0.05)} className="space-y-12">

                {/* ─ About You ─ */}
                <div>
                  <SectionDivider label="About you" />
                  <div className="space-y-8 mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <Label required>Full name</Label>
                        <FieldInput
                          placeholder="Jane Doe"
                          value={form.name}
                          onChange={(v) => setField('name', v)}
                          required
                        />
                      </div>
                      <div>
                        <Label required>Email address</Label>
                        <FieldInput
                          type="email"
                          placeholder="jane@company.com"
                          value={form.email}
                          onChange={(v) => setField('email', v)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <Label required>Phone number</Label>
                        <div className="flex gap-3">
                          <div className="relative flex-shrink-0">
                            <select
                              value={form.countryCode}
                              onChange={(e) => setField('countryCode', e.target.value)}
                              className="appearance-none bg-transparent border-b border-zinc-300 dark:border-zinc-700 py-3 text-[15px] text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 pr-6 cursor-pointer transition-colors"
                            >
                              {COUNTRY_CODES.map((c) => (
                                <option key={c.code} value={c.code} className="bg-white dark:bg-zinc-900">
                                  {c.label}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-400 dark:text-zinc-600 pointer-events-none" />
                          </div>
                          <FieldInput
                            type="tel"
                            placeholder="86516 00737"
                            value={form.phone}
                            onChange={(v) => setField('phone', v)}
                            required
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Company name</Label>
                        <FieldInput
                          placeholder="Acme Inc."
                          value={form.companyName || ''}
                          onChange={(v) => setField('companyName', v)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Country</Label>
                      <FieldInput
                        placeholder="India"
                        value={form.country || ''}
                        onChange={(v) => setField('country', v)}
                      />
                    </div>
                  </div>
                </div>

                {/* ─ Your business ─ */}
                <div>
                  <SectionDivider label="Your business" />
                  <div className="space-y-8 mt-8">
                    <div>
                      <Label>Business type</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {BUSINESS_TYPES.map((bt) => (
                          <button
                            key={bt.value}
                            type="button"
                            onClick={() => setField('businessType', form.businessType === bt.value ? undefined : bt.value)}
                            className={`px-4 py-2 rounded-full text-[13px] font-medium border transition-all duration-150 ${
                              form.businessType === bt.value
                                ? 'border-amber-400 bg-amber-400/10 text-amber-600 dark:text-amber-300'
                                : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-300'
                            }`}
                          >
                            {bt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Preferred engagement model</Label>
                      <div className="grid grid-cols-2 gap-3 mt-1">
                        {BUSINESS_MODELS.map((m) => (
                          <button
                            key={m.value}
                            type="button"
                            onClick={() => setField('businessModelType', m.value)}
                            className={`text-left px-4 py-4 rounded-xl border transition-all duration-150 ${
                              form.businessModelType === m.value
                                ? 'border-amber-400 bg-amber-400/5'
                                : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                            }`}
                          >
                            <p className={`text-[14px] font-semibold mb-0.5 ${form.businessModelType === m.value ? 'text-amber-600 dark:text-amber-300' : 'text-zinc-700 dark:text-zinc-300'}`}>
                              {m.label}
                            </p>
                            <p className="text-zinc-400 dark:text-zinc-600 text-[12px]">{m.subtitle}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Conditional: share % */}
                    <AnimatePresence>
                      {(form.businessModelType === 'REVENUE_SHARE' || form.businessModelType === 'EQUITY_SHARE') && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-6 pt-2">
                            <div>
                              <Label required>
                                {form.businessModelType === 'REVENUE_SHARE' ? 'Revenue share' : 'Equity share'} percentage
                              </Label>
                              <div className="relative">
                                <FieldInput
                                  type="number"
                                  placeholder="e.g. 10"
                                  value={form.sharePercentage?.toString() || ''}
                                  onChange={(v) => setField('sharePercentage', parseFloat(v) || undefined)}
                                  required
                                />
                                <span className="absolute right-0 bottom-3 text-zinc-400 dark:text-zinc-600 text-[14px]">%</span>
                              </div>
                            </div>
                            <div>
                              <Label>Tell us about your vision</Label>
                              <textarea
                                className="w-full bg-transparent border-b border-zinc-300 dark:border-zinc-700 py-3 text-[15px] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 transition-colors resize-none"
                                rows={3}
                                placeholder="Describe your startup, traction, team size, and what you're building..."
                                value={form.projectIdea || ''}
                                onChange={(e) => setField('projectIdea', e.target.value)}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* ─ The project ─ */}
                <div>
                  <SectionDivider label="The project" />
                  <div className="space-y-8 mt-8">

                    <div>
                      <Label>Estimated budget range</Label>
                      {/* Currency toggle */}
                      <div className="flex gap-2 mb-4 mt-1">
                        {CURRENCIES.map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => setField('currencyCode', c.code)}
                            className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-all ${
                              form.currencyCode === c.code
                                ? 'border-amber-400 bg-amber-400/10 text-amber-600 dark:text-amber-300'
                                : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-600 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-400'
                            }`}
                          >
                            {c.flag} {c.code}
                          </button>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {BUDGET_RANGES.map((r) => {
                          const sel = form.budgetMin === r.min && form.budgetMax === r.max;
                          return (
                            <button
                              key={r.label}
                              type="button"
                              onClick={() => { setField('budgetMin', r.min); setField('budgetMax', r.max); }}
                              className={`px-4 py-2.5 rounded-full text-[13px] font-medium border transition-all duration-150 ${
                                sel
                                  ? 'border-amber-400 bg-amber-400/10 text-amber-600 dark:text-amber-300'
                                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-300'
                              }`}
                            >
                              {form.currencyCode === 'INR' ? '₹' : form.currencyCode === 'EUR' ? '€' : form.currencyCode === 'GBP' ? '£' : form.currencyCode === 'AED' ? 'د.إ' : '$'}{r.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Package */}
                    {packages && packages.length > 0 && (
                      <div>
                        <Label>Interested in a specific package?</Label>
                        <div className="relative">
                          <select
                            className="w-full appearance-none bg-transparent border-b border-zinc-300 dark:border-zinc-700 py-3 text-[15px] text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 cursor-pointer transition-colors pr-6"
                            value={form.packageId || ''}
                            onChange={(e) => setField('packageId', e.target.value ? parseInt(e.target.value) : undefined)}
                          >
                            <option value="" className="bg-white dark:bg-zinc-900">No specific package</option>
                            {packages.map((p) => (
                              <option key={p.id} value={p.id} className="bg-white dark:bg-zinc-900">
                                {p.name} — {p.currencyCode} {p.price.toLocaleString()}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-0 bottom-3.5 w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600 pointer-events-none" />
                        </div>
                      </div>
                    )}

                    <div>
                      <Label required>Project details</Label>
                      <textarea
                        className="w-full bg-transparent border-b border-zinc-300 dark:border-zinc-700 py-3 text-[15px] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 transition-colors resize-none"
                        rows={5}
                        placeholder="Describe what you're building, what exists today, and what you need from us. The more specific, the better our initial response will be."
                        value={form.message}
                        onChange={(e) => setField('message', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex items-center gap-3 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold text-[15px] px-8 py-4 rounded-full transition-colors duration-200"
                  >
                    {isPending ? (
                      <>
                        <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        Sending brief…
                      </>
                    ) : (
                      <>
                        Send your brief <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <p className="text-zinc-400 dark:text-zinc-700 text-[12px] mt-4">
                    No commitment. No spam. A human reads every submission.
                  </p>
                </div>
              </motion.div>

              {/* Right column — sticky context panel */}
              <motion.div
                {...fadeUp(0.1)}
                className="hidden lg:block sticky top-24 space-y-6"
              >
                <div className="bg-zinc-50 dark:bg-[#111113] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-7">
                  <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-zinc-400 dark:text-zinc-600 mb-5">What to expect</p>
                  <ul className="space-y-4">
                    {[
                      '24h acknowledgement guarantee',
                      'Personal reply, not automated',
                      'Scoped proposal within 5 days',
                      'NDA available on request',
                      'No sales pressure',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-[13px] text-zinc-500 dark:text-zinc-400">
                        <ChevronRight className="w-4 h-4 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-zinc-50 dark:bg-[#111113] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-7">
                  <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-zinc-400 dark:text-zinc-600 mb-4">Current availability</p>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                    <span className="text-zinc-900 dark:text-white text-[14px] font-medium">Taking on new clients</span>
                  </div>
                  <p className="text-zinc-400 dark:text-zinc-600 text-[12px]">We have 2 project slots open this quarter.</p>
                </div>

                <div className="bg-zinc-50 dark:bg-[#111113] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-7">
                  <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-zinc-400 dark:text-zinc-600 mb-4">Prefer to talk first?</p>
                  <a
                    href="mailto:brizerhero@gmail.com"
                    className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-500 dark:text-amber-400 dark:hover:text-amber-300 text-[14px] font-medium transition-colors"
                  >
                    <Mail className="w-4 h-4" /> brizerhero@gmail.com
                  </a>
                </div>
              </motion.div>
            </div>
          </form>
        </div>
      </section>

      {/* ── 7. FAQ ───────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-16 py-20 border-t border-zinc-100 dark:border-zinc-900">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12 md:gap-20">
            <motion.div {...fadeUp()}>
              <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-zinc-400 dark:text-zinc-600 mb-5">FAQ</p>
              <h2 className="text-3xl font-light text-zinc-900 dark:text-white leading-snug">
                Common<br />questions.
              </h2>
            </motion.div>
            <motion.div {...fadeUp(0.06)}>
              {FAQS.map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 8. FINAL CTA ─────────────────────────────────────────────────── */}
      <section className="px-6 md:px-16 py-20 border-t border-zinc-100 dark:border-zinc-900">
        <div className="max-w-5xl mx-auto">
          <motion.div
            {...fadeUp()}
            className="relative overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0F0F10] p-12 md:p-20 text-center"
          >
            {/* Background glow */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="w-[600px] h-[300px] rounded-full bg-amber-400/4 blur-[100px]" />
            </div>
            <div className="relative">
              <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-amber-500/60 dark:text-amber-400/60 mb-6">Ready?</p>
              <h2 className="text-4xl md:text-6xl font-light text-zinc-900 dark:text-white leading-tight mb-6">
                Your next step<br />
                <span className="text-zinc-400 dark:text-zinc-500">is one brief away.</span>
              </h2>
              <p className="text-zinc-500 text-[16px] mb-10 max-w-md mx-auto">
                No lengthy forms. No sales calls before you're ready. Just an honest conversation about whether we're right for each other.
              </p>
              <button
                onClick={scrollToForm}
                className="inline-flex items-center gap-2.5 bg-amber-400 hover:bg-amber-300 text-black font-semibold text-[15px] px-8 py-4 rounded-full transition-colors duration-200"
              >
                Start your brief <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}