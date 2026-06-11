'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, FolderKanban, Package, Layers, Cpu,
  Star, ImageIcon, Users, MessageSquare, Settings, Zap, ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/contacts', label: 'Contact Requests', icon: MessageSquare },
  { href: '/dashboard/projects', label: 'Projects', icon: FolderKanban },
  { href: '/dashboard/services', label: 'Services', icon: Layers },
  { href: '/dashboard/packages', label: 'Packages', icon: Package },
  { href: '/dashboard/technologies', label: 'Technologies', icon: Cpu },
  { href: '/dashboard/testimonials', label: 'Testimonials', icon: Star },
  { href: '/dashboard/banners', label: 'Banners', icon: ImageIcon },
  { href: '/dashboard/users', label: 'Users', icon: Users },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login?redirect=/dashboard'); return; }
    const isAdmin = user?.roleName === 'ROLE_ADMIN' || user?.roleName === 'ROLE_SUPER_ADMIN';
    if (!isAdmin) { router.push('/profile'); }
  }, [isAuthenticated, user, router]);

  const isAdmin = user?.roleName === 'ROLE_ADMIN' || user?.roleName === 'ROLE_SUPER_ADMIN';
  if (!isAuthenticated || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col fixed inset-y-0 left-0 z-30 hidden md:flex">
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-bold text-base text-zinc-900 dark:text-zinc-100">
              Brizer<span className="text-brand-500">Hero</span>
            </span>
          </Link>
          <p className="text-xs text-zinc-400 mt-1 ml-9">Admin Dashboard</p>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href) && href !== '/dashboard';
            const isExactActive = pathname === href;
            const isActive = exact ? isExactActive : (pathname.startsWith(href) || (href === '/dashboard' && pathname === '/dashboard'));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors mb-0.5',
                  isActive
                    ? 'bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-400'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800">
          <Link href="/profile" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            <div className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-xs font-bold text-brand-700 dark:text-brand-400">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
            <span className="flex-1 truncate">{user?.fullName?.split(' ')[0] || 'Admin'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-60 min-h-screen">
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
