'use client';
import { useEffect, useState } from 'react';
import {
  MessageSquare, Users, Zap, TrendingUp,
  ArrowUpRight, Plus, RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api/auth.api';
import { AnimatedCounter } from '@/components/analytics/AnimatedCounter';
import { DashboardLiveSection } from '@/components/dashboard/DashboardLiveSection';
import { AiCopilotDashboardWidget } from '@/components/ai/AiCopilotWidget';
import { useAnalytics } from '@/lib/hooks/useAnalytics';

interface Stats {
  totalMessages: number;
  totalContacts: number;
  activeConversations: number;
  automationCount: number;
}

/* Gradient icon wrappers for the stat cards */
const StatIcon = ({ icon: Icon, color }: { icon: React.ElementType; color: string }) => (
  <div
    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
    style={{ background: color }}
  >
    <Icon size={16} className="text-white" style={{ opacity: 0.9 }} />
  </div>
);

export default function DashboardPage() {
  const { overview, loading: analyticsLoading } = useAnalytics(30000);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadStats = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await api.get('/messages/stats');
      setStats(res.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStats(); }, []);

  const m = overview?.metrics;
  const cards = [
    {
      label: 'Messages Sent',
      value: m?.totalMessages ?? stats?.totalMessages ?? 0,
      icon: MessageSquare,
      iconBg: 'rgba(129,140,248,0.18)',
      badge: '+12%',
      badgeColor: '#34D399',
    },
    {
      label: 'Total Contacts',
      value: m?.totalContacts ?? stats?.totalContacts ?? 0,
      icon: Users,
      iconBg: 'rgba(34,211,238,0.15)',
      badge: '+8%',
      badgeColor: '#34D399',
    },
    {
      label: 'Active Chats',
      value: m?.activeConversations ?? stats?.activeConversations ?? 0,
      icon: TrendingUp,
      iconBg: 'rgba(52,211,153,0.15)',
      badge: 'Live',
      badgeColor: '#34D399',
    },
    {
      label: 'Automations',
      value: m?.totalAutomations ?? stats?.automationCount ?? 0,
      icon: Zap,
      iconBg: 'rgba(192,132,252,0.18)',
      badge: 'Running',
      badgeColor: '#C084FC',
    },
  ];

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-5">

      {/* ── Header ───────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-xl font-bold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Dashboard
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Welcome back — here's your overview
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* AI Online pill — glassmorphic */}
          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
            style={{
              background: 'var(--alert-success-bg)',
              border: '1px solid var(--alert-success-border)',
            }}
          >
            <div className="w-1.5 h-1.5 bg-[#34D399] rounded-full animate-pulse" />
            <span className="text-[#34D399] text-xs font-medium">AI Online</span>
          </div>

          {/* Refresh */}
          <button
            onClick={loadStats}
            disabled={loading}
            className="p-2 rounded-lg transition-colors disabled:opacity-40"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* ── Error glass alert ────────────────────────────── */}
      {error && (
        <div className="glass-alert glass-alert-error rounded-xl">
          <span className="text-sm font-medium">
            ⚠ Could not load stats — retrying may help
          </span>
        </div>
      )}

      {/* ── Stats Grid ───────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="premium-card p-4 group"
          >
            <div className="flex items-center justify-between mb-3">
              <StatIcon icon={card.icon} color={card.iconBg} />
              <span className="text-xs font-medium" style={{ color: card.badgeColor }}>
                {card.badge}
              </span>
            </div>

            {/* Value — velvet white, extra-bold */}
            {loading && analyticsLoading ? (
              <div
                className="h-7 mb-1 empty-pulse"
                style={{ width: '3rem', background: 'rgba(129,140,248,0.08)' }}
              />
            ) : (
              <div
                className="text-2xl font-extrabold mb-0.5 tracking-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                <AnimatedCounter value={card.value} />
              </div>
            )}

            {/* Label — slate muted */}
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {card.label}
            </div>
          </div>
        ))}
      </div>

      <DashboardLiveSection overview={overview} loading={analyticsLoading} />

      {/* ── Bottom row ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Quick Actions */}
        <div className="premium-card p-5">
          <h2
            className="font-semibold text-sm mb-3 tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Quick Actions
          </h2>
          <div className="space-y-2">
            {[
              {
                label: 'Create New Workflow',
                desc: 'Set up a comment-to-DM automation',
                href: '/workflows',
                icon: Plus,
              },
              {
                label: 'Open Inbox',
                desc: 'View live conversations',
                href: '/inbox',
                icon: MessageSquare,
              },
              {
                label: 'View Contacts',
                desc: 'Manage your leads',
                href: '/contacts',
                icon: Users,
              },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-glass)',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = 'rgba(129,140,248,0.06)';
                  el.style.borderColor = 'var(--border-glow)';
                  el.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = 'rgba(255,255,255,0.02)';
                  el.style.borderColor = 'var(--border-glass)';
                  el.style.transform = '';
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(129,140,248,0.10)' }}
                >
                  <action.icon size={14} style={{ color: '#818CF8' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {action.label}
                  </div>
                  <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                    {action.desc}
                  </div>
                </div>
                <ArrowUpRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              </Link>
            ))}
          </div>
        </div>

        {/* AI Copilot Widget */}
        <AiCopilotDashboardWidget />
      </div>
    </div>
  );
}
