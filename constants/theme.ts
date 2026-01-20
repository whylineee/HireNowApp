/**
 * Тема додатку HireNow
 * Єдине джерело кольорів, відступів та типографіки
 */

export const colors = {
  // Основні (оновлена сучасна палітра)
  primary: '#4C6FFF',       // яскравий індиго
  primaryLight: '#7C8CFF',
  primaryDark: '#3246D3',
  accent: '#F97316',
  primaryGradient: ['#4C6FFF', '#7C8CFF'],

  // Нейтральні
  background: '#050816',    // темний фон у стилі неоморфізму
  surface: '#0B1220',
  surfaceElevated: '#111827',
  surfaceHover: '#1F2937',
  surfaceMuted: '#020617',

  // Текст
  text: '#E5E7EB',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',

  // Статуси
  success: '#059669',
  error: '#DC2626',
  warning: '#D97706',
  info: '#0EA5E9',

  // Рамки та роздільники
  border: '#111827',
  borderLight: '#1F2937',
  
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
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 8,
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
  lg: 16,
  xl: 24,
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
