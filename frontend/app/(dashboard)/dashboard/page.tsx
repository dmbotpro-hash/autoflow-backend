'use client';
import { useEffect, useState } from 'react';
import { MessageSquare, Users, Zap, TrendingUp, ArrowUpRight, Plus } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api/auth.api';
import ActivityChart from '@/components/dashboard/ActivityChart';

interface Stats {
  totalMessages: number;
  totalContacts: number;
  activeConversations: number;
  automationCount: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/messages/stats')
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      label: 'Messages Sent',
      value: stats?.totalMessages ?? 0,
      icon: MessageSquare,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
      change: '+12%',
      changePositive: true,
    },
    {
      label: 'Total Contacts',
      value: stats?.totalContacts ?? 0,
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      change: '+8%',
      changePositive: true,
    },
    {
      label: 'Active Conversations',
      value: stats?.activeConversations ?? 0,
      icon: TrendingUp,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      change: '+3%',
      changePositive: true,
    },
    {
      label: 'Active Automations',
      value: stats?.automationCount ?? 0,
      icon: Zap,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      change: 'Running',
      changePositive: true,
    },
  ];

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Welcome back — here's what's happening
          </p>
        </div>
        {/* AI Status Badge */}
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1.5 animate-fade-in">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <span className="text-green-400 text-xs font-medium">AI Online</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`bg-gray-900 border ${card.border} rounded-xl p-5 hover:bg-gray-800/50 transition-colors`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 ${card.bg} rounded-lg flex items-center justify-center`}>
                <card.icon size={18} className={card.color} />
              </div>
              <span className={`text-xs font-medium ${card.changePositive ? 'text-green-400' : 'text-red-400'}`}>
                {card.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-white mb-0.5">
              {loading ? (
                <div className="w-16 h-7 bg-gray-700 rounded animate-pulse" />
              ) : (
                card.value.toLocaleString()
              )}
            </div>
            <div className="text-gray-500 text-xs">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="mb-6">
        <ActivityChart />
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h2 className="text-white font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Create New Workflow', href: '/workflows', icon: Plus, desc: 'Set up a new automation' },
            { label: 'View Inbox', href: '/inbox', icon: MessageSquare, desc: 'Check live conversations' },
            { label: 'View Contacts', href: '/contacts', icon: Users, desc: 'Manage your leads' },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-3 bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-gray-600 rounded-xl px-4 py-3.5 transition-all group"
            >
              <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-colors">
                <action.icon size={15} className="text-gray-400 group-hover:text-orange-400 transition-colors" />
              </div>
              <div className="min-w-0">
                <div className="text-white text-sm font-medium truncate">{action.label}</div>
                <div className="text-gray-500 text-xs truncate">{action.desc}</div>
              </div>
              <ArrowUpRight size={14} className="text-gray-600 ml-auto flex-shrink-0 group-hover:text-gray-400 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
