'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'ai';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  aiProcessing?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/20 hover:opacity-95 hover:shadow-violet-500/30 border border-white/10',
  secondary:
    'af-glass text-[var(--af-text-primary)] hover:bg-white/5 border-[var(--af-border-subtle)]',
  ghost: 'text-[var(--af-text-secondary)] hover:text-[var(--af-text-primary)] hover:bg-white/5',
  danger: 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20',
  ai: 'bg-violet-500/10 text-violet-300 border border-violet-500/30 hover:border-violet-400/50 af-glow-border',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs rounded-lg',
  md: 'h-10 px-4 text-sm rounded-xl',
  lg: 'h-12 px-6 text-sm rounded-xl',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading,
      aiProcessing,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading || aiProcessing;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-[var(--af-duration-fast)]',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500/50',
          'disabled:opacity-50 disabled:pointer-events-none',
          aiProcessing && 'animate-pulse',
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {aiProcessing && !loading && (
          <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
