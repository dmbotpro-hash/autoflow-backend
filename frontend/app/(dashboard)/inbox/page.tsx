'use client';

import { useState, useEffect, useRef, type FormEvent } from 'react';
import {
  Search,
  Send,
  Instagram,
  Sparkles,
  Sliders,
  MessageCircle,
  Plus,
  X,
  Star,
  TrendingUp,
  FileText,
  ArrowLeft,
  Paperclip,
  Check,
  Loader2,
  ChevronRight,
  Trash2
} from 'lucide-react';
import { useInbox } from '@/lib/hooks/useInbox';
import { useSocket } from '@/lib/hooks/useSocket';
import { useInboxStore } from '@/lib/store/inbox.store';
import { fetchConversationSummary, fetchSmartReplies } from '@/lib/api/ai.api';
import api from '@/lib/api/auth.api';
import type { InboxConversation } from '@/lib/inbox/mappers';
import { EmptyState } from '@/components/empty/EmptyState';
import { VirtualList } from '@/components/ui/VirtualList';
import { useSwipeBack } from '@/lib/hooks/useSwipeBack';

export default function InboxPage() {
  const {
    conversations,
    loading,
    error,
    sending,
    loadMessages,
    sendMessage,
    updateLocalConv,
    updateContactCRM,
  } = useInbox();

  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newTagInput, setNewTagInput] = useState('');
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

  useSwipeBack(mobileView === 'chat', () => setMobileView('list'));
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const notesTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Socket Connection and Emitters
  const { emitTyping } = useSocket(selectedConvId);

  // Zustand Store Selectors
  const aiTypingConvId = useInboxStore((s) => s.aiTypingConvId);
  const typingConvs = useInboxStore((s) => s.typingConvs);
  const smartReplies = useInboxStore((s) => s.smartReplies);
  const setSmartReplies = useInboxStore((s) => s.setSmartReplies);

  // AI Summary State
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  // CRM Autosave feedback state
  const [crmSaving, setCrmSaving] = useState(false);

  // File Attachment State (mocked upload)
  const [attachments, setAttachments] = useState<Array<{ name: string; size: number; type: string }>>([]);

  // Auto-select first conversation
  useEffect(() => {
    if (conversations.length && !selectedConvId) {
      setSelectedConvId(conversations[0].id);
    }
  }, [conversations, selectedConvId]);

  // Load message thread
  useEffect(() => {
    if (selectedConvId) loadMessages(selectedConvId);
  }, [selectedConvId, loadMessages]);

  const selectedConv =
    conversations.find((c) => c.id === selectedConvId) ?? conversations[0];

  // Auto scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConv?.messages, aiTypingConvId, typingConvs]);

  // Load smart replies & reset summary on conversation change
  useEffect(() => {
    setAiSummary(null);
    if (!selectedConvId) return;

    let isCurrent = true;
    const loadReplies = async () => {
      try {
        const replies = await fetchSmartReplies(selectedConvId);
        if (isCurrent) {
          setSmartReplies(replies);
        }
      } catch (err) {
        console.error('Error fetching smart replies:', err);
      }
    };

    loadReplies();
    return () => {
      isCurrent = false;
    };
  }, [selectedConvId, setSmartReplies]);

  // Composer typing signal
  const handleInputChange = (val: string) => {
    setInputText(val);
    if (!selectedConv) return;

    // Send typing true to socket
    emitTyping(selectedConv.id, true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to clear typing state after 2.5s of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      emitTyping(selectedConv.id, false);
    }, 2500);
  };

  const handleSendMessage = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() && attachments.length === 0) return;
    if (!selectedConv) return;

    const text = inputText.trim() || `Sent ${attachments.length} attachment(s)`;
    setInputText('');
    setAttachments([]);

    // Clear typing timeout and emit false
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    emitTyping(selectedConv.id, false);

    try {
      await sendMessage(selectedConv.id, text);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectConversation = (id: string) => {
    setSelectedConvId(id);
    setMobileView('chat');
  };

  const filteredConversations = conversations.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.username.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const patchSelected = (patch: Partial<InboxConversation>) => {
    if (!selectedConv) return;
    updateLocalConv(selectedConv.id, patch);
  };

  // Persist CRM fields helper
  const persistCRMDetails = async (fieldPatch: { notes?: string; tags?: string[]; leadScore?: number }) => {
    if (!selectedConv || !selectedConv.contactId) return;
    setCrmSaving(true);
    try {
      await updateContactCRM(selectedConv.contactId, fieldPatch);
    } catch (err) {
      console.error('Error persisting contact CRM details:', err);
    } finally {
      setTimeout(() => setCrmSaving(false), 800);
    }
  };

  // Notes changes with local updates + debounced saving
  const handleNotesChange = (val: string) => {
    patchSelected({ notes: val });

    if (notesTimeoutRef.current) {
      clearTimeout(notesTimeoutRef.current);
    }

    notesTimeoutRef.current = setTimeout(() => {
      persistCRMDetails({ notes: val });
    }, 1500);
  };

  // Save notes immediately when focus leaves the textarea
  const handleNotesBlur = () => {
    if (notesTimeoutRef.current) {
      clearTimeout(notesTimeoutRef.current);
    }
    if (selectedConv) {
      persistCRMDetails({ notes: selectedConv.notes });
    }
  };

  // Instant save tags
  const handleAddTag = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTagInput.trim() || !selectedConv) return;
    const newTag = newTagInput.trim();
    if (selectedConv.tags.includes(newTag)) return;

    const updatedTags = [...selectedConv.tags, newTag];
    patchSelected({ tags: updatedTags });
    setNewTagInput('');

    await persistCRMDetails({ tags: updatedTags });
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    if (!selectedConv) return;
    const updatedTags = selectedConv.tags.filter((t) => t !== tagToRemove);
    patchSelected({ tags: updatedTags });

    await persistCRMDetails({ tags: updatedTags });
  };

  // Lead Score change
  const handleLeadScoreChange = async (score: number) => {
    if (!selectedConv) return;
    const val = Math.max(0, Math.min(100, score));
    patchSelected({ leadScore: val });
    await persistCRMDetails({ leadScore: val });
  };

  // Generate AI summary
  const handleGenerateSummary = async () => {
    if (!selectedConv) return;
    setLoadingSummary(true);
    try {
      const summary = await fetchConversationSummary(selectedConv.id);
      setAiSummary(summary);
    } catch (err) {
      console.error('Failed to generate summary:', err);
      setAiSummary('Failed to compile summary. Ensure OpenAI keys are valid.');
    } finally {
      setLoadingSummary(false);
    }
  };

  if (loading && conversations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center premium-dot-grid" style={{ background: 'var(--bg-main)' }}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#818CF8' }} />
          <span className="text-xs font-light" style={{ color: 'var(--text-muted)' }}>Loading inbox workspace...</span>
        </div>
      </div>
    );
  }

  if (!loading && conversations.length === 0) {
    return (
      <div className="min-h-screen flex flex-col font-sans premium-dot-grid premium-radial-glow items-center justify-center p-6" style={{ background: 'var(--bg-main)', color: 'var(--text-primary)' }}>
        <div className="max-w-lg w-full">
          <EmptyState
            icon={<Instagram className="text-pink-400" size={32} />}
            title="No conversations yet"
            description="Connect Instagram to receive DMs, or start with a comment-to-DM workflow template."
            primaryAction={{ label: 'Connect Instagram', href: '/settings' }}
            secondaryAction={{ label: 'Comment → DM template', href: '/workflows?template=comment-dm' }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col overflow-hidden font-sans" style={{ background: 'var(--bg-main)', color: 'var(--text-primary)' }}>
      {/* Header Panel */}
      <div className="backdrop-blur-md border-b px-6 py-4 flex justify-between items-center shrink-0" style={{ background: 'rgba(8,8,15,0.90)', borderColor: 'var(--border-glass)' }}>
        <div>
          <h1 className="text-sm font-bold flex items-center gap-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>
            <MessageCircle size={16} style={{ color: '#818CF8' }} />
            Live Inbox & Team Workspace
          </h1>
          <p className="text-[10px] mt-0.5 font-light" style={{ color: 'var(--text-muted)' }}>
            Realtime updates active — Synced with backend API & WebSockets
          </p>
        </div>
        <div className="flex items-center gap-3">
          {crmSaving && (
            <span className="text-[10px] flex items-center gap-1.5 px-2.5 py-1 rounded-full animate-pulse" style={{ color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)' }}>
              <Loader2 size={10} className="animate-spin" /> Autosaving...
            </span>
          )}
          <div
            className="flex items-center gap-2 rounded-full px-3 py-1.5"
            style={{ background: 'var(--alert-success-bg)', border: '1px solid var(--alert-success-border)' }}
          >
            <div className="w-1.5 h-1.5 bg-[#34D399] rounded-full animate-pulse" />
            <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: '#34D399' }}>Live Socket</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Conversations List */}
        <div
          className={`${mobileView === 'list' ? 'flex' : 'hidden'} md:flex w-full md:w-80 flex-shrink-0 border-r flex-col h-full`}
          style={{ background: 'var(--bg-sidebar)', borderColor: 'var(--border-glass)' }}
        >
          {/* Search bar */}
          <div className="p-4 border-b" style={{ borderColor: 'var(--border-glass)' }}>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-[#606060]" size={13} />
              <input
                type="search"
                placeholder="Filter chats by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Filter conversations by name"
                className="w-full rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-glass)', color: 'var(--text-primary)' }}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--border-glow)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-glass)')}
              />
            </div>
          </div>

          {/* Conversation list — virtualized when many rows */}
          <div className="flex-1 min-h-0">
            {filteredConversations.length > 20 ? (
              <VirtualList
                items={filteredConversations}
                height="100%"
                itemHeight={88}
                className="divide-y divide-[rgba(255,255,255,0.03)]"
                getKey={(c) => c.id}
                renderItem={(conv) => {
                  const isSelected = selectedConv && conv.id === selectedConv.id;
                  const hasAiActive = conv.aiActive;
                  const isUserTyping = typingConvs[conv.id];
                  return (
                    <div
                      onClick={() => handleSelectConversation(conv.id)}
                      className={`h-full px-4 py-3 cursor-pointer flex items-start gap-3 relative group transition-colors ${
                        isSelected
                          ? 'border-l-2 border-[#818CF8]'
                          : ''
                      }`}
                      style={isSelected ? { background: 'rgba(129,140,248,0.06)' } : undefined}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(129,140,248,0.04)'; }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold uppercase shrink-0 text-white"
                        style={{ background: 'linear-gradient(135deg, #818CF8, #22D3EE)' }}
                      >
                        {conv.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold truncate text-[#E0E0E0]">{conv.name}</h4>
                        <p className="text-[9px] text-[#A0A0A0] truncate">@{conv.username}</p>
                        <p className="text-[10px] text-[#707070] truncate mt-0.5">
                          {isUserTyping ? 'Typing…' : conv.lastMessage || 'No messages'}
                        </p>
                      </div>
                      {hasAiActive && (
                        <Sparkles size={12} className="text-purple-400 shrink-0" aria-hidden />
                      )}
                    </div>
                  );
                }}
              />
            ) : (
          <div className="h-full overflow-y-auto divide-y divide-[rgba(255,255,255,0.03)]">
            {filteredConversations.map((conv) => {
              const isSelected = selectedConv && conv.id === selectedConv.id;
              const hasAiActive = conv.aiActive;
              const isUserTyping = typingConvs[conv.id];

              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`p-4 cursor-pointer flex items-start gap-3 relative group transition-colors ${
                    isSelected
                      ? 'border-l-2 border-[#818CF8]'
                      : ''
                  }`}
                  style={isSelected ? { background: 'rgba(129,140,248,0.06)' } : undefined}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(129,140,248,0.04)'; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                >
                  {/* Quick Actions (Hover Over Row) */}
                  <div
                    className="absolute right-3 top-3 hidden group-hover:flex items-center gap-1.5 backdrop-blur shadow-xl rounded-lg p-1 transition-all duration-150 z-20"
                    style={{ background: 'rgba(8,8,15,0.90)', border: '1px solid var(--border-glass)' }}
                  >
                    <button
                      type="button"
                      title={conv.status === 'open' ? 'Resolve/Close Conversation' : 'Re-open Conversation'}
                      onClick={async (e) => {
                        e.stopPropagation();
                        const nextStatus = conv.status === 'open' ? 'closed' : 'open';
                        updateLocalConv(conv.id, { status: nextStatus });
                        try {
                          await api.patch(`/messages/conversations/${conv.id}/status`, { status: nextStatus });
                        } catch (err) {
                          console.error('Failed to change conversation status:', err);
                        }
                      }}
                      className={`p-1.5 rounded hover:bg-[#1C1C24] transition-colors ${
                        conv.status === 'open' ? 'text-[#606060] hover:text-emerald-400' : 'text-emerald-400'
                      }`}
                    >
                      <Check size={11} />
                    </button>
                    <button
                      type="button"
                      title={hasAiActive ? 'Deactivate AI Assist' : 'Activate AI Assist'}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateLocalConv(conv.id, { aiActive: !conv.aiActive });
                      }}
                      className={`p-1.5 rounded hover:bg-[#1C1C24] transition-colors ${
                        hasAiActive ? 'text-purple-400 animate-pulse' : 'text-[#606060] hover:text-purple-400'
                      }`}
                    >
                      <Sparkles size={11} />
                    </button>
                  </div>

                  {/* Avatar */}
                  <div className="relative">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold uppercase shadow-md select-none text-white"
                      style={{ background: 'linear-gradient(135deg, #818CF8, #22D3EE)' }}
                    >
                      {conv.name.charAt(0)}
                    </div>
                    {hasAiActive && (
                      <div className="absolute -bottom-1 -right-1 bg-purple-600 border border-black rounded-full p-0.5 shadow-md">
                        <Sparkles size={8} className="text-white" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className="text-xs font-semibold truncate text-[#E0E0E0]">{conv.name}</h4>
                      {conv.lastMessageTime && (
                        <span className="text-[9px] text-[#505050] whitespace-nowrap shrink-0">{conv.lastMessageTime}</span>
                      )}
                    </div>
                    <p className="text-[9px] text-[#A0A0A0] font-light truncate mb-1">@{conv.username}</p>
                    
                    {/* Dynamic Message Preview / Typing Pulse */}
                    {isUserTyping ? (
                      <p className="text-[10px] text-emerald-400 italic font-semibold flex items-center gap-1">
                        typing <span className="typing-dot bg-emerald-400" /><span className="typing-dot bg-emerald-400" /><span className="typing-dot bg-emerald-400" />
                      </p>
                    ) : (
                      <p className="text-[10px] text-[#606060] truncate font-light">
                        {conv.lastMessage}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
            {filteredConversations.length === 0 && (
              <div className="p-8 text-center text-[#606060] text-xs font-light">
                No chats found for filter.
              </div>
            )}
          </div>
            )}
          </div>
        </div>

        {/* Selected Chat Room */}
        <div
          className={`${mobileView === 'chat' ? 'flex' : 'hidden'} md:flex flex-1 flex-col min-w-0`}
          style={{ background: 'var(--bg-main)' }}
        >
          {/* Active Chat Header */}
          <div className="backdrop-blur-sm border-b px-6 py-3.5 flex justify-between items-center" style={{ background: 'rgba(8,8,15,0.80)', borderColor: 'var(--border-glass)' }}>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="md:hidden text-gray-400 hover:text-white p-1 rounded-lg"
                onClick={() => setMobileView('list')}
                aria-label="Back to conversation list"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h3 className="text-xs font-semibold flex items-center gap-1.5">
                  {selectedConv.name}
                  {selectedConv.status === 'closed' && (
                    <span className="text-[8px] font-bold bg-white/10 text-gray-400 border border-white/20 rounded-full px-2 py-0.5 uppercase tracking-widest">
                      Resolved
                    </span>
                  )}
                </h3>
                <p className="text-[9px] text-[#A0A0A0] font-light">@{selectedConv.username}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => patchSelected({ aiActive: !selectedConv.aiActive })}
              className={`text-[10px] flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-300 ${
                selectedConv.aiActive ? 'shadow-[0_0_12px_rgba(129,140,248,0.12)]' : 'hover:text-white'
              }`}
              style={selectedConv.aiActive ? {
                background: 'rgba(129,140,248,0.10)',
                border: '1px solid rgba(129,140,248,0.25)',
                color: '#C4B5FD',
              } : {
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-glass)',
                color: 'var(--text-muted)',
              }}
            >
              <Sparkles size={11} style={{ color: selectedConv.aiActive ? '#818CF8' : undefined }} className={selectedConv.aiActive ? 'animate-spin-slow' : ''} />
              AI Assistant {selectedConv.aiActive ? 'Active' : 'Off'}
            </button>
          </div>

          {/* Messages History Panel */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {selectedConv.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.direction === 'inbound' ? 'justify-start' : 'justify-end'} animate-message-appear`}
              >
                <div
                  className={`max-w-[70%] rounded-[20px] px-4 py-3 text-xs leading-relaxed ${
                    msg.direction === 'inbound'
                      ? 'bg-gradient-to-br from-gray-100 to-gray-200 text-[#1A1A1A] rounded-tl-sm shadow-md font-medium'
                      : 'bg-black border border-[rgba(255,255,255,0.08)] text-[#FAFAFA] rounded-tr-sm shadow-xl'
                  }`}
                >
                  {msg.content}
                  {msg.isAiGenerated && (
                    <span className="block text-[8px] tracking-wider uppercase mt-1.5 opacity-60 text-purple-500 font-bold flex items-center gap-1">
                      <Sparkles size={8} /> AI Co-Pilot Reply
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Standard Typing Indicator inside Chat Log */}
            {typingConvs[selectedConv.id] && (
              <div className="flex justify-start animate-message-appear">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 text-[#1A1A1A] max-w-[70%] rounded-[20px] rounded-tl-sm px-4 py-3 text-xs flex items-center gap-1 font-medium shadow-md">
                  <span className="text-[10px] font-semibold text-gray-600 mr-1">Customer typing</span>
                  <span className="typing-dot bg-gray-600" />
                  <span className="typing-dot bg-gray-600" />
                  <span className="typing-dot bg-gray-600" />
                </div>
              </div>
            )}

            {/* AI Typing Indicator inside Chat Log */}
            {aiTypingConvId === selectedConv.id && (
              <div className="flex justify-start animate-message-appear">
                <div className="bg-gradient-to-r from-purple-950/30 to-pink-950/30 border border-purple-500/20 text-white max-w-[70%] rounded-[20px] rounded-tl-sm px-4 py-3.5 text-xs flex flex-col gap-1.5 animate-ai-glow">
                  <div className="flex items-center gap-1.5 font-bold text-purple-300">
                    <Sparkles size={11} className="text-purple-400 animate-pulse" />
                    <span>AI Assistant is drafting a reply</span>
                    <span className="typing-dot bg-purple-400" />
                    <span className="typing-dot bg-purple-400" />
                    <span className="typing-dot bg-purple-400" />
                  </div>
                  <p className="text-[9px] text-[#A0A0A0] leading-normal font-light">
                    AutoFlow LLM is crafting reply suggestions in background...
                  </p>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Horizontal Layout of Smart Suggestion Chips */}
          {smartReplies && smartReplies.length > 0 && (
            <div className="px-4 py-2 border-t border-[rgba(255,255,255,0.04)] bg-black/30 flex gap-2 overflow-x-auto items-center select-none no-scrollbar">
              <span className="text-[9px] text-purple-400 font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
                <Sparkles size={10} className="text-purple-400" /> Smart Suggestions:
              </span>
              {smartReplies.map((reply, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleInputChange(reply)}
                  className="text-[10px] px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all duration-200 shadow-md transform active:scale-95"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-glass)', color: 'var(--text-secondary)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-glow)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-glass)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Attachment Preview thumbnail cards above composer */}
          {attachments.length > 0 && (
            <div className="px-4 py-2.5 bg-black/40 border-t border-[rgba(255,255,255,0.06)] flex flex-wrap gap-2 shrink-0 animate-message-appear">
              {attachments.map((file, idx) => (
                <div
                  key={idx}
                  className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-xl p-2 flex items-center gap-2 text-xs relative group shadow-md"
                >
                  <div className="w-8 h-8 bg-black/50 rounded-lg flex items-center justify-center text-[8px] uppercase font-bold text-[#A0A0A0] tracking-wider select-none">
                    {file.name.split('.').pop() || 'file'}
                  </div>
                  <div className="max-w-[120px]">
                    <p className="font-semibold text-[10px] truncate text-white">{file.name}</p>
                    <p className="text-[9px] text-[#606060]">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAttachments(attachments.filter((_, i) => i !== idx))}
                    className="text-gray-400 hover:text-white ml-1 p-1 hover:bg-white/5 rounded-full"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Chat Composer Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t flex gap-3 items-center shrink-0"
            style={{ borderColor: 'var(--border-glass)', background: 'rgba(8,8,15,0.65)' }}
          >
            {/* Hidden Input File */}
            <input
              type="file"
              ref={fileInputRef}
              multiple
              onChange={(e) => {
                if (!e.target.files) return;
                const fileList = Array.from(e.target.files).map((f) => ({
                  name: f.name,
                  size: f.size,
                  type: f.type,
                }));
                setAttachments([...attachments, ...fileList]);
              }}
              className="hidden"
            />

            {/* Paperclip selector */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-[#606060] hover:text-white p-3 hover:bg-white/5 rounded-xl transition-colors duration-150"
              title="Attach document or image"
            >
              <Paperclip size={16} />
            </button>

            {/* Main composer input */}
            <input
              id="composer-input"
              value={inputText}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={attachments.length > 0 ? "Add message details..." : "Type custom DM response..."}
              className="flex-1 rounded-xl px-4 py-3 text-sm md:text-xs outline-none transition-all font-light"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-glass)', color: 'var(--text-primary)' }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--border-glow)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-glass)')}
            />

            {/* Send CTA */}
            <button
              type="submit"
              disabled={sending || (!inputText.trim() && attachments.length === 0)}
              className="p-3.5 rounded-xl disabled:opacity-30 hover:scale-105 active:scale-95 transition-all text-white"
              style={{ background: 'linear-gradient(135deg, #818CF8, #22D3EE)', boxShadow: '0 0 16px rgba(129,140,248,0.35)' }}
            >
              <Send size={13} />
            </button>
          </form>
        </div>

        {/* Lead Details CRM Sidebar */}
        <div className="hidden lg:flex w-80 border-l flex-col p-5 overflow-y-auto shrink-0 select-none" style={{ background: 'var(--bg-sidebar)', borderColor: 'var(--border-glass)' }}>
          <h3 className="text-[10px] font-extrabold uppercase tracking-widest mb-5 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
            <Sliders size={12} style={{ color: '#818CF8' }} /> Premium Lead CRM
          </h3>
          
          {/* Compact visual Card */}
          <div className="premium-card text-center rounded-[20px] p-5 mb-5">
            <div
              className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-xl font-bold uppercase select-none shadow-lg text-white"
              style={{ background: 'linear-gradient(135deg, #818CF8, #22D3EE)' }}
            >
              {selectedConv.name.charAt(0)}
            </div>
            <p className="text-xs font-bold mt-3 text-white tracking-tight">{selectedConv.name}</p>
            <p className="text-[10px] text-[#A0A0A0] font-light flex items-center justify-center gap-1 mt-1">
              <Instagram size={10} className="text-[#C0C0C0]" /> @{selectedConv.username}
            </p>
          </div>

          {/* AI Summarization Panel */}
          <div className="rounded-[18px] p-4 mb-5" style={{ border: '1px solid rgba(129,140,248,0.15)', background: 'rgba(129,140,248,0.10)' }}>
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-[10px] font-bold text-purple-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles size={11} className="text-purple-400" />
                AI Conversation Summary
              </span>
              {aiSummary && (
                <button
                  onClick={handleGenerateSummary}
                  className="text-[9px] text-gray-500 hover:text-white font-medium flex items-center gap-0.5 transition-colors"
                >
                  Regenerate
                </button>
              )}
            </div>
            {loadingSummary ? (
              <div className="space-y-2 py-2 select-none">
                <div className="h-2.5 bg-[rgba(255,255,255,0.04)] rounded animate-pulse w-full" />
                <div className="h-2.5 bg-[rgba(255,255,255,0.04)] rounded animate-pulse w-5/6" />
                <div className="h-2.5 bg-[rgba(255,255,255,0.04)] rounded animate-pulse w-2/3" />
              </div>
            ) : aiSummary ? (
              <p className="text-[11px] text-[#D0D0D0] leading-relaxed italic font-light">
                "{aiSummary}"
              </p>
            ) : (
              <button
                onClick={handleGenerateSummary}
                className="w-full py-2 bg-purple-900/40 border border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-900/60 rounded-lg text-[10px] font-medium text-purple-200 flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <Sparkles size={11} className="text-purple-300" />
                Generate AI Summary
              </button>
            )}
          </div>

          {/* Lead Score Tactics Slider */}
          <div className="premium-card mb-5 rounded-[18px] p-4">
            <div className="flex justify-between text-[11px] mb-2.5 select-none font-semibold">
              <span className="flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                <TrendingUp size={11} style={{ color: '#818CF8' }} /> Lead Score
              </span>
              <span className="text-white bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[10px]">
                {selectedConv.leadScore}/100
              </span>
            </div>
            
            {/* Range Slider for immediate scoring updates */}
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                value={selectedConv.leadScore}
                onChange={(e) => handleLeadScoreChange(Number(e.target.value))}
                className="flex-1 h-1 rounded-full appearance-none cursor-pointer accent-[#818CF8] focus:outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-glass)' }}
              />
            </div>
          </div>

          {/* Lead Notes Area (Debounced persistence) */}
          <div className="premium-card mb-5 rounded-[18px] p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
              <FileText size={11} /> Notes (Autosaved)
            </div>
            <textarea
              rows={4}
              value={selectedConv.notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              onBlur={handleNotesBlur}
              placeholder="Record lead interaction details here..."
              className="w-full rounded-xl p-3 text-xs outline-none transition-all font-light leading-relaxed resize-none"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', color: 'var(--text-primary)' }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--border-glow)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-glass)')}
            />
          </div>

          {/* Tags Manager (Instant persist) */}
          <div className="premium-card rounded-[18px] p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider mb-3.5 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
              <Star size={11} style={{ color: '#818CF8' }} /> Tags Management
            </div>
            
            {/* Tag Badges list */}
            {selectedConv.tags && selectedConv.tags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 mb-3.5">
                {selectedConv.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] bg-black border border-[rgba(255,255,255,0.06)] hover:border-red-500/30 hover:bg-red-950/10 px-2.5 py-1 rounded-full flex items-center gap-1.5 text-gray-300 transition-all cursor-pointer group/tag"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag}
                    <X size={8} className="text-gray-500 group-hover/tag:text-red-500 transition-colors" />
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-[#505050] italic font-light mb-3">No tags applied yet.</p>
            )}

            {/* Tag Composer Form */}
            <form onSubmit={handleAddTag} className="flex gap-2">
              <input
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                placeholder="New tag..."
                className="flex-1 bg-black/40 border border-[rgba(255,255,255,0.08)] rounded-lg px-2.5 py-1.5 text-[11px] placeholder-[#505050] focus:outline-none"
              />
              <button
                type="submit"
                className="p-1.5 bg-[#141414] hover:bg-[#1E1E24] border border-[rgba(255,255,255,0.08)] rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                <Plus size={12} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
