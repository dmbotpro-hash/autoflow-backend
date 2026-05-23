'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sparkles, X, Send, Minimize2, Maximize2,
  Zap, MessageSquare, GitBranch, Lightbulb,
  ChevronRight, RotateCcw, ExternalLink,
} from 'lucide-react';
import { useAiCopilot } from '@/lib/hooks/useAiCopilot';
import { AiThinking } from './AiThinking';
import { StreamingText } from './StreamingText';
import { useRouter } from 'next/navigation';
import { useAiCopilotStore } from '@/lib/store/aiCopilot.store';

const QUICK_PROMPTS = [
  { icon: '⚡', label: 'Auto-DM "price" commenters', prompt: 'Create a workflow that sends a DM when someone comments "price"' },
  { icon: '🎯', label: 'Follow-up leads after 24h', prompt: 'Build a workflow to follow up with leads who haven\'t replied in 24 hours' },
  { icon: '🤖', label: 'AI reply to DMs', prompt: 'Create a workflow that uses AI to auto-reply to incoming DMs' },
  { icon: '📊', label: 'Optimize my workflows', prompt: 'Analyze my workflows and suggest optimizations' },
];

export function AiCopilotPanel() {
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const {
    open, setOpen, messages, isThinking, draftWorkflow,
    recommendations, mode, sendMessage, generateRecommendations,
    setMode, setDraftWorkflow, clearMessages,
  } = useAiCopilot();

  useEffect(() => {
    if (open && messages.length === 0) {
      generateRecommendations();
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, minimized]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    await sendMessage(text);
  }, [input, sendMessage]);

  const handleKey = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const handleOpenWorkflow = useCallback(() => {
    if (draftWorkflow) {
      // Store draft in localStorage for workflows page to pick up
      localStorage.setItem('af_workflow_draft', JSON.stringify(draftWorkflow));
      setOpen(false);
      router.push('/workflows?draft=1');
    }
  }, [draftWorkflow, router, setOpen]);

  if (!open) return null;

  return (
    <div
      id="ai-copilot-panel"
      className={`fixed bottom-6 right-6 z-[9000] flex flex-col
        ${minimized ? 'w-72 h-14' : 'w-[400px] h-[580px]'}
        rounded-2xl border border-violet-500/20 shadow-2xl shadow-violet-900/30
        bg-[#0d0d14] backdrop-blur-2xl
        transition-all duration-300 ease-out
        ai-copilot-panel-glow`}
      style={{ maxHeight: 'calc(100vh - 100px)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-white/5 shrink-0">
        <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shrink-0">
          <Sparkles size={14} className="text-white" />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0d0d14] animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white leading-none">AutoFlow AI</p>
          <p className="text-[10px] text-violet-400/60 mt-0.5">Copilot · Always on</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMinimized((m) => !m)}
            className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 transition-colors"
            title={minimized ? 'Expand' : 'Minimize'}
          >
            {minimized ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
          </button>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 transition-colors"
            title="Close"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {!minimized && (
        <>
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin">
            {messages.length === 0 ? (
              <div className="space-y-4">
                {/* Welcome */}
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles size={12} className="text-white" />
                  </div>
                  <div className="bg-white/5 border border-white/8 rounded-xl rounded-tl-sm px-3 py-2.5 max-w-[280px]">
                    <p className="text-sm text-white/80 leading-relaxed">
                      Hey! 👋 I'm your AI copilot. Tell me what to automate and I'll build the workflow for you.
                    </p>
                  </div>
                </div>

                {/* Quick prompts */}
                <div className="space-y-1.5">
                  <p className="text-[10px] font-medium text-white/30 uppercase tracking-widest px-1">Quick actions</p>
                  {QUICK_PROMPTS.map((q) => (
                    <button
                      key={q.label}
                      onClick={() => sendMessage(q.prompt)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/3 border border-white/6 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all text-left group"
                    >
                      <span className="text-base shrink-0">{q.icon}</span>
                      <span className="text-xs text-white/60 group-hover:text-white/80 transition-colors">{q.label}</span>
                      <ChevronRight size={12} className="ml-auto text-white/20 group-hover:text-violet-400 transition-colors" />
                    </button>
                  ))}
                </div>

                {/* Recommendations */}
                {recommendations.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-medium text-white/30 uppercase tracking-widest px-1">Recommendations</p>
                    <div className="space-y-1">
                      {recommendations.map((rec, i) => (
                        <div key={i} className="flex items-start gap-2 px-3 py-2 rounded-xl bg-amber-500/5 border border-amber-500/10">
                          <Lightbulb size={12} className="text-amber-400 shrink-0 mt-0.5" />
                          <p className="text-[11px] text-white/50 leading-relaxed">{rec.replace(/^[💡⚡🎯📊]\s*/, '')}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles size={12} className="text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[280px] px-3 py-2.5 rounded-xl text-sm leading-relaxed
                        ${msg.role === 'user'
                          ? 'bg-violet-600/20 border border-violet-500/25 rounded-tr-sm text-white/90'
                          : 'bg-white/5 border border-white/8 rounded-tl-sm text-white/80'
                        }`}
                    >
                      {msg.role === 'assistant' ? (
                        <StreamingText
                          text={msg.content}
                          isStreaming={msg.isStreaming}
                        />
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                ))}

                {isThinking && (
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles size={12} className="text-white" />
                    </div>
                    <div className="bg-white/5 border border-white/8 rounded-xl rounded-tl-sm px-3 py-2.5">
                      <AiThinking size="sm" label="" />
                    </div>
                  </div>
                )}

                {/* Workflow Draft Card */}
                {mode === 'workflow-draft' && draftWorkflow && (
                  <div className="border border-violet-500/25 rounded-xl bg-violet-500/5 p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <GitBranch size={13} className="text-violet-400" />
                      <p className="text-xs font-semibold text-violet-300">Workflow Draft Ready</p>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed">{draftWorkflow.description}</p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {draftWorkflow.nodes.map((n) => (
                        <span key={n.id} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50">
                          {n.label}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={handleOpenWorkflow}
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 transition-colors text-xs font-semibold text-white"
                      id="copilot-open-workflow-btn"
                    >
                      <ExternalLink size={12} />
                      Open on Canvas
                    </button>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Tab bar */}
          {messages.length > 0 && (
            <div className="flex items-center gap-1 px-4 py-1.5 border-t border-white/5">
              <button
                onClick={() => { clearMessages(); setDraftWorkflow(null); setMode('chat'); }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors"
              >
                <RotateCcw size={10} />
                New chat
              </button>
              <div className="ml-auto flex items-center gap-1">
                <button
                  onClick={() => setMode('chat')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] transition-colors flex items-center gap-1
                    ${mode === 'chat' ? 'bg-white/8 text-white/70' : 'text-white/30 hover:text-white/50'}`}
                >
                  <MessageSquare size={10} />
                  Chat
                </button>
                <button
                  onClick={() => setMode('workflow-draft')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] transition-colors flex items-center gap-1
                    ${mode === 'workflow-draft' ? 'bg-violet-500/15 text-violet-300' : 'text-white/30 hover:text-white/50'}`}
                >
                  <Zap size={10} />
                  Workflows
                </button>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-3 pb-3 shrink-0">
            <div className="flex items-end gap-2 bg-white/4 border border-white/8 rounded-xl px-3 py-2 focus-within:border-violet-500/40 transition-colors">
              <textarea
                ref={inputRef}
                id="copilot-input"
                rows={1}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
                onKeyDown={handleKey}
                placeholder="Ask me to create a workflow..."
                className="flex-1 bg-transparent text-sm text-white/80 placeholder:text-white/20 resize-none outline-none min-h-[24px] max-h-[120px] leading-relaxed scrollbar-none"
                disabled={isThinking}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isThinking}
                id="copilot-send-btn"
                className="shrink-0 w-7 h-7 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center"
              >
                <Send size={12} className="text-white" />
              </button>
            </div>
            <p className="text-[10px] text-white/15 text-center mt-1.5">
              ↵ to send · Shift+↵ new line
            </p>
          </div>
        </>
      )}
    </div>
  );
}

/** Floating trigger button shown when panel is closed */
export function AiCopilotTrigger({ className = '' }: { className?: string }) {
  const { open, setOpen, toggleOpen } = useAiCopilotStore();

  if (open) return null;

  return (
    <button
      id="ai-copilot-trigger"
      onClick={toggleOpen}
      title="Open AI Copilot"
      aria-label="Open AI Copilot"
      className={`fixed bottom-6 right-6 z-[8999] w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-900/50 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 ai-copilot-trigger-glow group ${className}`}
    >
      <Sparkles size={22} className="text-white group-hover:rotate-12 transition-transform duration-300" />
      <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0a0a0f] animate-pulse" />
    </button>
  );
}
