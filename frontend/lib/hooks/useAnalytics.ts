'use client';

import { useCallback, useEffect, useState } from 'react';
import api from '../api/auth.api';
import type { ActivityEvent, AnalyticsOverview } from '../types/analytics';
import { useNotificationsStore } from '../store/notifications.store';

export function useAnalytics(pollMs = 30000) {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const setNotificationEvents = useNotificationsStore((s) => s.setEvents);

  const load = useCallback(async () => {
    setError(false);
    try {
      const [overviewRes, eventsRes] = await Promise.all([
        api.get<AnalyticsOverview>('/analytics/overview'),
        api.get<ActivityEvent[]>('/analytics/events', { params: { limit: 40 } }),
      ]);
      setOverview(overviewRes.data);
      setEvents(eventsRes.data);
      setNotificationEvents(eventsRes.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [setNotificationEvents]);

  useEffect(() => {
    load();
    const id = setInterval(load, pollMs);
    return () => clearInterval(id);
  }, [load, pollMs]);

  return { overview, events, loading, error, reload: load };
}
