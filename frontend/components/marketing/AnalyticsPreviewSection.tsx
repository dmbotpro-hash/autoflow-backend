'use client';

import { MarketingSection, SectionHeader } from './MarketingSection';
import { ScrollReveal } from './ScrollReveal';
import { BarChart3, ArrowUpRight } from 'lucide-react';

const bars = [40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88];

export default function AnalyticsPreviewSection() {
  return (
    <MarketingSection variant="light" className="bg-slate-50">
      <ScrollReveal>
        <SectionHeader
          light
          label="Analytics"
          title="Mission control for your growth"
          subtitle="Live metrics, workflow performance, and conversion — no spreadsheet exports."
        />
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'DMs delivered', value: '12.4K', delta: '+18%' },
            { label: 'Lead score avg', value: '72', delta: '+5%' },
            { label: 'AI replies', value: '3.2K', delta: '+24%' },
          ].map((m) => (
            <div
              key={m.label}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
            >
              <p className="text-xs text-slate-500">{m.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{m.value}</p>
              <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
                <ArrowUpRight size={12} /> {m.delta}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="text-violet-600" size={18} />
              <span className="text-sm font-semibold text-slate-900">
                Weekly automation volume
              </span>
            </div>
            <span className="text-[10px] text-emerald-600 font-medium animate-pulse">
              ● Live
            </span>
          </div>
          <div className="flex items-end gap-2 h-32">
            {bars.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-md bg-gradient-to-t from-violet-600 to-violet-400 opacity-90 hover:opacity-100 transition-opacity"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </ScrollReveal>
    </MarketingSection>
  );
}
