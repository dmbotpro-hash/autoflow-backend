'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    desc: 'Perfect for getting started.',
    features: [
      '500 DMs/month',
      '1 Instagram account',
      '3 workflows',
      'Basic AI replies',
      'Inbox access',
    ],
    cta: 'Start for Free',
    ctaLink: '/signup',
    highlight: false,
  },
  {
    name: 'Growth',
    price: '₹999',
    period: '/month',
    desc: 'For growing creators and builders.',
    features: [
      '5,000 DMs/month',
      '3 Instagram accounts',
      'Unlimited workflows',
      'Advanced AI replies',
      'Email capture',
      'Priority support',
      'Analytics dashboard',
    ],
    cta: 'Get Growth Now',
    ctaLink: '/signup',
    highlight: true,
  },
  {
    name: 'Agency',
    price: '₹2,999',
    period: '/month',
    desc: 'Perfect for agency managers.',
    features: [
      'Unlimited DMs',
      '10 Instagram accounts',
      'White-label option',
      'Team access',
      'Custom AI training',
      'Dedicated support',
      'API access',
    ],
    cta: 'Get Agency Now',
    ctaLink: '/signup',
    highlight: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="bg-black py-24 px-6">
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <div className="text-center mb-16 select-none">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 0.5, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="section-label"
          >
            Pricing
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-white text-3xl sm:text-[32px] font-semibold leading-[1.25] tracking-tight mt-3 font-sans"
          >
            Simple, Transparent Pricing
          </motion.h2>
        </div>

        {/* Plans */}
        <motion.div 
          className="grid md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            }
          }}
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
              }}
              className={`relative rounded-2xl p-8 bg-[#0F0F0F] border hover:bg-[#141414] transition-all duration-200 flex flex-col justify-between ${
                plan.highlight
                  ? 'border-[rgba(255,255,255,0.25)] shadow-[0_10px_30px_rgba(255,255,255,0.02)]'
                  : 'border-[rgba(255,255,255,0.08)]'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black text-[9px] tracking-wider uppercase font-extrabold px-3 py-1 rounded-full border border-white">
                  MOST POPULAR
                </div>
              )}

              <div>
                <div className="mb-6">
                  <div className="text-[#A0A0A0] text-sm mb-1">{plan.name}</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-[#606060] text-xs font-medium">{plan.period}</span>
                  </div>
                  <div className="text-[#606060] text-xs mt-1.5 font-light">{plan.desc}</div>
                </div>

                <ul className="space-y-3.5 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-xs text-[#A0A0A0]">
                      <Check
                        size={14}
                        className={plan.highlight ? 'text-white' : 'text-[#606060]'}
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={plan.ctaLink}
                className={`block w-full text-center py-3 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  plan.highlight
                    ? 'bg-white text-black hover:opacity-88'
                    : 'bg-transparent text-white border border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.06)]'
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Guarantee */}
        <div className="text-center mt-10 text-[#606060] text-xs leading-relaxed font-light">
          ✓ No credit card required &nbsp;•&nbsp; ✓ Cancel anytime &nbsp;•&nbsp; ✓ Secure local payment networks
        </div>
      </div>
    </section>
  );
}
