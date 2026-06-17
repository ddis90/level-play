'use client';

import Link from 'next/link';
import { SiteHeader, SiteFooter } from '@/components/SiteChrome';
import { motion } from 'framer-motion';

const SERVICES = [
  { icon: '🏠', title: 'Home Construction', body: 'Independent houses and duplex villas built to your plan, from foundation to finishing.' },
  { icon: '🏢', title: 'Apartment Construction', body: 'Multi-unit residential blocks delivered with structural integrity and on-time milestones.' },
  { icon: '🏬', title: 'Commercial Construction', body: 'Retail, office and mixed-use spaces designed for footfall, function and durability.' },
  { icon: '🛋️', title: 'Interior Design', body: 'Turnkey interiors — modular kitchens, wardrobes, false ceilings and bespoke finishes.' },
];

const PROJECTS = [
  { name: 'Sharma Residence — Duplex Villa', city: 'RR Nagar, Bangalore', status: 'In Progress', badge: 'progress' },
  { name: 'Greenfield Apartments', city: 'Mysuru', status: 'Design Phase', badge: 'design' },
  { name: 'Sai Commercial Complex', city: 'Davanagere', status: 'Completed', badge: 'done' },
  { name: 'Lakeview Interiors', city: 'Shivamogga', status: 'Completed', badge: 'done' },
];

const STATS = [
  { num: '120+', label: 'Projects Delivered' },
  { num: '8', label: 'Cities Served' },
  { num: '15+', label: 'Years Experience' },
  { num: '100%', label: 'Transparent' },
];

const WHY = [
  { icon: '📐', title: 'Turnkey Delivery', body: 'One accountable team from design drawings to handover — no coordination headaches.' },
  { icon: '💳', title: 'Transparent Payments', body: 'Milestone-based payment structure with a full audit trail you can see anytime.' },
  { icon: '📲', title: 'Live Project Portal', body: 'Track progress photos, drawings, deliveries and approvals from your phone or laptop.' },
  { icon: '🌱', title: 'Quality & Sustainability', body: 'Certified materials and eco-conscious methods on every build.' },
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

      {/* Hero Section - Dark Cinematic */}
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
              Premium Construction · Karnataka
            </p>

            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-[0.95]">
              Build with{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500">
                  precision
                </span>
                <span className="absolute inset-0 blur-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 opacity-30"></span>
              </span>
              ,<br />
              track every moment
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl leading-relaxed font-light">
              Digital-first construction management. Every milestone, payment, and photo
              visible in your personal portal. No surprises, complete transparency.
            </p>

            <div className="flex flex-wrap gap-5">
              <Link
                href="/contact"
                className="group px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-xl transition-all duration-300 shadow-2xl shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-105"
              >
                Start Your Project
                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                href="/#projects"
                className="px-10 py-5 border-2 border-slate-700 hover:border-amber-500 text-slate-200 hover:text-amber-400 font-semibold rounded-xl transition-all duration-300 hover:bg-slate-900/50"
              >
                View Portfolio
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
            className="grid grid-cols-2 md:grid-cols-4 gap-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {STATS.map((s) => (
              <motion.div key={s.label} variants={itemVariants} className="text-center group">
                <div className="text-5xl md:text-6xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-br from-amber-400 to-orange-500 mb-3 group-hover:scale-110 transition-transform">
                  {s.num}
                </div>
                <div className="text-sm text-slate-400 font-medium uppercase tracking-wider">{s.label}</div>
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
              Comprehensive Services
            </p>
            <h2 className="font-display text-5xl md:text-6xl font-bold text-white mb-6">
              End-to-end construction
            </h2>
            <p className="text-xl text-slate-400 leading-relaxed">
              From concept to completion. Design, build, and interiors managed by a single expert team.
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
                  <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {s.icon}
                  </div>
                  <h3 className="text-xl font-bold font-display text-white mb-4 group-hover:text-amber-400 transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">{s.body}</p>
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
              Our Portfolio
            </p>
            <h2 className="font-display text-5xl md:text-6xl font-bold text-white mb-6">
              Projects across Karnataka
            </h2>
            <p className="text-xl text-slate-400 leading-relaxed">
              Real-time progress tracking for every project. Clients see updates live in their portal.
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
                  <span className="relative text-8xl font-bold font-display text-slate-700 group-hover:text-slate-600 transition-colors">LP</span>
                </div>

                <div className="p-6 relative">
                  <div className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-4 ${
                    p.badge === 'progress' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    p.badge === 'done' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {p.status}
                  </div>
                  <h3 className="text-lg font-bold font-display text-white mb-3 group-hover:text-amber-400 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-slate-400 text-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {p.city}
                  </p>
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
              Why Levelplay
            </p>
            <h2 className="font-display text-5xl md:text-6xl font-bold text-white mb-6">
              Builder + Platform
            </h2>
            <p className="text-xl text-slate-400 leading-relaxed">
              Not just construction. A complete digital experience for modern clients.
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
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">{w.icon}</div>
                <h3 className="text-xl font-bold font-display text-white mb-4 group-hover:text-amber-400 transition-colors">
                  {w.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">{w.body}</p>
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
            <h2 className="font-display text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Ready to start <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">your build</span>?
            </h2>
            <p className="text-2xl text-slate-300 mb-12 leading-relaxed font-light">
              Share your plot details and vision. Our team will respond with a personalized
              consultation and transparent estimate.
            </p>
            <Link
              href="/contact"
              className="inline-block px-12 py-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-lg rounded-xl transition-all duration-300 shadow-2xl shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-105"
            >
              Request Consultation →
            </Link>
          </motion.div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
