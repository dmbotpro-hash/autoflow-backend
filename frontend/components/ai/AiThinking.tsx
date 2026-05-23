'use client';

import React from 'react';

interface AiThinkingProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export function AiThinking({ className = '', size = 'md', label = 'AI is thinking' }: AiThinkingProps) {
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : size === 'lg' ? 'w-3 h-3' : 'w-2 h-2';

  return (
    <div className={`flex items-center gap-2 ${className}`} aria-label={label} role="status">
      <div className="ai-thinking-orb" aria-hidden="true" />
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`${dotSize} rounded-full bg-violet-400 ai-thinking-dot`}
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </div>
      {label && (
        <span className="text-xs text-violet-400/70 font-medium tracking-wide">{label}</span>
      )}
    </div>
  );
}

interface AiShimmerCardProps {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}

export function AiShimmerCard({ children, active = false, className = '' }: AiShimmerCardProps) {
  return (
    <div className={`relative overflow-hidden ${className} ${active ? 'ai-shimmer-active' : ''}`}>
      {active && (
        <div
          className="absolute inset-0 pointer-events-none z-0"
          aria-hidden="true"
        >
          <div className="ai-shimmer-sweep" />
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

interface NeuralGlowProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export function NeuralGlow({ children, className = '', intensity = 'medium' }: NeuralGlowProps) {
  const glowClass =
    intensity === 'low'
      ? 'neural-glow-low'
      : intensity === 'high'
      ? 'neural-glow-high'
      : 'neural-glow-medium';

  return (
    <div className={`${glowClass} ${className}`}>
      {children}
    </div>
  );
}
