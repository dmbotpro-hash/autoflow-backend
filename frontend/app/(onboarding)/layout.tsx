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
      <div className="min-h-screen af-ambient-bg flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen af-ambient-bg text-[var(--af-text-primary)] relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-32 left-1/3 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-fuchsia-600/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
