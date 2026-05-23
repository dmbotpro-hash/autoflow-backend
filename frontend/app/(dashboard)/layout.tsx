'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { OnboardingGate } from '@/components/onboarding/OnboardingGate';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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
    <OnboardingGate>
      <DashboardShell>{children}</DashboardShell>
    </OnboardingGate>
  );
}
