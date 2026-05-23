'use client';

import {
  Bot,
  MessageCircle,
  Sparkles,
  UserPlus,
  Zap,
  HelpCircle,
} from 'lucide-react';
import type { ActivityEvent } from '@/lib/types/analytics';
import { cn } from '@/lib/utils/cn';

const iconMap: Record<ActivityEvent['type'], typeof Zap> = {
  dm_sent: MessageCircle,
  ai_replied: Bot,
  faq_intercept: HelpCircle,
  workflow_triggered: Zap,
  lead_captured: UserPlus,
  inbound_dm: MessageCircle,
};

const severityStyles: Record<ActivityEvent['severity'], string> = {
  info: 'border-slate-500/30 bg-slate-500/10 text-slate-300',
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  ai: 'border-violet-500/30 bg-violet-500/10 text-violet-300',
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function LiveEventFeed({
  events,
  compact = false,
  maxItems = 12,
}: {
  events: ActivityEvent[];
  compact?: boolean;
  maxItems?: number;
}) {
  const list = events.slice(0, maxItems);

  return (
    <div
      className={cn(
        'af-glass rounded-2xl border border-[var(--af-border-subtle)] flex flex-col',
        compact ? 'p-4' : 'p-5',
      )}
    >
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div>
          <h3 className="text-[var(--af-text-primary)] font-semibold text-sm flex items-center gap-2">
            <Sparkles size={14} className="text-violet-400" />
            Live event stream
          </h3>
          {!compact && (
            <p className="text-[var(--af-text-muted)] text-xs mt-0.5">
              DMs, AI replies, workflows, and leads
            </p>
          )}
        </div>
        <span className="text-[10px] text-emerald-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          Live
        </span>
      </div>

      <div className={cn('space-y-2 overflow-y-auto', compact ? 'max-h-[280px]' : 'max-h-[420px]')}>
        {list.length === 0 ? (
          <p className="text-xs text-[var(--af-text-muted)] py-8 text-center">
            No events yet — automations will appear here
          </p>
        ) : (
          list.map((event) => {
            const Icon = iconMap[event.type] ?? Zap;
            return (
              <div
                key={event.id}
                className="flex gap-3 p-3 rounded-xl bg-black/20 border border-[var(--af-border-subtle)] hover:border-violet-500/20 transition-colors animate-in fade-in slide-in-from-top-1 duration-300"
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg border flex items-center justify-center shrink-0',
                    severityStyles[event.severity],
                  )}
                >
                  <Icon size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-2">
                    <p className="text-xs font-semibold text-[var(--af-text-primary)]">
                      {event.title}
                    </p>
                    <span className="text-[10px] text-[var(--af-text-muted)] shrink-0">
                      {timeAgo(event.createdAt)}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--af-text-muted)] truncate mt-0.5">
                    {event.description}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
