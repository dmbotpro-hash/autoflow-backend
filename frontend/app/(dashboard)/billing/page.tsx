'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { CreditCard, Check, ShieldAlert, BarChart3, Loader2 } from 'lucide-react';
import api from '@/lib/api/auth.api';
import { useWorkspaceStore } from '@/lib/store/workspace.store';

interface UsageData {
  plan: string;
  subscriptionStatus: string;
  monthlyMessageCount: number;
  monthlyLimit: number;
  usagePercentage: number;
}

function BillingContent() {
  const searchParams = useSearchParams();
  const workspaces = useWorkspaceStore((s) => s.workspaces);
  const workspaceId =
    typeof window !== 'undefined' ? localStorage.getItem('workspaceId') : null;
  const role = workspaces.find((w) => w.id === workspaceId)?.role;
  const canUpgrade = role === 'owner' || role === 'admin';

  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const loadUsage = () => {
    api
      .get('/billing/usage')
      .then((res) => setUsage(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsage();
    const upgraded = searchParams.get('upgraded');
    const session = searchParams.get('session');
    if (upgraded && session && canUpgrade) {
      api
        .post('/billing/upgrade', { plan: upgraded, sessionId: session })
        .then(() => {
          setToast(`Upgraded to ${upgraded}!`);
          loadUsage();
        })
        .catch(() => setToast('Upgrade failed'));
    }
  }, [searchParams, canUpgrade]);

  const currentPlan = usage?.plan ?? 'FREE';

  const handleUpgrade = async (planKey: string) => {
    if (!canUpgrade) return;
    setUpgrading(planKey);
    try {
      const checkout = await api.post('/billing/checkout', { plan: planKey });
      const url = checkout.data.checkoutUrl as string;
      const sessionId = checkout.data.sessionId as string;
      await api.post('/billing/upgrade', { plan: planKey, sessionId });
      setToast(`Plan updated to ${planKey}`);
      loadUsage();
    } catch {
      setToast('Could not upgrade plan');
    } finally {
      setUpgrading(null);
    }
  };

  const plans = [
    {
      name: 'Free',
      planKey: 'FREE',
      price: '₹0',
      period: 'forever',
      desc: 'Perfect for getting started.',
      features: [
        '50 automations/month',
        '1 Instagram account',
        '3 active workflows',
        'Basic AI replies',
      ],
      current: currentPlan === 'FREE',
    },
    {
      name: 'Growth',
      planKey: 'PRO',
      price: '₹999',
      period: '/month',
      desc: 'For growing creators.',
      features: [
        '5,000 DMs/month',
        '3 Instagram accounts',
        'Unlimited workflows',
        'Advanced AI tuning',
      ],
      current: currentPlan === 'PRO',
    },
    {
      name: 'Agency',
      planKey: 'AGENCY',
      price: '₹2,999',
      period: '/month',
      desc: 'For agencies managing clients.',
      features: [
        'High-volume messaging',
        '10 Instagram accounts',
        'Multi-workspace switcher',
        'Team seats',
      ],
      current: currentPlan === 'AGENCY',
    },
  ];

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6 min-h-screen" style={{ color: 'var(--text-primary)' }}>
      {/* Glass success toast */}
      {toast && (
        <div
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 glass-alert glass-alert-success rounded-full text-sm px-5 py-2.5 animate-text-reveal"
        >
          ✓ {toast}
        </div>
      )}

      <div
        className="flex items-center justify-between pb-6"
        style={{ borderBottom: '1px solid var(--border-glass)' }}
      >
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Billing</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Plans update instantly in your workspace database
          </p>
        </div>
      </div>

      <div className="premium-card p-5 space-y-4">
        <div className="flex items-center gap-3">
          <BarChart3 size={18} style={{ color: '#818CF8' }} />
          <div>
            <h3 className="text-sm font-semibold">Monthly usage</h3>
            <p className="text-xs text-[var(--af-text-muted)]">
              Status: {usage?.subscriptionStatus ?? '—'}
            </p>
          </div>
        </div>
        {loading ? (
          <Loader2 className="animate-spin text-[var(--af-text-muted)]" size={18} />
        ) : (
          <>
            <div className="flex justify-between text-xs">
              <span>
                {usage?.monthlyMessageCount ?? 0} / {usage?.monthlyLimit ?? 50} messages
              </span>
              <span>{usage?.usagePercentage ?? 0}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div
                className="h-full transition-all duration-700"
                style={{
                  width: `${usage?.usagePercentage ?? 0}%`,
                  background: 'linear-gradient(90deg, #818CF8, #22D3EE)',
                  boxShadow: '0 0 8px rgba(129,140,248,0.4)',
                }}
              />
            </div>
          </>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.planKey}
            className="rounded-2xl p-5 flex flex-col transition-all duration-300"
            style={plan.current ? {
              background: 'rgba(129,140,248,0.06)',
              border: '1px solid var(--border-glow)',
              boxShadow: '0 0 20px rgba(129,140,248,0.08)',
              backdropFilter: 'blur(16px)',
            } : {
              background: 'var(--bg-card)',
              border: '1px solid var(--border-glass)',
              backdropFilter: 'blur(16px)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{plan.name}</h3>
              {plan.current && (
                <span
                  className="text-[10px] px-2.5 py-0.5 rounded-full font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #818CF8, #22D3EE)' }}
                >
                  Current
                </span>
              )}
            </div>
            <p className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {plan.price}
              <span className="text-xs font-normal ml-1" style={{ color: 'var(--text-muted)' }}>
                {plan.period}
              </span>
            </p>
            <p className="text-xs mt-2 mb-4" style={{ color: 'var(--text-muted)' }}>{plan.desc}</p>
            <ul className="space-y-2 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="text-xs flex gap-2" style={{ color: 'var(--text-secondary)' }}>
                  <Check size={14} style={{ color: '#34D399', flexShrink: 0 }} />
                  {f}
                </li>
              ))}
            </ul>
            <button
              type="button"
              disabled={plan.current || !canUpgrade || upgrading === plan.planKey}
              onClick={() => handleUpgrade(plan.planKey)}
              className="mt-5 w-full py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50"
              style={plan.current ? {
                background: 'rgba(129,140,248,0.10)',
                border: '1px solid var(--border-glow)',
                color: '#A5B4FC',
              } : {
                background: 'linear-gradient(135deg, #818CF8, #C084FC)',
                color: 'white',
                boxShadow: '0 0 16px rgba(129,140,248,0.25)',
              }}
            >
              {upgrading === plan.planKey ? (
                <Loader2 className="animate-spin mx-auto" size={16} />
              ) : plan.current ? (
                'Active plan'
              ) : canUpgrade ? (
                'Upgrade now →'
              ) : (
                'Owner/admin only'
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="glass-alert glass-alert-warn rounded-xl text-xs">
        <ShieldAlert size={16} className="shrink-0" />
        <p>
          Mock Stripe checkout flow: upgrade writes <code style={{ color: '#A5B4FC' }}>plan</code> and{' '}
          <code style={{ color: '#A5B4FC' }}>subscriptionStatus</code> to your workspace in the database.
          Connect real Stripe keys when ready.
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
        <CreditCard size={14} />
        <span>Payments handled securely when Stripe is enabled.</span>
      </div>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={<div className="p-6 text-[var(--af-text-muted)]">Loading billing…</div>}>
      <BillingContent />
    </Suspense>
  );
}
