export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;
  primaryGradient: [string, string];

  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceHover: string;
  surfaceMuted: string;

  text: string;
  textSecondary: string;
  textMuted: string;

  success: string;
  error: string;
  warning: string;
  info: string;

  border: string;
  borderLight: string;

  coral: string;
  teal: string;
  sky: string;
  mint: string;

  shadow: {
    sm: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    md: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    lg: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  };
}

export const lightColors: ThemeColors = {
  primary: '#2563EB',
  primaryLight: '#3B82F6',
  primaryDark: '#4F46E5',
  accent: '#7C3AED',
  primaryGradient: ['#2563EB', '#4F46E5'],

  background: '#F7F9FC',
  surface: '#FFFFFF',
  surfaceElevated: 'rgba(255,255,255,0.94)',
  surfaceHover: '#F8FAFC',
  surfaceMuted: '#EEF2FF',

  text: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',

  success: '#10B981',
  error: '#DC2626',
  warning: '#F59E0B',
  info: '#0EA5E9',

  border: 'rgba(148,163,184,0.25)',
  borderLight: 'rgba(148,163,184,0.2)',

  coral: '#FB7185',
  teal: '#22D3EE',
  sky: '#60A5FA',
  mint: '#34D399',

  shadow: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 10,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.08,
      shadowRadius: 20,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 18 },
      shadowOpacity: 0.12,
      shadowRadius: 30,
      elevation: 6,
    },
  },
};

export const darkColors: ThemeColors = {
  primary: '#60A5FA',
  primaryLight: '#93C5FD',
  primaryDark: '#3B82F6',
  accent: '#A78BFA',
  primaryGradient: ['#2563EB', '#1D4ED8'],

  background: '#050B16',
  surface: '#0C1628',
  surfaceElevated: 'rgba(15,23,42,0.9)',
  surfaceHover: '#17243A',
  surfaceMuted: '#101D33',

  text: '#F1F5F9',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',

  success: '#34D399',
  error: '#F87171',
  warning: '#FBBF24',
  info: '#38BDF8',

  border: 'rgba(148,163,184,0.28)',
  borderLight: 'rgba(148,163,184,0.2)',

  coral: '#FB7185',
  teal: '#22D3EE',
  sky: '#60A5FA',
  mint: '#34D399',

  shadow: {
    sm: {
      shadowColor: '#020617',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.28,
      shadowRadius: 10,
      elevation: 2,
    },
    md: {
      shadowColor: '#020617',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.34,
      shadowRadius: 16,
      elevation: 4,
    },
    lg: {
      shadowColor: '#020617',
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: 0.42,
      shadowRadius: 26,
      elevation: 8,
    },
  },
};

export function getThemeColors(isDark: boolean): ThemeColors {
  return isDark ? darkColors : lightColors;
}

// Backward compatibility for modules that still use static tokens.
export const colors = lightColors;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderRadius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  full: 9999,
} as const;

export const typography = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,

  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
} as const;
