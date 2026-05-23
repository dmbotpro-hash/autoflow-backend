import { create } from 'zustand';

const STORAGE_KEY = 'af_onboarding_complete';

interface OnboardingStore {
  step: number;
  complete: boolean;
  hydrated: boolean;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setComplete: (complete: boolean) => void;
  hydrate: () => void;
}

export const ONBOARDING_STEPS = [
  { id: 'account', title: 'Account', subtitle: 'Confirm your profile' },
  { id: 'instagram', title: 'Instagram', subtitle: 'Connect your business account' },
  { id: 'ai', title: 'AI setup', subtitle: 'Tone & assistant prompt' },
  { id: 'workflow', title: 'First workflow', subtitle: 'Launch your first automation' },
  { id: 'test', title: 'Test', subtitle: 'Preview inbox & simulation' },
  { id: 'live', title: 'Go live', subtitle: 'Activate and finish' },
] as const;

export const useOnboardingStore = create<OnboardingStore>((set, get) => ({
  step: 0,
  complete: false,
  hydrated: false,
  setStep: (step) => set({ step: Math.max(0, Math.min(step, ONBOARDING_STEPS.length - 1)) }),
  nextStep: () => {
    const next = Math.min(get().step + 1, ONBOARDING_STEPS.length - 1);
    set({ step: next });
  },
  prevStep: () => set({ step: Math.max(0, get().step - 1) }),
  setComplete: (complete) => {
    if (complete && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, '1');
    }
    if (!complete && typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    set({ complete });
  },
  hydrate: () => {
    const local =
      typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY) === '1';
    set({ complete: local, hydrated: true });
  },
}));
