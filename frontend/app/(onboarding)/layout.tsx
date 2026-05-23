'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, authReady } = useAuthStore();

  useEffect(() => {
    if (authReady && !isAuthenticated) router.push('/login');
  }, [isAuthenticated, authReady, router]);

  if (!authReady || !isAuthenticated) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center" style={{ background: 'var(--bg-main)' }}>
        <div
          className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: 'rgba(129,140,248,0.3)', borderTopColor: '#818CF8' }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] relative overflow-x-hidden premium-dot-grid" style={{ background: 'var(--bg-main)', color: 'var(--text-primary)' }}>
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-32 left-1/3 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(129,140,248,0.08)' }} />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl" style={{ background: 'rgba(34,211,238,0.05)' }} />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
