export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <form className="glass w-full max-w-md space-y-4 p-6">
        <h1 className="text-2xl font-bold">Sign In</h1>
        <input className="w-full rounded-xl bg-slate-800 p-3" placeholder="Email" type="email" />
        <input className="w-full rounded-xl bg-slate-800 p-3" placeholder="Password" type="password" />
        <button className="w-full rounded-xl bg-cyan-500 py-3 font-semibold text-slate-900">Login</button>
      </form>
    </main>
  );
}
