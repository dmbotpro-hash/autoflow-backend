'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type Variant = 'dark' | 'light' | 'cinematic';

const variants: Record<Variant, string> = {
  dark: 'bg-[#050816] text-white',
  light: 'bg-white text-slate-900',
  cinematic:
    'bg-[#050816] text-white premium-radial-glow premium-dot-grid relative overflow-hidden',
};

export function MarketingSection({
  id,
  variant = 'dark',
  className,
  children,
  noPadding,
}: {
  id?: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
  noPadding?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(variants[variant], !noPadding && 'py-20 md:py-28 px-6', className)}
    >
      <div className="max-w-[1100px] mx-auto relative z-10">{children}</div>
    </section>
  );
}

export function SectionHeader({
  label,
  title,
  subtitle,
  light,
}: {
  label: string;
  title: string;
  subtitle?: string;
  light?: boolean;
}) {
  return (
    <div className="text-center mb-12 md:mb-16 select-none">
      <p
        className={cn(
          'text-xs font-semibold uppercase tracking-[0.2em] mb-3',
          light ? 'text-violet-600' : 'text-violet-400/80',
        )}
      >
        {label}
      </p>
      <h2
        className={cn(
          'text-3xl sm:text-4xl font-bold tracking-tight leading-[1.15]',
          light ? 'text-slate-900' : 'text-white',
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'mt-4 text-base max-w-xl mx-auto leading-relaxed',
            light ? 'text-slate-600' : 'text-slate-400',
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
