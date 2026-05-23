import React from 'react';

/** Shared gradient defs — must be rendered once per SVG */
const GeminiGradientDefs = () => (
  <defs>
    <linearGradient id="gemini-premium-axis" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stopColor="#818CF8" />
      <stop offset="50%"  stopColor="#C084FC" />
      <stop offset="100%" stopColor="#22D3EE" />
    </linearGradient>
  </defs>
);

const base =
  'drop-shadow-[0_0_6px_rgba(192,132,252,0.2)] transition-transform duration-300 hover:scale-105';

/* 1. Dashboard / Overview */
export const PremiumDashboardIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="url(#gemini-premium-axis)"
    strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
    className={base}
  >
    <GeminiGradientDefs />
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
);

/* 2. Inbox / Messages */
export const PremiumInboxIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="url(#gemini-premium-axis)"
    strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
    className="drop-shadow-[0_0_6px_rgba(34,211,238,0.2)] transition-transform duration-300 hover:scale-105"
  >
    <GeminiGradientDefs />
    <path d="M22 12h-6l-2 3h-4l-2-3H2" />
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
);

/* 3. Workflows / Automation */
export const PremiumWorkflowIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="url(#gemini-premium-axis)"
    strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
    className={base}
  >
    <GeminiGradientDefs />
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

/* 4. Analytics */
export const PremiumAnalyticsIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="url(#gemini-premium-axis)"
    strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
    className="drop-shadow-[0_0_6px_rgba(34,211,238,0.2)] transition-transform duration-300 hover:scale-105"
  >
    <GeminiGradientDefs />
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6"  y1="20" x2="6"  y2="14" />
  </svg>
);

/* 5. Contacts / CRM */
export const PremiumContactsIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="url(#gemini-premium-axis)"
    strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
    className={base}
  >
    <GeminiGradientDefs />
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

/* 6. Templates */
export const PremiumTemplatesIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="url(#gemini-premium-axis)"
    strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
    className={base}
  >
    <GeminiGradientDefs />
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18" />
    <path d="M9 21V9" />
  </svg>
);

/* 7. Team */
export const PremiumTeamIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="url(#gemini-premium-axis)"
    strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
    className={base}
  >
    <GeminiGradientDefs />
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" />
    <line x1="22" y1="11" x2="16" y2="11" />
  </svg>
);

/* 8. Security */
export const PremiumSecurityIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="url(#gemini-premium-axis)"
    strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
    className={base}
  >
    <GeminiGradientDefs />
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

/* 9. Settings */
export const PremiumSettingsIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="url(#gemini-premium-axis)"
    strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
    className={base}
  >
    <GeminiGradientDefs />
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

/* 10. Billing */
export const PremiumBillingIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="url(#gemini-premium-axis)"
    strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
    className={base}
  >
    <GeminiGradientDefs />
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

/* Active state wrapper — adds indigo micro-glow ring */
export const ActiveIconWrapper = ({ children }: { children: React.ReactNode }) => (
  <span className="relative flex items-center justify-center">
    <span className="absolute inset-0 rounded-lg bg-indigo-500/10 blur-sm" aria-hidden />
    {children}
  </span>
);
