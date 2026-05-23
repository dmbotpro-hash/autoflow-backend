import { create } from 'zustand';
import api from '../api/auth.api';
import { useAuthStore } from './auth.store';

export interface WorkspaceItem {
  id: string;
  name: string;
  slug: string;
  plan: string;
  role: string;
  organization: { id: string; name: string } | null;
}

interface WorkspaceStore {
  workspaces: WorkspaceItem[];
  organization: { id: string; name: string; workspaceCount: number } | null;
  loading: boolean;
  loadWorkspaces: () => Promise<void>;
  switchWorkspace: (id: string) => void;
  createWorkspace: (name: string) => Promise<WorkspaceItem>;
}

export const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
  workspaces: [],
  organization: null,
  loading: false,

  loadWorkspaces: async () => {
    set({ loading: true });
    try {
      const [listRes, orgRes] = await Promise.all([
        api.get<WorkspaceItem[]>('/workspaces'),
        api.get('/workspaces/organization').catch(() => ({ data: null })),
      ]);
      const workspaces = listRes.data ?? [];
      set({ workspaces, organization: orgRes.data });

      const stored = localStorage.getItem('workspaceId');
      const valid = workspaces.find((w) => w.id === stored);
      const activeId = valid?.id ?? workspaces[0]?.id;
      if (activeId) {
        useAuthStore.getState().setWorkspaceId(activeId);
      }
    } catch {
      set({ workspaces: [] });
    } finally {
      set({ loading: false });
    }
  },

  switchWorkspace: (id) => {
    const ws = get().workspaces.find((w) => w.id === id);
    if (!ws) return;
    useAuthStore.getState().setWorkspaceId(id);
  },

  createWorkspace: async (name) => {
    const { data } = await api.post<WorkspaceItem>('/workspaces', { name });
    set((s) => ({ workspaces: [...s.workspaces, data] }));
    get().switchWorkspace(data.id);
    return data;
  },
}));
