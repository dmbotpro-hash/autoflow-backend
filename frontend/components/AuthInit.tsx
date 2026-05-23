'use client';

import { useEffect } from 'react';
import api from '@/lib/api/auth.api';
import { useAuthStore } from '@/lib/store/auth.store';
import { useWorkspaceStore } from '@/lib/store/workspace.store';
import { setAuthCookie } from '@/lib/utils/auth-cookie';

export function AuthInit({ children }: { children: React.ReactNode }) {
  const setWorkspaceId = useAuthStore((s) => s.setWorkspaceId);
  const setUser = useAuthStore((s) => s.setUser);
  const updateTokens = useAuthStore((s) => s.updateTokens);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const setAuthReady = useAuthStore((s) => s.setAuthReady);
  const authReady = useAuthStore((s) => s.authReady);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      const workspaceId = localStorage.getItem('workspaceId');

      if (!token) {
        if (!cancelled) setAuthReady(true);
        return;
      }

      setAuthCookie(token);
      updateTokens(token, refreshToken ?? '');
      if (workspaceId) setWorkspaceId(workspaceId);

      try {
        const { data } = await api.get('/users/me');
        if (cancelled) return;
        setUser({
          id: data.id,
          email: data.email,
          name: data.name,
        });
        const wsId =
          data.workspaces?.[0]?.workspace?.id ??
          data.workspaces?.[0]?.workspaceId;
        if (wsId) setWorkspaceId(wsId);
        useAuthStore.setState({ isAuthenticated: true });
        await useWorkspaceStore.getState().loadWorkspaces();
      } catch {
        if (!cancelled) clearAuth();
      } finally {
        if (!cancelled) setAuthReady(true);
      }
    }

    hydrate();
    return () => {
      cancelled = true;
    };
  }, [setWorkspaceId, setUser, updateTokens, clearAuth, setAuthReady]);

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-main)' }}>
        <div
          className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: 'rgba(129,140,248,0.3)', borderTopColor: '#818CF8' }}
        />
      </div>
    );
  }

  return <>{children}</>;
}
