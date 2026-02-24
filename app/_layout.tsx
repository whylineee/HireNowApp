import { colors } from '@/constants/theme';
import { ThemeProvider } from '@/hooks/useTheme';
import { TranslationProvider } from '@/hooks/useTranslation';
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <ThemeProvider>
      <TranslationProvider>
        <Stack
          screenOptions={{
            headerTintColor: colors.primary,
            headerTitleStyle: { fontWeight: '700', fontSize: 16, color: colors.text },
            headerShadowVisible: false,
            headerStyle: { backgroundColor: colors.background },
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="favorites" options={{ title: 'Збережені' }} />
          <Stack.Screen name="messages" options={{ title: 'Повідомлення' }} />
          <Stack.Screen name="settings" options={{ title: 'Налаштування' }} />
        </Stack>
      </TranslationProvider>
    </ThemeProvider>
  );
}
