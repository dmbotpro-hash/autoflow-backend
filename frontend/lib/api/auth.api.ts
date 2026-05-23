import axios, { type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/auth.store';

const api = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, ''),
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token =
      localStorage.getItem('token') ?? localStorage.getItem('accessToken');
    if (token?.trim()) {
      config.headers.Authorization = `Bearer ${token.trim()}`;
    }
    const workspaceId = localStorage.getItem('workspaceId');
    if (workspaceId?.trim()) {
      config.headers['X-Workspace-Id'] = workspaceId.trim();
    }
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return null;

  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
  const { data } = await axios.post(
    `${baseUrl}/auth/refresh`,
    { refreshToken },
  );

  useAuthStore.getState().updateTokens(data.accessToken, data.refreshToken);
  if (data.user) {
    useAuthStore.getState().setUser(data.user);
  }
  return data.accessToken as string;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status !== 401 ||
      !original ||
      original._retry ||
      original.url?.includes('/auth/login') ||
      original.url?.includes('/auth/register') ||
      original.url?.includes('/auth/refresh')
    ) {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }
      const newToken = await refreshPromise;
      if (!newToken) {
        useAuthStore.getState().clearAuth();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
      original.headers.Authorization = `Bearer ${newToken}`;
      return api(original);
    } catch (refreshError) {
      useAuthStore.getState().clearAuth();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return Promise.reject(refreshError);
    }
  },
);

export default api;
