import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  workspaceId: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setWorkspaceId: (id: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  workspaceId: null,
  isAuthenticated: false,
  setAuth: (user, accessToken, refreshToken) => set({ user, accessToken, refreshToken, isAuthenticated: true }),
  setWorkspaceId: (workspaceId) => set({ workspaceId }),
  clearAuth: () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('workspaceId');
      localStorage.removeItem('refreshToken');
    } catch {}
    set({ user: null, accessToken: null, refreshToken: null, workspaceId: null, isAuthenticated: false });
  },
}));
