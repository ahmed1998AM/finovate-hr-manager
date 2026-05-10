import Link from 'next/link';

const modules = [
  'Accounting', 'Sales', 'Purchasing', 'Inventory', 'HR', 'Projects', 'Reports', 'Notifications'
];

export default function Home() {
  return (
    <main className="p-8 md:p-16">
      <section className="glass p-8">
        <h1 className="text-4xl font-bold">Finovate ERP Lite</h1>
        <p className="mt-3 text-slate-300">Arabic + English cloud-ready ERP for SMEs.</p>
        <div className="mt-6 flex gap-4">
          <Link href="/dashboard" className="rounded-xl bg-cyan-500 px-4 py-2 font-semibold text-slate-900">Dashboard</Link>
          <Link href="/auth/login" className="rounded-xl border border-slate-400 px-4 py-2">Login</Link>
        </div>
      </section>
      <section className="mt-8 grid gap-4 md:grid-cols-4">
        {modules.map((module) => <article key={module} className="glass p-4"><h2 className="font-semibold">{module}</h2></article>)}
      </section>
    </main>
  );
}
