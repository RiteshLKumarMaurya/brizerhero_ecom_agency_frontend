import type { Metadata, Viewport } from 'next';
// import Script from 'next/script';
import { Inter } from 'next/font/google';

import './globals.css';

import { Providers } from '@/components/layout/Providers';
import { Footer } from '@/components/layout/Footer';
import { NavbarWrapper } from '@/components/layout/NavbarWrapper';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#050506' },
  ],
  colorScheme: 'dark light',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://brizerhero.com'),

  title: {
    default:
      'BrizerHero | Digital Transformation for Grocery Businesses',
    template: '%s | BrizerHero',
  },

  description:
    'BrizerHero helps grocery businesses modernize with online ordering, mobile apps, inventory management, pickup & delivery systems, loyalty programs, and custom digital platforms.',

  keywords: [
    'grocery software',
    'grocery app development',
    'grocery website development',
    'grocery ordering system',
    'online grocery platform',
    'inventory management system',
    'grocery delivery software',
    'indian grocery software',
    'grocery digital transformation',
    'pickup and delivery system',
    'admin dashboard',
    'BrizerHero',
  ],

  authors: [
    {
      name: 'BrizerHero',
      url: 'https://brizerhero.com',
    },
  ],

  creator: 'BrizerHero',
  publisher: 'BrizerHero',

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },

  alternates: {
    canonical: '/',
  },

  icons: {
    icon: [
      {
        url: '/favicon.ico',
      },
      {
        url: '/favicon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
      },
    ],

    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
      },
    ],

    shortcut: ['/favicon.ico'],
  },

  manifest: '/site.webmanifest',

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://brizerhero.com',
    siteName: 'BrizerHero',

    title:
      'BrizerHero | Digital Transformation for Grocery Businesses',

    description:
      'Helping grocery businesses grow with premium online ordering, mobile apps, inventory systems, pickup & delivery, and custom digital solutions.',

    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BrizerHero',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',

    title:
      'BrizerHero | Digital Transformation for Grocery Businesses',

    description:
      'Premium digital systems built exclusively for grocery businesses.',

    images: ['/og-image.png'],
  },

  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },

  
};

const organizationSchema = {
  '@context': 'https://schema.org',

  '@graph': [
    {
      '@type': 'Organization',

      '@id': 'https://brizerhero.com/#organization',

      name: 'BrizerHero',

      url: 'https://brizerhero.com',

      logo: {
        '@type': 'ImageObject',
        url: 'https://brizerhero.com/logo.png',
      },

      image: 'https://brizerhero.com/og-image.png',

      description:
        'BrizerHero helps grocery businesses modernize with online ordering, mobile apps, inventory management, pickup & delivery systems, loyalty programs, and custom digital platforms.',

      email: 'brizerhero@gmail.com',

      telephone: '+918651600737',

      foundingLocation: {
        '@type': 'Place',
        name: 'Bihar, India',
      },

      areaServed: [
        {
          '@type': 'Country',
          name: 'United States',
        },
        {
          '@type': 'Country',
          name: 'Canada',
        },
        {
          '@type': 'Country',
          name: 'Australia',
        },
      ],

      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'Sales',

          email: 'brizerhero@gmail.com',

          telephone: '+918651600737',

          availableLanguage: [
            'English',
            'Hindi',
          ],
        },
      ],

      sameAs: [
        'https://www.linkedin.com/in/ritesh-kumar-46550a292',
        'https://www.instagram.com/brizerhero.com_agency',
      ],
    },

    {
      '@type': 'WebSite',

      '@id': 'https://brizerhero.com/#website',

      url: 'https://brizerhero.com',

      name: 'BrizerHero',

      publisher: {
        '@id': 'https://brizerhero.com/#organization',
      },

      inLanguage: 'en-US',
    },

    {
      '@type': 'ProfessionalService',

      '@id': 'https://brizerhero.com/#service',

      name: 'BrizerHero',

      url: 'https://brizerhero.com',

      description:
        'Premium digital transformation services built exclusively for grocery businesses.',

      provider: {
        '@id': 'https://brizerhero.com/#organization',
      },

      serviceType: [
        'Grocery Website Development',
        'Online Grocery Ordering',
        'Inventory Management System',
        'Pickup & Delivery Platform',
        'Customer Mobile App',
        'Admin Dashboard',
      ],

      areaServed: [
        'United States',
        'Canada',
        'Australia',
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={inter.variable}
    >
      <head>

       
        <meta
          name="apple-mobile-web-app-title"
          content="BrizerHero"
        />

        <meta
          name="format-detection"
          content="telephone=no"
        />

{
        
        }

      </head>

      <body className="min-h-screen bg-surface text-primary antialiased">

        

        <Providers>

          <NavbarWrapper />

          <main
            id="main-content"
            className="min-h-screen pt-16 md:pt-20"
          >
            {children}
          </main>

          <Footer />

        </Providers>

      </body>
    </html>
  );
}