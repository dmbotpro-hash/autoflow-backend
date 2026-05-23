import api from './auth.api';

export async function fetchConversationSummary(
  conversationId: string,
): Promise<string> {
  const res = await api.post('/ai/summary', { conversationId });
  return res.data?.summary ?? 'No summary available.';
}

export async function fetchSmartReplies(
  conversationId: string,
): Promise<string[]> {
  const res = await api.post('/ai/smart-replies', { conversationId });
  return res.data?.replies ?? [];
}
