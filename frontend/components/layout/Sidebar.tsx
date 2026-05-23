'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { XMarkIcon, ArrowRightOnRectangleIcon, Bars3Icon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/lib/hooks/useAuth';
import { useSidebarStore } from '@/lib/store/sidebar.store';
import { cn } from '@/lib/utils/cn';
import { Badge } from '@/components/ui/Badge';
import { WalkthroughTooltip } from '@/components/onboarding/WalkthroughTooltip';
import {
  PremiumDashboardIcon,
  PremiumInboxIcon,
  PremiumWorkflowIcon,
  PremiumAnalyticsIcon,
  PremiumContactsIcon,
  PremiumTemplatesIcon,
  PremiumTeamIcon,
  PremiumSecurityIcon,
  PremiumSettingsIcon,
  PremiumBillingIcon,
} from '@/components/ui/PremiumIcons';

/* ─── Nav definition ──────────────────────────────────────────────── */
const navItems = [
  { href: '/dashboard', label: 'Dashboard', Icon: PremiumDashboardIcon },
  { href: '/inbox',     label: 'Inbox',     Icon: PremiumInboxIcon     },
  { href: '/workflows', label: 'Workflows', Icon: PremiumWorkflowIcon  },
  { href: '/analytics', label: 'Analytics', Icon: PremiumAnalyticsIcon },
  { href: '/contacts',  label: 'Contacts',  Icon: PremiumContactsIcon  },
  { href: '/templates', label: 'Templates', Icon: PremiumTemplatesIcon },
  { href: '/team',      label: 'Team',      Icon: PremiumTeamIcon      },
  { href: '/security',  label: 'Security',  Icon: PremiumSecurityIcon  },
  { href: '/settings',  label: 'Settings',  Icon: PremiumSettingsIcon  },
  { href: '/billing',   label: 'Billing',   Icon: PremiumBillingIcon   },
];

/* ─── Inner content ───────────────────────────────────────────────── */
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

      {/* ── Logo row ─────────────────────────────────────── */}
      <div
        className={cn(
          'flex items-center border-b border-[var(--border-glass)]',
          collapsed ? 'px-3 py-4 justify-center' : 'px-4 py-4 justify-between',
        )}
      >
        <div className={cn('flex items-center gap-2.5', collapsed && 'justify-center')}>
          {/* Gemini-style gradient orb logo */}
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #818CF8 0%, #C084FC 50%, #22D3EE 100%)',
              boxShadow: '0 0 16px rgba(192,132,252,0.35)',
            }}
          >
            <Bars3Icon className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <div>
              <span
                className="font-bold text-base block leading-none tracking-tight"
                style={{ color: 'var(--text-primary)' }}
              >
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
            className="md:hidden"
            style={{ color: 'var(--text-muted)' }}
            onClick={() => setMobileOpen(false)}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* ── Collapse toggle ───────────────────────────────── */}
      {onToggleCollapse && (
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden md:flex mx-2 mt-2 items-center justify-center h-7 rounded-lg transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed
            ? <ChevronRightIcon className="w-4 h-4" />
            : <ChevronLeftIcon  className="w-4 h-4" />}
        </button>
      )}

      {/* ── Nav items ─────────────────────────────────────── */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto scrollbar-none">
        {navItems.map(({ href, label, Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? label : undefined}
              data-tour={href.replace('/', '') || 'dashboard'}
              className={cn(
                'relative flex items-center gap-3 rounded-xl text-sm font-medium',
                'transition-all duration-200 ease-out group',
                collapsed ? 'px-2.5 py-2.5 justify-center' : 'px-3 py-2.5',
              )}
              style={
                isActive
                  ? {
                      background: 'rgba(129,140,248,0.10)',
                      border: '1px solid rgba(129,140,248,0.20)',
                      color: 'var(--text-primary)',
                      boxShadow: '0 0 20px rgba(129,140,248,0.12)',
                    }
                  : {
                      border: '1px solid transparent',
                      color: 'var(--text-secondary)',
                    }
              }
            >
              {/* Active glow pill */}
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full"
                  style={{ background: 'linear-gradient(180deg,#818CF8,#22D3EE)' }}
                  aria-hidden
                />
              )}

              <Icon size={18} />
              {!collapsed && label}

              {/* Hover state override via Tailwind */}
              {!isActive && (
                <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/[0.04]" aria-hidden />
              )}

              {href === '/inbox' && !collapsed && (
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

      {/* ── User + Sign out ───────────────────────────────── */}
      <div
        className="px-2 py-3 border-t"
        style={{ borderColor: 'var(--border-glass)' }}
      >
        {!collapsed && (
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white"
              style={{
                background: 'linear-gradient(135deg, #818CF8, #22D3EE)',
                boxShadow: '0 0 10px rgba(129,140,248,0.3)',
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                {user?.name || 'User'}
              </div>
              <div className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>
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
            'w-full flex items-center gap-3 rounded-xl text-sm transition-colors group',
            collapsed ? 'px-2.5 py-2.5 justify-center' : 'px-3 py-2.5',
          )}
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#F87171')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <ArrowRightOnRectangleIcon className="h-4 w-4 shrink-0" />
          {!collapsed && 'Sign Out'}
        </button>
      </div>
    </div>
  );
}

/* ─── Root export ─────────────────────────────────────────────────── */
export default function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { collapsed, hydrated, toggle, hydrate } = useSidebarStore();

  useEffect(() => { hydrate(); }, [hydrate]);

  const width = collapsed ? 'var(--af-sidebar-collapsed)' : 'var(--af-sidebar-width)';

  return (
    <>
      {/* ── Desktop sidebar ──────────────────────────────── */}
      <aside
        className="hidden md:flex flex-shrink-0 flex-col h-screen sticky top-0 z-[var(--af-z-sidebar)] transition-[width] duration-[var(--af-duration-normal)]"
        style={{
          width,
          background: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-glass)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
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

      {/* ── Mobile hamburger ──────────────────────────────── */}
      <button
        type="button"
        className="md:hidden fixed top-3.5 left-4 z-50"
        style={{ color: 'var(--text-muted)' }}
        onClick={() => setMobileOpen(true)}
      >
        <Bars3Icon className="w-6 h-6" />
      </button>

      {/* ── Mobile drawer ─────────────────────────────────── */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="md:hidden fixed left-0 top-0 h-full w-64 z-50 flex flex-col animate-slide-in border-r"
            style={{
              background: 'var(--bg-sidebar)',
              borderColor: 'var(--border-glass)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
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
