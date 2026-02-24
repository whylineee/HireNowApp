export const colors = {
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
} as const;

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
  // Розміри
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,

  // Вага
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
} as const;
