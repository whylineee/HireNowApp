/**
 * Тема додатку HireNow
 * Єдине джерело кольорів, відступів та типографіки
 */

export const colors = {
  // Основні
  primary: '#0F766E',      // Teal 700 — головний акцент
  primaryLight: '#14B8A6', // Teal 500
  primaryDark: '#0D9488',  // Teal 600
  primaryGradient: ['#0F766E', '#14B8A6'],

  // Нейтральні
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceHover: '#F8FAFC',

  // Текст
  text: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',

  // Статуси
  success: '#059669',
  error: '#DC2626',
  warning: '#D97706',
  info: '#0EA5E9',

  // Рамки та роздільники
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  
  // Тіні
  shadow: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
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
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
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
