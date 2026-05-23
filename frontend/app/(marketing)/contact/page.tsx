import { MarketingContentCard, MarketingPageShell } from '@/components/marketing/MarketingPageShell';

export default function ContactPage() {
  return (
    <MarketingPageShell
      title="Contact us"
      subtitle="Questions about AutoFlow? We're here to help creators and businesses in India."
    >
      <div className="grid gap-4 sm:grid-cols-1">
        {[
          { label: 'Email', value: 'hello@autoflow.in', icon: '📧' },
          { label: 'WhatsApp', value: '+91 98765 43210', icon: '💬' },
          { label: 'Instagram', value: '@autoflow.in', icon: '📸' },
        ].map((item) => (
          <MarketingContentCard key={item.label} title={item.label}>
            <p className="flex items-center gap-3 text-base" style={{ color: 'var(--text-primary)' }}>
              <span className="text-2xl" aria-hidden>{item.icon}</span>
              {item.value}
            </p>
          </MarketingContentCard>
        ))}
      </div>
    </MarketingPageShell>
  );
}
