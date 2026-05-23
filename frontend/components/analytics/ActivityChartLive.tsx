'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { AnalyticsOverview } from '@/lib/types/analytics';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--af-bg-card)] border border-[var(--af-border-subtle)] rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="text-[var(--af-text-muted)] mb-1.5 font-medium">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export function ActivityChartLive({
  data,
  title = 'Activity (Last 7 Days)',
}: {
  data: AnalyticsOverview['chart'];
  title?: string;
}) {
  return (
    <div className="af-glass rounded-2xl p-5 border border-[var(--af-border-subtle)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[var(--af-text-primary)] font-semibold text-sm">{title}</h3>
          <p className="text-[var(--af-text-muted)] text-xs mt-0.5">Live from your workspace</p>
        </div>
        <span className="text-[10px] text-emerald-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          Live
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="dmsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="commentsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="aiGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 11 }}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Area
            type="monotone"
            dataKey="dms"
            name="DMs"
            stroke="#f97316"
            strokeWidth={2}
            fill="url(#dmsGrad)"
          />
          <Area
            type="monotone"
            dataKey="comments"
            name="Inbound"
            stroke="#8b5cf6"
            strokeWidth={2}
            fill="url(#commentsGrad)"
          />
          <Area
            type="monotone"
            dataKey="aiReplies"
            name="AI"
            stroke="#22d3ee"
            strokeWidth={2}
            fill="url(#aiGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
