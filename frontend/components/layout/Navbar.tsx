'use client';

import { Search, Sparkles, Command } from 'lucide-react';
import { NotificationBellButton } from '@/components/notifications/NotificationCenter';
import { WorkspaceSwitcher } from '@/components/workspace/WorkspaceSwitcher';
import { useAuth } from '@/lib/hooks/useAuth';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/components/theme/ThemeProvider';
import { useCommandStore } from '@/lib/store/command.store';
import { useAuthStore } from '@/lib/store/auth.store';
import { useAiCopilotStore } from '@/lib/store/aiCopilot.store';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Command Center',
  '/inbox': 'Live Inbox',
  '/workflows': 'Automation Studio',
  '/contacts': 'Contacts & Leads',
  '/billing': 'Billing',
  '/team': 'Team',
  '/security': 'Security',
  '/templates': 'Template Marketplace',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
  '/design-system': 'Design System',
};

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const setCommandOpen = useCommandStore((s) => s.setOpen);
  const workspaceId = useAuthStore((s) => s.workspaceId);
  const toggleCopilot = useAiCopilotStore((s) => s.toggleOpen);

  const title = pageTitles[pathname] || 'AutoFlow';

  return (
    <header
      role="banner"
      className={cn(
        'h-14 flex items-center justify-between px-4 gap-4 sticky top-0 z-[var(--af-z-topbar)]',
      )}
      style={{
        background: 'rgba(8,8,15,0.80)',
        borderBottom: '1px solid var(--border-glass)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* ── Page title ──────────────────────────────────── */}
      <div className="flex items-center gap-3 min-w-0 ml-8 md:ml-0">
        <h1
          className="font-semibold text-base truncate tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </h1>
        {workspaceId && (
          <span
            className="hidden lg:inline text-[10px] font-mono truncate max-w-[120px]"
            style={{ color: 'var(--text-muted)' }}
          >
            ws:{workspaceId.slice(0, 8)}…
          </span>
        )}
      </div>

      {/* ── Search / Command palette ─────────────────────── */}
      <div className="flex items-center gap-2 flex-1 max-w-md justify-end md:justify-center">
        <button
          type="button"
          onClick={() => setCommandOpen(true)}
          className="hidden sm:flex flex-1 max-w-sm items-center gap-2 h-9 px-3 rounded-xl text-xs transition-all duration-200 hover:-translate-y-px"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--border-glass)',
            color: 'var(--text-muted)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-glow)';
            (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(129,140,248,0.06)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-glass)';
            (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          }}
        >
          <Search size={14} />
          <span className="flex-1 text-left">Search or command...</span>
          <kbd
            className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded"
            style={{
              border: '1px solid var(--border-glass)',
              background: 'rgba(0,0,0,0.2)',
            }}
          >
            <Command size={10} />K
          </kbd>
        </button>
        <Button
          variant="ghost"
          size="sm"
          className="sm:hidden px-2"
          onClick={() => setCommandOpen(true)}
          aria-label="Open command palette"
        >
          <Search size={18} />
        </Button>
      </div>

      {/* ── Right actions ────────────────────────────────── */}
      <div className="flex items-center gap-2 shrink-0">
        <WorkspaceSwitcher />

        {/* AI Copilot button — gradient glow style */}
        <button
          type="button"
          onClick={toggleCopilot}
          id="topbar-ai-btn"
          className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl transition-all duration-200 animate-ai-glow"
          style={{
            background: 'linear-gradient(135deg, rgba(129,140,248,0.15), rgba(192,132,252,0.12))',
            border: '1px solid rgba(129,140,248,0.25)',
            color: '#C4B5FD',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(129,140,248,0.45)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(129,140,248,0.2)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(129,140,248,0.25)';
            (e.currentTarget as HTMLElement).style.boxShadow = '';
          }}
        >
          <Sparkles size={14} />
          AI Copilot
        </button>

        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="text-[10px] px-2 py-1 rounded-lg uppercase transition-colors"
          style={{
            color: 'var(--text-muted)',
            border: '1px solid var(--border-glass)',
          }}
          title="Toggle theme"
        >
          {theme === 'light' ? '☀' : theme === 'amoled' ? '◼' : '◐'}
        </button>

        <NotificationBellButton />

        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer text-white text-xs font-bold"
          style={{
            background: 'linear-gradient(135deg, #818CF8, #22D3EE)',
            boxShadow: '0 0 12px rgba(129,140,248,0.35)',
          }}
        >
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  );
}
