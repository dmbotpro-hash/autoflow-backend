export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[100dvh] overflow-x-hidden text-[var(--text-primary)]" style={{ background: 'var(--bg-main)' }}>
      {children}
    </div>
  );
}
