import { Stack } from 'expo-router';
import { colors } from '@/constants/theme';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.primaryLight,
        headerTitleStyle: { fontWeight: '600', fontSize: 17, color: colors.text },
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.surface },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="favorites" options={{ title: 'Збережені' }} />
    </Stack>
  );
}
