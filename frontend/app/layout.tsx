import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AutoFlow',
  description: 'Instagram Automation SaaS',
};

import { Providers } from './providers';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

