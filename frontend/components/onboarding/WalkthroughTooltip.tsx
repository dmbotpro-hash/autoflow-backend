'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function useWalkthrough(tourId: string) {
  const key = `af_tour_${tourId}`;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(key)) {
      setVisible(true);
    }
  }, [key]);

  const dismiss = () => {
    localStorage.setItem(key, '1');
    setVisible(false);
  };

  return { visible, dismiss };
}

export function WalkthroughTooltip({
  tourId,
  title,
  description,
  position = 'bottom',
  className,
}: {
  tourId: string;
  title: string;
  description: string;
  position?: 'top' | 'bottom';
  className?: string;
}) {
  const { visible, dismiss } = useWalkthrough(tourId);

  if (!visible) return null;

  return (
    <div
      className={cn(
        'absolute z-30 w-64 af-glass border border-violet-500/30 rounded-xl p-4 shadow-xl animate-in fade-in slide-in-from-bottom-2',
        position === 'top' ? 'bottom-full mb-2 left-0' : 'top-full mt-2 left-0',
        className,
      )}
      role="status"
    >
      <button
        type="button"
        onClick={dismiss}
        className="absolute top-2 right-2 text-[var(--af-text-muted)] hover:text-[var(--af-text-primary)]"
        aria-label="Dismiss tour"
      >
        <X size={14} />
      </button>
      <p className="text-xs font-semibold text-violet-300 mb-1">{title}</p>
      <p className="text-[11px] text-[var(--af-text-muted)] leading-relaxed pr-4">
        {description}
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="mt-3 text-[10px] font-bold text-violet-400 hover:text-violet-300"
      >
        Got it →
      </button>
    </div>
  );
}
