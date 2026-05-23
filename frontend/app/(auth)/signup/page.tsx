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

  const inputStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--border-glass)',
    color: 'var(--text-primary)',
  } as const;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden premium-dot-grid"
      style={{ background: 'var(--bg-main)' }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] rounded-full blur-[120px]"
          style={{ background: 'rgba(129,140,248,0.08)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl"
          style={{ background: 'rgba(34,211,238,0.04)' }}
        />
      </div>

      <div className="w-full max-w-[400px] relative z-10 animate-text-reveal">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2 select-none mb-1">
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
            <span className="font-bold text-2xl tracking-tight" style={{ color: 'var(--text-primary)' }}>
              AutoFlow
            </span>
          </Link>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Start Instagram automation — completely free
          </p>
        </div>

        <div className="premium-card rounded-2xl p-8" style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}>
          <h2 className="text-lg font-semibold mb-6 tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Create Account
          </h2>

          {error && (
            <div className="glass-alert glass-alert-error mb-5 rounded-xl">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span className="text-xs">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {(['name', 'email', 'password'] as const).map((field) => {
              const labels = { name: 'Full Name', email: 'Email Address', password: 'Password' };
              const placeholders = { name: 'John Doe', email: 'you@example.com', password: 'Min 8 characters' };
              const types = { name: 'text', email: 'email', password: 'password' };
              return (
                <div key={field}>
                  <label
                    className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {labels[field]}
                  </label>
                  <input
                    type={types[field]}
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = 'var(--border-glow)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-glass)')}
                    placeholder={placeholders[field]}
                    required
                    minLength={field === 'password' ? 8 : field === 'name' ? 2 : undefined}
                  />
                </div>
              );
            })}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full font-semibold rounded-xl px-4 py-3.5 text-sm transition-all duration-200 mt-2 active:scale-95 disabled:opacity-50 text-white"
              style={{
                background: 'linear-gradient(135deg, #818CF8 0%, #C084FC 50%, #22D3EE 100%)',
                boxShadow: isLoading ? 'none' : '0 0 24px rgba(192,132,252,0.35)',
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Creating account...
                </span>
              ) : (
                'Start Free Trial →'
              )}
            </button>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#818CF8')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              Log in
            </Link>
          </p>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2.5 text-center">
          {[
            ['⚡', 'Comment-to-DM'],
            ['🤖', 'AI Auto-Reply'],
            ['📊', 'Live Inbox'],
          ].map(([icon, label]) => (
            <div key={label} className="premium-card rounded-xl p-3">
              <div className="text-lg mb-1">{icon}</div>
              <div className="text-[10px] font-medium tracking-wide leading-tight" style={{ color: 'var(--text-muted)' }}>
                {label}
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-[10px] mt-4" style={{ color: 'var(--text-muted)' }}>
          No credit card required · Cancel anytime
        </p>
      </div>
    </div>
  );
}
