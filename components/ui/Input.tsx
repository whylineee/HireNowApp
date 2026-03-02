import { borderRadius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export function Input({ label, error, containerStyle, onFocus, onBlur, ...props }: InputProps) {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);
  const [isFocused, setIsFocused] = useState(false);
  const focusAnim = useRef(new Animated.Value(0)).current;

  const handleFocus: TextInputProps['onFocus'] = (event) => {
    setIsFocused(true);
    Animated.timing(focusAnim, {
      toValue: 1,
      duration: 170,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    onFocus?.(event);
  };

  const handleBlur: TextInputProps['onBlur'] = (event) => {
    setIsFocused(false);
    Animated.timing(focusAnim, {
      toValue: 0,
      duration: 180,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
    onBlur?.(event);
  };

  const focusedScale = focusAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.01] });
  const focusedOpacity = focusAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Animated.View
        style={[
          styles.inputShell,
          isFocused && styles.inputShellFocused,
          error ? styles.inputShellError : null,
          { transform: [{ scale: focusedScale }] },
        ]}
      >
        <Animated.View style={[styles.focusGlow, { opacity: focusedOpacity }]} />
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.textMuted}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      </Animated.View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors'], isDark: boolean) =>
  StyleSheet.create({
    wrapper: { marginBottom: spacing.md },
    label: {
      fontSize: typography.sm,
      fontWeight: typography.medium,
      color: colors.textSecondary,
      marginBottom: spacing.xs + 2,
    },
    inputShell: {
      backgroundColor: isDark ? 'rgba(15,23,42,0.9)' : 'rgba(255,255,255,0.96)',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
    },
    inputShellFocused: {
      borderColor: colors.primaryLight,
    },
    inputShellError: {
      borderColor: colors.error,
      borderWidth: 1.5,
    },
    focusGlow: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: isDark ? 'rgba(96,165,250,0.09)' : 'rgba(37,99,235,0.06)',
    },
    input: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm + 3,
      fontSize: typography.sm,
      color: colors.text,
    },
    error: {
      fontSize: typography.xs,
      color: colors.error,
      marginTop: spacing.xs,
    },
  });
