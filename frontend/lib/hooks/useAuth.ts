'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setWorkspaceId = useAuthStore((state) => state.setWorkspaceId);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setAuth(data.user, data.accessToken, data.refreshToken);
      
      // Workspace ID fetch and save
      const meRes = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${data.accessToken}` }
      });
      const workspaceId = meRes.data.workspaces?.[0]?.workspace?.id || meRes.data.workspaces?.[0]?.workspaceId;
      if (workspaceId) {
        localStorage.setItem('workspaceId', workspaceId);
        setWorkspaceId(workspaceId);
      }
      
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuth();
    router.push('/login');
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      setAuth(data.user, data.accessToken, data.refreshToken);
      
      const workspaceId = data.user.workspaces?.[0]?.workspace?.id || data.user.workspaces?.[0]?.workspaceId;
      if (workspaceId) {
        localStorage.setItem('workspaceId', workspaceId);
        setWorkspaceId(workspaceId);
      }
      
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      router.push('/dashboard');
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

