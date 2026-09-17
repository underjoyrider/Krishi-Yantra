'use client';

import React from 'react';
import { useLanguage } from '@/lib/language-context';
import { Language } from '@/lib/translations';

export const LanguageSelector: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { lang, setLang } = useLanguage();

  const options: { id: Language; label: string }[] = [
    { id: 'en', label: 'English' },
    { id: 'hi', label: 'हिंदी' },
    { id: 'kn', label: 'ಕನ್ನಡ' },
  ];

  return (
    <div className="inline-flex rounded-lg bg-emerald-900/10 p-1 border border-emerald-800/20 text-xs font-semibold">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => setLang(opt.id)}
          className={`px-2.5 py-1 rounded-md transition-all ${
            lang === opt.id
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-emerald-950 hover:bg-emerald-800/10'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};
