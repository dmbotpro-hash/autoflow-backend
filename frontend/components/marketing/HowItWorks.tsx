'use client';

import { motion } from 'framer-motion';
import { MarketingSection, SectionHeader } from './MarketingSection';

const steps = [
  {
    number: '01',
    title: 'Connect Instagram',
    desc: 'Connect in one click using Meta OAuth. No password sharing required.',
  },
  {
    number: '02',
    title: 'Set Keyword & Message',
    desc: 'Choose a trigger like "PRICE" or "LINK", then customize your automated DM.',
  },
  {
    number: '03',
    title: 'Watch Comments Become DMs',
    desc: 'AutoFlow sends DMs in seconds on Reels, Stories, and posts — 24/7.',
  },
];

export default function HowItWorks() {
  return (
    <MarketingSection id="how-it-works" variant="light" className="bg-slate-50">
      <SectionHeader
        light
        label="Simple process"
        title="Live in three steps"
        subtitle="From zero to automated revenue in under two minutes."
      />

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, i) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="relative bg-white rounded-2xl border border-slate-200 p-8 hover:border-violet-200 transition-colors"
          >
            <span className="text-4xl font-extrabold text-violet-100 absolute top-4 right-6">
              {step.number}
            </span>
            <h3 className="text-slate-900 font-semibold text-lg mb-3 relative z-10">
              {step.title}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed relative z-10">
              {step.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </MarketingSection>
  );
}
