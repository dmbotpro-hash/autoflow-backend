'use client';

import { Zap } from 'lucide-react';
import type { AnalyticsOverview } from '@/lib/types/analytics';

export function WorkflowPerformance({
  workflows,
}: {
  workflows: AnalyticsOverview['workflows'];
}) {
  const sorted = [...workflows].sort((a, b) => b.executions - a.executions);
  const max = Math.max(...sorted.map((w) => w.executions), 1);

  return (
    <div className="af-glass rounded-2xl p-5 border border-[var(--af-border-subtle)] h-full">
      <h3 className="text-[var(--af-text-primary)] font-semibold text-sm mb-1">
        Workflow performance
      </h3>
      <p className="text-[var(--af-text-muted)] text-xs mb-4">Executions this month</p>
      <div className="space-y-3 max-h-[220px] overflow-y-auto">
        {sorted.length === 0 ? (
          <p className="text-xs text-[var(--af-text-muted)]">No workflows yet</p>
        ) : (
          sorted.map((w) => (
            <div key={w.id}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[var(--af-text-primary)] font-medium flex items-center gap-1.5 truncate">
                  <Zap size={12} className={w.isActive ? 'text-violet-400' : 'text-slate-600'} />
                  {w.name}
                </span>
                <span className="text-[var(--af-text-muted)] tabular-nums">{w.executions}</span>
              </div>
              <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-full transition-all duration-700"
                  style={{ width: `${(w.executions / max) * 100}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
