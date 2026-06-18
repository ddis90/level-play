'use client';

import Link from 'next/link';
import Image from 'next/image';
import { SiteHeader, SiteFooter } from '@/components/SiteChrome';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useState, useRef } from 'react';

const SERVICES = [
  {
    icon: '🏠',
    title: 'Individual Homes & Villas',
    body: 'Custom-designed independent houses and duplex villas. From 30x40 plots to sprawling estates — built as per Vastu, with RERA compliance and transparent costing.',
    stats: { projects: '85+', avgSize: '2,400 sq.ft', satisfaction: '98%' }
  },
  {
    icon: '🏢',
    title: 'Apartment Projects',
    body: 'G+4 to high-rise residential complexes with modern amenities. Earthquake-resistant design, proper ventilation, and approved layouts from BBMP/BDA/BMRDA.',
    stats: { projects: '24', avgSize: '12 Units/Project', satisfaction: '96%' }
  },
  {
    icon: '🏬',
    title: 'Commercial Spaces',
    body: 'Shops, showrooms, offices, and warehouses built for business growth. Strategic layouts, ample parking, 100% Vaastu-compliant if required.',
    stats: { projects: '32+', avgSize: '8,000 sq.ft', satisfaction: '97%' }
  },
  {
    icon: '🛋️',
    title: 'Interiors & Fit-outs',
    body: 'Complete interior solutions — modular kitchens, wardrobes, false ceilings, electrical & plumbing. Premium finishes that suit Indian lifestyles.',
    stats: { projects: '120+', avgSize: '1,800 sq.ft', satisfaction: '99%' }
  },
];

const PROJECTS = [
  {
    name: 'Sharma Family Villa',
    city: 'RR Nagar, Bengaluru',
    status: 'Under Construction',
    badge: 'progress',
    area: '2,400 sq.ft',
    progress: 65,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop'
  },
  {
    name: 'Green Orchards Apartment',
    city: 'Mysuru Road',
    status: 'Design Approval',
    badge: 'design',
    area: '24 Units, G+4',
    progress: 25,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop'
  },
  {
    name: 'Sri Sai Commercial Complex',
    city: 'Davangere',
    status: 'Completed & Handed Over',
    badge: 'done',
    area: '12,000 sq.ft',
    progress: 100,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop'
  },
  {
    name: 'Lakeview Premium Interiors',
    city: 'Shivamogga',
    status: 'Completed',
    badge: 'done',
    area: '3 BHK, 1,800 sq.ft',
    progress: 100,
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop'
  },
];

