import { MarketingContentCard, MarketingPageShell } from '@/components/marketing/MarketingPageShell';

const sections = [
  {
    title: 'Data Collection',
    content:
      'We only collect data required to run the service — email, name, and Instagram account details connected via Meta APIs.',
  },
  {
    title: 'Data Usage',
    content:
      'Your data is used solely to provide AutoFlow. We do not sell personal data to third parties.',
  },
  {
    title: 'Instagram Data',
    content:
      'We use Meta’s official APIs. Your Instagram password is never stored on our servers.',
  },
  {
    title: 'Data Security',
    content:
      'Data is encrypted in transit and at rest. We follow industry-standard security practices.',
  },
  {
    title: 'Contact',
    content: 'Privacy questions: privacy@autoflow.in',
  },
];

export default function PrivacyPage() {
  return (
    <MarketingPageShell title="Privacy Policy" subtitle="Last updated: May 2026">
      {sections.map((section) => (
        <MarketingContentCard key={section.title} title={section.title}>
          <p>{section.content}</p>
        </MarketingContentCard>
      ))}
    </MarketingPageShell>
  );
}
