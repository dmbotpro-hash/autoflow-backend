'use client';

import { motion } from 'framer-motion';

const features = [
  {
    category: 'ENGAGEMENT',
    title: 'Comment-to-DM',
    desc: 'Koi bhi keyword comment kare — instant DM jaaye. Reels, posts, stories sab pe kaam karta hai.',
  },
  {
    category: 'ARTIFICIAL INTELLIGENCE',
    title: 'AI Auto-Reply',
    desc: 'AI khud detect karta hai sales inquiry hai ya support. Us hisaab se smart reply bhejta hai.',
  },
  {
    category: 'COMMUNICATION',
    title: 'Unified Inbox',
    desc: 'Saare DMs ek jagah. Real-time updates. Team ke saath manage karo.',
  },
  {
    category: 'METRICS & ANALYTICS',
    title: 'Advanced Analytics',
    desc: 'Kitne DMs gaye, kitne opens hue, kitni conversions — sab ek dashboard pe.',
  },
  {
    category: 'SAFETY & COMPLIANCE',
    title: 'Meta-Approved API',
    desc: 'Official Instagram Graph API use karta hai. Koi ban risk nahi. 100% safe.',
  },
  {
    category: 'AUTOMATION ENGINE',
    title: 'Visual Workflow Builder',
    desc: 'Visual drag-drop se complex automations banao. Delay, conditions, AI nodes — sab kuch.',
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
            Sab Kuch Ek Jagah
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
              <div className="text-[#A0A0A0] text-[10px] font-bold tracking-wider uppercase mb-3 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-white select-none">
                {feature.category}
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
