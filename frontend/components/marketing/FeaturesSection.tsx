'use client';

import { motion } from 'framer-motion';

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
    <section id="features" className="bg-black py-24 px-6">
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <div className="text-center mb-16 select-none">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 0.5, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="section-label"
          >
            FEATURES
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-white text-3xl sm:text-[32px] font-semibold leading-[1.25] tracking-tight mt-3 font-sans"
          >
            Everything You Need to Scale
          </motion.h2>
        </div>

        {/* Grid */}
        <motion.div 
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.08 },
            }
          }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
              }}
              whileHover={{ y: -4 }}
              transition={{ type: "tween", duration: 0.2 }}
              className="group bg-[#0F0F0F] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 hover:bg-[#141414] hover:border-[rgba(255,255,255,0.18)] transition-all duration-200 cursor-default select-none"
            >
              <div className="text-2xl mb-4 select-none transition-transform duration-200 group-hover:scale-110">
                {feature.icon}
              </div>
              <h3 className="text-white font-semibold text-lg mb-2.5 leading-snug font-sans">
                {feature.title}
              </h3>
              <p className="text-[#A0A0A0] text-sm sm:text-[15px] leading-relaxed font-normal transition-colors duration-200 group-hover:text-white">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
