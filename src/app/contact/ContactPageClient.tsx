'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, CheckCircle2, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useSubmitContact } from '@/hooks/useApi';
import { usePackages } from '@/hooks/useApi';
import toast from 'react-hot-toast';
import type { ContactRequestCreateRequest } from '@/types';
import { cn } from '@/lib/utils';

const businessModels = [
    'FULL_PAYMENT',

    'REVENUE_SHARE',

    'EQUITY_SHARE',

    'UNDECIDED'];

const budgetRanges = [
  { label: 'Under $1,000', min: 0, max: 1000 },
  { label: '$1,000 – $5,000', min: 1000, max: 5000 },
  { label: '$5,000 – $15,000', min: 5000, max: 15000 },
  { label: '$15,000 – $50,000', min: 15000, max: 50000 },
  { label: '$50,000+', min: 50000, max: 999999 },
];

const countries = [
  'India', 'United States', 'United Kingdom', 'UAE', 'Singapore', 'Australia',
  'Germany', 'France', 'Canada', 'Other',
];

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'hello@brizerhero.com' },
  { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
  { icon: MapPin, label: 'Location', value: 'India · Remote Worldwide' },
  { icon: Clock, label: 'Response time', value: 'Within 24 hours' },
];

const initialForm: ContactRequestCreateRequest = {
  name: '',
  email: '',
  countryCode: '+91',
  phone: '',
  companyName: '',
  country: '',
  message: '',
  projectIdea: '',
  businessModelType: '',
  budgetMin: undefined,
  budgetMax: undefined,
  currencyCode: 'USD',
  packageId: undefined,
};

export function ContactPageClient() {
  const [form, setForm] = useState<ContactRequestCreateRequest>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const { mutateAsync: submitContact, isPending } = useSubmitContact();
  const { data: packages } = usePackages();

  const set = <K extends keyof ContactRequestCreateRequest>(key: K, value: ContactRequestCreateRequest[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleBudget = (range: typeof budgetRanges[0]) => {
    set('budgetMin', range.min);
    set('budgetMax', range.max);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in your name, email, and message');
      return;
    }
    try {
      await submitContact(form);
      setSubmitted(true);
      toast.success('Message sent! We\'ll be in touch within 24 hours.');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(msg);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-16 h-16 rounded-full bg-brand-50 dark:bg-brand-950/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-brand-500" />
          </div>
          <h2 className="font-display text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">Message Received!</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
            Thanks for reaching out. We&apos;ve received your project details and will get back to you within 24 hours with a tailored proposal.
          </p>
          <button
            onClick={() => { setSubmitted(false); setForm(initialForm); }}
            className="btn-secondary"
          >
            Send Another Message
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 bg-zinc-50 dark:bg-zinc-950">
        <div className="section-container text-center max-w-2xl mx-auto">
          <p className="eyebrow justify-center">Let&apos;s Talk</p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-zinc-100 mb-5">
            Start Your <span className="gradient-text">Project Today</span>
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Tell us about your idea. We&apos;ll review it and send back a detailed proposal — usually within 24 hours.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="font-display text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Get in Touch</h2>
                <div className="space-y-4">
                  {contactInfo.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/30 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                      </div>
                      <div>
                        <p className="text-xs text-zinc-400 font-medium">{label}</p>
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-base p-5">
                <h3 className="font-display font-bold text-zinc-900 dark:text-zinc-100 mb-3">What happens next?</h3>
                <ol className="space-y-3">
                  {['We review your project details', 'Schedule a discovery call', 'Send a tailored proposal', 'Start building together'].map((step, i) => (
                    <li key={step} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="card-base p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name + Email */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 block">Full Name *</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={(e) => set('name', e.target.value)}
                        className="input-base"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 block">Email Address *</label>
                      <input
                        type="email"
                        placeholder="john@company.com"
                        value={form.email}
                        onChange={(e) => set('email', e.target.value)}
                        className="input-base"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone + Country */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 block">Phone</label>
                      <div className="flex gap-2">
                        <select
                          value={form.countryCode}
                          onChange={(e) => set('countryCode', e.target.value)}
                          className="input-base w-20 flex-shrink-0"
                        >
                          <option value="+91">+91</option>
                          <option value="+1">+1</option>
                          <option value="+44">+44</option>
                          <option value="+971">+971</option>
                          <option value="+65">+65</option>
                        </select>
                        <input
                          type="tel"
                          placeholder="9876543210"
                          value={form.phone}
                          onChange={(e) => set('phone', e.target.value)}
                          className="input-base flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 block">Country</label>
                      <select
                        value={form.country}
                        onChange={(e) => set('country', e.target.value)}
                        className="input-base"
                      >
                        <option value="">Select country</option>
                        {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Company */}
                  <div>
                    <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 block">Company Name</label>
                    <input
                      type="text"
                      placeholder="Your company (optional)"
                      value={form.companyName || ''}
                      onChange={(e) => set('companyName', e.target.value)}
                      className="input-base"
                    />
                  </div>

                  {/* Package Interest */}
                  {packages && packages.length > 0 && (
                    <div>
                      <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 block">Interested Package</label>
                      <select
                        value={form.packageId || ''}
                        onChange={(e) => set('packageId', e.target.value ? Number(e.target.value) : undefined)}
                        className="input-base"
                      >
                        <option value="">No specific package (custom)</option>
                        {packages.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Business Model */}
                  <div>
                    <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2 block">Business Model</label>
                    <div className="flex flex-wrap gap-2">
                      {businessModels.map((model) => (
                        <button
                          key={model}
                          type="button"
                          onClick={() => set('businessModelType', form.businessModelType === model ? '' : model)}
                          className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                            form.businessModelType === model
                              ? 'bg-brand-600 border-brand-600 text-white'
                              : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-brand-500/50'
                          )}
                        >
                          {model}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2 block">Budget Range</label>
                    <div className="flex flex-wrap gap-2">
                      {budgetRanges.map((range) => {
                        const selected = form.budgetMin === range.min && form.budgetMax === range.max;
                        return (
                          <button
                            key={range.label}
                            type="button"
                            onClick={() => selected ? set('budgetMin', undefined) : handleBudget(range)}
                            className={cn(
                              'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                              selected
                                ? 'bg-brand-600 border-brand-600 text-white'
                                : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-brand-500/50'
                            )}
                          >
                            {range.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Project Idea */}
                  <div>
                    <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 block">Project Idea</label>
                    <textarea
                      placeholder="Briefly describe what you want to build..."
                      value={form.projectIdea || ''}
                      onChange={(e) => set('projectIdea', e.target.value)}
                      rows={2}
                      className="input-base resize-none"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 block">Message *</label>
                    <textarea
                      placeholder="Tell us more — features, timeline, specific requirements..."
                      value={form.message}
                      onChange={(e) => set('message', e.target.value)}
                      rows={4}
                      className="input-base resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className={cn('btn-primary w-full justify-center py-3.5 text-base', isPending && 'opacity-60 cursor-not-allowed')}
                  >
                    {isPending ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                    ) : (
                      <><Send className="w-4 h-4" /> Send Message</>
                    )}
                  </button>

                  <p className="text-xs text-center text-zinc-400">
                    We respect your privacy. Your information is never shared with third parties.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
