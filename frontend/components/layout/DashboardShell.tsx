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
    <div
      className="flex min-h-screen text-[var(--text-primary)]"
      style={{ background: 'var(--bg-main)' }}
    >
      <SkipToContent />
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen min-w-0 overflow-x-hidden relative">
        {/* Ambient depth blobs — Gemini palette */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden
        >
          <div className="absolute -top-40 right-0 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(129,140,248,0.06)' }} />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full blur-3xl" style={{ background: 'rgba(34,211,238,0.03)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[120px]" style={{ background: 'rgba(192,132,252,0.03)' }} />
        </div>
        <Navbar />
        <main id="main-content" className="flex-1 relative z-0 mobile-main-pad min-w-0 overflow-x-hidden" tabIndex={-1}>
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
