import { create } from 'zustand';

const STORAGE_KEY = 'autoflow-sidebar-collapsed';

function readCollapsed(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEY) === 'true';
}

export const useSidebarStore = create<{
  collapsed: boolean;
  hydrated: boolean;
  toggle: () => void;
  hydrate: () => void;
}>((set, get) => ({
  collapsed: false,
  hydrated: false,
  hydrate: () => {
    set({ collapsed: readCollapsed(), hydrated: true });
  },
  toggle: () => {
    const next = !get().collapsed;
    try {
      localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      /* ignore */
    }
    set({ collapsed: next });
  },
}));
