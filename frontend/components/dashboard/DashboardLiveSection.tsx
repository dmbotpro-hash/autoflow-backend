'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useNotificationsStore } from '@/lib/store/notifications.store';
import type { AnalyticsOverview } from '@/lib/types/analytics';
import { ActivityChartLive } from '@/components/analytics/ActivityChartLive';
import { LiveEventFeed } from '@/components/analytics/LiveEventFeed';
import { Skeleton } from '@/components/ui/Skeleton';

/** Shared realtime analytics block for dashboard + analytics parity */
export function DashboardLiveSection({
  overview,
  loading,
}: {
  overview: AnalyticsOverview | null;
  loading: boolean;
}) {
  const feedEvents = useNotificationsStore((s) => s.events);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        {loading || !overview ? (
          <Skeleton className="h-[260px] w-full rounded-2xl" />
        ) : (
          <ActivityChartLive data={overview.chart} />
        )}
      </div>
      <div className="space-y-2">
        <LiveEventFeed events={feedEvents} compact maxItems={6} />
        <Link
          href="/analytics"
          className="flex items-center justify-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 py-2"
        >
          Full analytics
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}
