'use client';

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import type { AnalyticsOverview } from '@/lib/types/analytics';

export function FunnelChart({ data }: { data: AnalyticsOverview['funnel'] }) {
  return (
    <div className="af-glass rounded-2xl p-5 border border-[var(--af-border-subtle)] h-full">
      <h3 className="text-[var(--af-text-primary)] font-semibold text-sm mb-1">
        Conversion funnel
      </h3>
      <p className="text-[var(--af-text-muted)] text-xs mb-4">Inbound → outbound → leads</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="stage"
            width={90}
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: '#111827',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              fontSize: 12,
            }}
          />
          <Bar dataKey="count" radius={[0, 6, 6, 0]}>
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={
                  ['#3b82f6', '#8b5cf6', '#a855f7', '#ec4899'][i] ?? '#6366f1'
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
