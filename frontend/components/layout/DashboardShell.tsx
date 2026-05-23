'use client';

import { type ReactNode, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { CommandPalette } from '@/components/command/CommandPalette';
import { AiCopilotPanel, AiCopilotTrigger } from '@/components/ai/AiCopilotPanel';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { useAiCopilotStore } from '@/lib/store/aiCopilot.store';
import { useWorkspaceEvents } from '@/lib/hooks/useWorkspaceEvents';
import { useWorkspaceStore } from '@/lib/store/workspace.store';
import { SkipToContent } from '@/components/a11y/SkipToContent';
import { MobileBottomNav } from '@/components/mobile/MobileBottomNav';
import { MobileFAB } from '@/components/mobile/MobileFAB';

export function DashboardShell({ children }: { children: ReactNode }) {
  const toggleCopilot = useAiCopilotStore((s) => s.toggleOpen);
  useWorkspaceEvents();
  const loadWorkspaces = useWorkspaceStore((s) => s.loadWorkspaces);

  useEffect(() => {
    loadWorkspaces();
  }, [loadWorkspaces]);

  // ⌘⇧K / Ctrl+Shift+K opens AI copilot (⌘K is command palette search)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggleCopilot();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleCopilot]);

  return (
    <div className="flex min-h-screen af-ambient-bg text-[var(--af-text-primary)]">
      <SkipToContent />
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen min-w-0 overflow-x-hidden relative">
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden
        >
          <div className="absolute -top-40 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl" />
        </div>
        <Navbar />
        <main id="main-content" className="flex-1 relative z-0 mobile-main-pad" tabIndex={-1}>
          {children}
        </main>
      </div>
      <CommandPalette />
      <NotificationCenter />
      <MobileBottomNav />
      <MobileFAB />
      <AiCopilotPanel />
      <AiCopilotTrigger className="hidden md:flex" />
    </div>
  );
}
