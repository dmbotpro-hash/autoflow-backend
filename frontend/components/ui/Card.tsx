import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export function Card({
  className,
  glow,
  ...props
}: HTMLAttributes<HTMLDivElement> & { glow?: boolean }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-[var(--af-border-subtle)] bg-[var(--af-bg-card)]/80',
        'backdrop-blur-sm transition-shadow duration-[var(--af-duration-normal)]',
        glow && 'af-glow-border',
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5 pb-0', className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5', className)} {...props} />;
}
