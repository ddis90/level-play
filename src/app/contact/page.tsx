'use client';

import { SiteHeader, SiteFooter } from '@/components/SiteChrome';
import { OnboardingForm } from '@/components/OnboardingForm';
import { FlipCard, GlassCard, Depth3DCard } from '@/components/advanced-ui';
import { motion } from 'framer-motion';
import Image from 'next/image';

const TEAM_MEMBERS = [
  {
    name: 'Rajesh Kumar',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces',
    bio: '15+ years in construction. Led 200+ residential projects across Karnataka. Specializes in cost optimization and quality control.',
    expertise: ['Project Management', 'Cost Engineering', 'Quality Assurance']
  },
  {
    name: 'Priya Sharma',
    role: 'Chief Architect',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces',
    bio: 'Award-winning architect with 12 years experience. Expert in sustainable design and Vastu-compliant layouts. BBMP approved consultant.',
    expertise: ['Residential Design', 'Vastu Consulting', 'Interior Planning']
  },
  {
    name: 'Arun Reddy',
    role: 'Head of Construction',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=faces',
    bio: 'Civil Engineer with structural certification. Manages on-site execution ensuring IS 456:2000 compliance and safety standards.',
    expertise: ['Site Management', 'Structural Engineering', 'Safety Compliance']
  },
  {
    name: 'Lakshmi Menon',
    role: 'Client Relations Manager',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=faces',
    bio: '8 years in customer service excellence. Ensures smooth communication and timely project updates through our portal system.',
    expertise: ['Client Communication', 'Project Coordination', 'Portal Management']
  },
];

function TeamMemberCard({ member, index }: { member: typeof TEAM_MEMBERS[0], index: number }) {
  return (
    <Depth3DCard>
      <FlipCard
        className="h-[420px]"
        front={
          <GlassCard intensity="medium" className="h-full relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90"></div>
            <Image
              src={member.image}
              alt={member.name}
              fill
              className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
              <h3 className="font-display text-2xl font-bold text-white mb-1">{member.name}</h3>
              <p className="text-cyan-400 font-semibold text-sm">{member.role}</p>
              <div className="mt-4 text-xs text-slate-400">Click to view profile</div>
            </div>
          </GlassCard>
        }
        back={
          <GlassCard intensity="strong" className="h-full p-6 flex flex-col justify-between bg-gradient-to-br from-slate-900 to-slate-800">
            <div>
              <h3 className="font-display text-xl font-bold text-white mb-2">{member.name}</h3>
              <p className="text-cyan-400 text-sm font-semibold mb-4">{member.role}</p>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">{member.bio}</p>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Expertise</div>
                <div className="flex flex-wrap gap-2">
                  {member.expertise.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-xs text-cyan-400 font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        }
      />
    </Depth3DCard>
  );
}

export default function ContactPage() {
  return (
    <>
      <SiteHeader />

      {/* Hero + Form Section */}
      <section className="relative py-24 md:py-32 bg-slate-950 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-cyan-400 font-semibold text-sm tracking-widest uppercase mb-6">
                Start Your Project
              </p>

              <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
                Get Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">
                  Free Quotation
                </span>
              </h1>

              <p className="text-xl text-slate-300 mb-12 leading-relaxed font-light">
                Share your plot details, budget, and requirements. Our team will provide
                a detailed cost estimate and construction timeline within 48 hours. Get portal
                access after project starts to track everything — from BBMP approvals to final handover.
              </p>

              {/* Contact info card */}
              <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl mb-10">
                <h3 className="font-display text-2xl font-bold text-white mb-8">Contact Us</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-white mb-2">Phone & WhatsApp</p>
                      <p className="text-slate-400 text-sm">+91 98765 43210 (9 AM - 6 PM)</p>
                      <p className="text-green-400 text-xs mt-1">📱 WhatsApp for instant response</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-white mb-2">Office Address</p>
                      <p className="text-slate-400 text-sm leading-relaxed">#43, 10th Cross, 6th Main<br/>Mahalakshmi Layout<br/>Bengaluru, Karnataka 560086</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-white mb-2">Email</p>
                      <p className="text-slate-400 text-sm">levelplayconstructions@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-white mb-2">Working Hours</p>
                      <p className="text-slate-400 text-sm">Monday - Saturday: 9:00 AM - 6:00 PM</p>
                      <p className="text-slate-500 text-xs mt-1">Sunday by appointment</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <OnboardingForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Meet Our Team Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="container">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-4xl sm:text-5xl font-black mb-4 text-slate-900 dark:text-white">
                Meet Our Team
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Expert professionals dedicated to bringing your construction vision to life
              </p>
            </motion.div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM_MEMBERS.map((member, i) => (
              <TeamMemberCard key={i} member={member} index={i} />
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
