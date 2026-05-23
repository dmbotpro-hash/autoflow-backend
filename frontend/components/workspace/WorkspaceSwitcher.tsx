'use client';

import { useState } from 'react';
import { Building2, Check, ChevronDown, Plus } from 'lucide-react';
import { useWorkspaceStore } from '@/lib/store/workspace.store';
import { cn } from '@/lib/utils/cn';

export function WorkspaceSwitcher() {
  const { workspaces, loading, switchWorkspace, createWorkspace } = useWorkspaceStore();
  const workspaceId = typeof window !== 'undefined' ? localStorage.getItem('workspaceId') : null;
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');

  const active = workspaces.find((w) => w.id === workspaceId) ?? workspaces[0];

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      await createWorkspace(newName.trim());
      setNewName('');
      setOpen(false);
    } finally {
      setCreating(false);
    }
  };

  if (loading && workspaces.length === 0) {
    return (
      <span className="text-[10px] text-[var(--af-text-muted)] hidden lg:inline">
        Loading…
      </span>
    );
  }

  if (!active) return null;

  return (
    <div className="relative hidden md:block">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 h-9 px-3 rounded-xl border border-[var(--af-border-subtle)] bg-black/20 hover:border-violet-500/30 text-xs max-w-[200px]"
      >
        <Building2 size={14} className="text-violet-400 shrink-0" />
        <span className="truncate text-[var(--af-text-primary)] font-medium">
          {active.name}
        </span>
        <ChevronDown size={12} className="text-[var(--af-text-muted)] shrink-0" />
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[100]"
            onClick={() => setOpen(false)}
            aria-label="Close"
          />
          <div className="absolute right-0 top-full mt-2 w-72 af-glass border border-[var(--af-border-subtle)] rounded-xl shadow-xl z-[101] overflow-hidden">
            <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[var(--af-text-muted)]">
              Workspaces
            </p>
            <ul className="max-h-48 overflow-y-auto">
              {workspaces.map((w) => (
                <li key={w.id}>
                  <button
                    type="button"
                    onClick={() => {
                      switchWorkspace(w.id);
                      setOpen(false);
                      window.location.reload();
                    }}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2.5 text-left text-xs hover:bg-white/5',
                      w.id === active.id && 'bg-violet-500/10',
                    )}
                  >
                    <span className="flex-1 truncate text-[var(--af-text-primary)]">
                      {w.name}
                    </span>
                    <span className="text-[10px] text-[var(--af-text-muted)] capitalize">
                      {w.role}
                    </span>
                    {w.id === active.id && (
                      <Check size={12} className="text-violet-400" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
            <div className="p-2 border-t border-[var(--af-border-subtle)]">
              <div className="flex gap-2">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="New client workspace"
                  className="flex-1 h-8 px-2 rounded-lg bg-black/30 border border-[var(--af-border-subtle)] text-xs focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={creating || !newName.trim()}
                  className="h-8 px-2 rounded-lg bg-violet-600 text-white disabled:opacity-50"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
