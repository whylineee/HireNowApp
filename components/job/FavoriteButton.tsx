import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onPress: () => void;
  size?: number;
}

export function FavoriteButton({ isFavorite, onPress, size = 24 }: FavoriteButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.button}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Ionicons
        name={isFavorite ? 'heart' : 'heart-outline'}
        size={size}
        color={isFavorite ? colors.error : colors.textMuted}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1,
    borderColor: colors.border,
  },
});
