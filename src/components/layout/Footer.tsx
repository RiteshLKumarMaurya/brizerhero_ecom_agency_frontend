import Link from 'next/link';
import { Logo } from '@/components/common/Logo';
import {
  Github, Twitter, Linkedin, Instagram,
  MapPin, Mail, Phone, Clock,
  Briefcase, Users, Layers, FolderKanban,
  MessageCircle, ShieldCheck, FileText,
} from 'lucide-react';

const socialLinks = [
  { icon: Github,    href: 'https://github.com/RiteshLKumarMaurya',                    label: 'GitHub' },
  { icon: Twitter,   href: '#',                                                          label: 'Twitter' },
  { icon: Linkedin,  href: 'https://www.linkedin.com/in/ritesh-kumar-46550a292',        label: 'LinkedIn' },
  { icon: Instagram, href: 'https://www.instagram.com/brizerhero.com_agency',           label: 'Instagram' },
];

const legalLinks = [
  { name: 'About Us',          href: '/about',        icon: Users },
  { name: 'Services',          href: '/services',     icon: Layers },
  { name: 'Portfolio',         href: '/projects',     icon: FolderKanban },
  { name: 'Contact',           href: '/contact',      icon: MessageCircle },
  { name: 'Privacy Policy',    href: '/privacy',      icon: ShieldCheck },
  { name: 'Terms & Conditions',href: '/terms',        icon: FileText },
];

export function Footer() {
  return (
    <footer
      className="
        border-t border-default
        bg-surface
      "
    >
      <div className="section-container py-10 md:py-14">

        {/* ── Business info card ──────────────────────────────────────── */}
        <div
          className="
            mb-12 rounded-2xl p-6 md:p-7
            border border-default
            bg-card
            shadow-sm dark:shadow-none
          "
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">

            {/* Left: logo + tagline + founder */}
            <div className="flex-1">
              {/* Logo + name */}
              <div className="flex items-center gap-3 mb-4">
                <Logo variant="icon" />
                <span
                  className="
                    text-xl font-bold tracking-tight
                    text-primary
                  "
                >
                  BrizerHero
                </span>
              </div>

              {/* Tagline — grocery-specific */}
              <p className="text-sm text-secondary max-w-sm leading-relaxed mb-5">
                Digital operations platforms built exclusively for grocery, bakery, dairy, and specialty food businesses across India.
              </p>

              {/* Founder */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm">
                <span
                  className="
                    inline-flex items-center gap-1.5 font-medium
                    text-brand-600 dark:text-brand-400
                  "
                >
                  <Briefcase className="w-3.5 h-3.5" aria-hidden="true" />
                  Ritesh Kumar Maurya
                </span>
                <span className="text-muted" aria-hidden="true">·</span>
                <span className="text-secondary">Co-Founder &amp; CEO</span>
              </div>
            </div>

            {/* Right: contact card */}
            <div
              className="
                rounded-xl p-4 min-w-[240px]
                border border-default
                bg-surface
                shadow-sm dark:shadow-none
              "
            >
              <h4
                className="
                  text-[10px] font-semibold uppercase tracking-[0.12em]
                  text-muted
                  mb-3 flex items-center gap-2
                "
              >
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                Contact &amp; Hours
              </h4>
              <ul className="space-y-2.5 text-sm" role="list">
                {/* Phone */}
                <li className="flex items-start gap-2.5">
                  <Phone
                    className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand-500"
                    aria-hidden="true"
                  />
                  <div>
                    <a
                      href="https://wa.me/918651600737"
                      className="
                        font-medium text-primary
                        hover:text-brand-600 dark:hover:text-brand-400
                        transition-colors
                      "
                    >
                      +91 8651600737
                    </a>
                    <p className="text-xs text-muted mt-0.5">
                      Mon–Sat, 9 AM – 7 PM
                    </p>
                  </div>
                </li>
                {/* Email */}
                <li className="flex items-center gap-2.5">
                  <Mail
                    className="w-4 h-4 flex-shrink-0 text-brand-500"
                    aria-hidden="true"
                  />
                  <a
                    href="mailto:brizerhero@gmail.com"
                    className="
                      text-secondary truncate
                      hover:text-brand-600 dark:hover:text-brand-400
                      transition-colors
                    "
                  >
                    brizerhero@gmail.com
                  </a>
                </li>
                {/* Address */}
                <li className="flex items-start gap-2.5">
                  <MapPin
                    className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand-500"
                    aria-hidden="true"
                  />
                  <address className="not-italic text-secondary text-xs leading-relaxed">
                    Harigaon, 802162, near Mahathin Ma Temple, Bihar, India
                  </address>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── Links row ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">

          {/* Social + GST */}
          <div>
            <h3
              className="
                text-[10px] font-semibold uppercase tracking-[0.12em]
                text-muted
                mb-4
              "
            >
              Connect
            </h3>
            <div className="flex gap-2.5 mb-5" role="list" aria-label="Social media">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  role="listitem"
                  className="
                    w-9 h-9 rounded-full
                    flex items-center justify-center
                    border text-muted
                    transition-all duration-150
                    border-default
                    hover:text-brand-600 dark:hover:text-brand-400
                    hover:border-brand-300 dark:hover:border-brand-700
                    hover:bg-brand-50 dark:hover:bg-brand-950/20
                    focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-brand-500 focus-visible:ring-offset-1
                  "
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </a>
              ))}
            </div>
            <p className="text-[11px] text-muted font-medium tracking-wide">
              GST: OSMPK5329E1ZN
            </p>
          </div>

          {/* Legal & quick links */}
          <div className="md:col-span-3">
            <h3
              className="
                text-[10px] font-semibold uppercase tracking-[0.12em]
                text-muted
                mb-4
              "
            >
              Legal &amp; Quick Links
            </h3>
            <nav aria-label="Footer navigation">
              <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-3">
                {legalLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="
                        group inline-flex items-center gap-2
                        text-sm text-secondary
                        hover:text-brand-600 dark:hover:text-brand-400
                        transition-colors duration-150
                        focus-visible:outline-none focus-visible:rounded
                        focus-visible:ring-2 focus-visible:ring-brand-500
                      "
                    >
                      <link.icon
                        className="w-3.5 h-3.5 flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity"
                        aria-hidden="true"
                      />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* ── Bottom bar ───────────────────────────────────────────────── */}
        <div
          className="
            pt-6 border-t
            border-default
            flex flex-col md:flex-row justify-between items-center gap-3
            text-xs text-muted
          "
        >
          <div className="flex items-center gap-1">
            <span>© 2021 – {new Date().getFullYear()} BrizerHero.</span>
            <span>All rights reserved.</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <span className="text-red-500" aria-label="love">❤️</span>

            <span>Built for Grocery Owners only!</span>
          </div>
        </div>
      </div>
    </footer>
  );
}