import { create } from 'zustand';
import { setAuthCookie, clearAuthCookie } from '../utils/auth-cookie';

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
  authReady: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setWorkspaceId: (id: string) => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  setAuthReady: (ready: boolean) => void;
  clearAuth: () => void;
}

function persistTokens(accessToken: string, refreshToken: string) {
  try {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setAuthCookie(accessToken);
  } catch {
    /* ignore */
  }
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  workspaceId: null,
  isAuthenticated: false,
  authReady: false,
  setAuth: (user, accessToken, refreshToken) => {
    persistTokens(accessToken, refreshToken);
    set({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: true,
    });
  },
  setWorkspaceId: (workspaceId) => {
    try {
      localStorage.setItem('workspaceId', workspaceId);
    } catch {
      /* ignore */
    }
    set({ workspaceId });
  },
  updateTokens: (accessToken, refreshToken) => {
    persistTokens(accessToken, refreshToken);
    set({ accessToken, refreshToken, isAuthenticated: true });
  },
  setUser: (user) => set({ user }),
  setAuthReady: (authReady) => set({ authReady }),
  clearAuth: () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('workspaceId');
      localStorage.removeItem('refreshToken');
      clearAuthCookie();
    } catch {
      /* ignore */
    }
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      workspaceId: null,
      isAuthenticated: false,
    });
  },
}));
