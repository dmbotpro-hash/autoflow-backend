'use client';
import { Bell } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { usePathname } from 'next/navigation';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/inbox': 'Inbox',
  '/workflows': 'Workflows',
  '/contacts': 'Contacts & Leads',
  '/billing': 'Billing',
  '/settings': 'Settings',
};

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const title = pageTitles[pathname] || 'AutoFlow';

  return (
    <header className="h-14 border-b border-gray-800 bg-gray-950 flex items-center justify-between px-4 sticky top-0 z-10">
      <h1 className="text-white font-semibold text-base ml-8 md:ml-0">{title}</h1>
      <div className="flex items-center gap-3">
        <button className="relative text-gray-400 hover:text-white transition-colors">
          <Bell size={18} />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-orange-500 rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center cursor-pointer">
          <span className="text-white text-xs font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </span>
        </div>
      </div>
    </header>
  );
}
