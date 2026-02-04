import { borderRadius, colors, spacing, typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch?: () => void;
  placeholder?: string;
  showLocation?: boolean;
  locationValue?: string;
  onLocationChange?: (text: string) => void;
}

export function SearchBar({
  value,
  onChangeText,
  onSearch,
  placeholder = 'Посада, компанія, ключові слова...',
  showLocation = true,
  locationValue = '',
  onLocationChange,
}: SearchBarProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.searchRow}>
        <Ionicons name="search" size={20} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          returnKeyType="search"
          onSubmitEditing={onSearch}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="close-circle" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {showLocation && (
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.locationInput}
            value={locationValue}
            onChangeText={onLocationChange ?? (() => {})}
            placeholder="Місто або країна"
            placeholderTextColor={colors.textMuted}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...colors.shadow.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: { marginRight: spacing.sm },
  input: {
    flex: 1,
    fontSize: typography.base,
    color: colors.text,
    paddingVertical: spacing.sm,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  locationInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: typography.sm,
    color: colors.text,
    paddingVertical: 2,
  },
});
