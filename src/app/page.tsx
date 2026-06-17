'use client';

import Link from 'next/link';
import { SiteHeader, SiteFooter } from '@/components/SiteChrome';
import { motion } from 'framer-motion';

const SERVICES = [
  {
    icon: '🏠',
    title: 'Home Construction',
    body: 'Independent houses and duplex villas built to your plan, from foundation to finishing.',
    gradient: 'from-amber-500/20 via-orange-500/20 to-rose-500/20'
  },
  {
    icon: '🏢',
    title: 'Apartment Construction',
    body: 'Multi-unit residential blocks delivered with structural integrity and on-time milestones.',
    gradient: 'from-blue-500/20 via-cyan-500/20 to-teal-500/20'
  },
  {
    icon: '🏬',
    title: 'Commercial Construction',
    body: 'Retail, office and mixed-use spaces designed for footfall, function and durability.',
    gradient: 'from-purple-500/20 via-pink-500/20 to-rose-500/20'
  },
  {
    icon: '🛋️',
    title: 'Interior Design',
    body: 'Turnkey interiors — modular kitchens, wardrobes, false ceilings and bespoke finishes.',
    gradient: 'from-emerald-500/20 via-green-500/20 to-lime-500/20'
  },
];

const PROJECTS = [
  { name: 'Sharma Residence — Duplex Villa', city: 'RR Nagar, Bangalore', status: 'In Progress', badge: 'progress' },
  { name: 'Greenfield Apartments', city: 'Mysuru', status: 'Design Phase', badge: 'design' },
  { name: 'Sai Commercial Complex', city: 'Davanagere', status: 'Completed', badge: 'done' },
  { name: 'Lakeview Interiors', city: 'Shivamogga', status: 'Completed', badge: 'done' },
];

const STATS = [
  { num: '120+', label: 'Projects Delivered', icon: '✨' },
  { num: '8', label: 'Cities Served', icon: '🏙️' },
  { num: '15+', label: 'Years of Experience', icon: '⏱️' },
  { num: '100%', label: 'Transparent Billing', icon: '💎' },
];

