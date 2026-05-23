'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, Plus, Sparkles, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useNotificationsStore } from '@/lib/store/notifications.store';
import { useCommandStore } from '@/lib/store/command.store';
import { useAiCopilotStore } from '@/lib/store/aiCopilot.store';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

export function MobileFAB() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const toggleNotifications = useNotificationsStore((s) => s.toggleDrawer);
  const unread = useNotificationsStore((s) => s.unreadCount);
  const setCommandOpen = useCommandStore((s) => s.setOpen);
  const setCopilotOpen = useAiCopilotStore((s) => s.setOpen);

  const actions = [
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      onClick: () => {
        toggleNotifications();
        setOpen(false);
      },
      badge: unread,
    },
    {
      id: 'search',
      label: 'Search',
      icon: Search,
      onClick: () => {
        setCommandOpen(true);
        setOpen(false);
      },
    },
    {
      id: 'ai',
      label: 'AI Copilot',
      icon: Sparkles,
      onClick: () => {
        setCopilotOpen(true);
        setOpen(false);
      },
    },
    {
      id: 'new',
      label: pathname.startsWith('/workflows') ? 'New workflow' : 'Workflows',
      icon: Plus,
      onClick: () => {
        router.push('/workflows');
        setOpen(false);
      },
    },
  ];

  return (
    <div
      className="md:hidden fixed right-4 z-[calc(var(--af-z-topbar)+1)] flex flex-col items-end gap-3"
      style={{ bottom: 'calc(4.5rem + env(safe-area-inset-bottom, 0px))' }}
    >
      {open && (
        <div
          className={cn(
            'flex flex-col gap-2 items-end',
            !reducedMotion && 'animate-in fade-in slide-in-from-bottom-2 duration-200',
          )}
          role="menu"
          aria-label="Quick actions"
        >
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              role="menuitem"
              onClick={action.onClick}
              className="flex items-center gap-2 pl-3 pr-2 py-2 rounded-full af-glass border border-[var(--af-border-subtle)] text-xs font-medium text-[var(--af-text-primary)] shadow-lg"
            >
              {action.label}
              <span className="relative w-9 h-9 rounded-full bg-violet-600/20 flex items-center justify-center text-violet-300">
                <action.icon size={16} aria-hidden />
                {action.badge ? (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-violet-600 text-[9px] text-white font-bold flex items-center justify-center">
                    {action.badge > 9 ? '9+' : action.badge}
                  </span>
                ) : null}
              </span>
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-xl shadow-violet-500/30 flex items-center justify-center',
          !reducedMotion && 'transition-transform active:scale-95',
          open && 'rotate-0',
        )}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={open ? 'Close quick actions' : 'Open quick actions'}
      >
        {open ? <X size={22} /> : <Plus size={22} className={!open && !reducedMotion ? 'rotate-0' : ''} />}
      </button>
    </div>
  );
}
