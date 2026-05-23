'use client';

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:px-4 focus:py-2 focus:rounded-xl focus:bg-violet-600 focus:text-white focus:text-sm focus:font-semibold focus:outline-none"
    >
      Skip to main content
    </a>
  );
}
