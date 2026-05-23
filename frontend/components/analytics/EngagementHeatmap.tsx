'use client';

import type { AnalyticsOverview } from '@/lib/types/analytics';

export function EngagementHeatmap({ data }: { data: AnalyticsOverview['heatmap'] }) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="af-glass rounded-2xl p-5 border border-[var(--af-border-subtle)]">
      <h3 className="text-[var(--af-text-primary)] font-semibold text-sm mb-1">
        Engagement heatmap
      </h3>
      <p className="text-[var(--af-text-muted)] text-xs mb-4">Activity by hour (UTC)</p>
      <div className="grid grid-cols-12 gap-1">
        {data.map((cell) => {
          const intensity = cell.count / max;
          return (
            <div
              key={cell.hour}
              title={`${cell.hour}:00 — ${cell.count} events`}
              className="aspect-square rounded-md flex items-center justify-center text-[8px] text-white/80 font-medium"
              style={{
                backgroundColor: `rgba(139, 92, 246, ${0.08 + intensity * 0.72})`,
              }}
            >
              {cell.hour % 6 === 0 ? cell.hour : ''}
            </div>
          );
        })}
      </div>
    </div>
  );
}
