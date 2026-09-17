'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations, Translations } from './translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: translations.en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    const saved = (localStorage.getItem('krishiyantra_lang') || localStorage.getItem('kisanqueue_lang')) as Language;
    if (saved && (saved === 'en' || saved === 'hi' || saved === 'kn')) {
      setLangState(saved);
    }

    const handleStorage = () => {
      const updated = (localStorage.getItem('krishiyantra_lang') || localStorage.getItem('kisanqueue_lang')) as Language;
      if (updated && (updated === 'en' || updated === 'hi' || updated === 'kn')) {
        setLangState(updated);
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('krishiyantra_lang_changed', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('krishiyantra_lang_changed', handleStorage);
    };
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('krishiyantra_lang', newLang);
    localStorage.setItem('kisanqueue_lang', newLang);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('krishiyantra_lang_changed'));
    }
  };

  // Safe translation dictionary with automatic fallback to English
  const currentTranslations = translations[lang] || translations.en;
  const safeT = new Proxy(currentTranslations, {
    get(target, prop: string) {
      if (prop in target && target[prop as keyof Translations]) {
        return target[prop as keyof Translations];
      }
      return translations.en[prop as keyof Translations] || prop;
    },
  });

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: safeT }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
