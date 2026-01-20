import { View, StyleSheet, ViewStyle, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '@/constants/theme';

interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

export function Screen({ children, scroll = false, style, edges = ['top'] }: ScreenProps) {
  return (
    <SafeAreaView style={[styles.safe, style]} edges={edges}>
      <View pointerEvents="none" style={styles.background}>
        <View style={styles.glowPrimary} />
        <View style={styles.glowAccent} />
      </View>
      {scroll ? (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={styles.content}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  glowPrimary: {
    position: 'absolute',
    top: -120,
    right: -80,
    width: 240,
    height: 240,
    borderRadius: 999,
    backgroundColor: colors.primary + '14',
  },
  glowAccent: {
    position: 'absolute',
    top: 120,
    left: -120,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: colors.accent + '12',
  },
  content: { flex: 1, padding: spacing.md },
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.md, paddingBottom: spacing.xxl },
});
