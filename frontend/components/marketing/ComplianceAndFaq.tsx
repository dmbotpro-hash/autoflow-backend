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
    desc: 'Apna Instagram password kabhi share na karein. Connect securely via Meta\'s official sign-in system.',
  },
  {
    title: 'Business & Creator Accounts',
    desc: 'Dono Business aur Creator accounts perfectly support hote hain bina kisi system restrictions ke.',
  },
  {
    title: 'GDPR & Privacy Compliant',
    desc: 'Aapke users aur leads ka data humesha encrypt aur secure rehta hai. We respect user privacy laws.',
  },
  {
    title: 'Smart Instagram Rate Limits',
    desc: 'Instagram rules ke accodring we follow 200 DMs/hour parameters taaki aapka account fully safe rahe.',
  },
  {
    title: 'Cancel Anytime',
    desc: 'Koi minimum lock-in period ya shady contracts nahi hain. Aap jab chahein account cancel ya pause kar sakte hain.',
  },
];

const faqs = [
  {
    id: 1,
    question: 'AutoFlow kya hai aur ye kaise kaam karta hai?',
    answer: 'AutoFlow ek Meta-Approved Instagram DM automation platform hai. Jab koi user aapki post, Reel ya Story par aapka defined keyword (jaise "LINK" ya "PRICE") comment karta hai, toh AutoFlow unhe automatically seconds ke andar direct message (DM) bhej deta hai. Isse aapko 24/7 bina manual work ke leads aur sales convert karne me help milti hai.',
  },
  {
    id: 2,
    question: 'Kya isse mera Instagram account ban ya restrict ho sakta hai?',
    answer: 'Nahi! AutoFlow Meta ka official Graph API use karta hai. Hum kisi bhi browser extensions, scrapers, ya unofficial scripts ka use nahi karte jo Instagram guidelines ko violate karein. 14,000+ creators aur brands bina kisi restriction issue ke hamara platform safely use kar rahe hain.',
  },
  {
    id: 3,
    question: 'AutoFlow use karne ke liye kya requirement hai?',
    answer: 'Instagram DM automation API rules ke according aapke paas Instagram Business ya Instagram Creator account hona chahiye. Agar aapka personal account hai, toh aap use Instagram Settings me jaakar 2 minute me bilkul free me switch kar sakte hain.',
  },
  {
    id: 4,
    question: 'Kya main users se link bhejane se pehle email collect kar sakta hoon?',
    answer: 'Haan! AutoFlow ke Pro aur Growth plans par aap user ko link deliver karne se pehle unka email address direct DM me collect kar sakte hain. Ye emails hamare lead dashboard (CRM) me save hote hain jise aap Mailchimp ya active email providers par direct CSV export kar sakte hain.',
  },
  {
    id: 5,
    question: 'Subscription plans aur pricing kya hai?',
    answer: 'Humara Free plan hamesha ke liye free hai jisme aapko 500 DMs/month milte hain. Pro plan pricing ₹999/month hai (5,000 DMs, lead collection tracking). Agency/Growth plan pricing ₹2,999/month hai (Unlimited workflow campaigns aur unlimited workspaces agencies ke liye).',
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
        
        {/* SECTION 1: Compliance "Built on Meta's official API. No bots. No bans." */}
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
              Humare product features aur safety parameters ke bare me aam saval.
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
