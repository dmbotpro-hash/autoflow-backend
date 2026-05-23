'use client';

import { motion } from 'framer-motion';

export function FloatingPanels() {
  return (
    <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[45%] h-[80%] pointer-events-none">
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[8%] right-[15%] w-48 h-28 rounded-xl af-glass border border-white/10 p-3 shadow-2xl"
      >
        <p className="text-[10px] text-violet-400 font-semibold">Workflows</p>
        <p className="text-xs text-white mt-1">3 active automations</p>
        <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full w-3/4 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" />
        </div>
      </motion.div>
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute top-[42%] right-[5%] w-44 h-24 rounded-xl af-glass border border-white/10 p-3"
      >
        <p className="text-[10px] text-cyan-400">Inbox</p>
        <p className="text-lg font-bold text-white">24</p>
        <p className="text-[10px] text-slate-500">unread DMs</p>
      </motion.div>
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-[15%] right-[20%] w-40 h-20 rounded-xl af-glass border border-emerald-500/20 p-3"
      >
        <p className="text-[10px] text-emerald-400">+412 leads</p>
        <p className="text-xs text-slate-400">this week</p>
      </motion.div>
    </div>
  );
}
