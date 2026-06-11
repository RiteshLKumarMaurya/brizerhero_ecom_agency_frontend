# BrizerHero Frontend

Premium software development agency website built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**. Fully integrated with the BrizerHero backend API.

---

## 🚀 Features

- **Premium UI/UX** — Stripe/Linear/Vercel-quality design system
- **Google Sign-In (Primary)** — One-tap Google OAuth via GSI
- **Phone + Password (Secondary)** — Full login/register flow
- **JWT Auth with auto-refresh** — Axios interceptor handles token refresh
- **React Query** — Optimistic updates, caching, background refetch
- **Zustand** — Lightweight auth state with localStorage persistence
- **Dark / Light mode** — System-aware with manual toggle
- **Fully responsive** — Mobile-first design
- **SEO optimized** — Dynamic metadata, OG tags, sitemap, robots.txt
- **Admin Dashboard** — Full CRUD for all content types
- **Type-safe** — 100% TypeScript, all API types from Swagger spec

---

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout (fonts, metadata, providers)
│   ├── page.tsx                  # Homepage (all sections)
│   ├── about/page.tsx
│   ├── services/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── projects/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── packages/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── technologies/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── testimonials/page.tsx
│   ├── contact/page.tsx
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── profile/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx            # Admin sidebar layout
│   │   ├── page.tsx              # Dashboard overview + stats
│   │   ├── contacts/page.tsx     # Contact request management
│   │   ├── projects/page.tsx
│   │   ├── services/page.tsx
│   │   ├── packages/page.tsx
│   │   ├── technologies/page.tsx
│   │   ├── testimonials/page.tsx
│   │   ├── banners/page.tsx
│   │   └── users/page.tsx
│   ├── not-found.tsx             # 404 page
│   ├── sitemap.ts                # Dynamic sitemap
│   ├── robots.ts                 # Robots.txt
│   └── globals.css               # Global styles + design tokens
│
├── components/
│   ├── auth/
│   │   ├── GoogleSignInButton.tsx  # GSI button (primary auth)
│   │   └── UserMenu.tsx            # Authenticated user dropdown
│   ├── common/
│   │   ├── SectionHeader.tsx
│   │   └── Skeletons.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── Providers.tsx           # QueryClient + ThemeProvider
│   └── sections/                   # Homepage sections
│       ├── HeroSection.tsx
│       ├── StatsSection.tsx
│       ├── FeaturedServices.tsx
│       ├── FeaturedProjects.tsx
│       ├── FeaturedPackages.tsx
│       ├── TechnologiesSection.tsx
│       ├── TestimonialsSection.tsx
│       ├── WhyChooseUs.tsx         # Also exports ProcessSection, FaqSection, ContactCta
│       └── ...
│
├── hooks/
│   ├── useApi.ts                   # All React Query hooks
│   └── useGoogleAuth.ts            # Google GSI hook
│
├── lib/
│   ├── apiClient.ts                # Axios instance + JWT interceptors
│   ├── cdn.ts                      # CDN URL helpers
│   └── utils.ts                    # cn(), formatPrice(), formatDate(), etc.
│
├── services/
│   └── api.ts                      # All API service functions (typed)
│
├── store/
│   └── authStore.ts                # Zustand auth store (persisted)
│
└── types/
    └── index.ts                    # All TypeScript types from Swagger
```

---

## ⚙️ Setup

### 1. Prerequisites

- Node.js 18.17+ (LTS recommended)
- npm 9+

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | ✅ | Backend API base URL |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Your production domain |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | ✅ | Google OAuth Client ID |
| `NEXT_PUBLIC_CDN_URL` | ✅ | CDN base URL for media |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | ❌ | Google Search Console |

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Build for production

```bash
npm run build
npm start
```

---

## 🔐 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project (or select existing)
3. Enable **Google Identity Services API**
4. Go to **APIs & Services → Credentials**
5. Create **OAuth 2.0 Client ID** (Web application)
6. Add **Authorized JavaScript origins**:
   - `http://localhost:3000` (dev)
   - `https://yourdomain.com` (prod)
7. Copy the **Client ID** → paste into `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
8. The backend verifies the `idToken` via Google's public keys

---

## 🔑 Authentication Flow

```
Google Sign-In (Primary)
  └─ User clicks "Continue with Google"
  └─ GSI returns idToken (JWT from Google)
  └─ POST /api/v1/auth/login/google { idToken }
  └─ Backend validates → returns { user, tokens: { accessToken, refreshToken } }
  └─ Stored in Zustand + localStorage
  └─ Axios interceptor attaches Bearer token to all requests
  └─ On 401: intercept → POST /api/v1/auth/tokens/refresh → retry

Phone + Password (Secondary)
  └─ POST /api/v1/auth/login/phone-pass { fullPhoneNumber, password }
  └─ Returns { userProfileResponse, tokenResponse }
  └─ Same storage + interceptor flow

Register
  └─ POST /api/v1/auth/register/phone-pass { fullName, phoneNumber, countryCode, password, roleName: "ROLE_CLIENT" }
  └─ Auto-login after successful registration
```

---

## 🛡️ Admin Access

Admin dashboard is only accessible to users with `roleName = ROLE_ADMIN` or `ROLE_SUPER_ADMIN`.

Route: `/dashboard`

Protected by client-side redirect in `dashboard/layout.tsx`.

---

## 📦 Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 15.x | Framework, App Router, SSR/SSG |
| React | 19.x | UI |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Styling |
| Framer Motion | 11.x | Animations |
| TanStack Query | 5.x | Server state, caching |
| Axios | 1.x | HTTP client + interceptors |
| Zustand | 5.x | Client state (auth) |
| next-themes | 0.4.x | Dark/light mode |
| Embla Carousel | 8.x | Testimonials carousel |
| Lucide React | 0.4.x | Icons |
| react-hot-toast | 2.x | Toast notifications |

---

## 🌐 API Integration

All API calls go through `src/services/api.ts` using the typed Axios client from `src/lib/apiClient.ts`.

React Query hooks in `src/hooks/useApi.ts` wrap all API calls with:
- Loading states
- Error handling
- Background refetch
- Cache invalidation on mutations

### Key API endpoints used:

```
POST   /api/v1/auth/login/google          Google sign-in
POST   /api/v1/auth/login/phone-pass      Phone login
POST   /api/v1/auth/register/phone-pass   Register
POST   /api/v1/auth/tokens/refresh        Token refresh
POST   /api/v1/auth/logout                Logout
GET    /api/v1/users/me                   Current user
GET    /api/v1/public/services            Services list
GET    /api/v1/public/projects/featured   Featured projects
GET    /api/v1/public/packages            Packages
GET    /api/v1/public/technologies        Technologies
GET    /api/v1/public/testimonials        Testimonials
POST   /api/v1/public/contact-requests    Submit contact form
GET    /api/v1/admin/*                    Admin CRUD endpoints
```
#   b r i z e r h e r o _ e c o m _ a g e n c y _ f r o n t e n d  
 