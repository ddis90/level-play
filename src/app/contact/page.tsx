'use client';

import { SiteHeader, SiteFooter } from '@/components/SiteChrome';
import { OnboardingForm } from '@/components/OnboardingForm';
import { motion } from 'framer-motion';

export default function ContactPage() {
  return (
    <>
      <SiteHeader />

      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-amber-700 font-semibold text-sm tracking-wider uppercase mb-4">
                Get Started
              </p>

              <h1 className="text-4xl md:text-5xl font-light text-slate-900 mb-6">
                Tell us about your project
              </h1>

              <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                Share a few details and our team will reach out for a consultation.
                Once you come on board, you get portal access to track drawings,
                payments and on-site progress in real time.
              </p>

              {/* Contact info card */}
              <div className="p-8 bg-slate-50 border border-slate-200 rounded-lg mb-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-6">Reach us directly</h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <svg className="w-5 h-5 text-amber-700 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-slate-900 mb-1">Office Address</p>
                      <p className="text-slate-600 text-sm">#43, 10th Cross, 6th Main, Mahalakshmi Layout, Bangalore 560086</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <svg className="w-5 h-5 text-amber-700 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-slate-900 mb-1">Email</p>
                      <p className="text-slate-600 text-sm">levelplayconstructions@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <svg className="w-5 h-5 text-amber-700 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-slate-900 mb-1">Working Hours</p>
                      <p className="text-slate-600 text-sm">Monday - Saturday: 9:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust indicators */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white border border-slate-200 rounded-lg">
                  <div className="text-2xl font-light text-slate-900 mb-1">120+</div>
                  <div className="text-xs text-slate-600">Projects</div>
                </div>
                <div className="text-center p-4 bg-white border border-slate-200 rounded-lg">
                  <div className="text-2xl font-light text-slate-900 mb-1">15+</div>
                  <div className="text-xs text-slate-600">Years</div>
                </div>
                <div className="text-center p-4 bg-white border border-slate-200 rounded-lg">
                  <div className="text-2xl font-light text-slate-900 mb-1">8</div>
                  <div className="text-xs text-slate-600">Cities</div>
                </div>
              </div>
            </motion.div>

            {/* Right form */}
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

      <SiteFooter />
    </>
  );
}
