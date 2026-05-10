import { AppShell } from '@/components/app-shell';

const modules = [
  'Accounting', 'Sales', 'Purchase', 'Inventory', 'HR', 'Projects', 'Reports', 'AI Assistant', 'Notifications', 'Settings'
];

export default function Home() {
  return (
    <AppShell>
      <section className="glass p-6">
        <h2 className="text-3xl font-bold">Commercial ERP Experience</h2>
        <p className="mt-2 text-slate-300">Multi-company, RBAC-ready, bilingual architecture for SMEs.</p>
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
