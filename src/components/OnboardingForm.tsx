'use client';

import { useState } from 'react';

const SERVICE_OPTIONS = [
  'Individual Home / Villa',
  'Apartment / Multi-Unit',
  'Commercial Building',
  'Interior Design & Fit-out',
  'Renovation / Extension',
  'Vastu Consultation',
];

const CITY_OPTIONS = [
  'Bengaluru',
  'Mysuru',
  'Mangaluru',
  'Hubli-Dharwad',
  'Belgaum',
  'Davangere',
  'Shivamogga',
  'Tumakuru',
  'Other',
];

export function OnboardingForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
        return;
      }
      setStatus('ok');
      setMessage(
        `Thanks! Your enquiry was received (ref ${data.code}). Our team will be in touch shortly.`,
      );
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  }

  return (
    <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl shadow-2xl">
      {status === 'ok' && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm">
          {message}
        </div>
      )}
      {status === 'error' && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="fullName" className="block text-sm font-bold text-white mb-2">Full Name *</label>
          <input
            id="fullName"
            name="fullName"
            required
            placeholder="Your name"
            className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-white mb-2">Email *</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="your@email.com"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-bold text-white mb-2">Mobile *</label>
            <input
              id="phone"
              name="phone"
              required
              placeholder="98765 43210"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="serviceType" className="block text-sm font-bold text-white mb-2">Service Type *</label>
            <select
              id="serviceType"
              name="serviceType"
              defaultValue=""
              required
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
            >
              <option value="" disabled>Choose service…</option>
              {SERVICE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-bold text-white mb-2">City *</label>
            <select
              id="city"
              name="city"
              defaultValue=""
              required
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
            >
              <option value="" disabled>Select city…</option>
              {CITY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="plotSize" className="block text-sm font-bold text-white mb-2">Plot Size (sq.ft)</label>
            <input
              id="plotSize"
              name="plotSize"
              placeholder="e.g., 1200 or 30x40"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
          </div>
          <div>
            <label htmlFor="budget" className="block text-sm font-bold text-white mb-2">Budget Range (₹)</label>
            <select
              id="budget"
              name="budget"
              defaultValue=""
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
            >
              <option value="">Select range…</option>
              <option value="20-40L">₹20-40 Lakhs</option>
              <option value="40-60L">₹40-60 Lakhs</option>
              <option value="60-80L">₹60-80 Lakhs</option>
              <option value="80L-1Cr">₹80 Lakhs - 1 Crore</option>
              <option value="1Cr+">₹1 Crore+</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="requirements" className="block text-sm font-bold text-white mb-2">Project Details</label>
          <textarea
            id="requirements"
            name="requirements"
            rows={4}
            placeholder="Tell us about your project: number of floors, BHK configuration, Vastu requirements, timeline, special requests..."
            className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:from-slate-700 disabled:to-slate-700 text-slate-950 disabled:text-slate-500 font-bold rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-105 disabled:scale-100 disabled:shadow-none"
        >
          {status === 'sending' ? 'Sending Request...' : 'Get Free Quotation →'}
        </button>

        <p className="text-xs text-slate-500 text-center">
          We respect your privacy. Your information will not be shared.
        </p>
      </form>
    </div>
  );
}
