'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun, Bell } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { UserMenu } from '@/components/auth/UserMenu';
import { NotificationBell } from '@/components/common/NotificationBell';
import { Logo } from '@/components/common/Logo';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Projects' },
  { href: '/packages', label: 'Packages' },
  { href: '/technologies', label: 'Technologies' },
  { href: '/testimonials', label: 'Testimonials' },
  { href: '/how-to-use', label: 'Guide' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50 shadow-sm'
            : 'bg-transparent'
        )}
      >
        <nav className="section-container">
          <div className="flex items-center justify-between h-20">
            <Logo variant="full" />

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                    pathname === link.href
                      ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/30'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="btn-ghost p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              )}

              {/* Notification Bell – only for authenticated users */}
              {isAuthenticated && <NotificationBell />}

              {/* Auth / User Menu */}
              <div className="hidden md:flex items-center gap-2">
                {isAuthenticated ? (
                  <UserMenu />
                ) : (
                  <>
                    <Link href="/login" className="btn-ghost text-sm px-4 py-2">
                      Sign in
                    </Link>
                    <Link href="/contact" className="btn-primary text-sm px-4 py-2">
                      Book Consultation
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden btn-ghost p-2"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 lg:hidden"
          >
            <div className="mx-4 mt-2 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
              <div className="p-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                      pathname === link.href
                        ? 'bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-3 mt-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-2">
                  {isAuthenticated ? (
                    <>
                      <Link href="/notifications" className="btn-secondary w-full text-center gap-2">
                        <Bell className="w-4 h-4" /> Notifications
                      </Link>
                      <Link href="/profile" className="btn-secondary w-full text-center">
                        My Profile
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="btn-secondary w-full text-center">
                        Sign In
                      </Link>
                      <Link href="/contact" className="btn-primary w-full text-center">
                        Book Consultation
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}