'use client';

import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { Menu } from 'lucide-react';

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-black">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar variant="desktop" />
      </div>

      {/* Mobile sidebar drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            aria-label="Close sidebar"
            onClick={() => setIsSidebarOpen(false)}
            className="absolute inset-0 bg-black/60"
          />

          <div className="relative h-full">
            <Sidebar
              variant="mobile"
              onNavigate={() => setIsSidebarOpen(false)}
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 min-h-screen text-white">
        {/* Mobile header */}
        <div className="md:hidden sticky top-0 z-40 bg-black/90 backdrop-blur border-b border-[rgba(255,255,255,0.06)] px-4 py-3 flex items-center gap-3">
          <button
            aria-label="Open sidebar"
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-xl bg-[#0F0F0F] border border-[rgba(255,255,255,0.08)] text-white"
          >
            <Menu size={18} />
          </button>
          <div className="text-xs font-semibold tracking-wide text-white/90 select-none">AutoFlow</div>
        </div>

        <main className="min-h-screen bg-black">{children}</main>
      </div>
    </div>
  );
}


