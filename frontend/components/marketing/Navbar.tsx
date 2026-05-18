'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-[64px] flex items-center transition-all duration-300 font-sans ${
        scrolled
          ? 'bg-[#000000]/70 backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)] shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-[1100px] w-full mx-auto px-6 flex items-center justify-between">
        
        {/* Brand Logo with Premium SVG Glyph */}
        <Link href="/" className="flex items-center gap-2.5 select-none group">
          <div className="w-7 h-7 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-white transition-all duration-300 group-hover:bg-white group-hover:text-black select-none">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-white font-bold text-base tracking-tight font-sans transition-transform duration-200">
            AutoFlow<span className="text-neutral-400 font-light ml-0.5">.</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 select-none">
          {[
            ['Features', '#features'],
            ['How It Works', '#how-it-works'],
            ['Pricing', '#pricing'],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="text-[#A0A0A0] hover:text-white text-[13px] font-medium transition-all duration-150 relative py-1 hover:translate-y-[-1px]"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Desktop CTA Action Panel */}
        <div className="hidden md:flex items-center gap-6 select-none">
          <Link
            href="/login"
            className="text-[#A0A0A0] hover:text-white text-[13px] font-medium transition-all duration-150 hover:translate-y-[-1px]"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-white hover:bg-neutral-200 text-black text-xs font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-sm"
          >
            Free Shuru Karo <span>→</span>
          </Link>
        </div>

        {/* Mobile Navigation Trigger Button */}
        <button
          className="md:hidden text-[#A0A0A0] hover:text-white transition-colors duration-150"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Glassy Dropdown Menu Drawer */}
      {menuOpen && (
        <div className="absolute top-[64px] left-0 right-0 z-50 bg-[#000000] border-b border-[rgba(255,255,255,0.08)] px-6 py-6 flex flex-col gap-4 font-sans select-none animate-text-reveal">
          {['Features', 'How It Works', 'Pricing'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              className="text-[#A0A0A0] hover:text-white text-[14px] font-medium py-1 transition-colors duration-150"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </a>
          ))}
          <div className="h-[1px] bg-[rgba(255,255,255,0.06)] my-1" />
          <Link
            href="/login"
            className="text-[#A0A0A0] hover:text-white text-[14px] font-medium py-1 transition-colors duration-150"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-white hover:bg-neutral-200 text-black text-xs font-semibold px-4 py-3 rounded-full text-center mt-2 transition-all duration-150 active:scale-95"
            onClick={() => setMenuOpen(false)}
          >
            Free Shuru Karo →
          </Link>
        </div>
      )}
    </nav>
  );
}
