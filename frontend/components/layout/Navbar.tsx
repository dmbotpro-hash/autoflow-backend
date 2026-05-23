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
        'h-14 border-b border-[var(--af-border-subtle)] af-glass',
        'flex items-center justify-between px-4 gap-4 sticky top-0 z-[var(--af-z-topbar)]',
      )}
    >
      <div className="flex items-center gap-3 min-w-0 ml-8 md:ml-0">
        <h1 className="text-[var(--af-text-primary)] font-semibold text-base truncate">
          {title}
        </h1>
        {workspaceId && (
          <span className="hidden lg:inline text-[10px] text-[var(--af-text-muted)] font-mono truncate max-w-[120px]">
            ws:{workspaceId.slice(0, 8)}…
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 flex-1 max-w-md justify-end md:justify-center">
        <button
          type="button"
          onClick={() => setCommandOpen(true)}
          className="hidden sm:flex flex-1 max-w-sm items-center gap-2 h-9 px-3 rounded-xl border border-[var(--af-border-subtle)] bg-[var(--af-bg-muted)]/50 text-[var(--af-text-muted)] text-xs hover:border-violet-500/30 hover:text-[var(--af-text-secondary)] transition-colors"
        >
          <Search size={14} />
          <span className="flex-1 text-left">Search or command...</span>
          <kbd className="flex items-center gap-0.5 text-[10px] border border-[var(--af-border-subtle)] px-1.5 py-0.5 rounded bg-black/20">
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

      <div className="flex items-center gap-2 shrink-0">
        <WorkspaceSwitcher />
        <Button
          variant="ai"
          size="sm"
          className="hidden md:inline-flex animate-ai-glow"
          onClick={toggleCopilot}
          id="topbar-ai-btn"
        >
          <Sparkles size={14} />
          AI Copilot
        </Button>
        <button
          type="button"
          onClick={toggleTheme}
          className="text-[10px] text-[var(--af-text-muted)] hover:text-[var(--af-text-primary)] px-2 py-1 rounded-lg border border-[var(--af-border-subtle)] uppercase"
          title="Toggle theme"
        >
          {theme === 'light' ? '☀' : theme === 'amoled' ? '◼' : '◐'}
        </button>
        <NotificationBellButton />
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center cursor-pointer ring-2 ring-violet-500/20">
          <span className="text-white text-xs font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </span>
        </div>
      </div>
    </header>
  );
}
