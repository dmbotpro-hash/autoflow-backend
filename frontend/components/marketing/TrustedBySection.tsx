'use client';

import { MarketingSection, SectionHeader } from './MarketingSection';
import { ScrollReveal } from './ScrollReveal';

const logos = [
  'CreatorHub',
  'DigiMart',
  'StyleCo',
  'FoodieIN',
  'AgencyX',
  'BoostLab',
  'ReelPro',
  'ScaleUp',
];

export default function TrustedBySection() {
  return (
    <MarketingSection variant="light" className="border-y border-slate-200/80 py-14 md:py-16">
      <ScrollReveal>
        <SectionHeader
          light
          label="Trusted by"
          title="14,000+ Indian creators & brands"
          subtitle="From solo creators to growing agencies — automation that feels premium."
        />
      </ScrollReveal>
      <div className="relative overflow-hidden mt-8 mask-fade-x">
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {[...logos, ...logos].map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="text-slate-400 font-bold text-lg md:text-xl tracking-tight shrink-0"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </MarketingSection>
  );
}