const WHY = [
  {
    icon: '📐',
    title: 'Turnkey Delivery',
    body: 'One accountable team from design drawings to handover — no coordination headaches.',
    color: 'from-amber-400 to-orange-500'
  },
  {
    icon: '💳',
    title: 'Transparent Payments',
    body: 'Milestone-based payment structure with a full audit trail you can see anytime.',
    color: 'from-blue-400 to-cyan-500'
  },
  {
    icon: '📲',
    title: 'Live Project Portal',
    body: 'Track progress photos, drawings, deliveries and approvals from your phone or laptop.',
    color: 'from-purple-400 to-pink-500'
  },
  {
    icon: '🌱',
    title: 'Quality & Sustainability',
    body: 'Certified materials and eco-conscious methods on every build.',
    color: 'from-emerald-400 to-green-500'
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      {/* Hero with animated background */}
      <div className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 -left-4 w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-0 -right-4 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>
          {/* Grain texture overlay */}
          <div className="absolute inset-0 opacity-20 bg-grain"></div>
        </div>

        <div className="container relative z-10">
          <motion.div
            className="max-w-4xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.span
              className="inline-block px-4 py-2 rounded-full bg-amber-500/10 backdrop-blur-sm border border-amber-500/20 text-amber-400 font-bold text-sm tracking-wider mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              BANGALORE · KARNATAKA
            </motion.span>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-black text-white mb-6 leading-[0.95] tracking-tight">
              Build with
              <span className="block bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                confidence
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl leading-relaxed font-light">
              Premium construction meets digital transparency. Track every milestone,
              payment, and progress update in real-time through your personal portal.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full font-bold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/50"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Your Project
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>

              <Link
                href="/#projects"
                className="px-8 py-4 rounded-full font-bold text-white border-2 border-white/20 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                View Our Work
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Stats with glassmorphism */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-slate-900"></div>
        <div className="container relative z-10">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                variants={itemVariants}
                className="group relative p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-amber-500/50 transition-all duration-500 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/10 group-hover:to-orange-500/10 rounded-3xl transition-all duration-500"></div>
                <div className="relative">
                  <div className="text-4xl mb-2">{s.icon}</div>
                  <div className="text-5xl font-black text-white mb-2 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
                    {s.num}
                  </div>
                  <div className="text-slate-400 font-medium text-sm">{s.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services with swirling cards */}
      <section id="services" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900"></div>

        <div className="container relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-amber-500/10 backdrop-blur-sm border border-amber-500/20 text-amber-400 font-bold text-sm tracking-wider mb-4">
              WHAT WE BUILD
            </span>
            <h2 className="text-5xl md:text-6xl font-display font-black text-white mb-6">
              End-to-end construction services
            </h2>
            <p className="text-xl text-slate-400">
              From a single home to a commercial complex, we manage design, build and interiors under one roof.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {SERVICES.map((s, i) => (
              <motion.div
                key={s.title}
                variants={itemVariants}
                className="group relative"
              >
                <div className="relative p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 h-full">
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500`}></div>

                  <div className="relative">
                    <div className="text-6xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                      {s.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{s.body}</p>
                  </div>

                  {/* Floating corner accent */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projects with 3D effect */}
      <section id="projects" className="py-24 relative">
        <div className="absolute inset-0 bg-slate-900"></div>

        <div className="container relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-amber-500/10 backdrop-blur-sm border border-amber-500/20 text-amber-400 font-bold text-sm tracking-wider mb-4">
              OUR WORK
            </span>
            <h2 className="text-5xl md:text-6xl font-display font-black text-white mb-6">
              Projects across Karnataka
            </h2>
            <p className="text-xl text-slate-400">
              A snapshot of ongoing and completed builds. Clients follow every one of these live in the portal.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {PROJECTS.map((p, i) => (
              <motion.div
                key={p.name}
                variants={itemVariants}
                className="group relative rounded-3xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 hover:border-amber-500/50 transition-all duration-500 hover:scale-105"
                whileHover={{ y: -8 }}
              >
                {/* Image placeholder with gradient */}
                <div className="relative h-56 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 overflow-hidden">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-black text-white/30 tracking-widest">LP</span>
                  </div>
                  {/* Animated gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                <div className="p-6">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3 ${
                    p.badge === 'progress' ? 'bg-orange-500/20 text-orange-400' :
                    p.badge === 'done' ? 'bg-emerald-500/20 text-emerald-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      p.badge === 'progress' ? 'bg-orange-400' :
                      p.badge === 'done' ? 'bg-emerald-400' :
                      'bg-blue-400'
                    } animate-pulse`}></span>
                    {p.status}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-slate-400 text-sm">{p.city}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why us with gradient cards */}
      <section id="why" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950"></div>

        <div className="container relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-amber-500/10 backdrop-blur-sm border border-amber-500/20 text-amber-400 font-bold text-sm tracking-wider mb-4">
              WHY LEVELPLAY
            </span>
            <h2 className="text-5xl md:text-6xl font-display font-black text-white mb-6">
              A builder and a platform in one
            </h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {WHY.map((w, i) => (
              <motion.div
                key={w.title}
                variants={itemVariants}
                className="group relative p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500"
                whileHover={{ scale: 1.05 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${w.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`}></div>

                <div className="relative">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${w.color} mb-6 text-3xl transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                    {w.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{w.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{w.body}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA with gradient background */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-orange-600 to-pink-600">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
          </div>
        </div>

        <div className="container relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-6xl font-display font-black text-white mb-6">
              Ready to start your build?
            </h2>
            <p className="text-xl text-white/80 mb-10 leading-relaxed">
              Tell us about your plot and requirements. Our team will get back with a
              consultation and an estimate.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-orange-600 rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 hover:shadow-2xl"
            >
              Request a Consultation
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      <SiteFooter />

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .bg-grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
      `}</style>
    </>
  );
}
