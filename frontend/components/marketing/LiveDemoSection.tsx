'use client';

import { motion } from 'framer-motion';
import { Play, Zap, MessageCircle, TrendingUp } from 'lucide-react';
import { MarketingSection, SectionHeader } from './MarketingSection';
import { ScrollReveal } from './ScrollReveal';

const liveStats = [
  { label: 'DMs sent today', value: '2,847', icon: MessageCircle },
  { label: 'Workflows active', value: '128', icon: Zap },
  { label: 'Leads captured', value: '412', icon: TrendingUp },
];

export default function LiveDemoSection() {
  return (
    <MarketingSection id="demo" variant="dark" className="af-ambient-bg">
      <ScrollReveal>
        <SectionHeader
          label="Live product"
          title="See AutoFlow run in real time"
          subtitle="Comment triggers fire instantly. AI replies, inbox updates, and analytics — all in one OS."
        />
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="relative rounded-2xl border border-white/10 af-glass af-glow-border overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-black/40">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-[10px] text-slate-500 font-mono ml-2">
              autoflow.app/dashboard
            </span>
            <span className="ml-auto flex items-center gap-1 text-[10px] text-emerald-400">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Live
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {liveStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                viewport={{ once: true }}
                className="p-6 text-center"
              >
                <stat.icon className="w-5 h-5 text-violet-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white tabular-nums">{stat.value}</div>
                <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="p-4 md:p-6 bg-gradient-to-r from-violet-950/50 to-fuchsia-950/30 border-t border-white/10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                  <Play className="w-4 h-4 text-violet-300" />
                </div>
                <div>
                  <p className="font-medium text-white">Workflow: Comment “PRICE” → DM</p>
                  <p className="text-xs text-slate-500">Executed 12s ago • 98% delivery</p>
                </div>
              </div>
              <div className="flex gap-2 text-[10px]">
                {['Trigger', 'AI', 'Send DM'].map((step, i) => (
                  <span
                    key={step}
                    className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-violet-300"
                  >
                    {i + 1}. {step}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </MarketingSection>
  );
}
