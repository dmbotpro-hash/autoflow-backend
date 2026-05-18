'use client';

import Link from 'next/link';
import PhoneMockup from './PhoneMockup';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-black flex items-center pt-[140px] pb-24 overflow-hidden">
      
      <div className="max-w-[1100px] w-full mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="flex flex-col items-start">
          
          {/* Trust Badge */}
          <div className="trust-badge mb-6 select-none animate-text-reveal">
            <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-pulse" />
            <span className="text-white text-xs font-medium tracking-wide">Meta Tech Provider</span>
          </div>

          {/* Heading with Letter Spacing and Text Reveal Animations */}
          <h1 className="text-white text-4xl sm:text-5xl lg:text-[56px] font-extrabold leading-[1.15] tracking-tight max-w-[700px] mb-5 font-sans animate-letter-spacing animate-text-reveal">
            Instagram Comment-to-DM Automation
          </h1>

          {/* Subtext with Staggered Slow Text Reveal */}
          <p className="text-[#A0A0A0] text-base sm:text-lg leading-relaxed max-w-[500px] mb-8 font-normal animate-text-reveal-slow opacity-0 [animation-fill-mode:forwards] [animation-delay:150ms]">
            Koi bhi keyword comment kare — AutoFlow turant DM bhej deta hai. Leads capture karo, sales badhao. 24/7 automatic.
          </p>

          {/* CTA Buttons with Hover Micro-animations */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-8 animate-text-reveal-slow opacity-0 [animation-fill-mode:forwards] [animation-delay:300ms]">
            <Link
              href="/signup"
              className="bg-white hover:bg-neutral-200 text-black font-semibold text-sm px-6 py-3.5 rounded-full transition-all text-center flex items-center justify-center gap-1.5 active:scale-95 duration-200 hover:scale-[1.02] shadow-md shadow-white/5"
            >
              Free Mein Shuru Karo <span>→</span>
            </Link>
            <a
              href="#how-it-works"
              className="border border-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.3)] font-medium text-sm px-6 py-3.5 rounded-full transition-all text-center flex items-center justify-center active:scale-95 duration-200 hover:scale-[1.02]"
            >
              Kaise Kaam Karta Hai?
            </a>
          </div>

          {/* Social Proof with Subtle Staggered Appear */}
          <div className="flex items-center gap-3 select-none animate-text-reveal-slow opacity-0 [animation-fill-mode:forwards] [animation-delay:450ms]">
            {/* Avatar circles */}
            <div className="flex -space-x-2.5">
              {[
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=40&h=40&q=80',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=40&h=40&q=80',
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=40&h=40&q=80',
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=40&h=40&q=80'
              ].map((src, i) => (
                <img 
                  key={i}
                  src={src}
                  alt="Avatar" 
                  className="w-6.5 h-6.5 rounded-full border border-black object-cover transition-transform duration-200 hover:scale-110 cursor-pointer"
                />
              ))}
            </div>
            <span className="text-[#A0A0A0] text-xs sm:text-sm font-medium">
              Trusted by +14,000 creators
            </span>
          </div>
        </div>

        {/* Right Phone Mockup with Delayed Smooth Entry */}
        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <PhoneMockup />
        </motion.div>
      </div>

    </section>
  );
}
