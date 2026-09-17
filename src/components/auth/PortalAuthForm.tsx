'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Building2, CheckCircle2, CreditCard, Eye, EyeOff, Leaf, LockKeyhole, Phone, UserRound, MessageSquare } from 'lucide-react';
import { setStoredUser } from '@/lib/auth';
import { useLanguage } from '@/lib/language-context';

type PortalRole = 'FARMER' | 'VENDOR';

interface PortalAuthFormProps {
  role: PortalRole;
}

export function PortalAuthForm({ role }: PortalAuthFormProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const isFarmer = role === 'FARMER';
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [village, setVillage] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState(false);
  const [createdCustomerId, setCreatedCustomerId] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [consent, setConsent] = useState(false);

  const parseResponse = async (response: Response) => {
    try {
      return await response.json();
    } catch {
      return {};
    }
  };

  const finishLogin = (user: any) => {
    setStoredUser(user);
    router.push(isFarmer ? '/farmer/booking' : '/staff/dashboard');
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setCreated(false);

    try {
      const endpoint = mode === 'signup' ? '/api/auth/signup' : '/api/auth/password-login';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, aadhaar, password, village, email, role }),
      });
      const data = await parseResponse(response);
      if (!response.ok || !data.success || !data.user) {
        setError(data.message || 'Please check your details and try again.');
        return;
      }
      if (mode === 'signup') {
        setCreated(true);
        setCreatedCustomerId(data.user.customerId || '');
        setMode('login');
        setPassword('');
        setName('');
      } else {
        finishLogin(data.user);
      }
    } catch {
      setError('The authentication service is unavailable. Make sure the app server is running.');
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      const data = await parseResponse(response);
      if (!response.ok || !data.success || !data.user) {
        setError(data.message || 'Demo login failed.');
        return;
      }
      finishLogin(data.user);
    } catch {
      setError('The authentication service is unavailable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-3 py-4 text-slate-900 sm:px-6 sm:py-8 flex flex-col items-center justify-center relative overflow-x-hidden">
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl flex flex-col lg:grid lg:grid-cols-12">
        {/* Left Informational Sidebar - Hidden on mobile (< lg), visible on Desktop (lg+) */}
        <section className="hidden lg:flex lg:col-span-5 relative flex-col justify-between overflow-hidden bg-[#124734] p-8 text-white">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border-[22px] border-lime-300/20 pointer-events-none" />
          <div>
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lime-300 text-emerald-950 shadow-sm">
                {isFarmer ? <Leaf className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
              </div>
              <div>
                <p className="text-lg font-black tracking-tight leading-none text-white">KrishiYantra</p>
                <p className="text-[11px] text-emerald-200/80 font-medium">
                  {isFarmer ? t.tagline : 'Staff Operations'}
                </p>
              </div>
            </div>

            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-lime-300">
              {isFarmer ? (t.farmerPortalLabel || 'FARMER PORTAL') : 'STAFF PORTAL'}
            </p>
            <h1 className="text-3xl font-black leading-tight tracking-tight text-white">
              {isFarmer ? (t.farmerHeroTitle || 'Plan your mandi visit with confidence.') : 'Run your procurement desk with control.'}
            </h1>
            <p className="mt-4 text-xs leading-relaxed text-emerald-100/75">
              {isFarmer ? (t.farmerHeroDesc || 'Book a slot, follow your token, and see live waiting times before you travel.') : 'Manage queues, center capacity, schedules, and farmer support from one operational view.'}
            </p>
          </div>

          <div className="mt-8 space-y-3 text-xs text-emerald-50/85">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-3.5">
              <CheckCircle2 className="mb-1.5 h-4 w-4 text-lime-300" />
              <p className="font-bold">{isFarmer ? (t.liveQueueVisibilityTitle || 'Live queue visibility') : 'Live queue visibility'}</p>
              <p className="mt-0.5 text-[11px] text-emerald-100/65">{isFarmer ? (t.liveQueueVisibilityDesc || 'Updates from the counter in real time.') : 'Updates from the counter in real time.'}</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-3.5">
              <CheckCircle2 className="mb-1.5 h-4 w-4 text-lime-300" />
              <p className="font-bold">{isFarmer ? (t.secureAccountsTitle || 'Secure local accounts') : 'Secure local accounts'}</p>
              <p className="mt-0.5 text-[11px] text-emerald-100/65">{isFarmer ? (t.secureAccountsDesc || 'Credentials are stored securely.') : 'Credentials are stored securely.'}</p>
            </div>
          </div>
        </section>

        {/* Form Container - 100% full width on mobile/tablet (< lg), 7 cols on Desktop */}
        <section className="w-full lg:col-span-7 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-10">
          
          {/* Mobile Top Branding Header - Visible ONLY on mobile/tablet (< lg) */}
          <div className="w-full max-w-md lg:hidden flex items-center justify-between pb-4 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#124734] text-lime-300 shadow-sm">
                {isFarmer ? <Leaf className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
              </div>
              <div>
                <p className="text-base font-black tracking-tight leading-none text-slate-900">KrishiYantra</p>
                <p className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider mt-0.5">
                  {isFarmer ? 'Kisan App' : 'Staff Portal'}
                </p>
              </div>
            </div>
          </div>

          <div className="w-full max-w-md space-y-4 sm:space-y-5">
            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-xs font-bold text-emerald-700">{isFarmer ? (t.farmerAccessLabel || 'Farmer access') : 'Staff access'}</p>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5 break-words">
                  {mode === 'login'
                    ? (isFarmer ? (t.welcomeBack || 'Welcome back') : 'Welcome back')
                    : (isFarmer ? (t.createYourAccount || 'Create your account') : 'Create your account')}
                </h2>
              </div>
              {isFarmer ? (
                <Leaf className="h-6 w-6 text-emerald-700 shrink-0 hidden sm:block" />
              ) : (
                <Building2 className="h-6 w-6 text-emerald-700 shrink-0 hidden sm:block" />
              )}
            </div>

            {/* Mode Tabs */}
            <div className="grid grid-cols-2 rounded-2xl bg-slate-100 p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); }}
                className={`rounded-xl px-3 py-2.5 transition-all ${mode === 'login' ? 'bg-white text-emerald-900 shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-900'}`}
              >
                {isFarmer ? (t.logInTab || 'Log in') : 'Log in'}
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(''); }}
                className={`rounded-xl px-3 py-2.5 transition-all ${mode === 'signup' ? 'bg-white text-emerald-900 shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-900'}`}
              >
                {isFarmer ? (t.signUpTab || 'Sign up') : 'Sign up'}
              </button>
            </div>

            {created && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-900 shadow-2xs break-words">
                Account created successfully. {createdCustomerId && <>Your ID is <span className="font-black text-emerald-950">{createdCustomerId}</span>. </>}Please log in below.
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-700 shadow-2xs break-words">
                {error}
              </div>
            )}

            <form onSubmit={submit} className="space-y-3.5">
              {mode === 'signup' && (
                <label className="block text-xs font-bold text-slate-700">
                  {isFarmer ? (t.fullNameLabel || 'Full name') : 'Full name'}
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs font-semibold outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-2xs"
                    placeholder={isFarmer ? (t.namePlaceholder || 'Your name') : 'Staff operator name'}
                  />
                </label>
              )}

              {mode === 'signup' && (
                <label className="block text-xs font-bold text-slate-700">
                  {isFarmer ? (t.emailOptionalLabel || 'Email (optional)') : <>Email <span className="font-normal text-slate-400">(optional)</span></>}
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs font-semibold outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-2xs"
                    placeholder="name@example.com"
                  />
                </label>
              )}

              {(!isFarmer || mode === 'signup') && (
                <label className="block text-xs font-bold text-slate-700">
                  {isFarmer ? (t.mobileNumberLabel || 'Mobile number') : 'Mobile number'}
                  <div className="relative mt-1.5">
                    <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      required={!isFarmer || mode === 'signup'}
                      inputMode="numeric"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3.5 text-xs font-semibold outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-2xs"
                      placeholder={isFarmer ? (t.mobilePlaceholder || '10-digit mobile number') : '10-digit mobile number'}
                    />
                  </div>
                </label>
              )}

              {isFarmer && (
                <div>
                  <label className="block text-xs font-bold text-slate-700">
                    {t.aadhaarNumberLabel || 'Aadhaar number'}
                    <div className="relative mt-1.5">
                      <CreditCard className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        required
                        inputMode="numeric"
                        maxLength={12}
                        value={aadhaar}
                        onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, '').slice(0, 12))}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3.5 text-xs font-semibold outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-2xs"
                        placeholder={t.aadhaarPlaceholder || '12-digit Aadhaar number'}
                      />
                    </div>
                  </label>
                  <label className="flex items-start gap-2.5 text-[11px] font-medium text-slate-600 pt-2 leading-snug">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600 shrink-0"
                    />
                    <span className="flex-1 text-wrap">{t.aadhaarConsentText || 'I consent to Aadhaar identity verification.'}</span>
                  </label>
                </div>
              )}

              {isFarmer && mode === 'signup' && (
                <label className="block text-xs font-bold text-slate-700">
                  {t.villageLabel || 'Village'}
                  <input
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs font-semibold outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-2xs"
                    placeholder={t.villagePlaceholder || 'Your village'}
                  />
                </label>
              )}

              <label className="block text-xs font-bold text-slate-700">
                {isFarmer ? (t.passwordLabel || 'Password') : 'Password'}
                <div className="relative mt-1.5">
                  <LockKeyhole className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-xs font-semibold outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-2xs"
                    placeholder={isFarmer ? (t.passwordPlaceholder || 'At least 6 characters') : 'At least 6 characters'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              <button
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#124734] hover:bg-emerald-900 px-4 py-3.5 text-xs font-black text-white shadow-md active:scale-98 transition-all disabled:opacity-60 mt-2"
              >
                <span>
                  {loading
                    ? (isFarmer ? (t.pleaseWaitBtn || 'Please wait...') : 'Please wait...')
                    : mode === 'login'
                    ? (isFarmer ? (t.logInSecurely || 'Log in securely') : 'Log in securely')
                    : (isFarmer ? (t.createAccountBtn || 'Create account') : 'Create account')}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <button
              type="button"
              disabled={loading}
              onClick={demoLogin}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 px-4 py-3 text-xs font-extrabold text-emerald-900 shadow-2xs transition-all disabled:opacity-60"
            >
              <UserRound className="h-4 w-4 text-emerald-700" />
              <span>{isFarmer ? (t.useDemoFarmerAccount || 'Use demo farmer account') : 'Use demo staff account'}</span>
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => router.push(isFarmer ? '/staff/login' : '/farmer/login')}
                className="text-xs font-bold text-slate-500 hover:text-emerald-800 transition-colors"
              >
                {isFarmer ? 'Switch to Staff Portal →' : 'Switch to Farmer Mobile App →'}
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Floating Chat / Help Button */}
      <button
        type="button"
        onClick={() => router.push('/farmer/support')}
        className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#124734] text-white shadow-xl hover:bg-emerald-900 active:scale-95 transition-all"
        title="Help & Support"
        aria-label="Help & Support"
      >
        <MessageSquare className="h-6 w-6 text-lime-300" />
      </button>
    </main>
  );
}

