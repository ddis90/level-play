'use client';

import Image from 'next/image';
import { SiteHeader, SiteFooter } from '@/components/SiteChrome';
import { AnimatedButton, ProgressBar, Badge } from '@/components/ui';
import { FlipCard, GlassCard, Depth3DCard, FloatingElement, ConnectSection } from '@/components/advanced-ui';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { CheckCircle2, Shield, TrendingUp, Award, MapPin, Users, FileCheck, Building2, Sparkles } from 'lucide-react';

const SERVICES = [
  {
    icon: '🏠',
    title: 'Individual Homes & Villas',
    body: 'Custom-designed independent houses and duplex villas. From 30x40 plots to sprawling estates — built with structural certification, transparent costing, and bank-approved plans.',
    stats: { projects: '85+', avgSize: '2,400 sq.ft' }
  },
  {
    icon: '🏢',
    title: 'Apartment Projects',
    body: 'G+4 to high-rise residential complexes with modern amenities. IS 456:2000 compliant design, proper ventilation, and approved layouts from BBMP/BDA/BMRDA.',
    stats: { projects: '24', avgSize: '12 Units/Project' }
  },
  {
    icon: '🏬',
    title: 'Commercial Spaces',
    body: 'Shops, showrooms, offices, and warehouses built for business growth. Strategic layouts, ample parking, complete structural warranty.',
    stats: { projects: '32+', avgSize: '8,000 sq.ft' }
  },
  {
    icon: '🛋️',
    title: 'Interiors & Fit-outs',
    body: 'Complete interior solutions — modular kitchens, wardrobes, false ceilings, electrical & plumbing. Premium finishes that suit Indian lifestyles.',
    stats: { projects: '120+', avgSize: '1,800 sq.ft' }
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
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
    completionDate: 'Dec 2026',
    description: 'Modern 3BHK villa with contemporary design, spacious balconies, and premium finishes. Features include modular kitchen, designer bathrooms, and landscaped garden.'
  },
  {
    name: 'Green Orchards Apartment',
    city: 'Mysuru Road',
    status: 'Design Approval',
    badge: 'design',
    area: '24 Units, G+4',
    progress: 25,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
    completionDate: 'Jun 2027',
    description: 'Boutique apartment complex with 2 & 3 BHK units. Amenities include clubhouse, gym, children\'s play area, and rooftop terrace with city views.'
  },
  {
    name: 'Sri Sai Commercial Complex',
    city: 'Davangere',
    status: 'Completed & Handed Over',
    badge: 'done',
    area: '12,000 sq.ft',
    progress: 100,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
    completionDate: 'Mar 2026',
    description: 'Multi-purpose commercial building with retail shops on ground floor and office spaces above. Prime location with excellent parking facilities.'
  },
  {
    name: 'Lakeview Premium Interiors',
    city: 'Shivamogga',
    status: 'Completed',
    badge: 'done',
    area: '3 BHK, 1,800 sq.ft',
    progress: 100,
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
    completionDate: 'Jan 2026',
    description: 'Luxury interior transformation with Italian marble flooring, designer lighting, imported fixtures, and custom-built furniture throughout the residence.'
  },
];

