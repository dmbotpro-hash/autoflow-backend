'use client';

import { X, Bell, Zap, Bot, UserPlus, AlertTriangle } from 'lucide-react';
import { useNotificationsStore, eventGroup } from '@/lib/store/notifications.store';
import type { ActivityEvent } from '@/lib/types/analytics';
import { cn } from '@/lib/utils/cn';

const groups = [
  { id: 'automation' as const, label: 'Automations', icon: Zap },
  { id: 'ai' as const, label: 'AI', icon: Bot },
  { id: 'leads' as const, label: 'Leads', icon: UserPlus },
  { id: 'alerts' as const, label: 'Alerts', icon: AlertTriangle },
];

function timeAgo(iso: string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h`;
}

export function NotificationCenter() {
  const drawerOpen = useNotificationsStore((s) => s.drawerOpen);
  const setDrawerOpen = useNotificationsStore((s) => s.setDrawerOpen);
  const events = useNotificationsStore((s) => s.events);
  const markAllRead = useNotificationsStore((s) => s.markAllRead);

  if (!drawerOpen) return null;

  const grouped = groups.map((g) => ({
    ...g,
    items: events.filter((e) => eventGroup(e.type) === g.id).slice(0, 15),
  }));

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[115]"
        onClick={() => setDrawerOpen(false)}
        aria-label="Close notifications"
      />
      <aside
        className="fixed top-0 right-0 h-full w-full max-w-md af-glass border-l border-[var(--af-border-subtle)] z-[120] flex flex-col shadow-2xl"
        role="dialog"
        aria-label="Notifications"
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--af-border-subtle)]">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-violet-400" />
            <h2 className="font-semibold text-[var(--af-text-primary)]">Notifications</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={markAllRead}
              className="text-[10px] text-violet-400 hover:text-violet-300 font-medium"
            >
              Mark all read
            </button>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/5 text-[var(--af-text-muted)]"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {grouped.map((group) => (
            <div key={group.id}>
              <div className="flex items-center gap-2 mb-2">
                <group.icon size={14} className="text-[var(--af-text-muted)]" />
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-[var(--af-text-muted)]">
                  {group.label}
                </h3>
                <span className="text-[10px] text-[var(--af-text-muted)]">
                  ({group.items.length})
                </span>
              </div>
              {group.items.length === 0 ? (
                <p className="text-xs text-[var(--af-text-muted)] pl-1">No recent activity</p>
              ) : (
                <ul className="space-y-2">
                  {group.items.map((event: ActivityEvent) => (
                    <li
                      key={event.id}
                      className="p-3 rounded-xl bg-black/20 border border-[var(--af-border-subtle)]"
                    >
                      <div className="flex justify-between gap-2">
                        <p className="text-xs font-medium text-[var(--af-text-primary)]">
                          {event.title}
                        </p>
                        <span className="text-[10px] text-[var(--af-text-muted)]">
                          {timeAgo(event.createdAt)}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--af-text-muted)] mt-0.5 line-clamp-2">
                        {event.description}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}

export function NotificationBellButton() {
  const toggleDrawer = useNotificationsStore((s) => s.toggleDrawer);
  const unreadCount = useNotificationsStore((s) => s.unreadCount);

  return (
    <button
      type="button"
      onClick={() => {
        toggleDrawer();
        useNotificationsStore.getState().markAllRead();
      }}
      className="relative text-[var(--af-text-muted)] hover:text-[var(--af-text-primary)] p-2 rounded-lg hover:bg-white/5 transition-colors"
      aria-label="Notifications"
    >
      <Bell size={18} />
      {unreadCount > 0 && (
        <span
          className={cn(
            'absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-violet-600 text-[9px] font-bold text-white flex items-center justify-center',
          )}
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}
