import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Finovate ERP Lite',
  description: 'Commercial-grade bilingual ERP platform for SMEs'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500/30">{children}</body>
    </html>
  );
}
