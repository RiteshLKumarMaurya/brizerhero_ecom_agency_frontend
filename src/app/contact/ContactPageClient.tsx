'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSubmitContact } from '@/hooks/useApi';
import { usePackages } from '@/hooks/useApi';
import toast from 'react-hot-toast';
import {
  CheckCircle2, MessageSquare, Phone, Mail, Globe, Send, ChevronDown,
  DollarSign, TrendingUp, Users, Shield, Clock, Sparkles
} from 'lucide-react';
import type { ContactRequestCreateRequest } from '@/types';

// Type definitions matching backend enums
type BusinessType = 'ECOMMERCE_STORE_OWNER' | 'D2C_BRAND' | 'RETAIL_BUSINESS' | 'WHOLESALER_DISTRIBUTOR' | 'MANUFACTURER' | 'STARTUP' | 'OTHER';
type BusinessModelType = 'FULL_PAYMENT' | 'REVENUE_SHARE' | 'EQUITY_SHARE' | 'UNDECIDED';
type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED';

// Business Type options
const BUSINESS_TYPES: { value: BusinessType; label: string; icon: string }[] = [
  { value: 'ECOMMERCE_STORE_OWNER', label: '🛍️ Ecommerce Store Owner', icon: '🛍️' },
  { value: 'D2C_BRAND', label: '🏷️ D2C Brand', icon: '🏷️' },
  { value: 'RETAIL_BUSINESS', label: '🏪 Retail Business', icon: '🏪' },
  { value: 'WHOLESALER_DISTRIBUTOR', label: '📦 Wholesaler / Distributor', icon: '📦' },
  { value: 'MANUFACTURER', label: '🏭 Manufacturer', icon: '🏭' },
  { value: 'STARTUP', label: '🚀 Startup', icon: '🚀' },
  { value: 'OTHER', label: '📌 Other', icon: '📌' },
];

// Business payment models
const BUSINESS_MODELS: { value: BusinessModelType; label: string; icon: any; description: string }[] = [
  { value: 'FULL_PAYMENT', label: 'Full Payment', icon: DollarSign, description: 'One-time upfront payment. Best for established businesses.' },
  { value: 'REVENUE_SHARE', label: 'Revenue Share', icon: TrendingUp, description: 'Pay a percentage of your monthly revenue. No upfront cost.' },
  { value: 'EQUITY_SHARE', label: 'Equity Share', icon: Users, description: 'Exchange equity for development. For early-stage startups.' },
  { value: 'UNDECIDED', label: 'Not Sure Yet', icon: Shield, description: 'We can discuss options during consultation.' },
];

