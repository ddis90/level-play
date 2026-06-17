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

      {/* Hero Section - Clean and Professional */}
      <section className="relative bg-white py-20 md:py-32 overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none'/%3E%3Cpath d='M0 0h60v60H0z' fill='none' stroke='%23000' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>

        <div className="container relative">
          <motion.div
            className="max-w-4xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-amber-700 font-semibold text-sm tracking-wider uppercase mb-4">
              Bangalore · Karnataka
            </p>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-slate-900 mb-6 leading-tight">
              Build with <span className="font-semibold text-amber-700">confidence</span>,
              <br />track every brick
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
              Premium construction meets digital transparency. Track every milestone,
              payment, and progress update in real-time through your personal portal.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="px-8 py-4 bg-amber-700 hover:bg-amber-800 text-white font-medium rounded-md transition-colors duration-200"
              >
                Start Your Project →
              </Link>
              <Link
                href="/#projects"
                className="px-8 py-4 border-2 border-slate-300 hover:border-amber-700 text-slate-700 hover:text-amber-700 font-medium rounded-md transition-colors duration-200"
              >
                View Our Work
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-50 py-16">
        <div className="container">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {STATS.map((s) => (
              <motion.div key={s.label} variants={itemVariants} className="text-center">
                <div className="text-4xl md:text-5xl font-light text-amber-700 mb-2">{s.num}</div>
                <div className="text-sm text-slate-600 font-medium">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="container">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-amber-700 font-semibold text-sm tracking-wider uppercase mb-3">
              What We Build
            </p>
            <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-4">
              End-to-end construction services
            </h2>
            <p className="text-lg text-slate-600">
              From a single home to a commercial complex, we manage design, build and interiors under one roof.
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
                className="group p-8 bg-white border border-slate-200 hover:border-amber-700 rounded-lg transition-all duration-300 hover:shadow-lg"
              >
                <div className="text-5xl mb-5">{s.icon}</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{s.title}</h3>
                <p className="text-slate-600 leading-relaxed">{s.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-slate-50">
        <div className="container">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-amber-700 font-semibold text-sm tracking-wider uppercase mb-3">
              Our Work
            </p>
            <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-4">
              Projects across Karnataka
            </h2>
            <p className="text-lg text-slate-600">
              A snapshot of ongoing and completed builds. Clients follow every one of these live in the portal.
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
                className="group bg-white border border-slate-200 hover:border-amber-700 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <div className="h-48 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-100"></div>
                  <span className="relative text-6xl font-light text-slate-300">LP</span>
                </div>
                <div className="p-6">
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
                    p.badge === 'progress' ? 'bg-amber-100 text-amber-800' :
                    p.badge === 'done' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {p.status}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {p.name}
                  </h3>
                  <p className="text-slate-600 text-sm">{p.city}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="why" className="py-20 bg-white">
        <div className="container">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-amber-700 font-semibold text-sm tracking-wider uppercase mb-3">
              Why Levelplay
            </p>
            <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-4">
              A builder and a platform in one
            </h2>
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
                className="p-8 bg-slate-50 border border-slate-200 rounded-lg hover:border-amber-700 transition-colors duration-300"
              >
                <div className="text-4xl mb-5">{w.icon}</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{w.title}</h3>
                <p className="text-slate-600 leading-relaxed">{w.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-amber-700 text-white">
        <div className="container">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-light mb-6">
              Ready to start your build?
            </h2>
            <p className="text-xl text-amber-100 mb-10 leading-relaxed">
              Tell us about your plot and requirements. Our team will get back with a
              consultation and an estimate.
            </p>
            <Link
              href="/contact"
              className="inline-block px-10 py-4 bg-white text-amber-700 font-semibold rounded-md hover:bg-amber-50 transition-colors duration-200"
            >
              Request a Consultation →
            </Link>
          </motion.div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
