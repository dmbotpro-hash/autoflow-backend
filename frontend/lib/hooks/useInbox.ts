'use client';

import { useCallback, useEffect, useState } from 'react';
import api from '../api/auth.api';
import { useInboxStore } from '../store/inbox.store';
import {
  mapConversationFromList,
  mergeConversationMessages,
  type InboxConversation,
} from '../inbox/mappers';

export function useInbox() {
  const conversations = useInboxStore((s) => s.conversations);
  const setConversations = useInboxStore((s) => s.setConversations);
  const setConversationMessages = useInboxStore((s) => s.setConversationMessages);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const loadConversations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/messages/conversations');
      setConversations((res.data ?? []).map(mapConversationFromList));
    } catch {
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, [setConversations]);

  const loadMessages = useCallback(
    async (conversationId: string) => {
      try {
        const res = await api.get(`/messages/conversations/${conversationId}`);
        const conv = conversations.find((c) => c.id === conversationId);
        const base =
          conv ?? mapConversationFromList(res.data.conversation);
        const merged = mergeConversationMessages(
          base,
          res.data.messages ?? [],
        );
        setConversationMessages(conversationId, merged.messages);
      } catch (e) {
        console.error(e);
      }
    },
    [conversations, setConversationMessages],
  );

  const addMessage = useInboxStore((s) => s.addMessage);

  const sendMessage = useCallback(
    async (conversationId: string, content: string) => {
      const tempId = `optimistic-${Date.now()}`;
      const optimistic = {
        id: tempId,
        content,
        direction: 'outbound' as const,
        isAiGenerated: false,
        sentAt: new Date().toISOString(),
      };
      addMessage(conversationId, optimistic);
      setSending(true);
      try {
        await api.post(`/messages/conversations/${conversationId}/send`, {
          content,
        });
        await loadMessages(conversationId);
      } catch {
        await loadMessages(conversationId);
      } finally {
        setSending(false);
      }
    },
    [addMessage, loadMessages],
  );

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const updateLocalConv = (
    id: string,
    patch: Partial<InboxConversation>,
  ) => {
    setConversations(
      conversations.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    );
  };

  const updateContactCRM = useCallback(
    async (
      contactId: string,
      patch: { notes?: string; tags?: string[]; leadScore?: number },
    ) => {
      try {
        const res = await api.patch(`/contacts/${contactId}`, patch);
        return res.data;
      } catch (err) {
        console.error('Failed to update contact CRM', err);
        throw err;
      }
    },
    [],
  );

  return {
    conversations,
    loading,
    error,
    sending,
    loadConversations,
    loadMessages,
    sendMessage,
    updateLocalConv,
    updateContactCRM,
  };
}
