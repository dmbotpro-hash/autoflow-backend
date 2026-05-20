'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Connect Instagram',
    desc: 'Connect in one click using Meta OAuth. No password sharing required. Works for both Creator and Business accounts.',
  },
  {
    number: '02',
    title: 'Set Keyword & Message',
    desc: 'Choose a trigger keyword like "PRICE" or "LINK", then customize your automated response with your link, offer, or discount code.',
  },
  {
    number: '03',
    title: 'Watch Comments Turn into DMs',
    desc: 'As soon as anyone comments your keyword, AutoFlow sends an automated DM in seconds. Works for Reels, Stories, and posts 24/7.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-black py-24 px-6">
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
            Simple Process
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-white text-3xl sm:text-[32px] font-semibold leading-[1.25] tracking-tight mt-3 font-sans"
          >
            Set up in under 2 minutes
          </motion.h2>
        </div>

        {/* Steps */}
        <motion.div 
          className="grid md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            }
          }}
        >
          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
              }}
              whileHover={{ y: -4 }}
              transition={{ type: "tween", duration: 0.2 }}
              className="group bg-[#0F0F0F] border border-[rgba(255,255,255,0.08)] rounded-2xl p-7 hover:border-[rgba(255,255,255,0.18)] transition-all duration-200 cursor-default select-none"
            >
              {/* Step number float animation on parent hover */}
              <div className="text-white text-sm opacity-40 font-semibold mb-5 leading-none transition-transform duration-200 group-hover:translate-y-[-2px] group-hover:opacity-70 font-mono">
                {step.number}
              </div>
              <h3 className="text-white font-semibold text-lg mb-3 leading-snug transition-colors duration-200 font-sans">
                {step.title}
              </h3>
              <p className="text-[#A0A0A0] text-[15px] leading-relaxed font-normal transition-colors duration-200 group-hover:text-white">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
