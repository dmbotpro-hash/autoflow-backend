'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'w-full h-10 px-3 rounded-xl text-sm',
        'bg-[var(--af-bg-muted)] border border-[var(--af-border-subtle)]',
        'text-[var(--af-text-primary)] placeholder:text-[var(--af-text-muted)]',
        'transition-colors duration-[var(--af-duration-fast)]',
        'focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        error && 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/30',
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = 'Input';
