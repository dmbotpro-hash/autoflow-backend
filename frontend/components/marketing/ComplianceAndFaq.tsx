'use client';

import { useState } from 'react';
import { ShieldCheck, Check, ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const complianceItems = [
  {
    title: 'Meta Approved Provider',
    desc: 'AutoFlow is a registered Meta Tech Provider using Instagram\'s official Graph API. 100% compliant.',
  },
  {
    title: 'Secure Meta OAuth Connection',
    desc: 'Never share your Instagram password. Connect securely via Meta\'s official sign-in system.',
  },
  {
    title: 'Business & Creator Accounts',
    desc: 'Both Business and Creator accounts are fully supported without any system restrictions.',
  },
  {
    title: 'GDPR & Privacy Compliant',
    desc: 'Your user and lead data is always encrypted and secure. We strictly respect user privacy regulations.',
  },
  {
    title: 'Smart Instagram Rate Limits',
    desc: 'We strictly follow Instagram\'s rate limit parameters (up to 200 DMs/hour) to keep your account fully safe.',
  },
  {
    title: 'Cancel Anytime',
    desc: 'No minimum lock-in periods or hidden contracts. Cancel or pause your subscription at any time.',
  },
];

const faqs = [
  {
    id: 1,
    question: 'What is AutoFlow and how does it work?',
    answer: 'AutoFlow is a Meta-approved Instagram DM automation platform. When a user comments a specific keyword (like "LINK" or "PRICE") on your post, Reel, or Story, AutoFlow instantly sends them a direct message (DM) containing your resource or link. This helps you capture leads and boost sales 24/7 without manual effort.',
  },
  {
    id: 2,
    question: 'Can this get my Instagram account banned or restricted?',
    answer: 'No. AutoFlow uses the official Meta Graph API. We do not use browser extensions, scrapers, or unofficial bots that violate Instagram\'s terms of service. Over 14,000 creators and brands trust and use our platform safely without any issues.',
  },
  {
    id: 3,
    question: 'What are the requirements to use AutoFlow?',
    answer: 'According to Instagram\'s API policy, you need an Instagram Creator or Business account. If you currently have a personal account, you can switch it to a Creator/Business account in Instagram Settings in less than 2 minutes for free.',
  },
  {
    id: 4,
    question: 'Can I collect email addresses before sending links?',
    answer: 'Yes. With our Growth and Pro plans, you can collect user email addresses directly inside the DM thread before delivering the automated link. These leads are saved to your CRM dashboard and can be exported as a CSV file.',
  },
  {
    id: 5,
    question: 'What are your subscription plans and pricing?',
    answer: 'Our Free plan is free forever and includes 500 DMs/month. The Growth plan is ₹999/month (includes 5,000 DMs/month and lead collection), and the Agency plan is ₹2,999/month (includes unlimited workflows and multiple client accounts).',
  },
];

export default function ComplianceAndFaq() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <section className="bg-black text-white font-sans py-24 px-6 border-t border-[rgba(255,255,255,0.06)]">
      <div className="max-w-[1100px] mx-auto space-y-28">
        
        {/* SECTION 1: Compliance */}
        <div className="space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 0.5, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="section-label select-none flex items-center justify-center gap-1.5"
            >
              <ShieldCheck size={13} className="text-white" /> Safe & Meta Compliant
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-white text-3xl sm:text-[36px] font-bold leading-[1.15] tracking-tight font-sans"
            >
              Official Meta Graph API. No Bots. No Bans.
            </motion.h2>
            <p className="text-[#A0A0A0] text-sm sm:text-base leading-relaxed font-light font-sans">
              AutoFlow is a registered Meta Tech & Business Approved Provider. We never share your password or use shady browser workarounds.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complianceItems.map((item, idx) => (
              <div 
                key={idx}
                className="bg-[#0F0F0F] border border-[rgba(255,255,255,0.08)] rounded-2xl p-7 flex flex-col justify-start hover:border-[rgba(255,255,255,0.18)] transition-all duration-200 select-none group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#141414] border border-[rgba(255,255,255,0.06)] flex items-center justify-center mb-4 text-white group-hover:scale-[1.03] transition-transform">
                  <Check size={14} />
                </div>
                <h3 className="text-white text-sm font-semibold mb-2 leading-none font-sans">
                  {item.title}
                </h3>
                <p className="text-[#A0A0A0] text-[13px] leading-relaxed font-light">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: Interactive FAQ Section */}
        <div className="space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 0.5, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="section-label select-none flex items-center justify-center gap-1.5"
            >
              <HelpCircle size={13} className="text-white" /> Common Questions
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-white text-3xl sm:text-[32px] font-bold leading-[1.25] tracking-tight mt-3 font-sans"
            >
              Frequently Asked Questions
            </motion.h2>
            <p className="text-[#A0A0A0] text-sm leading-relaxed font-light">
              Common questions about our features, compliance, and billing.
            </p>
          </div>

          <div className="max-w-3xl mx-auto divide-y divide-[rgba(255,255,255,0.08)] bg-[#0F0F0F] border border-[rgba(255,255,255,0.08)] rounded-2xl overflow-hidden shadow-sm">
            {faqs.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div key={faq.id} className="transition-colors duration-150">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full text-left py-5 px-6 flex justify-between items-center gap-4 hover:bg-[#141414]/30 focus:outline-none"
                  >
                    <span className="text-white text-sm sm:text-[15px] font-semibold leading-relaxed font-sans">
                      {faq.question}
                    </span>
                    <ChevronDown 
                      size={16} 
                      className={`text-[#A0A0A0] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-white' : ''}`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 text-[#A0A0A0] text-[13px] sm:text-sm leading-relaxed font-light font-sans select-text border-t border-[rgba(255,255,255,0.04)] pt-3.5 bg-black/30">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
