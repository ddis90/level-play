'use client';

import { useState } from 'react';

const SERVICE_OPTIONS = [
  'Home Construction',
  'Apartment Construction',
  'Commercial Construction',
  'Interior Design',
  'Turnkey Project',
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
          <label htmlFor="fullName" className="block text-sm font-bold text-white mb-2">Full name</label>
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
            <label htmlFor="email" className="block text-sm font-bold text-white mb-2">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@email.com"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-bold text-white mb-2">Phone</label>
            <input
              id="phone"
              name="phone"
              required
              placeholder="10-digit mobile"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="serviceType" className="block text-sm font-bold text-white mb-2">Service</label>
            <select
              id="serviceType"
              name="serviceType"
              defaultValue=""
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
            >
              <option value="" disabled>Choose…</option>
              {SERVICE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-bold text-white mb-2">City</label>
            <input
              id="city"
              name="city"
              placeholder="e.g. Bangalore"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
          </div>
        </div>

        <div>
          <label htmlFor="requirements" className="block text-sm font-bold text-white mb-2">Project requirements</label>
          <textarea
            id="requirements"
            name="requirements"
            rows={4}
            placeholder="Plot size, floors, budget range, timeline…"
            className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:from-slate-700 disabled:to-slate-700 text-slate-950 disabled:text-slate-500 font-bold rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-105 disabled:scale-100 disabled:shadow-none"
        >
          {status === 'sending' ? 'Sending…' : 'Submit Enquiry'}
        </button>
      </form>
    </div>
  );
}
