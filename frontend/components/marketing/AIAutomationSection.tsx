'use client';

import { Sparkles, Brain, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { MarketingSection, SectionHeader } from './MarketingSection';
import { ScrollReveal } from './ScrollReveal';
import { MagneticButton } from './MagneticButton';

const capabilities = [
  {
    icon: Brain,
    title: 'Intent detection',
    desc: 'Sales, support, or spam — AI routes every DM intelligently.',
  },
  {
    icon: Wand2,
    title: 'Custom personality',
    desc: 'Tone and rules per workspace. Hindi-English mix that sounds human.',
  },
  {
    icon: Sparkles,
    title: 'FAQ intercept',
    desc: 'Instant answers before OpenAI — faster, cheaper, on-brand.',
  },
];

export default function AIAutomationSection() {
  return (
    <MarketingSection variant="cinematic" className="py-24 md:py-32">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-violet-500/30"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-cyan-500/20"
        />
      </div>

      <ScrollReveal>
        <SectionHeader
          label="AI native"
          title="AI that feels alive inside your inbox"
          subtitle="Not a chatbot bolt-on — intelligence woven through every automation."
        />
      </ScrollReveal>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {capabilities.map((item, i) => (
          <ScrollReveal key={item.title} delay={i * 0.08}>
            <div className="af-glass af-glow-border rounded-2xl p-6 h-full hover:border-violet-500/40 transition-colors">
              <item.icon className="w-8 h-8 text-violet-400 mb-4" />
              <h3 className="font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={0.2} className="text-center">
        <MagneticButton href="/signup">Start with AI automation →</MagneticButton>
      </ScrollReveal>
    </MarketingSection>
  );
}
