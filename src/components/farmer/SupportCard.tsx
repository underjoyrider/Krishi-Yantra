'use client';

import React from 'react';
import Link from 'next/link';
import { MessageCircle, ArrowRight, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export const SupportCard: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-3xl p-5 border border-emerald-700/60 shadow-lg relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-6 -right-6 w-28 h-28 bg-emerald-600/20 rounded-full blur-xl pointer-events-none" />

      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-8 h-8 rounded-xl bg-emerald-700/80 border border-emerald-600/50 flex items-center justify-center text-emerald-200">
          <MessageCircle className="w-4 h-4" />
        </div>
        <h3 className="text-base font-black text-white">{t.helpSupport}</h3>
      </div>

      <p className="text-xs text-emerald-200 leading-relaxed max-w-xs mb-4">
        {t.helpSubtitle}
      </p>

      <Link
        href="/farmer/support"
        className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-emerald-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
      >
        <span>{t.viewHelpCenter}</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};
