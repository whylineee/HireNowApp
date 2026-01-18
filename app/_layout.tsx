import { Stack } from 'expo-router';
import { colors } from '@/constants/theme';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.primary,
        headerTitleStyle: { fontWeight: '600', fontSize: 17 },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="favorites" options={{ title: 'Збережені' }} />
    </Stack>
  );
}
