'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Squares2X2Icon,
  ChatBubbleOvalLeftIcon,
  RocketLaunchIcon,
  ChartBarSquareIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  UserPlusIcon,
  SquaresPlusIcon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/lib/hooks/useAuth';
import { useSidebarStore } from '@/lib/store/sidebar.store';
import { cn } from '@/lib/utils/cn';
import { Badge } from '@/components/ui/Badge';
import { WalkthroughTooltip } from '@/components/onboarding/WalkthroughTooltip';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Squares2X2Icon },
  { href: '/inbox', label: 'Inbox', icon: ChatBubbleOvalLeftIcon },
  { href: '/workflows', label: 'Workflows', icon: RocketLaunchIcon },
  { href: '/analytics', label: 'Analytics', icon: ChartBarSquareIcon },
  { href: '/contacts', label: 'Contacts', icon: UserGroupIcon },
  { href: '/templates', label: 'Templates', icon: SquaresPlusIcon },
  { href: '/team', label: 'Team', icon: UserPlusIcon },
  { href: '/security', label: 'Security', icon: ShieldCheckIcon },
  { href: '/settings', label: 'Settings', icon: Cog6ToothIcon },
  { href: '/billing', label: 'Billing', icon: CreditCardIcon },
];

function SidebarContent({
  pathname,
  user,
  logout,
  setMobileOpen,
  collapsed,
  onToggleCollapse,
}: {
  pathname: string;
  user: { name?: string; email?: string } | null;
  logout: () => void;
  setMobileOpen: (open: boolean) => void;
  collapsed: boolean;
  onToggleCollapse?: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div
        className={cn(
          'flex items-center border-b border-[var(--af-border-subtle)]',
          collapsed ? 'px-3 py-4 justify-center' : 'px-4 py-4 justify-between',
        )}
      >
        <div className={cn('flex items-center gap-2', collapsed && 'justify-center')}>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 via-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20 shrink-0">
            <Bars3Icon className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <div>
              <span className="text-[var(--af-text-primary)] font-bold text-base block leading-none">
                AutoFlow
              </span>
              <Badge variant="ai" className="mt-1">
                AI OS
              </Badge>
            </div>
          )}
        </div>
        {!collapsed && (
          <button
            type="button"
            className="md:hidden text-[var(--af-text-muted)]"
            onClick={() => setMobileOpen(false)}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {onToggleCollapse && (
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden md:flex mx-2 mt-2 items-center justify-center h-7 rounded-lg text-[var(--af-text-muted)] hover:text-[var(--af-text-primary)] hover:bg-white/5 transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRightIcon className="w-4 h-4" /> : <ChevronLeftIcon className="w-4 h-4" />}
        </button>
      )}

      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? item.label : undefined}
              data-tour={item.href.replace('/', '') || 'dashboard'}
              className={cn(
                'relative',
                'flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-[var(--af-duration-fast)]',
                collapsed ? 'px-2.5 py-2.5 justify-center' : 'px-3 py-2.5',
                isActive
                  ? 'bg-violet-500/15 text-violet-300 af-nav-active-glow border border-violet-500/25'
                  : 'text-[var(--af-text-secondary)] hover:text-[var(--af-text-primary)] hover:bg-white/5 border border-transparent',
              )}
            >
              <item.icon
                className={cn(
                  'w-5 h-5 shrink-0 transition-colors',
                  isActive && 'text-violet-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]',
                )}
              />
              {!collapsed && item.label}
              {item.href === '/inbox' && !collapsed && (
                <WalkthroughTooltip
                  tourId="sidebar-inbox"
                  title="Live Inbox"
                  description="All DMs land here in realtime once Instagram is connected."
                  position="bottom"
                  className="left-full ml-2 top-0"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-2 py-3 border-t border-[var(--af-border-subtle)]">
        {!collapsed && (
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shrink-0 text-xs font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <div className="text-[var(--af-text-primary)] text-xs font-medium truncate">
                {user?.name || 'User'}
              </div>
              <div className="text-[var(--af-text-muted)] text-[10px] truncate">
                {user?.email}
              </div>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={logout}
          title="Sign out"
          className={cn(
            'w-full flex items-center gap-3 rounded-xl text-sm text-[var(--af-text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition-colors',
            collapsed ? 'px-2.5 py-2.5 justify-center' : 'px-3 py-2.5',
          )}
        >
          <ArrowRightOnRectangleIcon className="h-4 w-4 shrink-0" />
          {!collapsed && 'Sign Out'}
        </button>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { collapsed, hydrated, toggle, hydrate } = useSidebarStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const width = collapsed ? 'var(--af-sidebar-collapsed)' : 'var(--af-sidebar-width)';

  return (
    <>
      <aside
        className="hidden md:flex flex-shrink-0 af-glass border-r border-[var(--af-border-subtle)] flex-col h-screen sticky top-0 z-[var(--af-z-sidebar)] transition-[width] duration-[var(--af-duration-normal)]"
        style={{ width }}
      >
        <SidebarContent
          pathname={pathname}
          user={user}
          logout={logout}
          setMobileOpen={setMobileOpen}
          collapsed={collapsed}
          onToggleCollapse={toggle}
        />
      </aside>

      <button
        type="button"
        className="md:hidden fixed top-3.5 left-4 z-50 text-[var(--af-text-muted)] hover:text-[var(--af-text-primary)]"
        onClick={() => setMobileOpen(true)}
      >
        <Bars3Icon className="w-6 h-6" />
      </button>

      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="md:hidden fixed left-0 top-0 h-full w-64 af-glass border-r z-50 flex flex-col animate-slide-in">
            <SidebarContent
              pathname={pathname}
              user={user}
              logout={logout}
              setMobileOpen={setMobileOpen}
              collapsed={false}
            />
          </aside>
        </>
      )}
    </>
  );
}