// Flipping project card with image on back
function ProjectCard({ project, index }: { project: typeof PROJECTS[0], index: number }) {
  return (
    <Depth3DCard>
      <FlipCard
        className="h-[420px]"
        front={
          <GlassCard intensity="medium" className="h-full overflow-hidden group">
            <div className="relative h-56">
              <Image
                src={project.image}
                alt={project.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4">
                <Badge
                  variant={project.badge === 'done' ? 'success' : project.badge === 'progress' ? 'warning' : 'info'}
                  pulse={project.badge === 'progress'}
                >
                  {project.status}
                </Badge>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-display text-xl font-bold mb-2 text-slate-900 dark:text-white">{project.name}</h3>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-3">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{project.city}</span>
              </div>
              <div className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 mb-2">{project.area}</div>
              {project.progress < 100 && <ProgressBar value={project.progress} className="mb-2" />}
              <div className="mt-4 text-xs text-slate-500 dark:text-slate-500 text-center">Click for details</div>
            </div>
          </GlassCard>
        }
        back={
          <GlassCard intensity="strong" className="h-full relative overflow-hidden">
            <div className="absolute inset-0">
              <Image
                src={project.image}
                alt={project.name}
                fill
                className="object-cover opacity-20 dark:opacity-10"
              />
            </div>
            <div className="relative z-10 h-full p-6 flex flex-col justify-between bg-gradient-to-b from-slate-900/80 to-slate-900/95 dark:from-slate-950/90 dark:to-slate-950/98">
              <div>
                <h3 className="font-display text-xl font-bold mb-3 text-white">{project.name}</h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">{project.description}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-xs text-slate-400">Area</div>
                    <div className="text-sm font-bold text-white">{project.area}</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-xs text-slate-400">Completion</div>
                    <div className="text-sm font-bold text-white">{project.completionDate}</div>
                  </div>
                </div>
              </div>
              <AnimatedButton variant="primary" size="sm" className="w-full mt-4">
                View Full Details
              </AnimatedButton>
            </div>
          </GlassCard>
        }
      />
    </Depth3DCard>
  );
}

// Service card with stats on flip
function ServiceCard({ service, index }: { service: typeof SERVICES[0], index: number }) {
  return (
    <FlipCard
      className="h-[340px]"
      front={
        <GlassCard
          intensity="medium"
          className="h-full p-6 hover:bg-white/20 dark:hover:bg-white/15 transition-all duration-300"
        >
          <div className="text-5xl mb-4">{service.icon}</div>
          <h3 className="font-display text-xl font-bold mb-3 text-slate-900 dark:text-white">{service.title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{service.body}</p>
          <div className="mt-4 text-xs text-slate-500 dark:text-slate-500 text-center">Click for stats</div>
        </GlassCard>
      }
      back={
        <GlassCard intensity="strong" className="h-full p-6 flex flex-col justify-around bg-gradient-to-br from-cyan-500/10 to-teal-500/10 dark:from-cyan-500/5 dark:to-teal-500/5">
          <div className="text-center">
            <div className="text-5xl font-black bg-gradient-to-r from-cyan-500 to-teal-500 bg-clip-text text-transparent mb-2">{service.stats.projects}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400 font-semibold">Projects Completed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-slate-900 dark:text-white mb-2">{service.stats.avgSize}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400 font-semibold">Average Project Size</div>
          </div>
          <AnimatedButton variant="primary" size="sm" className="w-full mt-4">
            Learn More
          </AnimatedButton>
        </GlassCard>
      }
    />
  );
}

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const springScrollY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const heroOpacity = useTransform(springScrollY, [0, 1], [1, 0]);
  const heroScale = useTransform(springScrollY, [0, 1], [1, 0.95]);
  const heroY = useTransform(springScrollY, [0, 1], [0, -100]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <SiteHeader />

      {/* Hero Section with Parallax */}
      <section ref={heroRef} className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Animated Blueprint Grid Background */}
        <div className="absolute inset-0 opacity-20 dark:opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] bg-repeat" />
        </div>

        {/* Floating Construction Elements */}
        <FloatingElement delay={0} shape="triangle" size={120} />
        <FloatingElement delay={3} shape="hexagon" size={100} />
        <FloatingElement delay={6} shape="beam" size={140} />

        <motion.div
          className="container relative z-10"
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-500/20 dark:bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 font-bold text-sm backdrop-blur-sm">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                Certified Engineers | 10-Year Warranty | Bank-Approved Plans
              </span>
            </motion.div>

            <motion.h1
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-slate-900 dark:text-white">Build Your </span>
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-600 bg-clip-text text-transparent animate-gradient">
                  Dream Home
                </span>
                <motion.span
                  className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-cyan-500/50 to-teal-500/50 blur-xl"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </span>
              <br />
              <span className="text-slate-900 dark:text-white">in Bengaluru</span>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Turnkey construction with real-time project tracking. From plot approval to interior fit-out, we handle everything — transparent pricing, Vastu compliance, and zero surprises.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4 justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <AnimatedButton variant="primary" size="lg" href="/contact">
                Get Free Quotation
              </AnimatedButton>
              <AnimatedButton variant="secondary" size="lg" href="/#projects">
                View Live Projects
              </AnimatedButton>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {[
                { icon: Award, label: '15+ Years', sublabel: 'Experience' },
                { icon: CheckCircle2, label: '260+ Projects', sublabel: 'Delivered' },
                { icon: Users, label: '98% Happy', sublabel: 'Clients' },
                { icon: Shield, label: '10-Year', sublabel: 'Warranty' },
              ].map((item, i) => (
                <GlassCard
                  key={i}
                  intensity="light"
                  className="p-6 text-center"
                >
                  <item.icon className="w-8 h-8 mx-auto mb-3 text-cyan-500 dark:text-cyan-400" />
                  <div className="font-black text-2xl text-slate-900 dark:text-white">{item.label}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{item.sublabel}</div>
                </GlassCard>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 relative">
        <div className="container">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-4xl sm:text-5xl font-black mb-4 text-slate-900 dark:text-white">
                Our Services
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Complete construction solutions across Bengaluru, Mysuru, and Karnataka cities
              </p>
            </motion.div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((service, i) => (
              <ServiceCard key={i} service={service} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 bg-slate-100 dark:bg-slate-900/50">
        <div className="container">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-4xl sm:text-5xl font-black mb-4 text-slate-900 dark:text-white">
                Live Projects
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Track real-time progress of ongoing projects across Karnataka
              </p>
            </motion.div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROJECTS.map((project, i) => (
              <ProjectCard key={i} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="why" className="py-24">
        <div className="container">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-4xl sm:text-5xl font-black mb-4 text-slate-900 dark:text-white">
                Why Choose Levelplay?
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Building trust through transparency, quality, and customer satisfaction
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Shield,
                title: 'Structural Certification',
                body: 'IS 456:2000 compliant design with BBMP/BDA approved structural drawings. 10-year structural warranty on all residential projects.'
              },
              {
                icon: TrendingUp,
                title: 'Transparent Pricing',
                body: 'Fixed cost per sq.ft with zero hidden charges. Complete bill of quantities shared upfront — no surprises later.'
              },
              {
                icon: Building2,
                title: 'Bank-Approved Plans',
                body: 'All projects designed with bank loan approval in mind. Pre-approved layouts that meet financing requirements from major banks.'
              },
            ].map((item, i) => (
              <GlassCard
                key={i}
                intensity="medium"
                className="p-8 text-center hover:bg-white/30 dark:hover:bg-white/10 transition-all duration-300"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-3 text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.body}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-teal-600 dark:from-cyan-600 dark:to-orange-700"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-4xl sm:text-5xl font-black mb-6">
                Ready to Build Your Dream Home?
              </h2>
              <p className="text-xl mb-10 text-white/90">
                Get a free, no-obligation quotation within 24 hours. Our experts are ready to discuss your project.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <AnimatedButton variant="ghost" size="lg" href="/contact" className="bg-white text-cyan-600 hover:bg-white/90">
                  Get Free Quotation
                </AnimatedButton>
                <AnimatedButton variant="ghost" size="lg" href="tel:+919876543210" className="border-2 border-white text-white hover:bg-white/20">
                  Call +91 98765 43210
                </AnimatedButton>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Connect Section */}
      <ConnectSection />

      <SiteFooter />
    </div>
  );
}
