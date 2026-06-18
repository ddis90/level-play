'use client';

import Link from 'next/link';
import { SiteHeader, SiteFooter } from '@/components/SiteChrome';
import { motion } from 'framer-motion';

const SERVICES = [
  {
    icon: '🏠',
    title: 'Individual Homes & Villas',
    body: 'Custom-designed independent houses and duplex villas. From 30x40 plots to sprawling estates — built as per Vastu, with RERA compliance and transparent costing.'
  },
  {
    icon: '🏢',
    title: 'Apartment Projects',
    body: 'G+4 to high-rise residential complexes with modern amenities. Earthquake-resistant design, proper ventilation, and approved layouts from BBMP/BDA/BMRDA.'
  },
  {
    icon: '🏬',
    title: 'Commercial Spaces',
    body: 'Shops, showrooms, offices, and warehouses built for business growth. Strategic layouts, ample parking, 100% Vaastu-compliant if required.'
  },
  {
    icon: '🛋️',
    title: 'Interiors & Fit-outs',
    body: 'Complete interior solutions — modular kitchens, wardrobes, false ceilings, electrical & plumbing. Premium finishes that suit Indian lifestyles.'
  },
];

const PROJECTS = [
  { name: 'Sharma Family Villa', city: 'RR Nagar, Bengaluru', status: 'Under Construction', badge: 'progress', area: '2,400 sq.ft' },
  { name: 'Green Orchards Apartment', city: 'Mysuru Road', status: 'Design Approval', badge: 'design', area: '24 Units, G+4' },
  { name: 'Sri Sai Commercial Complex', city: 'Davangere', status: 'Completed & Handed Over', badge: 'done', area: '12,000 sq.ft' },
  { name: 'Lakeview Premium Interiors', city: 'Shivamogga', status: 'Completed', badge: 'done', area: '3 BHK, 1,800 sq.ft' },
];

const STATS = [
  { num: '120+', label: 'Happy Families', sublabel: 'Across Karnataka' },
  { num: '₹85 Cr+', label: 'Projects Delivered', sublabel: 'Since 2010' },
  { num: '15+', label: 'Years Experience', sublabel: 'In Construction' },
  { num: '100%', label: 'RERA Compliant', sublabel: 'Transparent Process' },
];

const WHY = [
  {
    icon: '📐',
    title: 'End-to-End Accountability',
    body: 'From BBMP plan approval to final handover — one team, one point of contact. No sub-contractor confusion or finger-pointing.'
  },
  {
    icon: '💳',
    title: 'Clear Payment Structure',
    body: 'Pay only at milestones: Foundation, Slab, Plastering, Finishing. Every rupee tracked with bills, photos, and digital receipts in your portal.'
  },
  {
    icon: '📲',
    title: 'Live Construction Updates',
    body: 'Daily site photos, material delivery tracking, and engineer reports — all accessible from your mobile. No surprise delays or hidden costs.'
  },
  {
    icon: '🌱',
    title: 'Quality Materials & Vaastu',
    body: 'ISI-marked steel, ACC/UltraTech cement, and reputed brands. Vastu consultation available. Green building practices for lower electricity bills.'
  },
];

