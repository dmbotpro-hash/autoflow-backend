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
        'text-center py-12 sm:py-16 px-4 sm:px-6 premium-card rounded-2xl relative overflow-hidden',
        className,
      )}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: 'linear-gradient(90deg, #818CF8, #C084FC, #22D3EE)' }}
      />
      <div
        className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center"
        style={{
          background: 'rgba(129,140,248,0.10)',
          border: '1px solid rgba(129,140,248,0.20)',
        }}
      >
        {icon}
      </div>
      <h2 className="text-base sm:text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h2>
      <p className="text-sm max-w-md mx-auto leading-relaxed px-2" style={{ color: 'var(--text-muted)' }}>
        {description}
      </p>
      {children}
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3 mt-6 px-2">
        {primaryAction && (
          <Link
            href={primaryAction.href}
            className="inline-flex items-center justify-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-xl text-white transition-all active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #818CF8, #C084FC, #22D3EE)',
              boxShadow: '0 0 16px rgba(129,140,248,0.3)',
            }}
          >
            {primaryAction.label}
          </Link>
        )}
        {secondaryAction && (
          <Link
            href={secondaryAction.href}
            className="text-sm px-4 py-2.5 rounded-xl border transition-colors text-center"
            style={{
              color: 'var(--text-secondary)',
              borderColor: 'var(--border-glass)',
            }}
          >
            {secondaryAction.label}
          </Link>
        )}
      </div>
    </div>
  );
}
