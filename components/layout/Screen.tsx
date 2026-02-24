import { colors, spacing } from '@/constants/theme';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
        <View style={styles.washTop} />
        <View style={styles.washBottom} />
        <View style={styles.glowPrimary} />
        <View style={styles.glowAccent} />
        <View style={styles.glowSoft} />
      </View>
      {scroll ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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
  washTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 320,
    backgroundColor: 'rgba(240,244,255,0.9)',
  },
  washBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 220,
    backgroundColor: 'rgba(246,248,252,0.65)',
  },
  glowPrimary: {
    position: 'absolute',
    top: -120,
    right: -100,
    width: 320,
    height: 320,
    borderRadius: 999,
    backgroundColor: 'rgba(37,99,235,0.12)',
  },
  glowAccent: {
    position: 'absolute',
    top: 140,
    left: -120,
    width: 280,
    height: 280,
    borderRadius: 999,
    backgroundColor: 'rgba(124,58,237,0.10)',
  },
  glowSoft: {
    position: 'absolute',
    bottom: 180,
    right: -100,
    width: 260,
    height: 260,
    borderRadius: 999,
    backgroundColor: 'rgba(15,23,42,0.03)',
  },
  content: { flex: 1, padding: spacing.md },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: spacing.md, paddingBottom: spacing.xxl + spacing.lg },
});
