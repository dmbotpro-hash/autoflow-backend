'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export function EmptyState({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  children,
  className,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'text-center py-16 px-6 af-glass rounded-2xl border border-[var(--af-border-subtle)] relative overflow-hidden',
        className,
      )}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-500" />
      <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-violet-500/10 border border-violet-500/25 flex items-center justify-center">
        {icon}
      </div>
      <h2 className="text-lg font-bold text-[var(--af-text-primary)] mb-2">{title}</h2>
      <p className="text-sm text-[var(--af-text-muted)] max-w-md mx-auto leading-relaxed">
        {description}
      </p>
      {children}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
        {primaryAction && (
          <Link
            href={primaryAction.href}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg transition-all"
          >
            {primaryAction.label}
          </Link>
        )}
        {secondaryAction && (
          <Link
            href={secondaryAction.href}
            className="text-sm text-[var(--af-text-secondary)] hover:text-[var(--af-text-primary)] px-4 py-2.5 rounded-xl border border-[var(--af-border-subtle)] hover:bg-white/5 transition-colors"
          >
            {secondaryAction.label}
          </Link>
        )}
      </div>
    </div>
  );
}
