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
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden premium-dot-grid"
      style={{ background: 'var(--bg-main)' }}
    >
      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] rounded-full blur-[120px]"
          style={{ background: 'rgba(129,140,248,0.08)' }}
        />
        <div
          className="absolute bottom-0 right-0 w-64 h-64 rounded-full blur-3xl"
          style={{ background: 'rgba(34,211,238,0.04)' }}
        />
      </div>

      <div className="w-full max-w-[400px] relative z-10 animate-text-reveal">
        {/* Brand header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2 select-none mb-1">
            {/* Gradient orb logo */}
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #818CF8 0%, #C084FC 50%, #22D3EE 100%)',
                boxShadow: '0 0 32px rgba(192,132,252,0.4)',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <span
              className="font-bold text-2xl tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              AutoFlow
            </span>
          </Link>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Sign in to your workspace
          </p>
        </div>

        {/* Glass form card */}
        <div
          className="premium-card rounded-2xl p-8"
          style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}
        >
          <h2
            className="text-lg font-semibold mb-6 tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Welcome back
          </h2>

          {/* Glass error alert */}
          {error && (
            <div className="glass-alert glass-alert-error mb-5 rounded-xl">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span className="text-xs">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                style={{ color: 'var(--text-muted)' }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border-glass)',
                  color: 'var(--text-primary)',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--border-glow)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-glass)')}
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                style={{ color: 'var(--text-muted)' }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border-glass)',
                  color: 'var(--text-primary)',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--border-glow)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-glass)')}
                placeholder="Your password"
                required
              />
            </div>

            {/* Gemini gradient CTA button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full font-semibold rounded-xl px-4 py-3.5 text-sm transition-all duration-200 mt-2 active:scale-95 disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #818CF8 0%, #C084FC 50%, #22D3EE 100%)',
                color: 'white',
                boxShadow: isLoading ? 'none' : '0 0 24px rgba(192,132,252,0.35)',
              }}
              onMouseEnter={e => {
                if (!isLoading) (e.currentTarget as HTMLElement).style.boxShadow = '0 0 32px rgba(129,140,248,0.5)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px rgba(192,132,252,0.35)';
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In →'
              )}
            </button>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link
              href="/signup"
              className="font-medium transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#818CF8')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              Sign up for free
            </Link>
          </p>
        </div>

        {/* Bottom trust badge */}
        <p className="text-center text-[10px] mt-4" style={{ color: 'var(--text-muted)' }}>
          🔒 Secured · Meta-approved · No spam
        </p>
      </div>
    </div>
  );
}
