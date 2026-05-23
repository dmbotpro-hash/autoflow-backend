'use client';

import { useEffect, useRef } from 'react';

/** Swipe right to trigger back (mobile inbox chat → list) */
export function useSwipeBack(
  enabled: boolean,
  onBack: () => void,
  thresholdPx = 72,
) {
  const startX = useRef(0);
  const startY = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const onTouchStart = (e: TouchEvent) => {
      startX.current = e.touches[0].clientX;
      startY.current = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX.current;
      const dy = Math.abs(e.changedTouches[0].clientY - startY.current);
      if (dx > thresholdPx && dy < 80 && startX.current < 48) {
        onBack();
      }
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [enabled, onBack, thresholdPx]);
}
