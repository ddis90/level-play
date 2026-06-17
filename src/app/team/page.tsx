'use client';

import Link from 'next/link';
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
        avatar: 'RK',
      },
      {
        name: 'Priya Sharma',
        role: 'Co-Founder & COO',
        bio: 'Operations expert specializing in project delivery and client relations',
        email: 'founder2@demo.test',
        avatar: 'PS',
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
        avatar: 'AP',
      },
      {
        name: 'Kavya Reddy',
        role: 'Head of Engineering',
        bio: 'Structural engineering expert ensuring quality and safety standards',
        email: 'engineer@demo.test',
        avatar: 'KR',
      },
      {
        name: 'Vikram Singh',
        role: 'Project Director',
        bio: 'Oversees all active projects with focus on timelines and quality',
        email: 'projectadmin@demo.test',
        avatar: 'VS',
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
        avatar: 'AD',
      },
      {
        name: 'Suresh Nair',
        role: 'Finance Manager',
        bio: 'Handles billing, payments, and financial transparency for all projects',
        email: 'admin2@demo.test',
        avatar: 'SN',
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
        avatar: 'DM',
      },
      {
        name: 'Meera Iyer',
        role: 'Civil Engineer',
        bio: 'Structural design and site supervision for commercial projects',
        email: 'engineer2@demo.test',
        avatar: 'MI',
      },
      {
        name: 'Ramesh Gowda',
        role: 'Interior Designer',
        bio: 'Creates functional and aesthetic interior spaces for homes and offices',
        email: 'designer@demo.test',
        avatar: 'RG',
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

      {/* Hero Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-amber-700 font-semibold text-sm tracking-wider uppercase mb-4">
              Our Team
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-slate-900 mb-6">
              Meet the people building your dreams
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
              Our experienced team of architects, engineers, and project managers
              brings decades of expertise to every project we deliver.
            </p>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="bg-slate-50 py-16">
        <div className="container max-w-7xl mx-auto">
          {TEAM_MEMBERS.map((section, idx) => (
            <div key={idx} className="mb-16 last:mb-0">
              <div className="flex items-center gap-4 mb-10">
                <div className="h-px flex-1 bg-amber-700"></div>
                <h2 className="text-2xl md:text-3xl font-light text-slate-900">
                  {section.category}
                </h2>
                <div className="h-px flex-1 bg-amber-700"></div>
              </div>

              <motion.div
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                {section.members.map((member, memberIdx) => (
                  <motion.div
                    key={memberIdx}
                    variants={itemVariants}
                    className="group relative bg-white border border-slate-200 hover:border-amber-700 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
                  >
                    {/* Card Header */}
                    <div className="relative h-32 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                      <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none' stroke='%23000' stroke-width='1'/%3E%3C/svg%3E")`,
                        backgroundSize: '40px 40px'
                      }}></div>

                      {/* Avatar Circle */}
                      <div className="relative w-20 h-20 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                        <span className="text-xl font-semibold text-amber-700">{member.avatar}</span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-slate-900 mb-1">
                        {member.name}
                      </h3>
                      <p className="text-sm font-medium text-amber-700 mb-4">
                        {member.role}
                      </p>

                      <p className="text-slate-600 text-sm leading-relaxed mb-6">
                        {member.bio}
                      </p>

                      {/* Email */}
                      <div className="flex items-center gap-2 text-sm text-slate-500 pt-4 border-t border-slate-100">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="truncate">{member.email}</span>
                      </div>
                    </div>

                    {/* Hover accent */}
                    <div className="absolute top-0 left-0 w-1 h-0 bg-amber-700 group-hover:h-full transition-all duration-300"></div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-amber-700 text-white">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-amber-100 mb-10">
            Our team is ready to bring your construction vision to life.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="px-10 py-4 bg-white text-amber-700 font-semibold rounded-md hover:bg-amber-50 transition-colors duration-200"
            >
              Get in Touch →
            </Link>
            <Link
              href="/#projects"
              className="px-10 py-4 border-2 border-white text-white font-semibold rounded-md hover:bg-white/10 transition-colors duration-200"
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
