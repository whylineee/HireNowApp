/**
 * Тема додатку HireNow
 * Єдине джерело кольорів, відступів та типографіки
 */

export const colors = {
  // Основні (Teal палітра як в документації)
  primary: '#0F766E',       // Teal - головний акцент
  primaryLight: '#14B8A6',  // Світліший Teal
  primaryDark: '#0D9488',   // Темніший Teal
  accent: '#F97316',       // помаранчевий акцент
  primaryGradient: ['#0F766E', '#14B8A6'],

  // Нейтральні (світла тема)
  background: '#F8FAFC',    // Світлий сірий фон
  surface: '#FFFFFF',      // білі поверхні
  surfaceElevated: '#F8F9FA', // світло-сірий для карток
  surfaceHover: '#F1F3F4', // для hover ефектів
  surfaceMuted: '#F5F5F5', // для фону

  // Текст (світла тема)
  text: '#0F172A',         // Темний сірий (Slate 900)
  textSecondary: '#64748B', // Slate 500
  textMuted: '#94A3B8',    // Slate 400

  // Статуси
  success: '#059669',
  error: '#DC2626',
  warning: '#D97706',
  info: '#0EA5E9',

  // Рамки та роздільники
  border: '#E5E7EB',       // світлі рамки
  borderLight: '#F3F4F6',  // ще світліші

  // Додаткові кольори для ілюстрацій
  coral: '#FF6B6B',        // кораловий
  teal: '#4ECDC4',         // бірюзовий
  sky: '#45B7D1',         // небесний
  mint: '#96CEB4',        // м'ятний

  // Тіні (світлі, м'які)
  shadow: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.03,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
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
