import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Zap, Shield, Users, PenTool, Image, Star, MessageSquare, Settings } from 'lucide-react';

export const metadata: Metadata = {
  title: 'How to Use BrizerHero | User Guide',
  description: 'Learn how to navigate our website, explore services, and manage your account.',
};

export default function HowToUsePage() {
  return (
    <div className="pt-24 pb-20">
      <div className="section-container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            How to Use <span className="gradient-text">BrizerHero</span>
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400">
            A complete guide for visitors, clients, and admins.
          </p>
        </div>

        {/* Tabs / Sections */}
        <div className="space-y-12">
          {/* For Visitors */}
          <section className="card-base p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-brand-50">
                <Users className="w-5 h-5 text-brand-600" />
              </div>
              <h2 className="font-display text-xl font-bold">For Visitors & Potential Clients</h2>
            </div>
            <div className="space-y-4 text-zinc-600 dark:text-zinc-300">
              <p>Welcome! Here's how to explore our services and get in touch:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li><strong>Browse our work:</strong> Visit the <Link href="/projects" className="text-brand-500 hover:underline">Projects</Link> page to see real‑world examples.</li>
                <li><strong>Explore services:</strong> Go to <Link href="/services" className="text-brand-500 hover:underline">Services</Link> to understand what we offer (website, mobile apps, e‑commerce, etc.).</li>
                <li><strong>Check packages:</strong> <Link href="/packages" className="text-brand-500 hover:underline">Packages</Link> show pre‑built solutions with transparent pricing.</li>
                <li><strong>Read testimonials:</strong> Hear from our happy clients on the <Link href="/testimonials" className="text-brand-500 hover:underline">Testimonials</Link> page.</li>
                <li><strong>Contact us:</strong> Fill out the form on the <Link href="/contact" className="text-brand-500 hover:underline">Contact</Link> page. We'll get back within 24 hours.</li>
              </ol>
            </div>
          </section>

          {/* For Registered Clients (with account) */}
      

          {/* For Admin Panel Users */}
          <section className="card-base p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-brand-50">
                <PenTool className="w-5 h-5 text-brand-600" />
              </div>
              <h2 className="font-display text-xl font-bold">For Admins (Managing the Website)</h2>
            </div>
            <div className="space-y-4 text-zinc-600 dark:text-zinc-300">
              <p>Administrators can manage all content from the dashboard. Here's how:</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3">
                  <Image className="w-4 h-4 text-brand-500 mb-2" />
                  <h4 className="font-semibold text-sm">Banners</h4>
                  <p className="text-xs">Create/update homepage banners with images, links, and scheduling.</p>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3">
                  <Star className="w-4 h-4 text-brand-500 mb-2" />
                  <h4 className="font-semibold text-sm">Testimonials</h4>
                  <p className="text-xs">Add client reviews, star ratings, and banner images.</p>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3">
                  <MessageSquare className="w-4 h-4 text-brand-500 mb-2" />
                  <h4 className="font-semibold text-sm">Contact Requests</h4>
                  <p className="text-xs">View leads, change status, assign to team members.</p>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3">
                  <Settings className="w-4 h-4 text-brand-500 mb-2" />
                  <h4 className="font-semibold text-sm">Settings & Users</h4>
                  <p className="text-xs">Manage site‑wide settings, user roles, and permissions.</p>
                </div>
              </div>

              <p className="mt-4"><strong>To access the admin panel:</strong> Go to <code className="bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">/dashboard</code> (or click "Admin" in navbar after logging in). Only users with <strong>ROLE_ADMIN</strong> can see the dashboard menu.</p>
              <p><strong>Quick tips:</strong> Use search and filters on each page to find content. Enable/disable items with the toggle switches. Always click "Save" after making changes.</p>
            </div>
          </section>

          {/* FAQ - Common Questions */}
          <section className="card-base p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-brand-50">
                <Zap className="w-5 h-5 text-brand-600" />
              </div>
              <h2 className="font-display text-xl font-bold">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-3 text-zinc-600 dark:text-zinc-300">
              <div>
                <p className="font-semibold">How do I change my password?</p>
                <p className="text-sm">Log in → go to Dashboard → Settings → Change Password.</p>
              </div>
            
              <div>
                <p className="font-semibold">What if I forget my login?</p>
                <p className="text-sm">Use the "Forgot Password?" link on the login page or contact support.</p>
              </div>
            </div>
          </section>

          {/* Call to action */}
          <div className="text-center pt-6">
            <Link href="/contact" className="btn-primary gap-2">
              Need More Help? Contact Support <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}