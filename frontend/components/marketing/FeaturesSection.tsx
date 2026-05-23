'use client';

import { motion } from 'framer-motion';
import { MarketingSection, SectionHeader } from './MarketingSection';

const features = [
  {
    icon: '💬',
    title: 'Comment-to-DM',
    desc: 'Any keyword comment triggers an instant DM. Works on Reels, posts, and Stories.',
  },
  {
    icon: '🤖',
    title: 'AI Auto-Reply',
    desc: 'AI detects sales vs support intent and sends smart, contextual replies automatically.',
  },
  {
    icon: '📥',
    title: 'Unified Inbox',
    desc: 'All DMs in one place. Real-time updates. Manage conversations with your team.',
  },
  {
    icon: '📊',
    title: 'Analytics',
    desc: 'Track delivery rate, open rate, and conversions — all in one dashboard.',
  },
  {
    icon: '🔒',
    title: 'Meta-Approved',
    desc: 'Uses official Instagram Graph API. No ban risk. 100% policy compliant.',
  },
  {
    icon: '⚡',
    title: 'Workflow Builder',
    desc: 'Build complex automations with delays, conditions, and AI nodes visually.',
  },
];

export default function FeaturesSection() {
  return (
    <MarketingSection id="features" variant="light">
      <SectionHeader
        light
        label="Features"
        title="Everything you need to scale"
        subtitle="One platform for capture, conversation, and conversion."
      />

      <motion.div
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.08 },
          },
        }}
      >
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            whileHover={{ y: -4 }}
            className="group bg-white border border-slate-200 rounded-2xl p-8 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/50 transition-all duration-200 cursor-default"
          >
            <div className="text-2xl mb-4 transition-transform duration-200 group-hover:scale-110">
              {feature.icon}
            </div>
            <h3 className="text-slate-900 font-semibold text-lg mb-2.5">{feature.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed group-hover:text-slate-800">
              {feature.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </MarketingSection>
  );
}
