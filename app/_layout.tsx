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
            animation: 'slide_from_right',
            gestureEnabled: true,
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="favorites" options={{ headerShown: false }} />
          <Stack.Screen name="messages" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
          <Stack.Screen name="job/[id]" options={{ headerShown: false }} />
        </Stack>
      </TranslationProvider>
    </ThemeProvider>
  );
}
