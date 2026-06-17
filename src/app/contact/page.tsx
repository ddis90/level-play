'use client';

import { SiteHeader, SiteFooter } from '@/components/SiteChrome';
import { OnboardingForm } from '@/components/OnboardingForm';
import { motion } from 'framer-motion';

export default function ContactPage() {
  return (
    <>
      <SiteHeader />

      <section className="relative min-h-screen overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 right-20 w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          </div>
          <div className="absolute inset-0 opacity-10 bg-grain"></div>
        </div>

        <div className="container relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:sticky lg:top-24"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-amber-500/10 backdrop-blur-sm border border-amber-500/20 text-amber-400 font-bold text-sm tracking-wider mb-6">
                GET STARTED
              </span>

              <h1 className="text-5xl md:text-6xl font-display font-black text-white mb-6 leading-tight">
                Tell us about your
                <span className="block bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  project
                </span>
              </h1>

              <p className="text-xl text-slate-300 mb-10 leading-relaxed">
                Share a few details and our team will reach out for a consultation.
                Once you come on board, you get portal access to track drawings,
                payments and on-site progress in real time.
              </p>

              {/* Contact info card */}
              <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-4">Reach us directly</h3>
                <div className="space-y-4 text-slate-300">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-white">Office Address</p>
                      <p>#43, 10th Cross, 6th Main, Mahalakshmi Layout, Bangalore 560086</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-white">Email</p>
                      <p>levelplayconstructions@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-white">Working Hours</p>
                      <p>Monday - Saturday: 9:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust indicators */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="text-3xl font-black text-white mb-1">120+</div>
                  <div className="text-xs text-slate-400 font-medium">Projects</div>
                </div>
                <div className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="text-3xl font-black text-white mb-1">15+</div>
                  <div className="text-xs text-slate-400 font-medium">Years</div>
                </div>
                <div className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="text-3xl font-black text-white mb-1">8</div>
                  <div className="text-xs text-slate-400 font-medium">Cities</div>
                </div>
              </div>
            </motion.div>

            {/* Right form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <OnboardingForm />
            </motion.div>
          </div>
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
        .bg-grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
      `}</style>
    </>
  );
}
