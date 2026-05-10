'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

type Locale = 'en' | 'ar';

const labels = {
  en: {
    dashboard: 'Dashboard',
    modules: 'Modules',
    quick: 'Quick Actions',
    switchLang: 'العربية',
    switchTheme: 'Theme'
  },
  ar: {
    dashboard: 'لوحة التحكم',
    modules: 'الوحدات',
    quick: 'إجراءات سريعة',
    switchLang: 'English',
    switchTheme: 'المظهر'
  }
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');
  const [light, setLight] = useState(false);

  const t = labels[locale];
  const dir = useMemo(() => (locale === 'ar' ? 'rtl' : 'ltr'), [locale]);

  return (
    <div className={light ? 'light' : ''} dir={dir}>
      <div className="grid min-h-screen md:grid-cols-[260px_1fr]">
        <aside className="glass m-4 p-4">
          <h1 className="text-xl font-bold text-cyan-300">Finovate ERP Lite</h1>
          <p className="mt-1 text-xs text-slate-400">Finovate – AHMED EG</p>
          <nav className="mt-6 space-y-2 text-sm">
            <Link className="block rounded-lg px-3 py-2 hover:bg-cyan-500/20" href="/dashboard">{t.dashboard}</Link>
            <Link className="block rounded-lg px-3 py-2 hover:bg-cyan-500/20" href="/">{t.modules}</Link>
            <button onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')} className="w-full rounded-lg border px-3 py-2">{t.switchLang}</button>
            <button onClick={() => setLight(!light)} className="w-full rounded-lg border px-3 py-2">{t.switchTheme}</button>
          </nav>
        </aside>
        <section className="p-4 md:p-8">{children}</section>
      </div>
    </div>
  );
}
