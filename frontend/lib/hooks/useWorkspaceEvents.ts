'use client';

import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuthStore } from '../store/auth.store';
import { useNotificationsStore } from '../store/notifications.store';
import type { ActivityEvent } from '../types/analytics';

/** Subscribes to workspace activity_event socket for live feed + notifications */
export function useWorkspaceEvents() {
  const { workspaceId, isAuthenticated, authReady } = useAuthStore();
  const prependEvent = useNotificationsStore((s) => s.prependEvent);

  useEffect(() => {
    if (!authReady || !isAuthenticated || !workspaceId) return;

    const wsUrl = (process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001').replace(/\/$/, '');
    const socket = io(
      `${wsUrl}/inbox`,
      {
        withCredentials: true,
        transports: ['websocket', 'polling'],
      },
    );

    socket.on('connect', () => {
      socket.emit('join_workspace', { workspaceId });
    });

    socket.on('activity_event', (event: ActivityEvent) => {
      prependEvent(event);
    });

    return () => {
      socket.disconnect();
    };
  }, [authReady, isAuthenticated, workspaceId, prependEvent]);
}
