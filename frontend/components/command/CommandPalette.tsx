'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  LayoutDashboard,
  Inbox,
  Workflow,
  Users,
  Settings,
  CreditCard,
  BarChart3,
  Sparkles,
  Plus,
  Moon,
  Sun,
  MessageCircle,
  Loader2,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useTheme } from '@/components/theme/ThemeProvider';
import { useCommandStore } from '@/lib/store/command.store';
import { useGlobalSearch, matchNlCommand } from '@/lib/hooks/useGlobalSearch';
import type { SearchResultItem } from '@/lib/hooks/useGlobalSearch';
import { useAiCopilotStore } from '@/lib/store/aiCopilot.store';

interface CommandItem {
  id: string;
  label: string;
  hint?: string;
  icon: React.ReactNode;
  action: () => void;
  group: 'Navigation' | 'Actions' | 'AI' | 'System' | 'Search' | 'Smart';
}

export function CommandPalette() {
  const open = useCommandStore((s) => s.open);
  const setOpen = useCommandStore((s) => s.setOpen);
  const toggle = useCommandStore((s) => s.toggle);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const { toggleTheme, theme } = useTheme();
  const openCopilot = useAiCopilotStore((s) => s.setOpen);
  const { results, loading: searchLoading } = useGlobalSearch(query, open);

  const items: CommandItem[] = useMemo(() => {
    const go = (path: string) => {
      router.push(path);
      setOpen(false);
      setQuery('');
    };
    const goSearch = (item: SearchResultItem) => {
      router.push(item.href);
      setOpen(false);
      setQuery('');
    };

    const base: CommandItem[] = [
      { id: 'dash', label: 'Dashboard', icon: <LayoutDashboard size={16} />, action: () => go('/dashboard'), group: 'Navigation' },
      { id: 'inbox', label: 'Inbox', icon: <Inbox size={16} />, action: () => go('/inbox'), group: 'Navigation' },
      { id: 'wf', label: 'Workflows', icon: <Workflow size={16} />, action: () => go('/workflows'), group: 'Navigation' },
      { id: 'contacts', label: 'Contacts', icon: <Users size={16} />, action: () => go('/contacts'), group: 'Navigation' },
      { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={16} />, action: () => go('/analytics'), group: 'Navigation' },
      { id: 'settings', label: 'Settings', icon: <Settings size={16} />, action: () => go('/settings'), group: 'Navigation' },
      { id: 'billing', label: 'Billing', icon: <CreditCard size={16} />, action: () => go('/billing'), group: 'Navigation' },
      { id: 'team', label: 'Team', icon: <Users size={16} />, action: () => go('/team'), group: 'Navigation' },
      { id: 'security', label: 'Security', icon: <Sparkles size={16} />, action: () => go('/security'), group: 'Navigation' },
      { id: 'templates', label: 'Templates', icon: <Sparkles size={16} />, action: () => go('/templates'), group: 'Navigation' },
      { id: 'onboard', label: 'Setup wizard', icon: <Sparkles size={16} />, action: () => go('/onboarding'), group: 'Navigation' },
      {
        id: 'new-wf',
        label: 'Create new workflow',
        hint: 'Workflows',
        icon: <Plus size={16} />,
        action: () => go('/workflows'),
        group: 'Actions',
      },
      {
        id: 'ai-copilot',
        label: 'Open AI Copilot',
        hint: '⌘⇧K',
        icon: <Sparkles size={16} />,
        action: () => {
          setOpen(false);
          openCopilot(true);
        },
        group: 'AI',
      },
      {
        id: 'ai',
        label: 'AI settings',
        icon: <Sparkles size={16} />,
        action: () => go('/settings'),
        group: 'AI',
      },
      {
        id: 'theme',
        label: `Toggle theme (${theme})`,
        icon: theme === 'light' ? <Moon size={16} /> : <Sun size={16} />,
        action: () => {
          toggleTheme();
          setOpen(false);
        },
        group: 'System',
      },
    ];

    const nl = matchNlCommand(query);
    if (nl) {
      base.unshift({
        id: 'nl',
        label: nl.label,
        hint: 'Natural language',
        icon: <Sparkles size={16} />,
        action: () => go(nl.href),
        group: 'Smart',
      });
    }

    const searchItems: CommandItem[] = [];
    if (query.trim().length >= 2) {
      results.contacts.forEach((c) => {
        searchItems.push({
          id: `c-${c.id}`,
          label: c.label,
          hint: c.sublabel,
          icon: <Users size={16} />,
          action: () => goSearch(c),
          group: 'Search',
        });
      });
      results.workflows.forEach((w) => {
        searchItems.push({
          id: `w-${w.id}`,
          label: w.label,
          hint: w.sublabel,
          icon: <Zap size={16} />,
          action: () => goSearch(w),
          group: 'Search',
        });
      });
      results.conversations.forEach((c) => {
        searchItems.push({
          id: `cv-${c.id}`,
          label: c.label,
          hint: c.sublabel,
          icon: <MessageCircle size={16} />,
          action: () => goSearch(c),
          group: 'Search',
        });
      });
    }

    return [...searchItems, ...base];
  }, [router, setOpen, theme, toggleTheme, query, results, openCopilot]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 2) return items;
    return items.filter(
      (i) =>
        i.group === 'Search' ||
        i.group === 'Smart' ||
        i.label.toLowerCase().includes(q) ||
        i.hint?.toLowerCase().includes(q) ||
        i.group.toLowerCase().includes(q),
    );
  }, [items, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k' && !e.shiftKey) {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [toggle]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === 'Enter' && filtered[activeIndex]) {
        e.preventDefault();
        filtered[activeIndex].action();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, filtered, activeIndex, setOpen]);

  if (!open) return null;

  const groups = ['Smart', 'Search', 'Navigation', 'Actions', 'AI', 'System'] as const;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-start justify-center pt-[12vh] px-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
        aria-label="Close"
      />
      <div className="relative w-full max-w-lg af-glass af-glow-border rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 border-b border-[var(--af-border-subtle)]">
          <Search className="text-[var(--af-text-muted)] shrink-0" size={18} />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search contacts, workflows, or type “open inbox”..."
            className="flex-1 h-12 bg-transparent text-sm text-[var(--af-text-primary)] placeholder:text-[var(--af-text-muted)] focus:outline-none"
          />
          {searchLoading && <Loader2 size={14} className="animate-spin text-violet-400" />}
          <kbd className="hidden sm:inline text-[10px] text-[var(--af-text-muted)] border border-[var(--af-border-subtle)] px-1.5 py-0.5 rounded">
            ESC
          </kbd>
        </div>
        <div className="max-h-80 overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-[var(--af-text-muted)]">
              No results — try “open inbox” or search a contact name
            </p>
          ) : (
            groups.map((group) => {
              const groupItems = filtered.filter((i) => i.group === group);
              if (!groupItems.length) return null;
              return (
                <div key={group} className="px-2 py-1">
                  <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--af-text-muted)]">
                    {group}
                  </p>
                  {groupItems.map((item) => {
                    const idx = filtered.indexOf(item);
                    const isActive = idx === activeIndex;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={item.action}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition-colors',
                          isActive
                            ? 'bg-violet-500/15 text-[var(--af-text-primary)]'
                            : 'text-[var(--af-text-secondary)] hover:bg-white/5',
                        )}
                      >
                        <span className="text-violet-400">{item.icon}</span>
                        <span className="flex-1 font-medium">{item.label}</span>
                        {item.hint && (
                          <span className="text-[10px] text-[var(--af-text-muted)]">
                            {item.hint}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>
        <div className="px-4 py-2 border-t border-[var(--af-border-subtle)] text-[10px] text-[var(--af-text-muted)] flex flex-wrap gap-4">
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>⌘K search</span>
          <span>⌘⇧K AI</span>
        </div>
      </div>
    </div>
  );
}
