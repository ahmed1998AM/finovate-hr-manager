import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Finovate ERP Lite',
  description: 'Commercial-grade bilingual ERP platform'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">{children}</body>
    </html>
  );
}
