import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getStoredValue, setStoredValue } from '@/utils/storage';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isDark, setIsDark] = useState(false);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    setStoredValue('themeMode', mode);
  };

  useEffect(() => {
    const saved = getStoredValue('themeMode');
    if (saved && (saved === 'light' || saved === 'dark' || saved === 'system')) {
      setThemeModeState(saved);
    }
  }, []);

  useEffect(() => {
    // Determine actual theme based on mode and system preference
    if (themeMode === 'system') {
      // For now, default to light. In a real app, you'd detect system preference
      setIsDark(false);
    } else {
      setIsDark(themeMode === 'dark');
    }
  }, [themeMode]);

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
