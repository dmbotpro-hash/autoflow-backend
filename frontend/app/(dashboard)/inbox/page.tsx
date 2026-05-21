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

const initialConversations: Conversation[] = [
  {
    id: 'conv-1',
    name: 'Aarav Mehta',
    username: 'aarav.mehta',
    platform: 'instagram',
    lastMessage: 'How much does this course cost?',
    lastMessageTime: '5m ago',
    unreadCount: 1,
    aiActive: true,
    status: 'open',
    leadScore: 85,
    notes: 'Interested in purchasing the premium package. Asked about video editing tools.',
    tags: ['Hot Lead', 'Course Inquiry', 'Instagram DM'],
    messages: [
      { id: 'm1', content: 'Hello, your profile looks great!', direction: 'inbound', sentAt: '10:30 AM' },
      { id: 'm2', content: 'Thank you! AutoFlow helps creators automate their engagement.', direction: 'outbound', sentAt: '10:32 AM' },
      { id: 'm3', content: 'Nice, how much does this course cost?', direction: 'inbound', sentAt: '5m ago' }
    ]
  },
  {
    id: 'conv-2',
    name: 'Priya Sharma',
    username: 'priya_creations',
    platform: 'instagram',
    lastMessage: 'Check your DM automation, wow working perfectly!',
    lastMessageTime: '30m ago',
    unreadCount: 0,
    aiActive: true,
    status: 'open',
    leadScore: 92,
    notes: 'Creator with 50k followers. Looking for dynamic triggers for comment-to-DM.',
    tags: ['Creator', 'Highly Active', 'Partner Potential'],
    messages: [
      { id: 'm4', content: 'I commented on your post.', direction: 'inbound', sentAt: '11:15 AM' },
      { id: 'm5', content: 'Yes Priya! The comment-to-DM trigger was successfully initiated.', direction: 'outbound', isAiGenerated: true, sentAt: '11:15 AM' },
      { id: 'm6', content: 'Check your DM automation, wow working perfectly!', direction: 'inbound', sentAt: '30m ago' }
    ]
  },
  {
    id: 'conv-3',
    name: 'Karan Malhotra',
    username: 'karan_m',
    platform: 'instagram',
    lastMessage: 'Can you show me a demo?',
    lastMessageTime: '2h ago',
    unreadCount: 0,
    aiActive: false,
    status: 'open',
    leadScore: 45,
    notes: 'Needs live demonstration of workflow nodes connectivity.',
    tags: ['Prospect', 'Needs Demo'],
    messages: [
      { id: 'm7', content: 'Hi, what is AutoFlow?', direction: 'inbound', sentAt: 'Yesterday' },
      { id: 'm8', content: 'Hi Karan! AutoFlow is an AI automated chat manager.', direction: 'outbound', sentAt: 'Yesterday' },
      { id: 'm9', content: 'Can you show me a demo?', direction: 'inbound', sentAt: '2h ago' }
    ]
  }
];

