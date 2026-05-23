'use client';

import {
  Bot,
  Clock,
  MessageSquare,
  RefreshCw,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { AnimatedCounter } from '@/components/analytics/AnimatedCounter';
import { ActivityChartLive } from '@/components/analytics/ActivityChartLive';
import { FunnelChart } from '@/components/analytics/FunnelChart';
import { WorkflowPerformance } from '@/components/analytics/WorkflowPerformance';
import { EngagementHeatmap } from '@/components/analytics/EngagementHeatmap';
import { LiveEventFeed } from '@/components/analytics/LiveEventFeed';
import { useAnalytics } from '@/lib/hooks/useAnalytics';
import { useNotificationsStore } from '@/lib/store/notifications.store';
import { Skeleton } from '@/components/ui/Skeleton';

export default function AnalyticsPage() {
  const { overview, loading, error, reload } = useAnalytics(30000);
  const feedEvents = useNotificationsStore((s) => s.events);
  const m = overview?.metrics;

  const metricCards = [
    {
      label: 'Messages sent',
      value: m?.totalMessages ?? 0,
      icon: MessageSquare,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
    },
    {
      label: 'Contacts',
      value: m?.totalContacts ?? 0,
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Active chats',
      value: m?.activeConversations ?? 0,
      icon: TrendingUp,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'AI replies',
      value: m?.aiReplies ?? 0,
      icon: Bot,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
    },
    {
      label: 'Automations',
      value: m?.totalAutomations ?? 0,
      icon: Zap,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
    },
    {
      label: 'Hours saved',
      value: m?.hoursSaved ?? 0,
      icon: Clock,
      color: 'text-fuchsia-400',
      bg: 'bg-fuchsia-500/10',
      suffix: 'h',
    },
  ];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[var(--af-text-primary)] tracking-tight">
            Analytics
          </h1>
          <p className="text-[var(--af-text-muted)] text-sm mt-0.5">
            Mission control — live metrics and activity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-emerald-400 flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Realtime
          </span>
          <button
            type="button"
            onClick={reload}
            disabled={loading}
            className="p-2 text-[var(--af-text-muted)] hover:text-[var(--af-text-primary)] hover:bg-white/5 rounded-lg transition-colors disabled:opacity-40"
            aria-label="Refresh analytics"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
          Could not load analytics. Check your connection and try refresh.
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {metricCards.map((card) => (
          <div
            key={card.label}
            className="af-glass rounded-2xl p-4 border border-[var(--af-border-subtle)]"
          >
            <div
              className={`w-8 h-8 ${card.bg} rounded-lg flex items-center justify-center mb-3`}
            >
              <card.icon size={16} className={card.color} />
            </div>
            {loading ? (
              <Skeleton className="h-7 w-16 mb-1" />
            ) : (
              <div className="text-2xl font-bold text-[var(--af-text-primary)]">
                <AnimatedCounter value={card.value} suffix={card.suffix ?? ''} />
              </div>
            )}
            <p className="text-[var(--af-text-muted)] text-xs mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          {loading || !overview ? (
            <Skeleton className="h-[280px] w-full rounded-2xl" />
          ) : (
            <ActivityChartLive data={overview.chart} />
          )}
        </div>
        <LiveEventFeed events={feedEvents} maxItems={14} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {loading || !overview ? (
          <>
            <Skeleton className="h-[280px] rounded-2xl" />
            <Skeleton className="h-[280px] rounded-2xl" />
          </>
        ) : (
          <>
            <FunnelChart data={overview.funnel} />
            <WorkflowPerformance workflows={overview.workflows} />
          </>
        )}
      </div>

      {!loading && overview && <EngagementHeatmap data={overview.heatmap} />}
    </div>
  );
}
