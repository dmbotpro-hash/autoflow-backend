'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';
import { setAuthCookie } from '../utils/auth-cookie';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setWorkspaceId = useAuthStore((state) => state.setWorkspaceId);

  const applySession = async (
    data: { user: { id: string; email: string; name: string }; accessToken: string; refreshToken: string },
  ) => {
    setAuth(data.user, data.accessToken, data.refreshToken);
    setAuthCookie(data.accessToken);

    try {
      const meRes = await api.get('/users/me');
      const workspaceId =
        meRes.data.workspaces?.[0]?.workspace?.id ??
        meRes.data.workspaces?.[0]?.workspaceId;
      if (workspaceId) setWorkspaceId(workspaceId);
    } catch {
      /* workspace optional on first load */
    }
  };

  const resolvePostAuthRoute = async () => {
    try {
      const res = await api.get('/settings');
      if (!res.data?.onboardingComplete) return '/onboarding';
    } catch {
      return '/onboarding';
    }
    return '/dashboard';
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      await applySession(data);
      router.push(await resolvePostAuthRoute());
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch {
      /* proceed with local clear */
    }
    clearAuth();
    router.push('/login');
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      await applySession(data);
      router.push('/onboarding');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const user = useAuthStore((state) => state.user);

  return {
    user,
    login,
    register,
    logout,
    isLoading,
    error,
  };
}
