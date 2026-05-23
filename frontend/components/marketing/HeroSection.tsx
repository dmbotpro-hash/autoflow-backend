'use client';

import Link from 'next/link';
import PhoneMockup from './PhoneMockup';
import { motion } from 'framer-motion';
import { AnimatedGrid } from './AnimatedGrid';
import { FloatingPanels } from './FloatingPanels';
import { MagneticButton } from './MagneticButton';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-[#050816] flex items-center pt-[120px] pb-24 overflow-hidden">
      <AnimatedGrid />
      <FloatingPanels />

      <div className="max-w-[1100px] w-full mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="flex flex-col items-start">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="trust-badge mb-6 select-none"
          >
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#34d399]" />
            <span className="text-white text-xs font-medium tracking-wide">
              Meta Tech Provider • AI-native automation
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-white text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold leading-[1.1] tracking-tight max-w-[640px] mb-5"
          >
            Turn Every Instagram Comment Into{' '}
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              AI-Powered Revenue
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-[500px] mb-8"
          >
            Keyword comment → instant DM. AI replies, unified inbox, and live
            workflows — the operating system for creator growth.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-8"
          >
            <MagneticButton href="/signup">Get Started Free →</MagneticButton>
            <Link
              href="#demo"
              className="border border-white/20 text-white hover:bg-white/5 font-medium text-sm px-6 py-3.5 rounded-full transition-all text-center flex items-center justify-center hover:scale-[1.02] active:scale-95"
            >
              Watch it live
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="flex items-center gap-3 select-none"
          >
            <div className="flex -space-x-2">
              {['P', 'R', 'S', 'A'].map((letter, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border-2 border-[#050816] bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-[10px] font-bold text-white"
                >
                  {letter}
                </div>
              ))}
            </div>
            <span className="text-slate-500 text-xs sm:text-sm font-medium">
              Trusted by 14,000+ creators
            </span>
          </motion.div>
        </div>

        <motion.div
          className="flex justify-center relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-violet-600/20 rounded-full blur-3xl" />
            <PhoneMockup />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
