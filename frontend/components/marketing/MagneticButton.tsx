'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export function MagneticButton({
  href,
  children,
  variant = 'primary',
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}) {
  const isPrimary = variant === 'primary';

  return (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
      <Link
        href={href}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-semibold text-sm px-6 sm:px-8 py-3.5 sm:py-4 rounded-full transition-shadow w-full sm:w-auto',
          'relative overflow-hidden group',
          isPrimary ? 'text-white shadow-lg' : 'border border-white/20 text-white hover:bg-white/5',
          className,
        )}
        style={
          isPrimary
            ? {
                background: 'linear-gradient(135deg, #818CF8, #C084FC, #22D3EE)',
                boxShadow: '0 0 24px rgba(129,140,248,0.35)',
              }
            : undefined
        }
      >
        <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
        <span className="relative flex items-center gap-2">{children}</span>
        {isPrimary && (
          <span className="absolute inset-0 rounded-full animate-pulse opacity-30 blur-md -z-10" style={{ background: '#818CF8' }} />
        )}
      </Link>
    </motion.div>
  );
}
