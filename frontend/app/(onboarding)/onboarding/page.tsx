'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle2,
  Instagram,
  Rocket,
  Sparkles,
  User,
  Zap,
} from 'lucide-react';
import api from '@/lib/api/auth.api';
import { useAuthStore } from '@/lib/store/auth.store';
import { useOnboardingStore, ONBOARDING_STEPS } from '@/lib/store/onboarding.store';
import { useOnboardingStatus } from '@/lib/hooks/useOnboardingStatus';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { WorkflowTemplatePicker } from '@/components/workflows/WorkflowTemplatePicker';
import { WORKFLOW_TEMPLATES } from '@/lib/workflow-templates';
import { Button } from '@/components/ui/Button';

const tones = ['Friendly', 'Professional', 'Casual', 'Sales-Focused'];

export default function OnboardingPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { step, setStep, nextStep, prevStep } = useOnboardingStore();
  const { markComplete } = useOnboardingStatus();
  const [celebrateStep, setCelebrateStep] = useState<number | null>(null);
  const [name, setName] = useState(user?.name ?? '');
  const [instaConnected, setInstaConnected] = useState(false);
  const [aiTone, setAiTone] = useState('Friendly');
  const [aiPrompt, setAiPrompt] = useState(
    'You are a helpful Instagram assistant. Keep replies concise and guide users toward your offer.',
  );
  const [workflowCreated, setWorkflowCreated] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    api.get('/settings').then((res) => {
      setInstaConnected(Boolean(res.data?.instaConnected));
      if (res.data?.aiTone) setAiTone(res.data.aiTone);
      if (res.data?.aiPrompt) setAiPrompt(res.data.aiPrompt);
      if (res.data?.onboardingComplete) router.replace('/dashboard');
    }).catch(() => {});
  }, [router]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const finishStep = () => {
    setCelebrateStep(step);
    setTimeout(() => setCelebrateStep(null), 600);
    nextStep();
  };

  const connectInstagram = async () => {
    setBusy(true);
    try {
      await api.post('/settings/instagram/connect', {});
      setInstaConnected(true);
      showToast('Instagram connected!');
      finishStep();
    } catch {
      showToast('Could not connect — try again');
    } finally {
      setBusy(false);
    }
  };

  const saveAi = async () => {
    setBusy(true);
    try {
      await api.post('/settings', { aiTone, aiPrompt });
      showToast('AI configured!');
      finishStep();
    } catch {
      showToast('Failed to save AI settings');
    } finally {
      setBusy(false);
    }
  };

  const createFromTemplate = async (templateId: string) => {
    const t = WORKFLOW_TEMPLATES.find((x) => x.id === templateId);
    if (!t) return;
    setBusy(true);
    try {
      const keywords = t.triggerValue.split(',').map((k) => k.trim()).filter(Boolean);
      await api.post('/workflows', {
        name: t.name,
        trigger: 'comment_keyword',
        isActive: false,
        config: {
          keywords: keywords.length ? keywords : ['*'],
          dmMessage: t.actionMessage,
          replyOnce: true,
        },
      });
      setWorkflowCreated(true);
      showToast('Workflow created!');
      finishStep();
    } catch {
      showToast('Could not create workflow');
    } finally {
      setBusy(false);
    }
  };

  const goLive = async () => {
    setBusy(true);
    try {
      const res = await api.get('/workflows');
      const list = res.data ?? [];
      if (list[0]?.id) {
        await api.patch(`/workflows/${list[0].id}/toggle`);
      }
      await markComplete();
      showToast('You are live! 🚀');
      router.push('/dashboard');
    } catch {
      await markComplete();
      router.push('/dashboard');
    } finally {
      setBusy(false);
    }
  };

  const stepContent = () => {
    switch (ONBOARDING_STEPS[step].id) {
      case 'account':
        return (
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center mx-auto">
              <User className="text-violet-400" size={28} />
            </div>
            <h2 className="text-xl font-bold text-center">Welcome, {name || 'creator'}!</h2>
            <p className="text-sm text-[var(--af-text-muted)] text-center max-w-md mx-auto">
              AutoFlow will guide you from signup to your first live automation in a few minutes.
            </p>
            <label className="block text-xs text-[var(--af-text-muted)]">Display name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-black/30 border border-[var(--af-border-subtle)] text-sm focus:outline-none focus:border-violet-500/50"
              placeholder="Your name"
            />
          </div>
        );
      case 'instagram':
        return (
          <div className="space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center mx-auto">
              <Instagram className="text-pink-400" size={28} />
            </div>
            <h2 className="text-xl font-bold">Connect Instagram</h2>
            <p className="text-sm text-[var(--af-text-muted)] max-w-md mx-auto">
              Link your business account to receive DMs and run automations. Mock connect works for demo.
            </p>
            {instaConnected ? (
              <p className="text-emerald-400 text-sm flex items-center justify-center gap-2">
                <CheckCircle2 size={16} /> Connected
              </p>
            ) : (
              <Button variant="primary" onClick={connectInstagram} disabled={busy}>
                Connect Instagram
              </Button>
            )}
          </div>
        );
      case 'ai':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 justify-center">
              <Bot className="text-cyan-400" size={24} />
              <h2 className="text-xl font-bold">Configure AI assistant</h2>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {tones.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setAiTone(t)}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                    aiTone === t
                      ? 'border-violet-500/50 bg-violet-500/15 text-violet-300'
                      : 'border-[var(--af-border-subtle)] text-[var(--af-text-muted)]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-black/30 border border-[var(--af-border-subtle)] text-sm focus:outline-none focus:border-violet-500/50 resize-none"
            />
            <Button variant="primary" className="w-full" onClick={saveAi} disabled={busy}>
              Save AI settings
            </Button>
          </div>
        );
      case 'workflow':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-center flex items-center justify-center gap-2">
              <Zap className="text-orange-400" size={22} />
              Create your first workflow
            </h2>
            <WorkflowTemplatePicker
              onSelect={(t) => createFromTemplate(t.id)}
            />
            {workflowCreated && (
              <p className="text-center text-emerald-400 text-sm">Workflow ready — continue to test</p>
            )}
          </div>
        );
      case 'test':
        return (
          <div className="space-y-4 text-center">
            <Sparkles className="text-violet-400 mx-auto" size={32} />
            <h2 className="text-xl font-bold">Test your setup</h2>
            <p className="text-sm text-[var(--af-text-muted)] max-w-md mx-auto">
              Open the inbox to see conversations, or workflows to run a visual simulation.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="secondary" onClick={() => router.push('/inbox')}>
                Open Inbox
              </Button>
              <Button variant="secondary" onClick={() => router.push('/workflows')}>
                Open Workflows
              </Button>
            </div>
          </div>
        );
      case 'live':
        return (
          <div className="space-y-4 text-center">
            <Rocket className="text-fuchsia-400 mx-auto" size={36} />
            <h2 className="text-xl font-bold">Go live</h2>
            <p className="text-sm text-[var(--af-text-muted)] max-w-md mx-auto">
              Activate your first workflow and enter mission control.
            </p>
            <Button variant="ai" className="mx-auto" onClick={goLive} disabled={busy}>
              Launch AutoFlow
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 py-12">
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm animate-in fade-in">
          {toast}
        </div>
      )}

      <div className="w-full max-w-xl af-glass rounded-3xl border border-[var(--af-border-subtle)] p-6 md:p-10 shadow-2xl">
        <OnboardingProgress step={step} celebrateStep={celebrateStep} />
        <div className="min-h-[280px] flex flex-col justify-center">{stepContent()}</div>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--af-border-subtle)]">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => (step === 0 ? router.push('/login') : prevStep())}
            disabled={busy}
          >
            <ArrowLeft size={14} />
            Back
          </Button>
          <div className="flex gap-2">
            {step < ONBOARDING_STEPS.length - 1 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  if (step === 0) finishStep();
                  else if (step === 1 && instaConnected) finishStep();
                  else if (step === 4) finishStep();
                  else setStep(step + 1);
                }}
                disabled={busy}
              >
                Skip
                <ArrowRight size={14} />
              </Button>
            )}
            {step === 0 && (
              <Button variant="primary" size="sm" onClick={finishStep}>
                Continue
                <ArrowRight size={14} />
              </Button>
            )}
            {step === 4 && (
              <Button variant="primary" size="sm" onClick={finishStep}>
                Continue
                <ArrowRight size={14} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
