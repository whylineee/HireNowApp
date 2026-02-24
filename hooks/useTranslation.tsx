import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getStoredValue, setStoredValue } from '@/utils/storage';
import { enTranslations } from '../locales/en';
import { ukTranslations } from '../locales/uk';

export type Language = 'uk' | 'en';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

type TranslationNode = string | { [key: string]: TranslationNode };

const translations = {
  uk: ukTranslations,
  en: enTranslations,
};

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('uk');

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setStoredValue('language', lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: TranslationNode | undefined = translations[language] as TranslationNode;

    for (const k of keys) {
      if (!value || typeof value === 'string') {
        return key;
      }
      value = value[k];
    }

    return typeof value === 'string' ? value : key;
  };

  useEffect(() => {
    const saved = getStoredValue('language');
    if (saved && (saved === 'uk' || saved === 'en')) {
      setLanguageState(saved);
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
