'use client';


import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  LayoutDashboard,
  MessageSquare,
  Zap,
  Users,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../lib/hooks/useAuth';

type SidebarVariant = 'desktop' | 'mobile';

const menuItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Inbox', href: '/inbox', icon: MessageSquare },
  { label: 'Workflows', href: '/workflows', icon: Zap },
  { label: 'Contacts', href: '/contacts', icon: Users },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar({
  variant = 'desktop',
  onNavigate,
  autoFocus,
}: {
  variant?: SidebarVariant;
  onNavigate?: () => void;
  autoFocus?: boolean;
}) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const classes =
    variant === 'desktop'
      ? 'w-64 bg-[#0F0F0F] border-r border-[rgba(255,255,255,0.08)] flex flex-col min-h-screen sticky top-0 z-30 font-sans'
      : 'w-72 bg-[#0F0F0F] border-r border-[rgba(255,255,255,0.08)] flex flex-col h-full font-sans';

  return (
    <div className={classes}>
      {/* Brand Logo */}
      <div className="p-6 flex items-center gap-2 border-b border-[rgba(255,255,255,0.06)]">
        <Link href="/" className="flex items-center">
          <span className="text-white font-bold text-lg tracking-tight select-none">AutoFlow</span>
        </Link>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">

        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 group ${
                isActive
                  ? 'bg-[#141414] text-white border border-[rgba(255,255,255,0.08)]'
                  : 'text-[#A0A0A0] hover:text-white border border-transparent'
              }`}
            >
              <Icon
                size={16}
                className={`transition-colors duration-150 ${
                  isActive ? 'text-white' : 'text-[#606060] group-hover:text-white'
                }`}
              />
              <span className="text-xs font-semibold tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout button */}
      <div className="p-4 border-t border-[rgba(255,255,255,0.06)]">
        <button
          autoFocus={autoFocus}
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full text-[#A0A0A0] hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all duration-150 group border border-transparent"
        >
          <LogOut size={16} className="text-[#606060] group-hover:text-red-400" />
          <span className="text-xs font-semibold tracking-wide">Logout</span>
        </button>
      </div>
    </div>
  );
}

