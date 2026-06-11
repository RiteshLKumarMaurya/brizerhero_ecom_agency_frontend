'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, ChevronLeft, ChevronRight, Loader2, Trash2, X } from 'lucide-react';
import { useAdminContacts, useUpdateContactStatus } from '@/hooks/useApi';
import { adminApi } from '@/services/api';
import { formatDate, formatPrice, cn } from '@/lib/utils';
import type { ContactRequestResponse, ContactStatus } from '@/types';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

const STATUSES: { value: ContactStatus; label: string; color: string }[] = [
  { value: 'PENDING', label: 'Pending', color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400' },
  { value: 'CONTACTED', label: 'Contacted', color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400' },
  { value: 'PROPOSAL_SENT', label: 'Proposal Sent', color: 'bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-brand-50 text-brand-700 dark:bg-brand-950/20 dark:text-brand-400' },
  { value: 'CLOSED_WON', label: 'Closed Won', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' },
  { value: 'CLOSED_LOST', label: 'Closed Lost', color: 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400' },
];

function StatusBadge({ status }: { status: string }) {
  const s = STATUSES.find((x) => x.value === status);
  return (
    <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', s?.color ?? 'bg-zinc-100 text-zinc-600')}>
      {s?.label ?? status?.replace(/_/g, ' ')}
    </span>
  );
}

function ContactModal({ contact, onClose }: { contact: ContactRequestResponse; onClose: () => void }) {
  const { mutateAsync: updateStatus, isPending } = useUpdateContactStatus();

  const handleStatus = async (status: string) => {
    try {
      await updateStatus({ id: contact.id, status });
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-5 border-b border-zinc-200 dark:border-zinc-800">
          <h3 className="font-display font-bold text-zinc-900 dark:text-zinc-100">Contact Request #{contact.id}</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Name', contact.name], ['Email', contact.email],
              ['Phone', `${contact.countryCode}${contact.phone}`], ['Country', contact.country],
              ['Company', contact.companyName], ['Budget', contact.budgetMin ? `${formatPrice(contact.budgetMin)} – ${formatPrice(contact.budgetMax)}` : '—'],
              ['Business Model', contact.businessModelType], ['Source', contact.source],
            ].map(([label, value]) => value ? (
              <div key={label}>
                <p className="text-xs text-zinc-400 font-medium">{label}</p>
                <p className="text-sm text-zinc-900 dark:text-zinc-100 font-medium">{value}</p>
              </div>
            ) : null)}
          </div>

          {contact.projectIdea && (
            <div>
              <p className="text-xs text-zinc-400 font-medium mb-1">Project Idea</p>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3">{contact.projectIdea}</p>
            </div>
          )}
          {contact.message && (
            <div>
              <p className="text-xs text-zinc-400 font-medium mb-1">Message</p>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3">{contact.message}</p>
            </div>
          )}

          <div>
            <p className="text-xs text-zinc-400 font-medium mb-2">Update Status</p>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => handleStatus(s.value)}
                  disabled={isPending || contact.status === s.value}
                  className={cn(
                    'text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all',
                    contact.status === s.value
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/20 text-brand-700 dark:text-brand-400'
                      : 'border-zinc-200 dark:border-zinc-700 hover:border-brand-500/50'
                  )}
                >
                  {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminContactsPage() {
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<ContactRequestResponse | null>(null);
  const { data, isLoading } = useAdminContacts(page);
  const qc = useQueryClient();

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this contact request?')) return;
    try {
      await adminApi.deleteContactRequest(id);
      toast.success('Deleted');
      qc.invalidateQueries({ queryKey: ['admin', 'contacts'] });
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-zinc-900 dark:text-zinc-100">Contact Requests</h1>
        <p className="text-sm text-zinc-500 mt-1">Manage incoming leads and project inquiries</p>
      </div>

      <div className="card-base p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                {['Name', 'Email', 'Country', 'Budget', 'Status', 'Date', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {isLoading
                ? Array(8).fill(0).map((_, i) => (
                    <tr key={i}>
                      {Array(7).fill(0).map((_, j) => (
                        <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded" /></td>
                      ))}
                    </tr>
                  ))
                : data?.content.map((contact) => (
                    <tr key={contact.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{contact.name}</p>
                        <p className="text-xs text-zinc-400">{contact.companyName}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{contact.email}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">{contact.country}</td>
                      <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                        {contact.budgetMin ? `${formatPrice(contact.budgetMin)}` : '—'}
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={contact.status} /></td>
                      <td className="px-4 py-3 text-xs text-zinc-400">{contact.createdAt ? formatDate(contact.createdAt) : ''}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setSelected(contact)} className="p-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-950/20 text-zinc-400 hover:text-brand-600 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(contact.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-zinc-400 hover:text-red-600 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>

        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-200 dark:border-zinc-800">
            <span className="text-xs text-zinc-500">
              {data.totalElements} total · Page {(data.page ?? 0) + 1} of {data.totalPages}
            </span>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={(data.page ?? 0) === 0} className="btn-secondary p-2">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setPage((p) => p + 1)} disabled={data.last} className="btn-secondary p-2">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {selected && <ContactModal contact={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
