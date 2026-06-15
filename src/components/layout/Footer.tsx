import Link from 'next/link';
import { Logo } from '@/components/common/Logo';
import {
  Github, Twitter, Linkedin, Instagram, MapPin, Mail, Phone,
  Briefcase, Users, Layers, FolderKanban, MessageCircle,
  ShieldCheck, FileText, RefreshCw, Trash2, Clock
} from 'lucide-react';

const socialLinks = [
  { icon: Github, href: 'https://github.com/RiteshLKumarMaurya', label: 'GitHub' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/ritesh-kumar-46550a292', label: 'LinkedIn' },
  { icon: Instagram, href: 'https://www.instagram.com/brizerhero.com_agency', label: 'Instagram' },
];

// All website links – now neatly organised under "Legal & Quick Links"
const legalLinks = [
  { name: 'About Us', href: '/about', icon: Users },
  { name: 'Services', href: '/services', icon: Layers },
  { name: 'Portfolio', href: '/projects', icon: FolderKanban },
  { name: 'Contact', href: '/contact', icon: MessageCircle },
  { name: 'Privacy Policy', href: '/privacy', icon: ShieldCheck },
  { name: 'Terms & Conditions', href: '/terms', icon: FileText },
];

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="section-container py-10 md:py-12">
        {/* Prominent Business Info Card – Now BrizerHero */}
        <div className="mb-12 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900/50 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            {/* Left side: Logo + tagline + founder */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Logo variant="icon" />
                <span className="text-xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
                  BrizerHero
                </span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-300 text-sm max-w-md mb-4">
                We craft scalable, fast, and modern apps, websites, and software for ambitious businesses.
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                <span className="inline-flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-medium">
                  <Briefcase className="w-4 h-4" />
                  Ritesh Kumar Maurya
                </span>
                <span className="text-zinc-400">•</span>
                <span className="text-zinc-500 dark:text-zinc-400">Co-Founder & CEO</span>
              </div>
            </div>

            {/* Right side: Your actual contact card */}
            <div className="bg-white dark:bg-zinc-900/80 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 min-w-[240px] shadow-sm">
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                Contact & Hours
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 mt-0.5 text-brand-500" />
                  <div>
                    <a href="https://wa.me/918651600737" className="hover:text-brand-500 font-medium">
                      +91 8651600737
                    </a>
                    <p className="text-xs text-zinc-400">Mon-Sat, 9AM-7PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-brand-500" />
                  <a href="mailto:brizerhero@gmail.com" className="hover:text-brand-500 truncate">
                    brizerhero@gmail.com
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-brand-500" />
                  <span className="text-zinc-600 dark:text-zinc-300">
                    Harigaon, 802162, near Mahathin Ma Temple, Bihar, India
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* All links in one clean Legal section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Social & GST */}
          <div>
            <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-4">
              Connect
            </h3>
            <div className="flex gap-3 mb-6">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-brand-500 hover:border-brand-500/30 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <div className="text-xs text-zinc-400">
              GST: OSMPK5329E1ZN
            </div>
          </div>

          {/* Legal & Quick Links (all website pages) */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-4">
              Legal & Quick Links
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-3">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-brand-500 transition-colors flex items-center gap-2 group"
                >
                  <link.icon className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-zinc-400">
          <div className="flex items-center gap-1">
            <span>© 2021 - {new Date().getFullYear()} BrizerHero.</span>
            <span>All rights reserved.</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <span className="text-red-500">❤️</span>
            <span>in Bihari</span>
          </div>
        </div>
      </div>
    </footer>
  );
}