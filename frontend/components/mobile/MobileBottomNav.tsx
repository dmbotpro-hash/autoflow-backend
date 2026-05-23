'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Inbox,
  Workflow,
  BarChart3,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useNotificationsStore } from '@/lib/store/notifications.store';

const tabs = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/inbox', label: 'Inbox', icon: Inbox },
  { href: '/workflows', label: 'Flows', icon: Workflow },
  { href: '/analytics', label: 'Stats', icon: BarChart3 },
  { href: '/settings', label: 'More', icon: Menu },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();
  const unread = useNotificationsStore((s) => s.unreadCount);

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-[var(--af-z-topbar)] safe-area-pb border-t"
      style={{
        background: 'rgba(8,8,15,0.92)',
        borderColor: 'var(--border-glass)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
      aria-label="Primary mobile navigation"
    >
      <ul className="flex items-stretch justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          const Icon = tab.icon;
          const isInbox = tab.href === '/inbox';

          return (
            <li key={tab.href} className="flex-1 min-w-0">
              <Link
                href={tab.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-0.5 h-full text-[10px] font-medium transition-colors touch-target',
                  active ? '' : '',
                )}
                style={{ color: active ? '#A5B4FC' : 'var(--text-muted)' }}
                aria-current={active ? 'page' : undefined}
              >
                <span className="relative">
                  <Icon size={20} strokeWidth={active ? 2.5 : 2} aria-hidden />
                  {isInbox && unread > 0 && (
                    <span
                      className="absolute -top-1 -right-1 min-w-[14px] h-3.5 px-0.5 rounded-full text-[8px] font-bold text-white flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #818CF8, #22D3EE)' }}
                    >
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </span>
                <span className="truncate max-w-full px-0.5">{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
