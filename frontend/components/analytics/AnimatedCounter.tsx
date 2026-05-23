'use client';

import { useEffect, useRef, useState } from 'react';

export function AnimatedCounter({
  value,
  duration = 800,
  suffix = '',
}: {
  value: number;
  duration?: number;
  suffix?: string;
}) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);

  useEffect(() => {
    const start = fromRef.current;
    const diff = value - start;
    if (diff === 0) {
      fromRef.current = value;
      return;
    }
    const startTime = performance.now();

    const tick = (now: number) => {
      const p = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const next = Math.round(start + diff * eased);
      setDisplay(next);
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        fromRef.current = value;
      }
    };
    requestAnimationFrame(tick);
  }, [value, duration]);

  return (
    <span className="tabular-nums">
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}