const TESTIMONIALS = [
  {
    name: 'Rajesh & Priya Kumar',
    location: 'JP Nagar, Bengaluru',
    quote: 'Built our dream home exactly as we imagined. The portal made everything transparent — no tension, no surprise bills.',
    project: '2 BHK Villa'
  },
  {
    name: 'Venkatesh Reddy',
    location: 'Mysuru',
    quote: 'Very professional team. They handled BBMP approvals, electricity connection, everything. I just had to visit on weekends to check progress.',
    project: '3 BHK Duplex'
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      {/* Hero Section - Indian Market Focus */}
      <section className="relative bg-slate-950 py-24 md:py-40 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none' stroke='%23fff' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>

        <div className="container relative z-10">
          <motion.div
            className="max-w-5xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-amber-400 font-semibold text-sm tracking-widest uppercase mb-6">
              Bengaluru & Karnataka | RERA Registered
            </p>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-[0.95]">
              Build Your{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500">
                  Dream Home
                </span>
                <span className="absolute inset-0 blur-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 opacity-30"></span>
              </span>
              ,<br />
              Track Every Brick
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl leading-relaxed font-light">
              No hidden costs. No delays. No tension. Just transparent construction
              with real-time updates on your phone.
            </p>

            <div className="mb-12 flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2 text-green-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">RERA Approved</span>
              </div>
              <div className="flex items-center gap-2 text-blue-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Vastu Consultation</span>
              </div>
              <div className="flex items-center gap-2 text-amber-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Premium Materials</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-5">
              <Link
                href="/contact"
                className="group px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-xl transition-all duration-300 shadow-2xl shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-105"
              >
                Get Free Quotation
                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                href="/#projects"
                className="px-10 py-5 border-2 border-slate-700 hover:border-amber-500 text-slate-200 hover:text-amber-400 font-semibold rounded-xl transition-all duration-300 hover:bg-slate-900/50"
              >
                View Our Projects
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-900 py-20 border-y border-slate-800">
        <div className="container">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {STATS.map((s) => (
              <motion.div key={s.label} variants={itemVariants} className="text-center group">
                <div className="text-4xl md:text-5xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-br from-amber-400 to-orange-500 mb-2 group-hover:scale-110 transition-transform">
                  {s.num}
                </div>
                <div className="text-sm text-slate-300 font-semibold">{s.label}</div>
                <div className="text-xs text-slate-500 mt-1">{s.sublabel}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-slate-950">
        <div className="container">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-amber-400 font-semibold text-sm tracking-widest uppercase mb-4">
              Complete Construction Solutions
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
              What We Build
            </h2>
            <p className="text-xl text-slate-400 leading-relaxed">
              From plot purchase guidance to final interior finishing — we handle everything
              so you can focus on your dream, not the paperwork.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {SERVICES.map((s) => (
              <motion.div
                key={s.title}
                variants={itemVariants}
                className="group relative p-8 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 hover:border-amber-500/50 rounded-2xl transition-all duration-500 overflow-hidden"
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>
                </div>

                <div className="relative z-10">
                  <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {s.icon}
                  </div>
                  <h3 className="text-xl font-bold font-display text-white mb-4 group-hover:text-amber-400 transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed text-sm">{s.body}</p>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500 group-hover:w-full transition-all duration-500"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 bg-slate-900">
        <div className="container">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-amber-400 font-semibold text-sm tracking-widest uppercase mb-4">
              Our Recent Work
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
              Projects Across Karnataka
            </h2>
            <p className="text-xl text-slate-400 leading-relaxed">
              From Bengaluru to tier-2 cities — building quality homes for Indian families.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {PROJECTS.map((p) => (
              <motion.div
                key={p.name}
                variants={itemVariants}
                className="group bg-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105"
              >
                <div className="h-56 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 flex items-center justify-center relative overflow-hidden">
                  {/* Animated background */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                  </div>
                  <span className="relative text-7xl font-bold font-display text-slate-700 group-hover:text-slate-600 transition-colors">LP</span>
                </div>

                <div className="p-6 relative">
                  <div className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-4 ${
                    p.badge === 'progress' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    p.badge === 'done' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {p.status}
                  </div>
                  <h3 className="text-lg font-bold font-display text-white mb-2 group-hover:text-amber-400 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-slate-400 text-sm flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {p.city}
                  </p>
                  <p className="text-slate-500 text-xs font-mono">{p.area}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="why" className="py-24 bg-slate-950 border-t border-slate-800">
        <div className="container">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-amber-400 font-semibold text-sm tracking-widest uppercase mb-4">
              Why Choose Levelplay
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
              Hassle-Free Construction
            </h2>
            <p className="text-xl text-slate-400 leading-relaxed">
              15 years of building trust, one home at a time.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {WHY.map((w) => (
              <motion.div
                key={w.title}
                variants={itemVariants}
                className="group p-8 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl hover:border-amber-500/50 transition-all duration-500"
              >
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{w.icon}</div>
                <h3 className="text-xl font-bold font-display text-white mb-4 group-hover:text-amber-400 transition-colors">
                  {w.title}
                </h3>
                <p className="text-slate-400 leading-relaxed text-sm">{w.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-slate-900">
        <div className="container">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-amber-400 font-semibold text-sm tracking-widest uppercase mb-4">
              Client Testimonials
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
              What Our Clients Say
            </h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {TESTIMONIALS.map((t, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="p-8 bg-slate-950 border border-slate-800 rounded-2xl"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-bold text-lg">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-white">{t.name}</div>
                    <div className="text-sm text-slate-400">{t.location} • {t.project}</div>
                  </div>
                </div>
                <p className="text-slate-300 leading-relaxed italic">
                  "{t.quote}"
                </p>
                <div className="mt-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>

        <div className="container relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Ready to Build Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                Dream Home
              </span>?
            </h2>
            <p className="text-2xl text-slate-300 mb-12 leading-relaxed font-light">
              Share your plot details and budget. Get a detailed quotation and
              construction timeline within 48 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-block px-12 py-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-lg rounded-xl transition-all duration-300 shadow-2xl shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-105"
              >
                Get Free Consultation →
              </Link>
              <a
                href="tel:+919876543210"
                className="inline-block px-12 py-6 border-2 border-amber-500 text-amber-400 font-bold text-lg rounded-xl hover:bg-amber-500/10 transition-all duration-300"
              >
                📞 Call: +91 98765 43210
              </a>
            </div>
            <p className="mt-8 text-slate-500 text-sm">
              Or WhatsApp us for instant response • RERA Registered • 15+ Years Experience
            </p>
          </motion.div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
