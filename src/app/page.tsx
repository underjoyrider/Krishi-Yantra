'use client';

import React from 'react';
import Link from 'next/link';
import {
  Tractor,
  Clock,
  CalendarCheck,
  BellRing,
  MapPin,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Smartphone,
  ChevronRight,
  Users,
  Sprout,
  Building2,
} from 'lucide-react';
import { LanguageSelector } from '@/components/common/LanguageSelector';
import { LanguageProvider, useLanguage } from '@/lib/language-context';

export default function LandingPage() {
  return (
    <LanguageProvider>
      <LandingPageContent />
    </LanguageProvider>
  );
}

function LandingPageContent() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#F9FBF7] text-[#1F2937]">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-900/10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#124734] text-white flex items-center justify-center shadow-md shrink-0">
              <Sprout className="w-6 h-6 text-lime-300" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-emerald-950 flex items-center gap-2">
                <span>{t.appName}</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                  SIH 2026
                </span>
              </h1>
              <p className="text-[11px] font-semibold text-emerald-700 hidden sm:block">
                {t.landingTagSub}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSelector />
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black text-white bg-[#124734] hover:bg-emerald-900 rounded-xl transition-all shadow-md"
            >
              <span>📱 Farmer App</span>
            </Link>
            <Link
              href="/staff/login"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-300"
            >
              <span>💻 Staff Portal</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 px-4 bg-gradient-to-b from-emerald-100/40 via-emerald-50/20 to-transparent">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300/80 text-emerald-900 text-xs font-bold shadow-2xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>{t.liveSeasonBadge}</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.08] tracking-tight">
              {t.tagline}
            </h2>

            <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
              {t.subTagline}
            </p>

            {/* Dual Portals CTA Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 max-w-lg">
              {/* Farmer App CTA */}
              <Link
                href="/login"
                className="p-4 rounded-2xl bg-[#124734] hover:bg-emerald-900 text-white shadow-lg shadow-emerald-900/20 transition-all border border-emerald-700 flex flex-col justify-between gap-3 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-200">
                    For Farmers
                  </span>
                  <Smartphone className="w-5 h-5 text-emerald-200" />
                </div>
                <div>
                  <div className="text-lg font-black text-white leading-tight">
                    Mobile App Portal →
                  </div>
                  <p className="text-[11px] text-emerald-100/90 mt-0.5 font-medium">
                    Book slots, get digital token slips, track live arrival queues.
                  </p>
                </div>
              </Link>

              {/* Staff Portal CTA */}
              <Link
                href="/staff/login"
                className="p-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 shadow-md transition-all border border-slate-300 flex flex-col justify-between gap-3 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
                    For Staff
                  </span>
                  <Building2 className="w-5 h-5 text-emerald-800" />
                </div>
                <div>
                  <div className="text-lg font-black text-slate-900 leading-tight">
                    Staff Web Portal →
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                    Manage counter desk, center capacity, schedules & analytics.
                  </p>
                </div>
              </Link>
            </div>

            {/* Trust Metric Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 max-w-lg border-t border-gray-200">
              <div className="bg-white p-3 rounded-2xl border border-emerald-100 shadow-2xs">
                <div className="text-2xl font-black text-emerald-900">~25 min</div>
                <div className="text-xs text-gray-500 font-medium">{t.avgWaitLabel}</div>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-emerald-100 shadow-2xs">
                <div className="text-2xl font-black text-emerald-900">0 Queue</div>
                <div className="text-xs text-gray-500 font-medium">{t.zeroQueueLabel}</div>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-emerald-100 shadow-2xs">
                <div className="text-2xl font-black text-emerald-900">100%</div>
                <div className="text-xs text-gray-500 font-medium">{t.predictableLabel}</div>
              </div>
            </div>
          </div>

          {/* Right Hero Visual: Mobile App Preview */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              <div className="bg-white rounded-[36px] p-4 border-[6px] border-slate-900 shadow-2xl relative z-10">
                <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto mb-3" />

                <div className="bg-emerald-50/70 rounded-2xl p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#124734] text-white flex items-center justify-center text-xs font-bold">
                        R
                      </div>
                      <span className="text-xs font-black text-gray-900">Ravi Kumar 👋</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      🟢 Center Open
                    </span>
                  </div>

                  <div className="bg-[#124734] text-white p-4 rounded-2xl shadow-md">
                    <div className="text-[10px] text-emerald-200 uppercase font-semibold">
                      Your Token • Mandya Mandi
                    </div>
                    <div className="text-3xl font-black text-white my-1">B-104</div>
                    <div className="flex items-center justify-between text-xs text-emerald-100 mt-2 pt-2 border-t border-emerald-800/80">
                      <span>Position: <strong className="text-amber-300">#4</strong></span>
                      <span>Wait: <strong>~25 min</strong></span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-900">
                    <BellRing className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Turn approaching: 3 farmers ahead</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step How It Works */}
      <section className="py-16 px-4 bg-white border-y border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              {t.howItWorksLabel}
            </span>
            <h3 className="text-3xl font-black text-gray-900 mt-1">
              {t.howItWorksTitle}
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              {t.howItWorksSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: t.stepFindTitle,
                desc: t.stepFindDesc,
                icon: MapPin,
                bg: 'bg-emerald-50 text-emerald-800',
              },
              {
                step: '02',
                title: t.stepBookTitle,
                desc: t.stepBookDesc,
                icon: CalendarCheck,
                bg: 'bg-amber-50 text-amber-800',
              },
              {
                step: '03',
                title: t.stepTrackTitle,
                desc: t.stepTrackDesc,
                icon: Clock,
                bg: 'bg-blue-50 text-blue-800',
              },
              {
                step: '04',
                title: t.stepArriveTitle,
                desc: t.stepArriveDesc,
                icon: BellRing,
                bg: 'bg-purple-50 text-purple-800',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="p-6 rounded-2xl border border-gray-200 bg-[#F9FBF7] hover:border-emerald-300 transition-all hover:shadow-md"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${item.bg}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black text-gray-400">
                      {item.step}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-[#F9FBF7]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              {t.advantagesLabel}
            </span>
            <h3 className="text-3xl font-black text-gray-900 mt-1">
              {t.advantagesTitle}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-gray-900 mb-1">{t.benefitWaitTitle}</h4>
              <p className="text-sm text-gray-600">
                {t.benefitWaitDesc}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-3">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-gray-900 mb-1">{t.benefitPlanTitle}</h4>
              <p className="text-sm text-gray-600">
                {t.benefitPlanDesc}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold mb-3">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-gray-900 mb-1">{t.benefitLiveTitle}</h4>
              <p className="text-sm text-gray-600">
                {t.benefitLiveDesc}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold mb-3">
                <BellRing className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-gray-900 mb-1">{t.benefitSmsTitle}</h4>
              <p className="text-sm text-gray-600">
                {t.benefitSmsDesc}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm md:col-span-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-gray-900 mb-1">{t.benefitOpsTitle}</h4>
              <p className="text-sm text-gray-600">
                {t.benefitOpsDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-950 text-white py-12 px-4 border-t border-emerald-900">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Sprout className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-lg">{t.appName}</span>
            </div>
            <p className="text-xs text-emerald-300 mt-1">
              "{t.subTagline}"
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-emerald-300 font-semibold">
            <Link href="/login" className="hover:text-white">{t.farmerLoginFooter}</Link>
            <span>•</span>
            <Link href="/staff/login" className="hover:text-white">{t.staffDashboardFooter}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