// Currencies
const CURRENCIES: { code: CurrencyCode; symbol: string; flag: string }[] = [
  { code: 'USD', symbol: '$', flag: '🇺🇸' },
  { code: 'INR', symbol: '₹', flag: '🇮🇳' },
  { code: 'EUR', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', flag: '🇬🇧' },
  { code: 'AED', symbol: 'د.إ', flag: '🇦🇪' },
];

// Budget ranges (without $ sign)
const BUDGET_RANGES = [
  { label: '< 5,000', min: 0, max: 5000 },
  { label: '5,000 – 15,000', min: 5000, max: 15000 },
  { label: '15,000 – 30,000', min: 15000, max: 30000 },
  { label: '30,000 – 60,000', min: 30000, max: 60000 },
  { label: '60,000+', min: 60000, max: 999999 },
];

// Country codes for phone
const COUNTRY_CODES = [
  { code: '+91', label: '🇮🇳 +91 India' },
  { code: '+1', label: '🇺🇸 +1 USA' },
  { code: '+44', label: '🇬🇧 +44 UK' },
  { code: '+971', label: '🇦🇪 +971 UAE' },
  { code: '+65', label: '🇸🇬 +65 Singapore' },
  { code: '+61', label: '🇦🇺 +61 Australia' },
  { code: '+49', label: '🇩🇪 +49 Germany' },
  { code: '+33', label: '🇫🇷 +33 France' },
];

export function ContactPageClient() {
  const { mutateAsync: submitContact, isPending } = useSubmitContact();
  const { data: packages } = usePackages();

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
    businessType: undefined, // added for backend enum
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
      // Convert numbers to appropriate types if needed (backend expects BigDecimal)
      const payload = {
        ...form,
        budgetMin: Number(form.budgetMin),
        budgetMax: Number(form.budgetMax),
        sharePercentage: form.sharePercentage ? Number(form.sharePercentage) : undefined,
      };
      await submitContact(payload);
      setSubmitted(true);
      toast.success('Message sent! We\'ll reply within 24 hours.');
    } catch {
      toast.error('Failed to send. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </div>
          <h2 className="font-display text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
            Message Sent!
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">
            Thanks for reaching out. Our team will review your project and get back to you within 24 hours.
          </p>
          <button onClick={() => setSubmitted(false)} className="btn-secondary">
            Send Another Message
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-12 overflow-hidden bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="section-container text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="eyebrow justify-center">Contact Us</span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-zinc-900 dark:text-zinc-100 mb-5">
              Let's Build Your{' '}
              <span className="bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
                Ecommerce Empire
              </span>
            </h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Tell us about your business and what you need. We'll send you a detailed proposal
              within 24 hours — no commitment required.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <div className="flex flex-wrap justify-center gap-6 pb-8">
        {[
          { icon: Clock, text: '24h Response' },
          { icon: Shield, text: 'No Obligation' },
          { icon: Sparkles, text: 'Free Consultation' },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2 text-sm text-zinc-500 bg-white dark:bg-zinc-900 px-4 py-2 rounded-full shadow-sm border border-zinc-200 dark:border-zinc-800">
            <Icon className="w-4 h-4 text-brand-500" />
            {text}
          </div>
        ))}
      </div>

      {/* Main Form Section */}
      <section className="section-padding pt-8">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Left Column - Info */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 space-y-8">
                <div>
                  <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                    Why partner with us?
                  </h2>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">5+ successful projects delivered</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">End-to-end development: website, app, admin</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">Flexible payment models: upfront, revenue share, equity</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">3 months free support after launch</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-zinc-100">Contact directly</h3>
                  {[
                    { icon: MessageSquare, label: 'Free Consultation', desc: '30-min discovery call', href: null },
                    { icon: Phone, label: 'WhatsApp', desc: '+91 8651600737', href: 'https://wa.me/918651600737' },
                    { icon: Mail, label: 'Email', desc: 'brizerhero@gmail.com', href: 'mailto:brizerhero@gmail.com' },
                    { icon: Globe, label: 'Response Time', desc: 'Within 24 hours, always', href: null },
                  ].map(({ icon: Icon, label, desc, href }) => (
                    <div key={label} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/20 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{label}</p>
                        {href ? (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-brand-600 dark:text-brand-400 hover:underline"
                          >
                            {desc}
                          </a>
                        ) : (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">{desc}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl p-6 md:p-8 space-y-6">
                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 block">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="input-base w-full"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => setField('name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 block">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="input-base w-full"
                      type="email"
                      placeholder="john@company.com"
                      value={form.email}
                      onChange={(e) => setField('email', e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 block">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3">
                    <div className="relative w-36">
                      <select
                        className="input-base w-full appearance-none pr-8"
                        value={form.countryCode}
                        onChange={(e) => setField('countryCode', e.target.value)}
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.code}>{c.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                    </div>
                    <input
                      className="input-base flex-1"
                      type="tel"
                      placeholder="9876543210"
                      value={form.phone}
                      onChange={(e) => setField('phone', e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Company + Country */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 block">Company Name</label>
                    <input
                      className="input-base w-full"
                      placeholder="ACME Ltd."
                      value={form.companyName}
                      onChange={(e) => setField('companyName', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 block">Country</label>
                    <input
                      className="input-base w-full"
                      placeholder="India"
                      value={form.country}
                      onChange={(e) => setField('country', e.target.value)}
                    />
                  </div>
                </div>

                {/* Business Type (new separate field) */}
                <div>
                  <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 block">Business Type</label>
                  <div className="relative">
                    <select
                      className="input-base w-full appearance-none pr-8"
                      value={form.businessType || ''}
                      onChange={(e) => setField('businessType', e.target.value as BusinessType)}
                    >
                      <option value="">Select your business type</option>
                      {BUSINESS_TYPES.map((b) => (
                        <option key={b.value} value={b.value}>{b.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                  </div>
                </div>

                {/* Payment Model */}
                <div>
                  <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 block">Preferred Payment Model</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {BUSINESS_MODELS.map((model) => (
                      <button
                        type="button"
                        key={model.value}
                        onClick={() => setField('businessModelType', model.value)}
                        className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                          form.businessModelType === model.value
                            ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/20 ring-2 ring-brand-500/20'
                            : 'border-zinc-200 dark:border-zinc-700 hover:border-brand-300'
                        }`}
                      >
                        <model.icon className={`w-5 h-5 mt-0.5 ${form.businessModelType === model.value ? 'text-brand-600' : 'text-zinc-400'}`} />
                        <div>
                          <p className={`text-sm font-semibold ${form.businessModelType === model.value ? 'text-brand-700 dark:text-brand-400' : 'text-zinc-700 dark:text-zinc-300'}`}>
                            {model.label}
                          </p>
                          <p className="text-xs text-zinc-500 mt-0.5">{model.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Share Percentage (conditional) */}
                {(form.businessModelType === 'REVENUE_SHARE' || form.businessModelType === 'EQUITY_SHARE') && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 block">
                      {form.businessModelType === 'REVENUE_SHARE' ? 'Revenue Share Percentage' : 'Equity Share Percentage'} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="100"
                        className="input-base w-full pl-8"
                        placeholder="e.g., 10"
                        value={form.sharePercentage || ''}
                        onChange={(e) => setField('sharePercentage', parseFloat(e.target.value) || undefined)}
                        required
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">%</span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      {form.businessModelType === 'REVENUE_SHARE' ? 'Percentage of monthly revenue you wish to share.' : 'Percentage of equity you are willing to offer.'}
                    </p>
                  </motion.div>
                )}

                {/* Project Idea (partnership) */}
                {(form.businessModelType === 'REVENUE_SHARE' || form.businessModelType === 'EQUITY_SHARE') && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 block">
                      Tell us about your vision (partnership)
                    </label>
                    <textarea
                      className="input-base w-full resize-none"
                      rows={3}
                      placeholder="Describe your startup idea, traction, team, and what you're looking for..."
                      value={form.projectIdea || ''}
                      onChange={(e) => setField('projectIdea', e.target.value)}
                    />
                  </motion.div>
                )}

                {/* Budget Range + Currency */}
                <div>
                  <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 block">Estimated Budget Range</label>
                  <div className="flex flex-wrap gap-3 mb-3">
                    {CURRENCIES.map((curr) => (
                      <button
                        type="button"
                        key={curr.code}
                        onClick={() => setField('currencyCode', curr.code)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          form.currencyCode === curr.code
                            ? 'bg-brand-500 text-white shadow-md'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200'
                        }`}
                      >
                        {curr.flag} {curr.code} ({curr.symbol})
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {BUDGET_RANGES.map((range) => {
                      const isSelected = form.budgetMin === range.min && form.budgetMax === range.max;
                      return (
                        <button
                          type="button"
                          key={range.label}
                          onClick={() => {
                            setField('budgetMin', range.min);
                            setField('budgetMax', range.max);
                          }}
                          className={`py-2.5 px-3 rounded-xl border text-sm font-semibold transition-all ${
                            isSelected
                              ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/20 text-brand-700 dark:text-brand-300'
                              : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-brand-300'
                          }`}
                        >
                          {range.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Interested Package */}
                {packages && packages.length > 0 && (
                  <div>
                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 block">Interested Package (optional)</label>
                    <div className="relative">
                      <select
                        className="input-base w-full appearance-none pr-8"
                        value={form.packageId || ''}
                        onChange={(e) => setField('packageId', e.target.value ? parseInt(e.target.value) : undefined)}
                      >
                        <option value="">No specific package</option>
                        {packages.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} — {p.currencyCode} {p.price.toLocaleString()}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                    </div>
                  </div>
                )}

                {/* Message */}
                <div>
                  <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 block">
                    Project Details <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="input-base w-full resize-none"
                    rows={4}
                    placeholder="Describe what you need — e.g., 'I run a clothing brand and need a full ecommerce system with website, app, and admin panel...'"
                    value={form.message}
                    onChange={(e) => setField('message', e.target.value)}
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn-primary w-full justify-center py-4 text-base shadow-lg disabled:opacity-60 disabled:cursor-not-allowed group"
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <>
                      Send Message <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-zinc-400">
                  No spam, no commitment. We reply within 24 hours.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}