import { MarketingContentCard, MarketingPageShell } from '@/components/marketing/MarketingPageShell';

const sections = [
  {
    title: 'Acceptance',
    content: 'By using AutoFlow you agree to these terms and our Privacy Policy.',
  },
  {
    title: 'Service',
    content:
      'AutoFlow provides Instagram automation tools including comment-to-DM, AI replies, and workflow builders.',
  },
  {
    title: 'Account',
    content:
      'You are responsible for your account credentials and for activity under your workspace.',
  },
  {
    title: 'Acceptable Use',
    content:
      'Do not use AutoFlow for spam, harassment, or activities that violate Meta Platform policies.',
  },
  {
    title: 'Contact',
    content: 'Legal questions: legal@autoflow.in',
  },
];

export default function TermsPage() {
  return (
    <MarketingPageShell title="Terms of Service" subtitle="Last updated: May 2026">
      {sections.map((section) => (
        <MarketingContentCard key={section.title} title={section.title}>
          <p>{section.content}</p>
        </MarketingContentCard>
      ))}
    </MarketingPageShell>
  );
}
