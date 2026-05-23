'use client';

import { type ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboardingStatus } from '@/lib/hooks/useOnboardingStatus';

/** Redirects incomplete workspaces to /onboarding */
export function OnboardingGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { complete, loading } = useOnboardingStatus();

  useEffect(() => {
    if (!loading && !complete) {
      router.replace('/onboarding');
    }
  }, [complete, loading, router]);

  if (loading || !complete) {
    return (
      <div className="min-h-screen af-ambient-bg flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
