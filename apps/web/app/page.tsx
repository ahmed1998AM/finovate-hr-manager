import { AppShell } from '@/components/app-shell';

const modules = [
  'Accounting', 'Sales', 'Purchase', 'Inventory', 'HR', 'Projects', 'Reports', 'AI Assistant', 'Notifications', 'Settings'
];

export default function Home() {
  return (
    <AppShell>
      <section className="glass neon p-6">
        <h2 className="text-3xl font-bold">Finovate ERP Lite</h2>
        <p className="mt-2 text-slate-300">Premium bilingual ERP experience for SMB operations and finance teams.</p>
      </section>
      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {modules.map((module) => (
          <article key={module} className="glass p-4 transition hover:-translate-y-1 hover:border-cyan-400/40">
            <h3 className="font-semibold">{module}</h3>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
