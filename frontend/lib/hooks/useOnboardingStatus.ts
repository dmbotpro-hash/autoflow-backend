'use client';

import { useCallback, useEffect, useState } from 'react';
import api from '../api/auth.api';
import { useOnboardingStore } from '../store/onboarding.store';

export function useOnboardingStatus() {
  const { complete, hydrated, setComplete, hydrate } = useOnboardingStore();
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await api.get('/settings');
      const done = Boolean(res.data?.onboardingComplete);
      setComplete(done);
      return done;
    } catch {
      return complete;
    } finally {
      setLoading(false);
    }
  }, [complete, setComplete]);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!hydrated) return;
    refresh();
  }, [hydrated, refresh]);

  const markComplete = useCallback(async () => {
    try {
      await api.post('/settings/onboarding/complete');
    } catch {
      /* local fallback */
    }
    setComplete(true);
  }, [setComplete]);

  return { complete, loading: loading || !hydrated, refresh, markComplete };
}
