'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { useState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
  const { register, isLoading, error } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return;
    await register(form.name, form.email, form.password);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center mb-2 select-none">
            <span className="text-white font-bold text-2xl tracking-tight font-sans">
              AutoFlow
            </span>
          </Link>
          <p className="text-[#A0A0A0] text-sm">
            Start Instagram automation — completely free
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[#0F0F0F] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
          <h2 className="text-lg font-semibold text-white mb-6 tracking-wide font-sans">
            Create Account
          </h2>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-3 mb-5 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#A0A0A0] mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3 text-sm text-white placeholder-[#606060] focus:outline-none focus:border-white transition-colors"
                placeholder="John Doe"
                required
                minLength={2}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A0A0A0] mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3 text-sm text-white placeholder-[#606060] focus:outline-none focus:border-white transition-colors"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A0A0A0] mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3 text-sm text-white placeholder-[#606060] focus:outline-none focus:border-white transition-colors"
                placeholder="Min 8 characters"
                required
                minLength={8}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black hover:opacity-88 disabled:opacity-50 font-semibold rounded-full px-4 py-3.5 text-sm transition-opacity mt-2 duration-150 active:scale-95 shadow-sm"
            >
              {isLoading ? 'Creating account...' : 'Start Free Trial →'}
            </button>
          </form>

          <p className="text-center text-[#606060] text-xs mt-6">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-white hover:underline transition-colors font-medium ml-0.5"
            >
              Log in
            </Link>
          </p>
        </div>

        {/* Feature badges */}
        <div className="mt-6 grid grid-cols-3 gap-2.5 text-center">
          {[
            ['⚡', 'Comment-to-DM'],
            ['🤖', 'AI Auto-Reply'],
            ['📊', 'Live Inbox'],
          ].map(([icon, label]) => (
            <div
              key={label}
              className="bg-[#0F0F0F] border border-[rgba(255,255,255,0.08)] rounded-xl p-3"
            >
              <div className="text-lg mb-1">{icon}</div>
              <div className="text-[#A0A0A0] text-[10px] font-medium tracking-wide leading-tight">{label}</div>
            </div>
          ))}
        </div>
        <p className="text-center text-[#606060] text-[11px] mt-4 font-light">
          No credit card required • Cancel anytime
        </p>
      </div>
    </div>
  );
}
