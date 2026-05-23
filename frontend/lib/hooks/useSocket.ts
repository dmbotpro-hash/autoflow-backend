'use client';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/auth.store';
import { useInboxStore } from '../store/inbox.store';
import { mapMessage } from '../inbox/mappers';

export function useSocket(activeConversationId?: string | null) {
  const socketRef = useRef<Socket | null>(null);
  const { isAuthenticated, workspaceId, authReady } = useAuthStore();
  const addMessage = useInboxStore((s) => s.addMessage);
  const updateConversationPreview = useInboxStore((s) => s.updateConversationPreview);
  const setTyping = useInboxStore((s) => s.setTyping);
  const setAiTypingConvId = useInboxStore((s) => s.setAiTypingConvId);

  useEffect(() => {
    if (!authReady || !isAuthenticated || !workspaceId) return;

    const wsUrl = (process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001').replace(/\/$/, '');
    const socket = io(
      `${wsUrl}/inbox`,
      {
        withCredentials: true,
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      },
    );
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join_workspace', { workspaceId });
    });

    socket.on('new_message', ({ conversationId, message }) => {
      const mapped = mapMessage({
        id: message.id,
        content: message.content,
        direction: message.direction,
        isAiGenerated: message.isAiGenerated,
        sentAt: message.sentAt ?? new Date().toISOString(),
      });
      addMessage(conversationId, mapped);
      updateConversationPreview(conversationId, mapped);
    });

    socket.on('typing', ({ conversationId, isTyping }) => {
      setTyping(conversationId, isTyping);
    });

    socket.on('ai_typing', ({ conversationId, isTyping }) => {
      setAiTypingConvId(isTyping ? conversationId : null);
    });

    return () => {
      socket.disconnect();
    };
  }, [
    authReady,
    isAuthenticated,
    workspaceId,
    addMessage,
    updateConversationPreview,
    setTyping,
    setAiTypingConvId,
  ]);

  useEffect(() => {
    if (!activeConversationId || !socketRef.current?.connected) return;
    socketRef.current.emit('join_conversation', {
      conversationId: activeConversationId,
    });
  }, [activeConversationId]);

  const joinConversation = (conversationId: string) => {
    socketRef.current?.emit('join_conversation', { conversationId });
  };

  const emitTyping = (conversationId: string, isTyping: boolean) => {
    socketRef.current?.emit('typing', { conversationId, isTyping });
  };

  return { joinConversation, emitTyping };
}
