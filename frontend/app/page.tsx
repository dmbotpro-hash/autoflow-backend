import Navbar from '@/components/marketing/Navbar';
import HeroSection from '@/components/marketing/HeroSection';
import TrustedBySection from '@/components/marketing/TrustedBySection';
import LiveDemoSection from '@/components/marketing/LiveDemoSection';
import HowItWorks from '@/components/marketing/HowItWorks';
import FeaturesSection from '@/components/marketing/FeaturesSection';
import WorkflowPreviewSection from '@/components/marketing/WorkflowPreviewSection';
import AIAutomationSection from '@/components/marketing/AIAutomationSection';
import InboxPreviewSection from '@/components/marketing/InboxPreviewSection';
import AnalyticsPreviewSection from '@/components/marketing/AnalyticsPreviewSection';
import TestimonialsSection from '@/components/marketing/TestimonialsSection';
import PricingSection from '@/components/marketing/PricingSection';
import ComplianceAndFaq from '@/components/marketing/ComplianceAndFaq';
import FinalCTASection from '@/components/marketing/FinalCTASection';
import Footer from '@/components/marketing/Footer';

export const metadata = {
  title: 'AutoFlow — Turn Instagram Comments Into AI-Powered Revenue',
  description:
    'AutoFlow: comment-to-DM automation, AI inbox, workflows, and analytics for Indian creators. Free plan. Meta-approved.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Navbar />
      {/* 1. Hero — cinematic black */}
      <HeroSection />
      {/* 2. Trusted — white */}
      <TrustedBySection />
      {/* 3. Live demo — dark */}
      <LiveDemoSection />
      {/* 4. How it works — light */}
      <HowItWorks />
      {/* 5. Features — white */}
      <FeaturesSection />
      {/* 6. Workflow builder — dark */}
      <WorkflowPreviewSection />
      {/* 7. AI — cinematic black */}
      <AIAutomationSection />
      {/* 8. Inbox preview — white */}
      <InboxPreviewSection />
      {/* 9. Analytics — light */}
      <AnalyticsPreviewSection />
      {/* 10. Testimonials — dark */}
      <TestimonialsSection />
      {/* 11. Pricing — white */}
      <PricingSection />
      {/* 12. FAQ + compliance — dark */}
      <ComplianceAndFaq />
      {/* 13. Final CTA — cinematic */}
      <FinalCTASection />
      <Footer />
    </div>
  );
}
