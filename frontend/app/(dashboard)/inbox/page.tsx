'use client';

import { useState, useEffect, useRef } from 'react';
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
  ArrowLeft
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  direction: 'inbound' | 'outbound';
  isAiGenerated?: boolean;
  sentAt: string;
}

interface Conversation {
  id: string;
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
  messages: Message[];
}

export default function InboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [inputText, setInputText] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newTagInput, setNewTagInput] = useState<string>('');
  const [isTypingSimulated, setIsTypingSimulated] = useState<boolean>(false);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const selectedConv = conversations.find(c => c.id === selectedConvId) ?? null;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConv?.messages, isTypingSimulated]);

  const handleSelectConversation = (id: string) => {
    setSelectedConvId(id);
    setMobileView('chat');
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !selectedConv) return;

    const userMessage: Message = {
      id: `m-out-${Date.now()}`,
      content: inputText,
      direction: 'outbound',
      sentAt: 'Just now'
    };

    setConversations(prev => prev.map(c => {
      if (c.id === selectedConv.id) {
        return {
          ...c,
          lastMessage: inputText,
          lastMessageTime: 'Just now',
          messages: [...c.messages, userMessage]
        };
      }
      return c;
    }));

    setInputText('');

    if (selectedConv.aiActive) {
      setIsTypingSimulated(true);
      setTimeout(() => {
        setIsTypingSimulated(false);
        const aiMessage: Message = {
          id: `m-ai-${Date.now()}`,
          content: `🤖 [AI Auto-Reply]: Thank you for reaching out! We'll get back to you shortly with more information.`,
          direction: 'outbound',
          isAiGenerated: true,
          sentAt: 'Just now'
        };

        setConversations(prev => prev.map(c => {
          if (c.id === selectedConv.id) {
            return {
              ...c,
              lastMessage: aiMessage.content,
              lastMessageTime: 'Just now',
              messages: [...c.messages, aiMessage]
            };
          }
          return c;
        }));
      }, 1500);
    }
  };

  const toggleAiState = (id: string) => {
    setConversations(prev => prev.map(c => {
      if (c.id === id) return { ...c, aiActive: !c.aiActive };
      return c;
    }));
  };

  const updateNotes = (id: string, notes: string) => {
    setConversations(prev => prev.map(c => {
      if (c.id === id) return { ...c, notes };
      return c;
    }));
  };

  const updateLeadScore = (id: string, score: number) => {
    const safeScore = Math.max(0, Math.min(100, score));
    setConversations(prev => prev.map(c => {
      if (c.id === id) return { ...c, leadScore: safeScore };
      return c;
    }));
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagInput.trim() || !selectedConv) return;
    setConversations(prev => prev.map(c => {
      if (c.id === selectedConv.id) {
        if (c.tags.includes(newTagInput.trim())) return c;
        return { ...c, tags: [...c.tags, newTagInput.trim()] };
      }
      return c;
    }));
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!selectedConv) return;
    setConversations(prev => prev.map(c => {
      if (c.id === selectedConv.id) {
        return { ...c, tags: c.tags.filter(t => t !== tagToRemove) };
      }
      return c;
    }));
  };

  const filteredConversations = conversations.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-black text-white overflow-hidden font-sans">

      {/* Page Header */}
      <div className="bg-[#0F0F0F] border-b border-[rgba(255,255,255,0.08)] px-4 md:px-6 py-4 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-base font-bold text-white flex items-center gap-2 font-sans">
            <MessageCircle className="text-white" size={18} />
            Live Automation Inbox
          </h1>
          <p className="text-[11px] text-[#A0A0A0] mt-1 font-light hidden sm:block">
            Real-time message monitoring and dynamic lead score tracking workspace.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-wider bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] text-white font-semibold px-3 py-1.5 rounded-full hidden sm:flex items-center gap-1.5 select-none">
            <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-pulse" />
            Live Synchronized
          </span>
        </div>
      </div>

      {/* Three-Pane Workspace */}
      <div className="flex-1 flex overflow-hidden">

        {/* Pane 1: Conversations List — full width on mobile, fixed width on desktop */}
        <div className={`${mobileView === 'chat' ? 'hidden md:flex' : 'flex'} w-full md:w-80 bg-[#0F0F0F] border-r border-[rgba(255,255,255,0.08)] flex-col overflow-hidden shrink-0`}>
          <div className="p-4 border-b border-[rgba(255,255,255,0.06)] shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-[#606060]" size={14} />
              <input
                type="text"
                placeholder="Search leads, chats..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-[#606060] focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[rgba(255,255,255,0.04)]">
            {filteredConversations.map(conv => {
              const isSelected = conv.id === selectedConvId;
              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`p-4 cursor-pointer flex items-start gap-3 transition-colors ${
                    isSelected ? 'bg-[#141414] border-l-2 border-white' : 'hover:bg-[#141414]/40'
                  }`}
                >
                  <div className="relative shrink-0 mt-0.5 select-none">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white text-xs uppercase shadow-inner">
                      {conv.name.charAt(0)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-[rgba(255,255,255,0.12)]">
                      <Instagram size={8} className="text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className="text-xs font-semibold text-white truncate">{conv.name}</h4>
                      <span className="text-[9px] text-[#606060] whitespace-nowrap">{conv.lastMessageTime}</span>
                    </div>
                    <p className="text-[10px] text-[#606060] truncate mb-1">@{conv.username}</p>
                    <p className="text-[11px] text-[#A0A0A0] truncate font-light leading-snug">{conv.lastMessage}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex gap-1">
                        {conv.tags.slice(0, 1).map(tag => (
                          <span key={tag} className="text-[9px] bg-[#141414] border border-[rgba(255,255,255,0.08)] text-[#A0A0A0] px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {conv.aiActive && (
                          <span className="text-[9px] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] text-white px-1.5 py-0.5 rounded flex items-center gap-0.5 font-bold">
                            <Sparkles size={8} /> AI Active
                          </span>
                        )}
                        {conv.unreadCount > 0 && (
                          <span className="w-1.5 h-1.5 bg-white rounded-full" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Empty state: fresh account with no conversations */}
            {conversations.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
                <MessageCircle size={32} className="text-[#404040] mb-3" />
                <p className="text-white text-xs font-semibold mb-2">No messages yet</p>
                <p className="text-[#606060] text-[10px] font-light leading-relaxed max-w-[200px]">
                  Conversations will appear here when your Instagram automation triggers fire.
                </p>
              </div>
            )}

            {/* Search returned no results */}
            {conversations.length > 0 && filteredConversations.length === 0 && (
              <div className="p-8 text-center text-[#606060] text-xs font-light">
                No chats found.
              </div>
            )}
          </div>
        </div>

        {/* Pane 2: Chat View — full width on mobile, flexible on desktop */}
        <div className={`${mobileView === 'list' ? 'hidden md:flex' : 'flex'} flex-1 bg-black flex-col overflow-hidden`}>
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <div className="bg-[#0F0F0F]/80 border-b border-[rgba(255,255,255,0.08)] px-4 md:px-6 py-3.5 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Back button — mobile only */}
                  <button
                    onClick={() => setMobileView('list')}
                    className="md:hidden p-1.5 rounded-lg text-[#A0A0A0] hover:text-white transition-colors shrink-0"
                    aria-label="Back to conversations"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white text-xs shrink-0 select-none uppercase">
                    {selectedConv.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-semibold text-white truncate leading-none mb-0.5">{selectedConv.name}</h3>
                    <p className="text-[10px] text-[#A0A0A0] truncate">@{selectedConv.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 border border-[rgba(255,255,255,0.08)] bg-[#0F0F0F] px-3 py-1.5 rounded-xl">
                    <Sparkles size={12} className={selectedConv.aiActive ? 'text-white' : 'text-[#606060]'} />
                    <span className="hidden sm:block text-[11px] font-semibold text-[#A0A0A0] select-none">AI Auto-Reply</span>
                    <button
                      onClick={() => toggleAiState(selectedConv.id)}
                      className={`w-7 h-3.5 rounded-full p-0.5 transition-colors duration-150 focus:outline-none ${
                        selectedConv.aiActive ? 'bg-white' : 'bg-[#141414] border border-[rgba(255,255,255,0.12)]'
                      }`}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full shadow-md transform transition-transform duration-150 ${
                        selectedConv.aiActive ? 'translate-x-3.5 bg-black' : 'translate-x-0 bg-[#606060]'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages Stream */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-black">
                <div className="text-center py-2 shrink-0">
                  <span className="text-[9px] bg-[#0F0F0F] border border-[rgba(255,255,255,0.06)] text-[#606060] px-3 py-1 rounded-full font-medium uppercase tracking-wide">
                    Instagram Conversation Initiated
                  </span>
                </div>

                {selectedConv.messages.map(msg => {
                  const isInbound = msg.direction === 'inbound';
                  return (
                    <div key={msg.id} className={`flex ${isInbound ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[85%] md:max-w-[70%] flex flex-col ${isInbound ? 'items-start' : 'items-end'}`}>
                        <div className="flex items-center gap-1.5 mb-1 select-none">
                          <span className="text-[9px] text-[#606060] font-light">{msg.sentAt}</span>
                          {msg.isAiGenerated && (
                            <span className="text-[8px] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] text-white px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5 shrink-0">
                              <Sparkles size={8} /> AI Response
                            </span>
                          )}
                        </div>
                        <div className={`rounded-[18px] px-3.5 py-2.5 text-xs leading-relaxed ${
                          isInbound
                            ? 'bg-[#EEEEEE] text-[#1A1A1A] rounded-tl-[4px]'
                            : 'bg-black border border-[rgba(255,255,255,0.08)] text-white rounded-tr-[4px]'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {isTypingSimulated && (
                  <div className="flex justify-start">
                    <div className="bg-black border border-[rgba(255,255,255,0.08)] rounded-[18px] rounded-tl-[4px] px-3.5 py-2.5 max-w-[70%]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.4s]" />
                        <span className="text-[10px] text-white font-bold ml-1.5 flex items-center gap-1">
                          AI typing auto-response...
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Input Panel */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-[rgba(255,255,255,0.08)] bg-[#0F0F0F]/60 shrink-0">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    placeholder={selectedConv.aiActive ? "Type here, or let AI auto-respond on send..." : "Type your message..."}
                    className="flex-1 bg-[#141414] border border-[rgba(255,255,255,0.08)] focus:border-white rounded-xl px-4 py-3 text-xs focus:outline-none transition-colors text-white placeholder-[#606060]"
                  />
                  <button
                    type="submit"
                    className="bg-white hover:opacity-90 active:scale-95 text-black p-3.5 rounded-xl transition-all duration-150 flex items-center justify-center shrink-0 shadow-sm"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </form>
            </>
          ) : (
            /* Desktop: no conversation selected */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 select-none">
              <MessageCircle size={40} className="text-[#404040] mb-4" />
              <h3 className="text-white font-semibold text-xs mb-1">No Conversation Selected</h3>
              <p className="text-[#606060] text-[11px] max-w-xs leading-relaxed font-light">
                Select a conversation from the list to start messaging.
              </p>
            </div>
          )}
        </div>

        {/* Pane 3: Lead CRM — hidden on mobile */}
        <div className="hidden md:flex w-80 bg-[#0F0F0F] border-l border-[rgba(255,255,255,0.08)] flex-col overflow-y-auto shrink-0 p-5">
          {selectedConv ? (
            <>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 select-none">
                <Sliders size={13} className="text-white" />
                Lead Metadata CRM
              </h3>

              {/* Lead Card */}
              <div className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-xl p-4 mb-5 text-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 mx-auto flex items-center justify-center font-bold text-white text-lg mb-2.5 select-none uppercase">
                  {selectedConv.name.charAt(0)}
                </div>
                <h4 className="text-white font-semibold text-xs leading-none">{selectedConv.name}</h4>
                <p className="text-[10px] text-[#606060] mt-1">@{selectedConv.username}</p>
                <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between">
                  <span className="text-[9px] text-[#A0A0A0] font-semibold uppercase">Platform:</span>
                  <span className="text-[10px] text-white font-bold flex items-center gap-1">
                    <Instagram size={11} /> Instagram DM
                  </span>
                </div>
              </div>

              {/* Lead Score */}
              <div className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-xl p-4 mb-5">
                <div className="flex justify-between items-center mb-2 select-none">
                  <span className="text-[11px] font-semibold text-[#A0A0A0] flex items-center gap-1">
                    <TrendingUp size={12} className="text-white" /> Lead Score
                  </span>
                  <span className="text-xs font-bold text-white">{selectedConv.leadScore}/100</span>
                </div>
                <div className="w-full bg-black h-1.5 rounded-full overflow-hidden mb-3">
                  <div
                    className="bg-white h-full rounded-full transition-all duration-300"
                    style={{ width: `${selectedConv.leadScore}%` }}
                  />
                </div>
                <div className="flex justify-between gap-2">
                  <button
                    onClick={() => updateLeadScore(selectedConv.id, selectedConv.leadScore - 5)}
                    className="flex-1 bg-black hover:bg-[#0F0F0F] border border-[rgba(255,255,255,0.08)] text-white text-[10px] py-1.5 rounded-lg font-semibold transition-colors duration-150"
                  >
                    -5 Score
                  </button>
                  <button
                    onClick={() => updateLeadScore(selectedConv.id, selectedConv.leadScore + 5)}
                    className="flex-1 bg-black hover:bg-[#0F0F0F] border border-[rgba(255,255,255,0.08)] text-white text-[10px] py-1.5 rounded-lg font-semibold transition-colors duration-150"
                  >
                    +5 Score
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-xl p-4 mb-5 flex flex-col">
                <div className="text-[11px] font-semibold text-[#A0A0A0] mb-2 flex items-center gap-1.5 select-none">
                  <FileText size={12} className="text-white" /> Lead Notes
                </div>
                <textarea
                  rows={3}
                  value={selectedConv.notes}
                  onChange={e => updateNotes(selectedConv.id, e.target.value)}
                  placeholder="Add lead details and observations here..."
                  className="bg-black border border-[rgba(255,255,255,0.08)] rounded-lg p-2.5 text-xs text-white placeholder-[#606060] focus:outline-none focus:border-white transition-colors resize-none leading-relaxed font-light"
                />
              </div>

              {/* Tags */}
              <div className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-xl p-4 flex flex-col">
                <div className="text-[11px] font-semibold text-[#A0A0A0] mb-3 flex items-center gap-1.5 select-none">
                  <Star size={12} className="text-white" /> Custom Lead Tags
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {selectedConv.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-[10px] bg-black border border-[rgba(255,255,255,0.08)] text-white px-2 py-0.5 rounded-full flex items-center gap-1 font-medium select-none"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="text-[#606060] hover:text-red-400 transition-colors"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                  {selectedConv.tags.length === 0 && (
                    <span className="text-[10px] text-[#606060] font-light">No tags yet.</span>
                  )}
                </div>
                <form onSubmit={handleAddTag} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add tag..."
                    value={newTagInput}
                    onChange={e => setNewTagInput(e.target.value)}
                    className="flex-1 bg-black border border-[rgba(255,255,255,0.08)] focus:border-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none transition-colors text-white placeholder-[#606060]"
                  />
                  <button
                    type="submit"
                    className="bg-black hover:bg-[#0F0F0F] border border-[rgba(255,255,255,0.08)] p-2 rounded-lg text-white transition-colors flex items-center justify-center"
                  >
                    <Plus size={11} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center select-none">
              <Sliders size={28} className="text-[#404040] mb-3" />
              <p className="text-[#606060] text-xs font-light leading-relaxed max-w-[180px]">
                Select a conversation to view lead details.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
