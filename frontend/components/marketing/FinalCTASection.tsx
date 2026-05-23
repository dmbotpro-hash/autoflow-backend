'use client';

import { MarketingSection } from './MarketingSection';
import { ScrollReveal } from './ScrollReveal';
import { MagneticButton } from './MagneticButton';
import { AnimatedGrid } from './AnimatedGrid';

export default function FinalCTASection() {
  return (
    <MarketingSection variant="cinematic" noPadding className="py-28 md:py-36 relative">
      <AnimatedGrid />
      <div className="max-w-[1100px] mx-auto px-6 relative z-10 text-center">
        <ScrollReveal>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.1] mb-5">
            Turn every comment into
            <span className="block bg-gradient-to-r from-blue-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              AI-powered revenue
            </span>
          </h2>
          <p className="text-slate-400 text-base max-w-md mx-auto mb-10">
            500 DMs/month free. No credit card. Go live in under 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticButton href="/signup">Free mein shuru karo →</MagneticButton>
            <MagneticButton href="/login" variant="secondary">
              Login
            </MagneticButton>
          </div>
        </ScrollReveal>
      </div>
    </MarketingSection>
  );
}
