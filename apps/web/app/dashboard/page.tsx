import { AppShell } from '@/components/app-shell';

const kpis = [
  ['Total Revenue', '$1,240,500'],
  ['Total Expenses', '$730,320'],
  ['Net Profit', '$510,180'],
  ['Pending Invoices', '36'],
  ['Low Stock Alerts', '12'],
  ['Active Employees', '82'],
  ['Tax Summary', '$14,600'],
  ['Open Tasks', '27']
];

export default function DashboardPage() {
  return (
    <AppShell>
      <h1 className="mb-6 text-3xl font-bold">Executive Dashboard</h1>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(([label, value]) => (
          <article key={label} className="glass p-5">
            <p className="text-slate-400">{label}</p>
            <p className="text-2xl font-bold text-cyan-300">{value}</p>
          </article>
        ))}
      </section>
      <section className="mt-6 grid gap-4 xl:grid-cols-2">
        <div className="glass p-5"><h2 className="font-semibold">Recent Transactions</h2><p className="text-sm text-slate-400">Sales invoices, supplier payments, payroll.</p></div>
        <div className="glass p-5"><h2 className="font-semibold">Quick Actions</h2><p className="text-sm text-slate-400">Create invoice, add expense, run payroll, export report.</p></div>
      </section>
    </AppShell>
  );
}
