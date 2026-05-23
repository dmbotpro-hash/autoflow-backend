export interface InboxMessage {
  id: string;
  content: string;
  direction: 'inbound' | 'outbound';
  isAiGenerated?: boolean;
  sentAt: string;
}

export interface InboxConversation {
  id: string;
  contactId: string | null;
  name: string;
  username: string;
  avatarUrl?: string;
  platform: 'instagram';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  aiActive: boolean;
  status: 'open' | 'closed';
  leadScore: number;
  notes: string;
  tags: string[];
  messages: InboxMessage[];
}

function formatTime(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return d.toLocaleDateString();
}

export function mapMessage(m: {
  id: string;
  content: string;
  direction: string;
  isAiGenerated?: boolean;
  sentAt: string | Date;
}): InboxMessage {
  return {
    id: m.id,
    content: m.content,
    direction: m.direction as 'inbound' | 'outbound',
    isAiGenerated: m.isAiGenerated,
    sentAt: formatTime(m.sentAt),
  };
}

export function mapConversationFromList(apiConv: any): InboxConversation {
  const contact = apiConv.contact;
  const last = apiConv.messages?.[0];
  const name =
    contact?.name ||
    contact?.username ||
    (contact?.instagramId ? `User ${contact.instagramId.slice(-4)}` : 'Unknown');
  const username = contact?.username || contact?.instagramId || 'unknown';

  return {
    id: apiConv.id,
    contactId: contact?.id || apiConv.contactId || null,
    name,
    username,
    avatarUrl: contact?.avatarUrl,
    platform: 'instagram',
    lastMessage: last?.content ?? 'No messages yet',
    lastMessageTime: last ? formatTime(last.sentAt) : '',
    unreadCount: 0,
    aiActive: true,
    status: (apiConv.status as 'open' | 'closed') || 'open',
    leadScore: contact?.leadScore ?? 0,
    notes: contact?.notes ?? '',
    tags: contact?.tags ?? [],
    messages: last ? [mapMessage(last)] : [],
  };
}

export function mergeConversationMessages(
  conv: InboxConversation,
  messages: any[],
): InboxConversation {
  return {
    ...conv,
    messages: messages.map(mapMessage),
    lastMessage: messages.length
      ? messages[messages.length - 1].content
      : conv.lastMessage,
    lastMessageTime: messages.length
      ? formatTime(messages[messages.length - 1].sentAt)
      : conv.lastMessageTime,
  };
}
