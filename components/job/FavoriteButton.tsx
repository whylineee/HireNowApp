import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onPress: () => void;
  size?: number;
}

export function FavoriteButton({ isFavorite, onPress, size = 24 }: FavoriteButtonProps) {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  return (
    <TouchableOpacity onPress={onPress} style={styles.button} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
      <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={size} color={isFavorite ? colors.error : colors.textMuted} />
    </TouchableOpacity>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors'], isDark: boolean) =>
  StyleSheet.create({
    button: {
      padding: 6,
      borderRadius: 999,
      backgroundColor: isDark ? 'rgba(15,23,42,0.9)' : 'rgba(255,255,255,0.92)',
      borderWidth: 1,
      borderColor: colors.border,
    },
  });
