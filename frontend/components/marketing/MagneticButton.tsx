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
  const base =
    variant === 'primary'
      ? 'bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30'
      : 'border border-white/20 text-white hover:bg-white/5';

  return (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
      <Link
        href={href}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-semibold text-sm px-8 py-4 rounded-full transition-shadow',
          'relative overflow-hidden group',
          base,
          className,
        )}
      >
        <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
        <span className="relative flex items-center gap-2">{children}</span>
        {variant === 'primary' && (
          <span className="absolute inset-0 rounded-full animate-pulse bg-violet-500/20 blur-md -z-10" />
        )}
      </Link>
    </motion.div>
  );
}
