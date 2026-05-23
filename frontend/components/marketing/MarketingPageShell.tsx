import Link from 'next/link';
import type { ReactNode } from 'react';
import Navbar from './Navbar';

export function MarketingPageShell({
  title,
  subtitle,
  children,
  showNav = true,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  showNav?: boolean;
}) {
  return (
    <div
      className="min-h-[100dvh] text-[var(--text-primary)] premium-dot-grid overflow-x-hidden"
      style={{ background: 'var(--bg-main)' }}
    >
      {showNav && <Navbar />}
      <main className={`page-container ${showNav ? 'pt-24 sm:pt-28' : 'pt-8'} pb-16 sm:pb-20`}>
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm font-medium mb-6 sm:mb-8 transition-colors"
          style={{ color: '#A5B4FC' }}
        >
          ← Back to homepage
        </Link>
        <header className="mb-8 sm:mb-10 max-w-3xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {subtitle}
            </p>
          )}
        </header>
        <div className="max-w-3xl space-y-6 text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {children}
        </div>
      </main>
    </div>
  );
}

export function MarketingContentCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="premium-card rounded-2xl p-5 sm:p-6">
      <h2 className="text-base sm:text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h2>
      <div style={{ color: 'var(--text-secondary)' }}>{children}</div>
    </div>
  );
}
