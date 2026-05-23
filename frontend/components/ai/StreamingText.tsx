'use client';

import { useEffect, useRef } from 'react';

interface StreamingTextProps {
  text: string;
  isStreaming?: boolean;
  className?: string;
  cursorColor?: string;
}

export function StreamingText({
  text,
  isStreaming = false,
  className = '',
  cursorColor = '#8b5cf6',
}: StreamingTextProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [text]);

  return (
    <span className={`inline ${className}`} ref={ref}>
      {text}
      {isStreaming && (
        <span
          className="inline-block w-0.5 h-4 ml-0.5 align-middle animate-cursor-blink rounded-full"
          style={{ backgroundColor: cursorColor }}
          aria-hidden="true"
        />
      )}
    </span>
  );
}
