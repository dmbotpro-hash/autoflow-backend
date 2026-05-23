'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Zap, ArrowRight, TrendingUp } from 'lucide-react';
import { useAiCopilotStore } from '@/lib/store/aiCopilot.store';
import { useAiCopilot } from '@/lib/hooks/useAiCopilot';
import { AiThinking, AiShimmerCard } from '@/components/ai/AiThinking';
import { StreamingText } from '@/components/ai/StreamingText';

const INSIGHT_CYCLE = [
  '🔥 3 high-intent leads replied in the last hour. Consider following up now.',
  '⚡ Your "price" keyword trigger has a 78% DM open rate — above average.',
  '🎯 Leads tagged "hot" have 3x higher conversion. Prioritize them in inbox.',
  '📈 Workflow response time avg: 1.2s. Your automations are running smoothly.',
];

export function AiCopilotDashboardWidget() {
  const setOpen = useAiCopilotStore((s) => s.setOpen);
  const { sendMessage, generateRecommendations, recommendations } = useAiCopilot();
  const [insightIdx, setInsightIdx] = useState(0);
  const [insightText, setInsightText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cycle through insights with streaming effect
  useEffect(() => {
    generateRecommendations();

    const stream = async (text: string) => {
      setIsStreaming(true);
      setInsightText('');
      const words = text.split(' ');
      let acc = '';
      for (let i = 0; i < words.length; i++) {
        acc += (i === 0 ? '' : ' ') + words[i];
        setInsightText(acc);
        await new Promise((r) => setTimeout(r, 35));
      }
      setIsStreaming(false);
      setLoading(false);
    };

    stream(INSIGHT_CYCLE[0]);
    const interval = setInterval(() => {
      setInsightIdx((prev) => {
        const next = (prev + 1) % INSIGHT_CYCLE.length;
        stream(INSIGHT_CYCLE[next]);
        return next;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const quickActions = [
    { label: 'Auto-DM "price"', prompt: 'Create a workflow to DM people who comment "price"' },
    { label: 'Follow-up sequence', prompt: 'Build a 24h follow-up workflow for leads who haven\'t replied' },
    { label: 'AI inbox replies', prompt: 'Create a workflow that auto-replies to DMs using AI' },
  ];

  return (
    <AiShimmerCard
      active={isStreaming}
      className="rounded-2xl border border-violet-500/15 bg-gradient-to-br from-violet-950/40 to-fuchsia-950/20 p-4 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
            <Sparkles size={15} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">AI Copilot</p>
            <p className="text-[10px] text-violet-400/60">Live intelligence</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-emerald-400/70 font-medium">Active</span>
        </div>
      </div>

      {/* Live AI Insight */}
      <div className="bg-black/20 rounded-xl px-3.5 py-3 border border-white/5 min-h-[56px] flex items-center">
        {loading ? (
          <AiThinking size="sm" label="Analyzing workspace..." />
        ) : (
          <p className="text-sm text-white/70 leading-relaxed">
            <StreamingText text={insightText} isStreaming={isStreaming} />
          </p>
        )}
      </div>

      {/* Insight dots */}
      <div className="flex items-center justify-center gap-1.5">
        {INSIGHT_CYCLE.map((_, i) => (
          <span
            key={i}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === insightIdx
                ? 'w-4 bg-violet-400'
                : 'w-1 bg-white/15'
            }`}
          />
        ))}
      </div>

      {/* Quick actions */}
      <div className="space-y-1.5">
        <p className="text-[10px] font-medium text-white/25 uppercase tracking-widest">Quick actions</p>
        {quickActions.map((a) => (
          <button
            key={a.label}
            onClick={() => {
              setOpen(true);
              setTimeout(() => sendMessage(a.prompt), 150);
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/3 border border-white/6 hover:border-violet-500/25 hover:bg-violet-500/5 transition-all text-left group"
          >
            <div className="flex items-center gap-2">
              <Zap size={11} className="text-violet-400 shrink-0" />
              <span className="text-xs text-white/55 group-hover:text-white/75 transition-colors">{a.label}</span>
            </div>
            <ArrowRight size={11} className="text-white/20 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" />
          </button>
        ))}
      </div>

      {/* Open copilot */}
      <button
        onClick={() => setOpen(true)}
        id="dashboard-open-copilot-btn"
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
          bg-gradient-to-r from-violet-600/80 to-fuchsia-600/80
          hover:from-violet-600 hover:to-fuchsia-600
          border border-violet-500/20 transition-all
          text-sm font-semibold text-white group"
      >
        <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
        Open AI Copilot
        <TrendingUp size={12} className="opacity-60" />
      </button>
    </AiShimmerCard>
  );
}
