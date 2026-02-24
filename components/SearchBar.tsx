import { borderRadius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
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
  placeholder,
  showLocation = true,
  locationValue = '',
  onLocationChange,
}: SearchBarProps) {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);
  const searchPlaceholder = placeholder ?? `${t('jobs.searchJobs')}...`;

  return (
    <View style={styles.wrapper}>
      <View style={styles.searchRow}>
        <Ionicons name="search" size={20} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={searchPlaceholder}
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
            placeholder={t('jobForm.locationPlaceholder')}
            placeholderTextColor={colors.textMuted}
          />
        </View>
      )}
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors'], isDark: boolean) =>
  StyleSheet.create({
    wrapper: {
      paddingVertical: spacing.xs,
      marginBottom: spacing.md,
    },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? 'rgba(15,23,42,0.9)' : 'rgba(255,255,255,0.96)',
      borderRadius: borderRadius.full,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.md,
      minHeight: 48,
      ...colors.shadow.sm,
    },
    searchIcon: { marginRight: spacing.sm },
    input: {
      flex: 1,
      fontSize: typography.sm,
      color: colors.text,
      paddingVertical: spacing.xs + 6,
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.sm,
      backgroundColor: isDark ? 'rgba(15,23,42,0.82)' : 'rgba(255,255,255,0.92)',
      borderRadius: borderRadius.full,
      borderWidth: 1,
      borderColor: colors.borderLight,
      paddingHorizontal: spacing.md,
      minHeight: 44,
      ...colors.shadow.sm,
    },
    locationInput: {
      flex: 1,
      marginLeft: spacing.sm,
      fontSize: typography.sm,
      color: colors.textSecondary,
      paddingVertical: spacing.xs + 4,
    },
  });
