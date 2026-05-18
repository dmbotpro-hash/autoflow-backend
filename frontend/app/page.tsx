import Navbar from '@/components/marketing/Navbar';
import HeroSection from '@/components/marketing/HeroSection';
import HowItWorks from '@/components/marketing/HowItWorks';
import FeaturesSection from '@/components/marketing/FeaturesSection';
import PricingSection from '@/components/marketing/PricingSection';
import TestimonialsSection from '@/components/marketing/TestimonialsSection';
import ComplianceAndFaq from '@/components/marketing/ComplianceAndFaq';
import Footer from '@/components/marketing/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'AutoFlow — Instagram Comment-to-DM Automation for Indian Businesses',
  description:
    'AutoFlow se Instagram automation karo. Koi bhi keyword comment kare — turant DM jaaye. Leads capture karo, sales badhao. 24/7 automatic. Free plan available.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white premium-radial-glow premium-dot-grid">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      
      {/* Safe Trust compliance and Accordion FAQs */}
      <ComplianceAndFaq />

      {/* Final CTA in CreatorFlow Monochrome Style */}
      <section className="bg-black/40 py-24 px-6 text-center border-t border-[rgba(255,255,255,0.06)] select-none">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          <h2 className="text-white text-3xl sm:text-[36px] font-bold leading-[1.15] tracking-tight mb-4 font-sans animate-letter-spacing animate-text-reveal">
            Aaj Hi Shuru Karo — Bilkul Free
          </h2>
          <p className="text-[#A0A0A0] text-base leading-relaxed mb-8 max-w-md font-normal animate-text-reveal-slow">
            500 DMs/month free. Credit card nahi chahiye. 2 minute mein setup.
          </p>
          <Link
            href="/signup"
            className="bg-white hover:bg-neutral-200 text-black font-semibold text-sm px-8 py-4 rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-95 inline-block shadow-md shadow-white/5 animate-text-reveal-slow"
          >
            Free Mein Shuru Karo →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
