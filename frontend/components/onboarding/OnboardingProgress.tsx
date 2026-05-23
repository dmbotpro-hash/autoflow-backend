'use client';

import { Check } from 'lucide-react';
import { ONBOARDING_STEPS } from '@/lib/store/onboarding.store';
import { cn } from '@/lib/utils/cn';

export function OnboardingProgress({
  step,
  celebrateStep,
}: {
  step: number;
  celebrateStep?: number | null;
}) {
  const pct = ((step + 1) / ONBOARDING_STEPS.length) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex items-center justify-between text-xs text-[var(--af-text-muted)] mb-2">
        <span>
          Step {step + 1} of {ONBOARDING_STEPS.length}
        </span>
        <span className="text-violet-400 font-medium">{ONBOARDING_STEPS[step].title}</span>
      </div>
      <div className="h-2 bg-black/30 rounded-full overflow-hidden border border-[var(--af-border-subtle)]">
        <div
          className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-500 transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between mt-4 gap-1">
        {ONBOARDING_STEPS.map((s, i) => {
          const done = i < step;
          const active = i === step;
          const celebrate = celebrateStep === i;
          return (
            <div
              key={s.id}
              className={cn(
                'flex-1 flex flex-col items-center gap-1 min-w-0',
                celebrate && 'animate-bounce',
              )}
            >
              <div
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all',
                  done && 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
                  active && 'bg-violet-500/20 border-violet-500/50 text-violet-300 scale-110',
                  !done && !active && 'bg-black/20 border-[var(--af-border-subtle)] text-[var(--af-text-muted)]',
                )}
              >
                {done ? <Check size={12} /> : i + 1}
              </div>
              <span className="text-[9px] text-[var(--af-text-muted)] truncate w-full text-center hidden sm:block">
                {s.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
