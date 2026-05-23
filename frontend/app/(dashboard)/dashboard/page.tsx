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
      iconColor: 'text-orange-400',
      iconBg: 'bg-orange-500/10',
      badge: '+12%',
      badgeColor: 'text-emerald-400',
    },
    {
      label: 'Total Contacts',
      value: m?.totalContacts ?? stats?.totalContacts ?? 0,
      icon: Users,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/10',
      badge: '+8%',
      badgeColor: 'text-emerald-400',
    },
    {
      label: 'Active Chats',
      value: m?.activeConversations ?? stats?.activeConversations ?? 0,
      icon: TrendingUp,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10',
      badge: 'Live',
      badgeColor: 'text-emerald-400',
    },
    {
      label: 'Automations',
      value: m?.totalAutomations ?? stats?.automationCount ?? 0,
      icon: Zap,
      iconColor: 'text-violet-400',
      iconBg: 'bg-violet-500/10',
      badge: 'Running',
      badgeColor: 'text-violet-400',
    },
  ];

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Welcome back — here's your overview
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* AI Status */}
          <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-emerald-400 text-xs font-medium">AI Online</span>
          </div>
          {/* Refresh */}
          <button
            onClick={loadStats}
            disabled={loading}
            className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors disabled:opacity-40"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Stats Grid — 2 cols mobile, 4 cols desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-[#111827] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-8 h-8 ${card.iconBg} rounded-lg flex items-center justify-center`}>
                <card.icon size={16} className={card.iconColor} />
              </div>
              <span className={`text-xs font-medium ${card.badgeColor}`}>
                {card.badge}
              </span>
            </div>
            {loading && analyticsLoading ? (
              <div className="w-12 h-7 bg-white/5 rounded-lg animate-pulse mb-1" />
            ) : (
              <div className="text-2xl font-bold text-white mb-0.5">
                <AnimatedCounter value={card.value} />
              </div>
            )}
            <div className="text-gray-500 text-xs">{card.label}</div>
          </div>
        ))}
      </div>

      <DashboardLiveSection overview={overview} loading={analyticsLoading} />

      {/* Bottom row: Quick Actions + AI Copilot Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Quick Actions */}
        <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
          <h2 className="text-white font-semibold text-sm mb-3">Quick Actions</h2>
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
                className="flex items-center gap-3 p-3 bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 rounded-xl transition-all group"
              >
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                  <action.icon size={14} className="text-gray-400 group-hover:text-orange-400 transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium">{action.label}</div>
                  <div className="text-gray-500 text-xs truncate">{action.desc}</div>
                </div>
                <ArrowUpRight size={14} className="text-gray-600 group-hover:text-gray-400 flex-shrink-0 transition-colors" />
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
