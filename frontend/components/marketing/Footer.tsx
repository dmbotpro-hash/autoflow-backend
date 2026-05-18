import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-[rgba(255,255,255,0.06)] pt-16 pb-8 px-6 font-sans">
      <div className="max-w-[1100px] mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Logo & Intro */}
          <div className="md:col-span-2 select-none">
            <div className="flex items-center gap-2.5 mb-4 group cursor-default">
              <div className="w-7 h-7 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-white transition-all duration-300">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-white font-bold text-base tracking-tight font-sans">
                AutoFlow<span className="text-neutral-400 font-light ml-0.5">.</span>
              </span>
            </div>
            <p className="text-[#606060] text-sm leading-relaxed max-w-xs font-normal">
              Instagram DM automation Indian businesses ke liye. Comment-to-DM, AI replies, aur sales conversion scaling.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <div className="text-white text-[12px] font-bold tracking-wider uppercase mb-4 select-none">
              Product
            </div>
            <div className="space-y-3 flex flex-col items-start">
              {[
                { label: 'Features', href: '/#features' },
                { label: 'Pricing', href: '/#pricing' },
                { label: 'How It Works', href: '/#how-it-works' },
                { label: 'Login', href: '/login' },
                { label: 'Signup', href: '/signup' },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-[#606060] hover:text-white text-[13px] transition-all duration-150 hover:translate-x-0.5 font-medium block"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <div className="text-white text-[12px] font-bold tracking-wider uppercase mb-4 select-none">
              Company
            </div>
            <div className="space-y-3 flex flex-col items-start">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Contact', href: '/contact' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-[#606060] hover:text-white text-[13px] transition-all duration-150 hover:translate-x-0.5 font-medium block"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM METADATA BAR */}
        <div className="border-t border-[rgba(255,255,255,0.06)] pt-6 flex flex-col md:flex-row justify-between items-center gap-3 select-none">
          <div className="text-[#404040] text-[12px] font-normal font-sans">
            © 2026 AutoFlow. All rights reserved.
          </div>
          <div className="text-[#404040] text-[12px] font-normal font-sans">
            Meta Tech Provider • Indian Businesses ke liye ❤️
          </div>
        </div>
      </div>
    </footer>
  );
}
