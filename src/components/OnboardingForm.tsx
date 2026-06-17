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
    <div className="form-card" style={{ maxWidth: 'none' }}>
      {status === 'ok' && <div className="alert alert-ok">{message}</div>}
      {status === 'error' && <div className="alert alert-error">{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="fullName">Full name</label>
          <input id="fullName" name="fullName" required placeholder="Your name" />
        </div>
        <div className="grid grid-2" style={{ gap: '1rem' }}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required placeholder="you@email.com" />
          </div>
          <div className="field">
            <label htmlFor="phone">Phone</label>
            <input id="phone" name="phone" required placeholder="10-digit mobile" />
          </div>
        </div>
        <div className="grid grid-2" style={{ gap: '1rem' }}>
          <div className="field">
            <label htmlFor="serviceType">Service</label>
            <select id="serviceType" name="serviceType" defaultValue="">
              <option value="" disabled>Choose…</option>
              {SERVICE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="city">City</label>
            <input id="city" name="city" placeholder="e.g. Bangalore" />
          </div>
        </div>
        <div className="field">
          <label htmlFor="requirements">Project requirements</label>
          <textarea id="requirements" name="requirements" rows={4}
            placeholder="Plot size, floors, budget range, timeline…" />
        </div>
        <button className="btn btn-primary" type="submit" disabled={status === 'sending'}
          style={{ width: '100%', justifyContent: 'center' }}>
          {status === 'sending' ? 'Sending…' : 'Submit Enquiry'}
        </button>
      </form>
    </div>
  );
}
