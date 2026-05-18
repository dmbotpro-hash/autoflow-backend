'use client';
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/auth.store';
import { useInboxStore } from '../store/inbox.store';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const { isAuthenticated, workspaceId } = useAuthStore();
  const { addMessage, updateConversationPreview } = useInboxStore();

  useEffect(() => {
    if (!isAuthenticated || !workspaceId) return;

    const socket = io(
      `${process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001'}/inbox`,
      {
        withCredentials: true,
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      }
    );
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      socket.emit('join_workspace', { workspaceId });
    });

    socket.on('new_message', ({ conversationId, message }) => {
      addMessage(conversationId, message);
      updateConversationPreview(conversationId, message);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated, workspaceId]);

  const joinConversation = (conversationId: string) => {
    socketRef.current?.emit('join_conversation', { conversationId });
  };

  const emitTyping = (conversationId: string, isTyping: boolean) => {
    socketRef.current?.emit('typing', { conversationId, isTyping });
  };

  return { joinConversation, emitTyping };
}
