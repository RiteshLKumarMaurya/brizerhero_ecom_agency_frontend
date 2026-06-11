'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MessageSquare, FolderKanban, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { useContactStats, useAdminProjects, useAdminContacts } from '@/hooks/useApi';
import { formatDate } from '@/lib/utils';

function StatCard({ title, value, icon: Icon, color, href }: { title: string; value: number | string; icon: React.ElementType; color: string; href: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card-base p-5">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <Link href={href} className="text-xs text-brand-500 hover:text-brand-600 font-medium flex items-center gap-1">
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <p className="font-display text-2xl font-bold text-zinc-900 dark:text-zinc-100">{value}</p>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{title}</p>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useContactStats();
  const { data: projectsPage } = useAdminProjects(0);
  const { data: contactsPage } = useAdminContacts(0);

  const recentContacts = contactsPage?.content?.slice(0, 5) ?? [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-zinc-900 dark:text-zinc-100">Dashboard Overview</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Welcome back. Here&apos;s what&apos;s happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Contact Requests"
          value={statsLoading ? '—' : (stats?.total ?? 0)}
          icon={MessageSquare}
          color="bg-brand-500"
          href="/dashboard/contacts"
        />
        <StatCard
          title="Pending Follow-ups"
          value={statsLoading ? '—' : (stats?.pending ?? 0)}
          icon={Clock}
          color="bg-amber-500"
          href="/dashboard/contacts"
        />
        <StatCard
          title="In Progress"
          value={statsLoading ? '—' : (stats?.inProgress ?? 0)}
          icon={TrendingUp}
          color="bg-blue-500"
          href="/dashboard/contacts"
        />
        <StatCard
          title="Total Projects"
          value={projectsPage?.totalElements ?? '—'}
          icon={FolderKanban}
          color="bg-emerald-500"
          href="/dashboard/projects"
        />
      </div>

      {/* Contact status breakdown */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Pending', value: stats.pending, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/20' },
            { label: 'In Progress', value: stats.inProgress, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/20' },
            { label: 'Resolved', value: stats.resolved, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20' },
            { label: 'Total', value: stats.total, color: 'text-brand-600 bg-brand-50 dark:bg-brand-950/20' },
          ].map(({ label, value, color }) => (
            <div key={label} className={`rounded-xl p-3 ${color}`}>
              <p className="text-xl font-bold font-display">{value}</p>
              <p className="text-xs font-medium opacity-80">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Recent contacts */}
      <div className="card-base p-0 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="font-display font-bold text-zinc-900 dark:text-zinc-100">Recent Contact Requests</h2>
          <Link href="/dashboard/contacts" className="text-xs text-brand-500 hover:text-brand-600 font-medium">
            View all →
          </Link>
        </div>
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {recentContacts.length === 0 ? (
            <p className="text-sm text-zinc-400 text-center py-8">No contact requests yet</p>
          ) : recentContacts.map((contact) => (
            <div key={contact.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-700 dark:text-brand-400 text-xs font-bold flex-shrink-0">
                {contact.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{contact.name}</p>
                <p className="text-xs text-zinc-500 truncate">{contact.email} · {contact.country}</p>
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                contact.status === 'PENDING' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600' :
                contact.status === 'CLOSED_WON' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' :
                'bg-brand-50 dark:bg-brand-950/20 text-brand-600'
              }`}>
                {contact.status?.replace(/_/g, ' ')}
              </span>
              <span className="text-xs text-zinc-400 flex-shrink-0 hidden sm:block">
                {contact.createdAt ? formatDate(contact.createdAt) : ''}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