// Flipping project card component
function FlippingProjectCard({ project, index }: { project: typeof PROJECTS[0], index: number }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      className="group perspective-1000"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <motion.div
        className="relative w-full h-[400px] cursor-pointer preserve-3d"
        onClick={() => setIsFlipped(!isFlipped)}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 80 }}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden border border-slate-800">
          <div className="relative h-full">
            <Image
              src={project.image}
              alt={project.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

            <div className="absolute top-4 right-4">
              <div className={`px-4 py-2 rounded-full text-xs font-bold backdrop-blur-xl ${
                project.badge === 'progress' ? 'bg-amber-500/90 text-slate-950' :
                project.badge === 'done' ? 'bg-green-500/90 text-white' :
                'bg-blue-500/90 text-white'
              }`}>
                {project.status}
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="font-display text-2xl font-bold text-white mb-2">
                {project.name}
              </h3>
              <p className="text-slate-300 text-sm flex items-center gap-2 mb-3">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {project.city}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">{project.area}</span>
                <span className="text-xs text-amber-400">Click to flip →</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-6 flex flex-col justify-center rotate-y-180">
          <h4 className="font-display text-xl font-bold text-white mb-4">Project Details</h4>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Progress</span>
                <span className="text-amber-400 font-bold">{project.progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                  initial={{ width: 0 }}
                  animate={{ width: isFlipped ? `${project.progress}%` : 0 }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950/50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-amber-400">{project.area.split(',')[0]}</div>
                <div className="text-xs text-slate-400">Area</div>
              </div>
              <div className="bg-slate-950/50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-400">✓</div>
                <div className="text-xs text-slate-400">RERA Approved</div>
              </div>
            </div>

            <button className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold rounded-lg hover:from-amber-400 hover:to-orange-400 transition-all">
              View Full Details
            </button>
          </div>

          <p className="text-xs text-slate-500 text-center mt-4">Click again to flip back</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Floating construction element
function FloatingConstructionElement({ delay = 0 }) {
  return (
    <motion.div
      className="absolute w-32 h-32 opacity-5"
      animate={{
        y: [-20, 20, -20],
        rotate: [0, 10, 0, -10, 0],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <svg viewBox="0 0 100 100" fill="currentColor" className="text-amber-400">
        <polygon points="50,10 90,90 10,90" />
      </svg>
    </motion.div>
  );
}

export default function HomePage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <>
      <SiteHeader />

      {/* Hero with Parallax */}
      <section ref={containerRef} className="relative bg-slate-950 py-32 md:py-48 overflow-hidden">
        {/* Animated background with construction elements */}
        <div className="absolute inset-0">
          <FloatingConstructionElement delay={0} />
          <FloatingConstructionElement delay={2} />
          <FloatingConstructionElement delay={4} />
        </div>

        {/* Blueprint grid with parallax */}
        <motion.div
          className="absolute inset-0 opacity-[0.03]"
          style={{ y }}
        >
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(to right, #3b82f6 1px, transparent 1px),
              linear-gradient(to bottom, #3b82f6 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }} />
        </motion.div>

        <motion.div className="container relative z-10" style={{ opacity }}>
          <motion.div
            className="max-w-5xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, type: "spring" }}
          >
            {/* Animated badge */}
            <motion.div
              className="inline-flex items-center gap-3 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full mb-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="w-2 h-2 bg-green-400 rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-amber-400 font-semibold text-sm tracking-widest uppercase">
                Bengaluru & Karnataka | RERA Registered
              </span>
            </motion.div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-[0.95]">
              Build Your{' '}
              <motion.span
                className="relative inline-block"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500">
                  Dream Home
                </span>
                <motion.span
                  className="absolute inset-0 blur-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500"
                  animate={{
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.span>
              ,<br />
              Track Every Brick
            </h1>

            <motion.p
              className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl leading-relaxed font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              No hidden costs. No delays. No tension. Just transparent construction
              with real-time updates on your phone.
            </motion.p>

            {/* Trust badges with stagger */}
            <motion.div
              className="flex flex-wrap gap-4 mb-12"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.8
                  }
                }
              }}
            >
              {[
                { icon: '✓', text: 'RERA Approved', color: 'green' },
                { icon: '✓', text: 'Vastu Consultation', color: 'blue' },
                { icon: '✓', text: 'Premium Materials', color: 'amber' },
              ].map((badge, i) => (
                <motion.div
                  key={i}
                  className={`flex items-center gap-2 px-4 py-2 bg-${badge.color}-500/10 border border-${badge.color}-500/30 rounded-lg`}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <span className={`text-${badge.color}-400 font-bold`}>{badge.icon}</span>
                  <span className="text-sm font-medium text-slate-300">{badge.text}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Link
                href="/contact"
                className="group relative px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold rounded-xl overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  Get Free Quotation
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Services with hover flip effect */}
      <section className="py-24 bg-slate-900">
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
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((service, i) => (
              <motion.div
                key={i}
                className="group relative h-[400px] perspective-1000"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="relative w-full h-full preserve-3d"
                  whileHover={{ rotateY: 180 }}
                  transition={{ duration: 0.8 }}
                >
                  {/* Front */}
                  <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 flex flex-col">
                    <div className="text-6xl mb-6">{service.icon}</div>
                    <h3 className="font-display text-xl font-bold text-white mb-4">
                      {service.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed flex-grow">
                      {service.body.slice(0, 100)}...
                    </p>
                    <div className="text-xs text-amber-400 mt-4">Hover for stats →</div>
                  </div>

                  {/* Back */}
                  <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-8 flex flex-col justify-center rotate-y-180">
                    <h4 className="font-display text-2xl font-bold text-slate-950 mb-6">
                      Our Track Record
                    </h4>
                    <div className="space-y-4">
                      <div className="bg-slate-950/20 p-4 rounded-lg">
                        <div className="text-3xl font-bold text-slate-950">{service.stats.projects}</div>
                        <div className="text-sm text-slate-900">Completed Projects</div>
                      </div>
                      <div className="bg-slate-950/20 p-4 rounded-lg">
                        <div className="text-3xl font-bold text-slate-950">{service.stats.avgSize}</div>
                        <div className="text-sm text-slate-900">Average Size</div>
                      </div>
                      <div className="bg-slate-950/20 p-4 rounded-lg">
                        <div className="text-3xl font-bold text-slate-950">{service.stats.satisfaction}</div>
                        <div className="text-sm text-slate-900">Client Satisfaction</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects with custom flipping cards */}
      <section className="py-24 bg-slate-950">
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
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROJECTS.map((project, i) => (
              <FlippingProjectCard key={i} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA with animated elements */}
      <section className="relative py-32 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundImage: 'radial-gradient(circle at center, rgba(245, 158, 11, 0.1) 0%, transparent 50%)',
            backgroundSize: '200% 200%',
          }}
        />

        <div className="container relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-5xl md:text-7xl font-bold text-white mb-8">
              Ready to Build Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                Dream Home
              </span>?
            </h2>
            <p className="text-2xl text-slate-300 mb-12 font-light">
              Get a detailed quotation within 48 hours
            </p>
            <Link
              href="/contact"
              className="inline-block px-12 py-6 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-lg rounded-xl hover:scale-105 transition-transform duration-300 shadow-2xl shadow-amber-500/20"
            >
              Get Free Consultation →
            </Link>
          </motion.div>
        </div>
      </section>

      <SiteFooter />

      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </>
  );
}
