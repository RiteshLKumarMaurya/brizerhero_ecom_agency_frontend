'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MessageSquare, FolderKanban, TrendingUp, Clock, ArrowRight, Users, Star, Zap, Award, Sparkles } from 'lucide-react';
import { useContactStats, useAdminProjects, useAdminContacts } from '@/hooks/useApi';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

// Premium Stat Card with glassmorphic gradient
function StatCard({ title, value, icon: Icon, gradient, href, delay }: { title: string; value: number | string; icon: React.ElementType; gradient: string; href: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay || 0, duration: 0.4 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="relative overflow-hidden rounded-2xl p-6 shadow-xl transition-all duration-300 group cursor-pointer"
      style={{ background: gradient }}
    >
      {/* Animated shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-5">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
            <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
          </div>
          <Link
            href={href}
            className="text-xs font-medium text-white/80 hover:text-white flex items-center gap-1 transition-all backdrop-blur-sm px-2 py-1 rounded-full bg-white/10"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <p className="font-display text-4xl font-extrabold text-white tracking-tight">{value}</p>
        <p className="text-sm text-white/80 mt-2 font-medium">{title}</p>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    NEW: 'badge-amber',
    CONTACTED: 'badge-blue',
    PROPOSAL_SENT: 'badge-purple',
    NEGOTIATION: 'badge-brand',
    WON: 'badge-green',
    LOST: 'badge-red',
  };
  const fallback = 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400';
  return (
    <span className={cn('badge text-xs font-semibold', variants[status] || fallback)}>
      {status?.replace(/_/g, ' ')}
    </span>
  );
}

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useContactStats();
  const { data: projectsPage } = useAdminProjects(0);
  const { data: contactsPage } = useAdminContacts({ page: 0, size: 5, sortBy: 'createdAt', direction: 'DESC' });

  const recentContacts = contactsPage?.content ?? [];

  const totalLeads = stats
    ? (stats.newCount || 0) + (stats.contactedCount || 0) + (stats.proposalSentCount || 0) +
      (stats.negotiationCount || 0) + (stats.wonCount || 0) + (stats.lostCount || 0)
    : 0;
  const pending = stats?.newCount ?? 0;
  const inProgress = (stats?.contactedCount || 0) + (stats?.proposalSentCount || 0) + (stats?.negotiationCount || 0);
  const resolved = (stats?.wonCount || 0) + (stats?.lostCount || 0);

  const gradients = [
    'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header with shimmer text */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-card-bg border border-border p-6 shadow-sm"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-500/5 to-purple-500/5 rounded-full blur-3xl" />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight shimmer-text">Dashboard Overview</h1>
            <p className="text-text-secondary mt-1">Welcome back. Here's your business at a glance.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400 text-sm font-semibold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Live updates
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Leads" value={statsLoading ? '—' : totalLeads} icon={MessageSquare} gradient={gradients[0]} href="/dashboard/contacts" delay={0.05} />
        <StatCard title="New Leads" value={statsLoading ? '—' : pending} icon={Clock} gradient={gradients[1]} href="/dashboard/contacts?status=NEW" delay={0.1} />
        <StatCard title="In Progress" value={statsLoading ? '—' : inProgress} icon={TrendingUp} gradient={gradients[2]} href="/dashboard/contacts?status=CONTACTED&status=PROPOSAL_SENT&status=NEGOTIATION" delay={0.15} />
        <StatCard title="Total Projects" value={projectsPage?.totalElements ?? '—'} icon={FolderKanban} gradient={gradients[3]} href="/dashboard/projects" delay={0.2} />
      </div>

      {/* Lead Funnel Section - Premium */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card-glass rounded-2xl p-6"
        >
          <div className="flex items-center gap-2.5 mb-5">
            <div className="p-2 rounded-xl bg-brand-100 dark:bg-brand-900/30 text-brand-600">
              <Award className="w-5 h-5" />
            </div>
            <h2 className="font-display font-bold text-xl text-text-primary">Lead Funnel</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'New', value: stats.newCount, icon: '🆕', gradient: 'from-amber-500 to-orange-500' },
              { label: 'Contacted', value: stats.contactedCount, icon: '📞', gradient: 'from-blue-500 to-indigo-500' },
              { label: 'Proposal', value: stats.proposalSentCount, icon: '📄', gradient: 'from-purple-500 to-pink-500' },
              { label: 'Negotiation', value: stats.negotiationCount, icon: '🤝', gradient: 'from-brand-500 to-purple-500' },
              { label: 'Won', value: stats.wonCount, icon: '🏆', gradient: 'from-emerald-500 to-teal-500' },
              { label: 'Lost', value: stats.lostCount, icon: '❌', gradient: 'from-red-500 to-rose-500' },
            ].map(({ label, value, icon, gradient }) => (
              <div
                key={label}
                className={`relative overflow-hidden rounded-xl p-4 text-center bg-gradient-to-br ${gradient} shadow-md transition-all hover:scale-105 duration-200`}
              >
                <div className="absolute inset-0 bg-white/5" />
                <div className="relative">
                  <div className="text-2xl mb-1 drop-shadow-sm">{icon}</div>
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="text-xs font-semibold text-white/80 uppercase tracking-wide">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent Contacts Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-card-bg border border-border overflow-hidden shadow-sm"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-gradient-to-r from-secondary to-transparent">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-brand-500" />
            <h2 className="font-display font-bold text-xl text-text-primary">Recent Contact Requests</h2>
          </div>
          <Link href="/dashboard/contacts" className="btn-secondary !py-1.5 !px-4 text-sm">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="divide-y divide-border">
          {recentContacts.length === 0 ? (
            <div className="text-center py-16 text-text-muted">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No contact requests yet</p>
            </div>
          ) : (
            recentContacts.map((contact, idx) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="flex items-center gap-4 px-6 py-4 hover:bg-hover-bg transition-colors group"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <span className="text-white text-sm font-bold">{contact.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-card-bg" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">{contact.name}</p>
                  <p className="text-xs text-text-muted truncate">{contact.email} · {contact.country}</p>
                </div>
                <StatusBadge status={contact.status} />
                <span className="text-xs text-text-muted flex-shrink-0 hidden sm:block">
                  {contact.createdAt ? formatDate(contact.createdAt) : ''}
                </span>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Motivational Tip - Premium Glass */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 to-purple-600 p-6 shadow-xl"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg...%3E')] opacity-10" />
        <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-md">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-lg">Pro Tip</p>
              <p className="text-white/80 text-sm">Use filters on contacts page to focus on high-priority leads.</p>
            </div>
          </div>
          <Link
            href="/dashboard/contacts"
            className="px-5 py-2.5 rounded-xl bg-white/20 backdrop-blur-md text-white text-sm font-semibold hover:bg-white/30 transition-all shadow-md"
          >
            Go to Contacts →
          </Link>
        </div>
      </motion.div>
    </div>
  );
}