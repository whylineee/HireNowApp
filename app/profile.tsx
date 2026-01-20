import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { useAuth } from '@/hooks/useAuth';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

export default function ProfileScreen() {
  const { user } = useAuth();

  return (
    <Screen scroll={false}>
      <View style={{ flex: 1 }}>
        <Header
          title="Мій кабінет"
          subtitle={user ? `${user.name} • ${user.role === 'worker' ? 'Пошук роботи' : 'Роботодавець'}` : undefined}
        />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Профіль</Text>
            <Text style={styles.cardText}>
              Тут зʼявиться детальна інформація про ваш профіль, резюме та компанію, коли ми підʼєднаємо бекенд.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Налаштування додатку</Text>
            <View style={styles.settingRow}>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Темна тема</Text>
                <Text style={styles.settingSubtitle}>Увімкнено за замовчуванням</Text>
              </View>
              <Switch value disabled />
            </View>
            <View style={styles.settingRow}>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Сповіщення</Text>
                <Text style={styles.settingSubtitle}>Отримувати оновлення про нові вакансії</Text>
              </View>
              <Switch value disabled />
            </View>
          </View>
        </ScrollView>
      </View>
      <BottomNav />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  card: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...colors.shadow.lg,
  },
  cardTitle: {
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  cardText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  settingText: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingTitle: {
    fontSize: typography.base,
    color: colors.text,
  },
  settingSubtitle: {
    fontSize: typography.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
});

