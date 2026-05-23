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

function alertClassForEvent(event: ActivityEvent) {
  if (event.type.includes('error') || event.type.includes('failed')) return 'glass-alert-error';
  if (event.type.includes('warn')) return 'glass-alert-warn';
  return '';
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
        className="fixed top-0 right-0 h-full w-full max-w-md z-[120] flex flex-col shadow-2xl border-l"
        style={{
          background: 'var(--bg-popover)',
          borderColor: 'var(--border-glass)',
          backdropFilter: 'blur(16px)',
        }}
        role="dialog"
        aria-label="Notifications"
      >
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: 'var(--border-glass)' }}
        >
          <div className="flex items-center gap-2">
            <Bell size={18} style={{ color: '#818CF8' }} />
            <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Notifications</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={markAllRead}
              className="text-[10px] font-medium transition-colors"
              style={{ color: '#A5B4FC' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#818CF8')}
              onMouseLeave={e => (e.currentTarget.style.color = '#A5B4FC')}
            >
              Mark all read
            </button>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {grouped.map((group) => (
            <div key={group.id}>
              <div className="flex items-center gap-2 mb-2">
                <group.icon size={14} style={{ color: 'var(--text-muted)' }} />
                <h3
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {group.label}
                </h3>
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  ({group.items.length})
                </span>
              </div>
              {group.items.length === 0 ? (
                <p className="text-xs pl-1" style={{ color: 'var(--text-muted)' }}>No recent activity</p>
              ) : (
                <ul className="space-y-2">
                  {group.items.map((event: ActivityEvent) => {
                    const alertCls = alertClassForEvent(event);
                    return (
                      <li
                        key={event.id}
                        className={cn(
                          'p-3 rounded-xl transition-all duration-200',
                          alertCls ? `glass-alert ${alertCls}` : 'premium-card',
                        )}
                      >
                        <div className="flex justify-between gap-2">
                          <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                            {event.title}
                          </p>
                          <span className="text-[10px] shrink-0" style={{ color: 'var(--text-muted)' }}>
                            {timeAgo(event.createdAt)}
                          </span>
                        </div>
                        <p className="text-[11px] mt-0.5 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                          {event.description}
                        </p>
                      </li>
                    );
                  })}
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
      className="relative p-2 rounded-lg transition-colors"
      style={{ color: 'var(--text-muted)' }}
      onMouseEnter={e => {
        e.currentTarget.style.color = 'var(--text-primary)';
        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = 'var(--text-muted)';
        e.currentTarget.style.background = 'transparent';
      }}
      aria-label="Notifications"
    >
      <Bell size={18} />
      {unreadCount > 0 && (
        <span
          className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold text-white flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #818CF8, #22D3EE)' }}
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}
