import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import enTranslations from './en.json';
import arTranslations from './ar.json';

export type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: 'ltr' | 'rtl';
  t: (path: string, fallback?: string) => string;
}

const translations: Record<Language, any> = {
  en: enTranslations,
  ar: arTranslations
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('keyscale_lang') as Language;
      if (saved === 'en' || saved === 'ar') return saved;
    } catch {}
    return 'en';
  });

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('keyscale_lang', lang);
    } catch {}
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    if (language === 'ar') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [language, dir]);

  const t = useMemo(() => {
    const dict = translations[language];
    return (path: string, fallback?: string): string => {
      const parts = path.split('.');
      let cur = dict;
      for (const p of parts) {
        if (cur && typeof cur === 'object' && p in cur) {
          cur = cur[p];
        } else {
          return fallback || path;
        }
      }
      return typeof cur === 'string' ? cur : fallback || path;
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dir, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