export default function InboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedConvId, setSelectedConvId] = useState<string>('conv-1');
  const [inputText, setInputText] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newTagInput, setNewTagInput] = useState<string>('');
  const [isTypingSimulated, setIsTypingSimulated] = useState<boolean>(false);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const selectedConv = conversations.find(c => c.id === selectedConvId) || conversations[0];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConv?.messages, isTypingSimulated]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

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
          content: `🤖 [AI Auto-Reply]: Absolutely! Our standard packages start for free and include 500 DMs per month. For premium features, you can upgrade via the workflows builder dashboard.`,
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
      if (c.id === id) {
        return { ...c, aiActive: !c.aiActive };
      }
      return c;
    }));
  };

  const updateNotes = (id: string, notes: string) => {
    setConversations(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, notes };
      }
      return c;
    }));
  };

  const updateLeadScore = (id: string, score: number) => {
    const safeScore = Math.max(0, Math.min(100, score));
    setConversations(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, leadScore: safeScore };
      }
      return c;
    }));
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagInput.trim()) return;
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
    setConversations(prev => prev.map(c => {
      if (c.id === selectedConv.id) {
        return { ...c, tags: c.tags.filter(t => t !== tagToRemove) };
      }
      return c;
    }));
  };

  const handleSelectConversation = (id: string) => {
    setSelectedConvId(id);
    setMobileView('chat');
  };

  const filteredConversations = conversations.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0F] text-white overflow-hidden font-sans">
      {/* Header info */}
      <div className="bg-[#0F0F0F] border-b border-[rgba(255,255,255,0.08)] px-6 py-4 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-base font-bold text-white flex items-center gap-2 font-sans">
            <MessageCircle className="text-white" size={18} />
            Live Automation Inbox
          </h1>
          <p className="text-[11px] text-[#A0A0A0] mt-1 font-light">All your Instagram DMs in one place — live and synchronized.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-emerald-400 text-xs font-medium">Live</span>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Pane 1: Conversations List */}
        <div className={`
          ${mobileView === 'list' ? 'flex' : 'hidden'}
          md:flex w-full md:w-72 flex-shrink-0
          border-r border-gray-800 flex-col h-full bg-[#0F0F0F] overflow-hidden
        `}>
          <div className="p-4 border-b border-[rgba(255,255,255,0.06)] shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-[#606060]" size={14} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-[#606060] focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[rgba(255,255,255,0.04)]">
            {filteredConversations.map(conv => {
              const isSelected = conv.id === selectedConv.id;
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

            {filteredConversations.length === 0 && (
              <div className="p-8 text-center text-[#606060] text-xs font-light">
                No chats found.
              </div>
            )}
          </div>
        </div>

        {/* Pane 2: Conversation View */}
        <div className={`
          ${mobileView === 'chat' ? 'flex' : 'hidden'}
          md:flex flex-1 flex-col min-w-0 bg-[#0A0A0F]
        `}>
          
          {/* Chat Pane Header */}
          <div className="bg-[#0F0F0F]/80 border-b border-[rgba(255,255,255,0.08)] px-6 py-3.5 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                className="md:hidden text-gray-400 mr-2 hover:text-white"
                onClick={() => setMobileView('list')}
              >
                <ArrowLeft size={20} />
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
                <span className="text-[11px] font-semibold text-[#A0A0A0] select-none">AI Auto-Reply</span>
                <button
                  type="button"
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

          {/* Chat Messages stream */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#0A0A0F]">
            <div className="text-center py-2 shrink-0">
              <span className="text-[9px] bg-[#0F0F0F] border border-[rgba(255,255,255,0.06)] text-[#606060] px-3 py-1 rounded-full font-medium uppercase tracking-wide">
                Conversation Started
              </span>
            </div>

            {selectedConv.messages.map(msg => {
              const isInbound = msg.direction === 'inbound';
              return (
                <div
                  key={msg.id}
                  className={`flex ${isInbound ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[70%] flex flex-col ${isInbound ? 'items-start' : 'items-end'}`}>
                    
                    <div className="flex items-center gap-1.5 mb-1 select-none">
                      <span className="text-[9px] text-[#606060] font-light">{msg.sentAt}</span>
                      {msg.isAiGenerated && (
                        <span className="text-[8px] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] text-white px-1.5 py-0.2 rounded font-bold flex items-center gap-0.5 shrink-0">
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

          {/* Chat Input Panel */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-[rgba(255,255,255,0.08)] bg-[#0F0F0F]/60 shrink-0">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-[#141414] border border-[rgba(255,255,255,0.08)] focus:border-white rounded-xl px-4 py-3 text-xs focus:outline-none transition-colors text-white placeholder-[#606060]"
              />
              <button
                type="submit"
                className="bg-white hover:opacity-88 active:scale-95 text-black p-3.5 rounded-xl transition-all duration-150 flex items-center justify-center shrink-0 shadow-sm"
              >
                <Send size={14} />
              </button>
            </div>
          </form>

        </div>

        {/* Pane 3: Lead Details & CRM Card */}
        <div className="hidden lg:flex w-72 lg:w-80 bg-[#0F0F0F] border-l border-[rgba(255,255,255,0.08)] flex-col overflow-y-auto shrink-0 p-5">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 select-none">
            <Sliders size={13} className="text-white" />
            Lead Metadata CRM
          </h3>

          {/* Lead Card summary */}
          <div className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-xl p-4 mb-5 text-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 mx-auto flex items-center justify-center font-bold text-white text-lg mb-2.5 select-none uppercase">
              {selectedConv.name.charAt(0)}
            </div>
            <h4 className="text-white font-semibold text-xs leading-none">{selectedConv.name}</h4>
            <p className="text-[10px] text-[#606060] mt-1">@{selectedConv.username}</p>

            <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between">
              <span className="text-[9px] text-[#A0A0A0] font-semibold uppercase">Platform</span>
              <span className="text-[10px] text-white font-bold flex items-center gap-1">
                <Instagram size={11} /> Instagram DM
              </span>
            </div>
          </div>

          {/* Interactive Lead Score */}
          <div className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-xl p-4 mb-5">
            <div className="flex justify-between items-center mb-2 select-none">
              <span className="text-[11px] font-semibold text-[#A0A0A0] flex items-center gap-1">
                <TrendingUp size={12} className="text-white" /> Lead Score
              </span>
              <span className="text-xs font-bold text-white">{selectedConv.leadScore}/100</span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-black h-1.5 rounded-full overflow-hidden mb-3">
              <div 
                className="bg-white h-full rounded-full transition-all duration-300"
                style={{ width: `${selectedConv.leadScore}%` }}
              />
            </div>

            {/* Score controller */}
            <div className="flex justify-between gap-2">
              <button 
                type="button"
                onClick={() => updateLeadScore(selectedConv.id, selectedConv.leadScore - 5)}
                className="flex-1 bg-black hover:bg-[#0F0F0F] border border-[rgba(255,255,255,0.08)] text-white text-[10px] py-1.5 rounded-lg font-semibold transition-colors duration-150"
              >
                -5 Score
              </button>
              <button 
                type="button"
                onClick={() => updateLeadScore(selectedConv.id, selectedConv.leadScore + 5)}
                className="flex-1 bg-black hover:bg-[#0F0F0F] border border-[rgba(255,255,255,0.08)] text-white text-[10px] py-1.5 rounded-lg font-semibold transition-colors duration-150"
              >
                +5 Score
              </button>
            </div>
          </div>

          {/* Notes manager */}
          <div className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-xl p-4 mb-5 flex flex-col">
            <div className="text-[11px] font-semibold text-[#A0A0A0] mb-2 flex items-center gap-1.5 select-none">
              <FileText size={12} className="text-white" /> Lead Notes
            </div>
            <textarea
              rows={3}
              value={selectedConv.notes}
              onChange={e => updateNotes(selectedConv.id, e.target.value)}
              placeholder="Add lead notes..."
              className="bg-black border border-[rgba(255,255,255,0.08)] rounded-lg p-2.5 text-xs text-white placeholder-[#606060] focus:outline-none focus:border-white transition-colors resize-none leading-relaxed font-light"
            />
          </div>

          {/* Interactive Tags list */}
          <div className="bg-[#141414] border border-[rgba(255,255,255,0.08)] rounded-xl p-4 flex flex-col">
            <div className="text-[11px] font-semibold text-[#A0A0A0] mb-3 flex items-center gap-1.5 select-none">
              <Star size={12} className="text-white" /> Custom Tags
            </div>

            {/* Tags wrapper */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {selectedConv.tags.map(tag => (
                <span 
                  key={tag} 
                  className="text-[10px] bg-black border border-[rgba(255,255,255,0.08)] text-white px-2 py-0.5 rounded-full flex items-center gap-1 font-medium select-none"
                >
                  {tag}
                  <button 
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-[#606060] hover:text-red-400 transition-colors"
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>

            {/* Tags form */}
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

        </div>

      </div>
    </div>
  );
}
