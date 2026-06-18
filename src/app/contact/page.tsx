'use client';

import { SiteHeader, SiteFooter } from '@/components/SiteChrome';
import { OnboardingForm } from '@/components/OnboardingForm';
import { motion } from 'framer-motion';

export default function ContactPage() {
  return (
    <>
      <SiteHeader />

      {/* Hero + Form Section */}
      <section className="relative py-24 md:py-32 bg-slate-950 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-amber-400 font-semibold text-sm tracking-widest uppercase mb-6">
                Start Your Project
              </p>

              <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
                Get Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
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
                      <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                      <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                      <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                      <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

              {/* Trust indicators */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-5 bg-slate-900 border border-slate-800 rounded-xl">
                  <div className="text-2xl font-bold font-display text-amber-400 mb-1">₹85Cr+</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider">Projects</div>
                </div>
                <div className="text-center p-5 bg-slate-900 border border-slate-800 rounded-xl">
                  <div className="text-2xl font-bold font-display text-green-400 mb-1">RERA</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider">Registered</div>
                </div>
                <div className="text-center p-5 bg-slate-900 border border-slate-800 rounded-xl">
                  <div className="text-2xl font-bold font-display text-blue-400 mb-1">100%</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider">Transparent</div>
                </div>
              </div>
            </motion.div>

            {/* Right form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:sticky lg:top-24"
            >
              <OnboardingForm />
            </motion.div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
