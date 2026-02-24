import { BottomNav } from '@/components/layout/BottomNav';
import { Header } from '@/components/layout/Header';
import { Screen } from '@/components/layout/Screen';
import { Card } from '@/components/ui/Card';
import { colors, spacing, typography } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

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
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Профіль</Text>
            <Text style={styles.cardText}>
              Тут зʼявиться детальна інформація про ваш профіль, резюме та компанію, коли ми підʼєднаємо бекенд.
            </Text>
          </Card>

          <Card style={styles.card}>
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
          </Card>
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
    padding: spacing.md + 2,
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: typography.base,
    fontWeight: typography.bold,
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
