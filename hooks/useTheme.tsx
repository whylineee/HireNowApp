import { getThemeColors, type ThemeColors } from '@/constants/theme';
import { getStoredValue, setStoredValue } from '@/utils/storage';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

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

  const isDark = useMemo(() => {
    if (themeMode === 'system') {
      return systemScheme === 'dark';
    }

    return themeMode === 'dark';
  }, [systemScheme, themeMode]);

  const colors = useMemo(() => getThemeColors(isDark), [isDark]);

  return <ThemeContext.Provider value={{ themeMode, setThemeMode, isDark, colors }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
