import Link from 'next/link';
import { ArrowUpRight, Building2, Leaf } from 'lucide-react';

export default function LoginPortalPage() {
  return (
    <main className="min-h-screen bg-[#edf4ee] px-4 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center">
        <section className="grid w-full overflow-hidden rounded-[2rem] border border-emerald-950/10 bg-white shadow-2xl lg:grid-cols-[0.85fr_1.15fr]">
          <div className="bg-[#124734] p-8 text-white sm:p-12">
            <div className="mb-16 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lime-300 text-emerald-950"><Leaf className="h-6 w-6" /></div>
              <div><p className="text-lg font-black">KrishiYantra</p><p className="text-xs text-emerald-100/70">Mandi operations, made clear</p></div>
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-300">Choose your portal</p>
            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">One platform, two clear paths.</h1>
            <p className="mt-6 max-w-sm text-sm leading-7 text-emerald-50/75">Farmers manage visits and tokens. Staff manage procurement operations and queues.</p>
          </div>
          <div className="p-6 sm:p-12">
            <div className="mb-8"><p className="text-sm font-bold text-emerald-700">Secure access</p><h2 className="mt-1 text-3xl font-black">Where are you signing in?</h2></div>
            <div className="grid gap-4">
              <Link href="/farmer/login" className="group rounded-2xl border border-slate-200 p-5 transition hover:border-emerald-500 hover:bg-emerald-50"><div className="flex items-start justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800"><Leaf className="h-6 w-6" /></span><ArrowUpRight className="h-5 w-5 text-slate-300 transition group-hover:text-emerald-700" /></div><h3 className="mt-6 text-xl font-black">Farmer portal</h3><p className="mt-2 text-sm leading-6 text-slate-500">Sign in or create an account to book a mandi slot and track your queue.</p></Link>
              <Link href="/staff/login" className="group rounded-2xl border border-slate-200 p-5 transition hover:border-emerald-500 hover:bg-emerald-50"><div className="flex items-start justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-800"><Building2 className="h-6 w-6" /></span><ArrowUpRight className="h-5 w-5 text-slate-300 transition group-hover:text-emerald-700" /></div><h3 className="mt-6 text-xl font-black">Staff portal</h3><p className="mt-2 text-sm leading-6 text-slate-500">Sign in to operate procurement center workflows.</p></Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
