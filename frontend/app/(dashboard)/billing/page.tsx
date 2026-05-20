'use client';

import { useState } from 'react';
import { CreditCard, Check, ShieldAlert, BarChart3 } from 'lucide-react';

export default function BillingPage() {
  const [currentPlan, setCurrentPlan] = useState('Free');
  const dmsUsed = 240;
  const dmsLimit = 500;
  const usagePercentage = (dmsUsed / dmsLimit) * 100;

  const plans = [
    {
      name: 'Free',
      price: '₹0',
      period: 'forever',
      desc: 'Perfect for getting started.',
      features: [
        '500 DMs/month',
        '1 Instagram account',
        '3 active workflows',
        'Basic AI replies',
        'Unified Live Inbox',
      ],
      current: currentPlan === 'Free',
    },
    {
      name: 'Growth',
      price: '₹999',
      period: '/month',
      desc: 'For growing creators and builders.',
      features: [
        '5,000 DMs/month',
        '3 Instagram accounts',
        'Unlimited active workflows',
        'Advanced AI personality tuning',
        'Lead capture & export',
        'Priority email support',
      ],
      current: currentPlan === 'Growth',
    },
    {
      name: 'Agency',
      price: '₹2,999',
      period: '/month',
      desc: 'Perfect for agency managers.',
      features: [
        'Unlimited DMs',
        '10 Instagram accounts',
        'White-label options',
        'Team access (5 seats)',
        'Custom AI fine-tuning',
        'Dedicated support manager',
      ],
      current: currentPlan === 'Agency',
    },
  ];

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6 min-h-screen bg-black text-white font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">Billing</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Manage your subscription, plans, and monthly API limits
          </p>
        </div>
      </div>

      {/* Usage Analytics Panel */}
      <div className="bg-[#0F0F0F] border border-[rgba(255,255,255,0.08)] rounded-2xl p-5 md:p-6 space-y-4">
        <div className="flex items-center gap-3 border-b border-[rgba(255,255,255,0.06)] pb-4">
          <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 select-none">
            <BarChart3 size={18} />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Monthly API Usage</h3>
            <p className="text-[#A0A0A0] text-xs font-light mt-0.5">Track your comment-to-DM triggers usage</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-[#A0A0A0]">DMs Sent (Current Cycle)</span>
            <span className="text-white">{dmsUsed} / {dmsLimit} limits</span>
          </div>
          <div className="w-full bg-black h-2.5 rounded-full overflow-hidden border border-[rgba(255,255,255,0.06)]">
            <div 
              className="bg-gradient-to-r from-orange-500 to-pink-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
          <p className="text-[10px] text-[#606060] font-light pt-1">
            Usage resets automatically on the 1st of next month.
          </p>
        </div>
      </div>

      {/* Warning Notice */}
      <div className="p-4 rounded-xl flex items-start gap-3 bg-orange-500/5 border border-orange-500/10 text-xs leading-relaxed text-orange-400">
        <ShieldAlert size={18} className="shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold block mb-0.5">Exceeding Plan Limits</span>
          <span>When your monthly limit is reached, automations will pause until the start of the next billing cycle. Upgrade to Growth to avoid disruption.</span>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="space-y-4">
        <h3 className="text-white font-bold text-sm tracking-wide select-none">Available Subscription Plans</h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-[#0F0F0F] border rounded-2xl p-6 flex flex-col justify-between transition-all ${
                plan.current 
                  ? 'border-white bg-[#141414] shadow-[0_4px_20px_rgba(255,255,255,0.02)]' 
                  : 'border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.18)]'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-white font-bold text-sm">{plan.name} Plan</h4>
                    <p className="text-[#606060] text-[10px] mt-0.5 font-light">{plan.desc}</p>
                  </div>
                  {plan.current && (
                    <span className="bg-white text-black text-[9px] uppercase font-extrabold px-2.5 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-1 mb-6 border-b border-[rgba(255,255,255,0.06)] pb-4">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-[#606060] text-xs font-light">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-xs text-[#A0A0A0]">
                      <Check size={14} className="text-orange-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {!plan.current && (
                <button
                  type="button"
                  className="w-full bg-white hover:opacity-88 active:scale-95 text-black py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm"
                >
                  Upgrade to {plan.name}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Secure Gateway Info */}
      <div className="text-center pt-4 select-none">
        <div className="inline-flex items-center gap-2 border border-[rgba(255,255,255,0.06)] bg-[#0F0F0F] rounded-full px-4 py-2">
          <CreditCard size={14} className="text-[#A0A0A0]" />
          <span className="text-[#606060] text-[10px] font-medium uppercase tracking-wider">
            Secure Payments via Razorpay & Stripe • Moneyback Guarantee
          </span>
        </div>
      </div>
    </div>
  );
}
