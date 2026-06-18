'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.get('email'),
          password: form.get('password'),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed. Please check your credentials.');
        setLoading(false);
        return;
      }

      // Success - redirect
      router.push('/portal');
      router.refresh();
    } catch (err) {
      console.error('Login error:', err);
      setError('Unable to connect to server. Please check your connection and try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0f1a] flex items-center justify-center p-6">
      {/* Navigation Bar */}
      <motion.nav
        className="absolute top-0 left-0 right-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center font-black text-white shadow-lg shadow-cyan-500/20"
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                LP
              </motion.div>
              <span className="font-display text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                Levelplay
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors font-medium">
                Home
              </Link>
              <Link href="/team" className="text-sm text-slate-400 hover:text-white transition-colors font-medium">
                Our Team
              </Link>
              <Link href="/contact" className="text-sm text-slate-400 hover:text-white transition-colors font-medium">
                Contact
              </Link>
            </div>

            {/* Mobile menu button */}
            <Link
              href="/"
              className="md:hidden text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Link>
          </div>
        </div>
      </motion.nav>
      {/* Animated blueprint grid background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <motion.div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, #3b82f6 1px, transparent 1px),
              linear-gradient(to bottom, #3b82f6 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
          animate={{
            x: [0, 40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Animated construction elements */}
      <motion.div
        className="absolute top-20 right-20 w-64 h-64 border-2 border-blue-500/20 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute bottom-20 left-20 w-48 h-48 border-2 border-amber-500/20"
        style={{
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
        }}
        animate={{
          rotate: [0, -360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Main login card */}
      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Card with architectural drawing style */}
        <div className="relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-10 shadow-2xl">
          {/* Technical corner markers */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-blue-400/50"></div>
          <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-blue-400/50"></div>
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-blue-400/50"></div>
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-blue-400/50"></div>

          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-3 mb-8 group">
            <motion.div
              className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center font-black text-white text-xl shadow-lg shadow-cyan-500/20"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              LP
            </motion.div>
            <div>
              <div className="font-display text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                Levelplay
              </div>
              <div className="text-xs text-slate-400 tracking-wider uppercase">Portal Access</div>
            </div>
          </Link>

          {/* Title */}
          <div className="mb-8 text-center">
            <h1 className="font-display text-3xl font-bold text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-400 text-sm">
              Access your projects, drawings, and payments
            </p>
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="username"
                defaultValue="client@demo.test"
                className="w-full px-4 py-3.5 bg-slate-950 border-2 border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all font-medium"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                defaultValue="Passw0rd!"
                className="w-full px-4 py-3.5 bg-slate-950 border-2 border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all font-medium"
                placeholder="••••••••"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 disabled:from-slate-700 disabled:to-slate-800 text-white disabled:text-slate-500 font-bold text-lg rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/35 disabled:shadow-none overflow-hidden"
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
            >
              {/* Animated progress bar */}
              {loading && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{
                    x: ['-100%', '200%'],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </span>
            </motion.button>
          </form>

          {/* Demo accounts */}
          <details className="mt-8 group">
            <summary className="cursor-pointer text-sm font-semibold text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2">
              <svg className="w-4 h-4 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Demo Accounts (POC)
            </summary>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-4 bg-slate-950/50 border border-slate-700/50 rounded-xl"
            >
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="font-bold text-amber-400">Password:</span>
                  <code className="px-2 py-1 bg-slate-900 rounded text-white font-mono">Passw0rd!</code>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                  <div className="px-3 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400 font-medium">
                    client@demo.test
                  </div>
                  <div className="px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 font-medium">
                    admin@demo.test
                  </div>
                  <div className="px-3 py-2 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 font-medium">
                    projectadmin@demo.test
                  </div>
                  <div className="px-3 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400 font-medium">
                    engineer@demo.test
                  </div>
                  <div className="px-3 py-2 bg-orange-500/10 border border-orange-500/30 rounded-lg text-orange-400 font-medium">
                    architect@demo.test
                  </div>
                  <div className="px-3 py-2 bg-slate-500/10 border border-slate-500/30 rounded-lg text-slate-400 font-medium">
                    worker@demo.test
                  </div>
                </div>
              </div>
            </motion.div>
          </details>

          {/* Back to home */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-amber-400 transition-colors font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to home
            </Link>
          </div>
        </div>

        {/* Technical specification footer */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-xs text-slate-600 font-mono">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            SYSTEM STATUS: OPERATIONAL
            <span className="text-slate-700">|</span>
            BUILD: v2.0-DARK
          </div>
        </div>
      </motion.div>
    </div>
  );
}
