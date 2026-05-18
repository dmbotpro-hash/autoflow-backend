'use client';

import { useEffect, useState } from 'react';
import { MessageSquare, Users, Zap, TrendingUp, Plus } from 'lucide-react';
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
    const timer = setTimeout(() => {
      setStats({
        totalMessages: 1240,
        totalContacts: 382,
        activeConversations: 14,
        automationCount: 7,
      });
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const cards = [
    {
      label: 'Messages Sent',
      value: stats?.totalMessages ?? 0,
      icon: MessageSquare,
    },
    {
      label: 'Total Leads Captured',
      value: stats?.totalContacts ?? 0,
      icon: Users,
    },
    {
      label: 'Active Conversations',
      value: stats?.activeConversations ?? 0,
      icon: TrendingUp,
    },
    {
      label: 'Active Node Automations',
      value: stats?.automationCount ?? 0,
      icon: Zap,
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8 min-h-screen bg-black font-sans">
      
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[rgba(255,255,255,0.06)] pb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white font-sans">
            System Dashboard
          </h1>
          <p className="text-xs text-[#A0A0A0] mt-1 font-normal">
            Real-time dynamic monitoring console for comments and direct message automations.
          </p>
        </div>

        <div className="flex gap-2">
          <span className="text-[10px] uppercase tracking-wider bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] text-white font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 select-none">
            <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-pulse" /> AI Processing Core Online
          </span>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card) => (
          <div 
            key={card.label} 
            className="bg-[#0F0F0F] border border-[rgba(255,255,255,0.08)] rounded-2xl p-5 hover:border-[rgba(255,255,255,0.14)] transition-all duration-150"
          >
            <div className="w-10 h-10 bg-[#141414] border border-[rgba(255,255,255,0.06)] rounded-xl flex items-center justify-center mb-4">
              <card.icon size={16} className="text-white" />
            </div>
            <div className="text-3xl font-bold tracking-tight text-white font-sans">
              {loading ? (
                <span className="inline-block w-16 h-8 bg-[#141414] rounded animate-pulse" />
              ) : (
                card.value.toLocaleString()
              )}
            </div>
            <div className="text-[#A0A0A0] text-xs mt-2 font-medium">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Charts module section */}
      <div className="grid grid-cols-1 gap-6">
        <ActivityChart />
      </div>

      {/* Elegant Quick Actions panel */}
      <div className="bg-[#0F0F0F] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6">
        <h2 className="text-white font-semibold text-xs mb-4 tracking-wider uppercase opacity-80 select-none">Quick Operations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Create New Campaign', href: '/workflows', icon: Plus },
            { label: 'Open Conversation Inbox', href: '/inbox', icon: MessageSquare },
            { label: 'View Leads & Contacts', href: '/contacts', icon: Users },
          ].map((action) => (
            <a
              key={action.label}
              href={action.href}
              className="flex items-center gap-3 bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3.5 transition-all duration-150 hover:border-[rgba(255,255,255,0.14)] hover:bg-[#1A1A1A]"
            >
              <div className="w-8 h-8 rounded-lg bg-black border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-white">
                <action.icon size={14} />
              </div>
              <span className="text-white text-xs font-semibold">{action.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
