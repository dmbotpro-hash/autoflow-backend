import { create } from 'zustand';

interface Message {
  id: string;
  content: string;
  direction: 'inbound' | 'outbound';
  sentAt: string;
}

interface InboxStore {
  addMessage: (conversationId: string, message: Message) => void;
  updateConversationPreview: (conversationId: string, message: Message) => void;
}

export const useInboxStore = create<InboxStore>((set) => ({
  addMessage: (conversationId, message) => {
    // Basic implementation
    console.log(`Adding message to ${conversationId}:`, message);
  },
  updateConversationPreview: (conversationId, message) => {
    // Basic implementation
    console.log(`Updating preview for ${conversationId}:`, message);
  },
}));
