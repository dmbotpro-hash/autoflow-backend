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

import { MarketingSection, SectionHeader } from './MarketingSection';

export default function PricingSection() {
  return (
    <MarketingSection id="pricing" variant="light">
        <SectionHeader
          light
          label="Pricing"
          title="Simple, transparent pricing"
          subtitle="Start free. Scale when your DMs take off."
        />

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
              className={`relative rounded-2xl p-8 bg-white border transition-all duration-200 flex flex-col justify-between ${
                plan.highlight
                  ? 'border-violet-300 shadow-xl shadow-violet-100 ring-2 ring-violet-500/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-[9px] tracking-wider uppercase font-extrabold px-3 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}

              <div>
                <div className="mb-6">
                  <div className="text-slate-500 text-sm mb-1">{plan.name}</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                    <span className="text-slate-400 text-xs font-medium">{plan.period}</span>
                  </div>
                  <div className="text-slate-500 text-xs mt-1.5">{plan.desc}</div>
                </div>

                <ul className="space-y-3.5 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-xs text-slate-600">
                      <Check
                        size={14}
                        className={plan.highlight ? 'text-violet-600' : 'text-slate-400'}
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
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:opacity-90'
                    : 'bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200'
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Guarantee */}
        <div className="text-center mt-10 text-slate-500 text-xs leading-relaxed">
          ✓ No credit card required &nbsp;•&nbsp; ✓ Cancel anytime &nbsp;•&nbsp; ✓ Secure payments
        </div>
    </MarketingSection>
  );
}
