'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Menu, X, Moon, Sun, Bell } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { UserMenu } from '@/components/auth/UserMenu';
import { NotificationBell } from '@/components/common/NotificationBell';
import { Logo } from '@/components/common/Logo';

// Primary information architecture — grocery-first, not feature/module-first.
// "Home" is intentionally omitted: the logo already serves as the home link.
const navLinks = [
  { href: '/services', label: 'Solutions' },
  { href: '/projects', label: 'Case Studies' },
  { href: '/packages', label: 'Pricing' },
  { href: '/how-to-use', label: 'Resources' },
  { href: '/technologies', label: 'Tech Stack' },
  { href: '/features', label: 'Platform' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;


const PRIMARY_CTA = { label: 'Book Free Strategy Call', href: '/contact' };

const mobileListVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.05 } },
};
const mobileItemVariants = {
  initial: { opacity: 0, x: -12 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const } },
};

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => setMobileOpen(false), [pathname]);

  // Lock background scroll while the full-screen mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-[var(--color-background)]/75 backdrop-blur-xl border-b border-default shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)]'
            : 'bg-transparent border-b border-transparent'
        )}
      >
        <nav className="section-container" aria-label="Main navigation">
          <div
            className={cn(
              'flex items-center justify-between transition-all duration-300',
              scrolled ? 'h-16' : 'h-20'
            )}
          >
<Link
  href="/"
  className="flex items-center gap-3 group"
  aria-label="BrizerHero Home"
>
  <Logo variant="icon" />

  <span
    className="
      hidden sm:block
      text-xl
      font-semibold
      tracking-tight
      text-primary
      transition-colors
      duration-200
    "
  >
    BrizerHero
  </span>
</Link>
            {/* Desktop Nav */}
            <div className="hidden xl:flex items-center gap-2 ml-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                          `
                          relative
                          whitespace-nowrap
                          rounded-xl
                          px-3
                          2xl:px-4
                          py-2
                          text-[14px]
                          xl:text-[15px]
                          font-medium
                          transition-all
                          duration-200
                          `,
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-indicator"
                        className="absolute inset-x-3 -bottom-px h-px bg-brand-500 dark:bg-brand-400"
                        transition={
                          prefersReducedMotion
                            ? { duration: 0 }
                            : { type: 'spring', stiffness: 380, damping: 30 }
                        }
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="flex shrink-0 items-center gap-3">
              {/* Theme Toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className={cn(
                    'btn-ghost p-2 rounded-lg text-muted hover:text-primary overflow-hidden',
                    focusRing
                  )}
                  aria-label="Toggle theme"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={theme}
                      initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
                      className="block"
                    >
                      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </motion.span>
                  </AnimatePresence>
                </button>
              )}

              {/* Notification Bell – only for authenticated users */}
              {isAuthenticated && <NotificationBell />}

              {/* Auth / User Menu */}
              <div className="hidden md:flex items-center gap-3">
                {isAuthenticated ? (
                  <UserMenu />
                ) : (
                  <>
                    <Link
                      href="/login"
                      className={cn(
                        'text-sm font-medium text-secondary hover:text-primary transition-colors px-2 py-2 rounded-lg',
                        focusRing
                      )}
                    >
                      Sign in
                    </Link>
                    <Link
                      href={PRIMARY_CTA.href}
                      className={cn('btn-primary text-sm px-5 py-2.5', focusRing)}
                    >
                      {PRIMARY_CTA.label}
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                className={cn('lg:hidden btn-ghost p-2', focusRing)}
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu — full-screen, not a small dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'fixed inset-x-0 bottom-0 z-40 lg:hidden bg-[var(--color-background)]/98 backdrop-blur-2xl overflow-y-auto',
              scrolled ? "h-[72px]" : "h-[84px]"
            )}
          >
            <div className="h-full flex flex-col px-6 py-8">
              <motion.nav
                variants={mobileListVariants}
                initial="initial"
                animate="animate"
                aria-label="Mobile navigation"
                className="flex flex-col gap-1"
              >
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div key={link.href} variants={mobileItemVariants}>
                      <Link
                        href={link.href}
                        aria-current={isActive ? 'page' : undefined}
                        className={cn(
                          'flex items-center px-4 py-4 rounded-2xl text-lg font-medium transition-colors',
                          focusRing,
                          isActive
                            ? 'bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400'
                            : 'text-secondary hover:bg-card-hover'
                        )}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.nav>

              <div className="mt-auto pt-6 border-t border-default flex flex-col gap-3">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/notifications"
                      className={cn('btn-secondary w-full justify-center gap-2 py-4 text-base', focusRing)}
                    >
                      <Bell className="w-4 h-4" /> Notifications
                    </Link>
                    <Link
                      href="/profile"
                      className={cn('btn-secondary w-full justify-center py-4 text-base', focusRing)}
                    >
                      My profile
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className={cn('btn-secondary w-full justify-center py-4 text-base', focusRing)}
                    >
                      Sign in
                    </Link>
                    <Link
                      href={PRIMARY_CTA.href}
                      className={cn('btn-primary w-full justify-center py-4 text-base', focusRing)}
                    >
                      {PRIMARY_CTA.label}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}