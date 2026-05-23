'use client';

import {
  Bot, Clock, MessageSquare, RefreshCw, TrendingUp, Users, Zap,
} from 'lucide-react';
import { AnimatedCounter } from '@/components/analytics/AnimatedCounter';
import { ActivityChartLive } from '@/components/analytics/ActivityChartLive';
import { FunnelChart } from '@/components/analytics/FunnelChart';
import { WorkflowPerformance } from '@/components/analytics/WorkflowPerformance';
import { EngagementHeatmap } from '@/components/analytics/EngagementHeatmap';
import { LiveEventFeed } from '@/components/analytics/LiveEventFeed';
import { useAnalytics } from '@/lib/hooks/useAnalytics';
import { useNotificationsStore } from '@/lib/store/notifications.store';
export default function AnalyticsPage() {
  const { overview, loading, error, reload } = useAnalytics(30000);
  const feedEvents = useNotificationsStore((s) => s.events);
  const m = overview?.metrics;

  const metricCards = [
    {
      label: 'Messages sent',
      value: m?.totalMessages ?? 0,
      icon: MessageSquare,
      iconBg: 'rgba(129,140,248,0.15)',
      iconColor: '#818CF8',
      glow: 'rgba(129,140,248,0.2)',
    },
    {
      label: 'Contacts',
      value: m?.totalContacts ?? 0,
      icon: Users,
      iconBg: 'rgba(34,211,238,0.12)',
      iconColor: '#22D3EE',
      glow: 'rgba(34,211,238,0.2)',
    },
    {
      label: 'Active chats',
      value: m?.activeConversations ?? 0,
      icon: TrendingUp,
      iconBg: 'rgba(52,211,153,0.12)',
      iconColor: '#34D399',
      glow: 'rgba(52,211,153,0.2)',
    },
    {
      label: 'AI replies',
      value: m?.aiReplies ?? 0,
      icon: Bot,
      iconBg: 'rgba(192,132,252,0.15)',
      iconColor: '#C084FC',
      glow: 'rgba(192,132,252,0.2)',
    },
    {
      label: 'Automations',
      value: m?.totalAutomations ?? 0,
      icon: Zap,
      iconBg: 'rgba(129,140,248,0.15)',
      iconColor: '#818CF8',
      glow: 'rgba(129,140,248,0.2)',
    },
    {
      label: 'Hours saved',
      value: m?.hoursSaved ?? 0,
      icon: Clock,
      iconBg: 'rgba(34,211,238,0.12)',
      iconColor: '#22D3EE',
      glow: 'rgba(34,211,238,0.2)',
      suffix: 'h',
    },
  ];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">

      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1
            className="text-xl font-bold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Analytics
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Mission control — live metrics and activity
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Realtime badge — glass pill */}
          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
            style={{
              background: 'var(--alert-success-bg)',
              border: '1px solid var(--alert-success-border)',
            }}
          >
            <span className="w-1.5 h-1.5 bg-[#34D399] rounded-full animate-pulse" />
            <span className="text-[10px] font-semibold" style={{ color: '#34D399' }}>
              Realtime
            </span>
          </div>

          <button
            type="button"
            onClick={reload}
            disabled={loading}
            className="p-2 rounded-lg transition-colors disabled:opacity-40"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            aria-label="Refresh analytics"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* ── Glass error alert ────────────────────────────── */}
      {error && (
        <div className="glass-alert glass-alert-warn rounded-xl">
          <span className="text-sm">⚠ Could not load analytics. Check your connection and try refresh.</span>
        </div>
      )}

      {/* ── Metric Cards Grid ────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {metricCards.map((card) => (
          <div key={card.label} className="premium-card p-4">
            {/* Icon */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 shrink-0"
              style={{ background: card.iconBg }}
            >
              <card.icon
                size={16}
                style={{
                  color: card.iconColor,
                  filter: `drop-shadow(0 0 4px ${card.glow})`,
                }}
              />
            </div>

            {/* Value */}
            {loading ? (
              <div
                className="h-7 mb-1 empty-pulse rounded-lg"
                style={{ width: '3.5rem', background: 'rgba(129,140,248,0.08)' }}
              />
            ) : (
              <div
                className="text-2xl font-extrabold mb-0.5 tracking-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                <AnimatedCounter value={card.value} suffix={card.suffix ?? ''} />
              </div>
            )}

            {/* Label */}
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              {card.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Activity chart + Live feed ───────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          {loading || !overview ? (
            <div
              className="h-[280px] w-full rounded-2xl empty-pulse"
              style={{ background: 'rgba(129,140,248,0.04)' }}
            />
          ) : (
            <ActivityChartLive data={overview.chart} />
          )}
        </div>
        <LiveEventFeed events={feedEvents} maxItems={14} />
      </div>

      {/* ── Funnel + Workflow Performance ────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {loading || !overview ? (
          <>
            <div
              className="h-[280px] rounded-2xl empty-pulse"
              style={{ background: 'rgba(129,140,248,0.04)' }}
            />
            <div
              className="h-[280px] rounded-2xl empty-pulse"
              style={{ background: 'rgba(129,140,248,0.04)' }}
            />
          </>
        ) : (
          <>
            <FunnelChart data={overview.funnel} />
            <WorkflowPerformance workflows={overview.workflows} />
          </>
        )}
      </div>

      {/* ── Engagement Heatmap ───────────────────────────── */}
      {!loading && overview && <EngagementHeatmap data={overview.heatmap} />}
    </div>
  );
}
