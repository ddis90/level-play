'use client';

import Link from 'next/link';
import Image from 'next/image';
import { SiteHeader, SiteFooter } from '@/components/SiteChrome';
import { motion } from 'framer-motion';

const TEAM_MEMBERS = [
  {
    category: 'Founders',
    members: [
      {
        name: 'Rajesh Kumar',
        role: 'Founder & CEO',
        bio: '20+ years in construction and real estate development across Karnataka',
        email: 'founder@demo.test',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=faces',
      },
      {
        name: 'Priya Sharma',
        role: 'Co-Founder & COO',
        bio: 'Operations expert specializing in project delivery and client relations',
        email: 'founder2@demo.test',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces',
      }
    ]
  },
  {
    category: 'Leadership',
    members: [
      {
        name: 'Arun Patel',
        role: 'Chief Architect',
        bio: 'Award-winning architect with 100+ residential and commercial projects',
        email: 'architect@demo.test',
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=faces',
      },
      {
        name: 'Kavya Reddy',
        role: 'Head of Engineering',
        bio: 'Structural engineering expert ensuring quality and safety standards',
        email: 'engineer@demo.test',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=faces',
      },
      {
        name: 'Vikram Singh',
        role: 'Project Director',
        bio: 'Oversees all active projects with focus on timelines and quality',
        email: 'projectadmin@demo.test',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces',
      }
    ]
  },
  {
    category: 'Administrators',
    members: [
      {
        name: 'Anita Desai',
        role: 'System Administrator',
        bio: 'Manages portal access, documentation, and client onboarding',
        email: 'admin@demo.test',
        image: 'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=400&h=400&fit=crop&crop=faces',
      },
      {
        name: 'Suresh Nair',
        role: 'Finance Manager',
        bio: 'Handles billing, payments, and financial transparency for all projects',
        email: 'admin2@demo.test',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=faces',
      }
    ]
  },
  {
    category: 'Technical Team',
    members: [
      {
        name: 'Deepak Menon',
        role: 'Senior Architect',
        bio: 'Specializes in modern residential designs and sustainable architecture',
        email: 'architect2@demo.test',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=faces',
      },
      {
        name: 'Meera Iyer',
        role: 'Civil Engineer',
        bio: 'Structural design and site supervision for commercial projects',
        email: 'engineer2@demo.test',
        image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop&crop=faces',
      },
      {
        name: 'Ramesh Gowda',
        role: 'Interior Designer',
        bio: 'Creates functional and aesthetic interior spaces for homes and offices',
        email: 'designer@demo.test',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=faces',
      }
    ]
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function TeamPage() {
  return (
    <>
      <SiteHeader />

      {/* Hero Section - Dark Cinematic */}
      <section className="relative bg-slate-950 py-24 md:py-32 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-amber-400 font-semibold text-sm tracking-widest uppercase mb-6">
              Our Team
            </p>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              Meet the people building{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-600">
                your dreams
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 leading-relaxed font-light">
              Our experienced team of architects, engineers, and project managers
              brings decades of expertise to every project we deliver.
            </p>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="bg-slate-900 py-24">
        <div className="container max-w-7xl mx-auto">
          {TEAM_MEMBERS.map((section, idx) => (
            <div key={idx} className="mb-20 last:mb-0">
              {/* Category Header */}
              <div className="flex items-center gap-6 mb-12">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
                  {section.category}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
              </div>

              <motion.div
                className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                {section.members.map((member, memberIdx) => (
                  <motion.div
                    key={memberIdx}
                    variants={itemVariants}
                    className="group relative bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-amber-500/50 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105"
                  >
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl"></div>
                    </div>

                    {/* Image Header */}
                    <div className="relative h-80 overflow-hidden">
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-60"></div>

                      {/* Status indicator */}
                      <div className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                    </div>

                    {/* Content */}
                    <div className="relative p-6">
                      <h3 className="font-display text-2xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-sm font-semibold text-amber-400 mb-4 uppercase tracking-wider">
                        {member.role}
                      </p>

                      <p className="text-slate-400 leading-relaxed mb-6">
                        {member.bio}
                      </p>

                      {/* Email with icon */}
                      <div className="flex items-center gap-3 pt-4 border-t border-slate-700/50">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                          <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="text-sm text-slate-400 truncate">{member.email}</span>
                      </div>
                    </div>

                    {/* Bottom accent */}
                    <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-cyan-500 to-cyan-600 group-hover:w-full transition-all duration-700"></div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden border-t border-slate-800">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>

        <div className="container max-w-5xl mx-auto text-center relative z-10">
          <h2 className="font-display text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-600">start your project</span>?
          </h2>
          <p className="text-2xl text-slate-300 mb-12 font-light">
            Our team is ready to bring your construction vision to life.
          </p>
          <div className="flex flex-wrap gap-5 justify-center">
            <Link
              href="/contact"
              className="group px-10 py-5 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-slate-950 font-bold rounded-xl transition-all duration-300 shadow-2xl shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-105"
            >
              Get in Touch
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              href="/#projects"
              className="px-10 py-5 border-2 border-slate-700 hover:border-amber-500 text-slate-200 hover:text-amber-400 font-semibold rounded-xl transition-all duration-300 hover:bg-slate-900/50"
            >
              View Our Projects
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
