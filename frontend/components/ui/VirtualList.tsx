'use client';

import { useCallback, useRef, useState, type ReactNode } from 'react';

/** Lightweight fixed-height virtual scroll (no extra deps) */
export function VirtualList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  getKey,
  className = '',
  overscan = 4,
}: {
  items: T[];
  height: number | string;
  itemHeight: number;
  renderItem: (item: T, index: number) => ReactNode;
  getKey: (item: T, index: number) => string;
  className?: string;
  overscan?: number;
}) {
  const [scrollTop, setScrollTop] = useState(0);
  const raf = useRef<number | null>(null);

  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const top = e.currentTarget.scrollTop;
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => setScrollTop(top));
  }, []);

  if (items.length === 0) return null;

  const totalHeight = items.length * itemHeight;
  const viewH = typeof height === 'number' ? height : 400;
  const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(viewH / itemHeight) + overscan * 2;
  const end = Math.min(items.length, start + visibleCount);
  const slice = items.slice(start, end);

  return (
    <div
      className={`overflow-y-auto overscroll-contain ${className}`}
      style={{ height }}
      onScroll={onScroll}
      role="list"
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {slice.map((item, i) => {
          const index = start + i;
          return (
            <div
              key={getKey(item, index)}
              style={{
                position: 'absolute',
                top: index * itemHeight,
                left: 0,
                right: 0,
                height: itemHeight,
              }}
              role="listitem"
            >
              {renderItem(item, index)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
