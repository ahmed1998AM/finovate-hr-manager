const kpis = [
  { label: 'Revenue', value: '$1,240,500' },
  { label: 'Expenses', value: '$730,320' },
  { label: 'Net Profit', value: '$510,180' },
  { label: 'Pending Invoices', value: '36' }
];

export default function DashboardPage() {
  return (
    <main className="p-8">
      <h1 className="mb-6 text-3xl font-bold">Executive Dashboard</h1>
      <section className="grid gap-4 md:grid-cols-4">
        {kpis.map((kpi) => (
          <article key={kpi.label} className="glass p-5">
            <p className="text-slate-400">{kpi.label}</p>
            <p className="text-2xl font-bold text-cyan-300">{kpi.value}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
