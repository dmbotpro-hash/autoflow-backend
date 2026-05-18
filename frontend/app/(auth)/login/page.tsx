'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
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
            Apne account mein login karo
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[#0F0F0F] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
          <h2 className="text-lg font-semibold text-white mb-6 tracking-wide font-sans">Login</h2>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-3 mb-5 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#A0A0A0] mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3 text-sm text-white placeholder-[#606060] focus:outline-none focus:border-white transition-colors"
                placeholder="aap@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A0A0A0] mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3 text-sm text-white placeholder-[#606060] focus:outline-none focus:border-white transition-colors"
                placeholder="Aapka password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black hover:opacity-88 disabled:opacity-50 font-semibold rounded-full px-4 py-3.5 text-sm transition-opacity mt-2 duration-150 active:scale-95 shadow-sm"
            >
              {isLoading ? 'Login ho raha hai...' : 'Login Karo →'}
            </button>
          </form>

          <p className="text-center text-[#606060] text-xs mt-6">
            Account nahi hai?{' '}
            <Link
              href="/signup"
              className="text-white hover:underline transition-colors font-medium ml-0.5"
            >
              Free mein banao
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
