import { create } from 'zustand';
import type { InboxConversation, InboxMessage } from '../inbox/mappers';
import { mapMessage } from '../inbox/mappers';

interface InboxStore {
  conversations: InboxConversation[];
  setConversations: (conversations: InboxConversation[]) => void;
  upsertConversation: (conversation: InboxConversation) => void;
  setConversationMessages: (
    conversationId: string,
    messages: InboxMessage[],
  ) => void;
  addMessage: (conversationId: string, message: InboxMessage) => void;
  updateConversationPreview: (
    conversationId: string,
    message: InboxMessage,
  ) => void;

  // AI typing indicator — which conversation has AI composing
  aiTypingConvId: string | null;
  setAiTypingConvId: (id: string | null) => void;

  // Standard contact/user typing indicator map (conversationId -> isTyping)
  typingConvs: Record<string, boolean>;
  setTyping: (conversationId: string, isTyping: boolean) => void;

  // Smart reply chips for the active conversation
  smartReplies: string[];
  setSmartReplies: (replies: string[]) => void;
  clearSmartReplies: () => void;
}

export const useInboxStore = create<InboxStore>((set, get) => ({
  conversations: [],
  aiTypingConvId: null,
  typingConvs: {},
  smartReplies: [],

  setConversations: (conversations) => set({ conversations }),

  upsertConversation: (conversation) =>
    set((state) => {
      const idx = state.conversations.findIndex((c) => c.id === conversation.id);
      if (idx === -1) {
        return { conversations: [conversation, ...state.conversations] };
      }
      const next = [...state.conversations];
      next[idx] = { ...next[idx], ...conversation };
      return { conversations: next };
    }),

  setConversationMessages: (conversationId, messages) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              messages,
              lastMessage: messages.length
                ? messages[messages.length - 1].content
                : c.lastMessage,
              lastMessageTime: messages.length
                ? messages[messages.length - 1].sentAt
                : c.lastMessageTime,
            }
          : c,
      ),
    })),

  addMessage: (conversationId, message) => {
    const mapped =
      message.sentAt && message.content
        ? message
        : mapMessage(message as any);

    set((state) => ({
      conversations: state.conversations.map((c) => {
        if (c.id !== conversationId) return c;
        if (c.messages.some((m) => m.id === mapped.id)) return c;
        return {
          ...c,
          messages: [...c.messages, mapped],
          lastMessage: mapped.content,
          lastMessageTime: mapped.sentAt,
          unreadCount:
            mapped.direction === 'inbound' ? c.unreadCount + 1 : c.unreadCount,
        };
      }),
    }));
  },

  updateConversationPreview: (conversationId, message) => {
    const mapped = mapMessage(message as any);
    const state = get();
    const exists = state.conversations.some((c) => c.id === conversationId);
    if (!exists) return;
    get().addMessage(conversationId, mapped);
  },

  setTyping: (conversationId, isTyping) =>
    set((state) => ({
      typingConvs: {
        ...state.typingConvs,
        [conversationId]: isTyping,
      },
    })),

  setAiTypingConvId: (id) => set({ aiTypingConvId: id }),

  setSmartReplies: (replies) => set({ smartReplies: replies }),
  clearSmartReplies: () => set({ smartReplies: [] }),
}));
