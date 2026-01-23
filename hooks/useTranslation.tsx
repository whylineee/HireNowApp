import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { enTranslations } from '../locales/en';
import { ukTranslations } from '../locales/uk';

export type Language = 'uk' | 'en';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const translations = {
  uk: ukTranslations,
  en: enTranslations,
};

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('uk');

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    // Save to localStorage
    try {
      localStorage.setItem('language', lang);
    } catch (e) {
      // Ignore localStorage errors
    }
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  useEffect(() => {
    // Load saved language from localStorage
    try {
      const saved = localStorage.getItem('language') as Language;
      if (saved && (saved === 'uk' || saved === 'en')) {
        setLanguageState(saved);
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }, []);

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
}
