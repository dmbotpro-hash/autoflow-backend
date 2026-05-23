import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'ai';

const styles: Record<BadgeVariant, string> = {
  default: 'bg-white/5 text-[var(--af-text-secondary)] border-white/10',
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  error: 'bg-red-500/10 text-red-400 border-red-500/20',
  ai: 'bg-violet-500/10 text-violet-300 border-violet-500/25',
};

export function Badge({
  variant = 'default',
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border',
        styles[variant],
        className,
      )}
      {...props}
    />
  );
}
