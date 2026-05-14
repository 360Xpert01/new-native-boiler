import React from 'react';

import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import Header from '@components/Header/Header';
import { fonts } from '@constants/fonts';
import { spacing } from '@constants/spacing';
import { useAppSelector } from '@store/hooks';
import { selectSocketConnected } from '@store/slices/socketSlice';
import { useTheme } from '@theme/ThemeContext';

const HomeScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);
  const isConnected = useAppSelector(selectSocketConnected);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title={t('common.dashboard')} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Socket Status Indicator */}
        <View style={[styles.statusBanner, { backgroundColor: isConnected ? theme.colors.success + '20' : theme.colors.error + '20' }]}>
          <View style={[styles.statusDot, { backgroundColor: isConnected ? theme.colors.success : theme.colors.error }]} />
          <Text style={[styles.statusText, { color: isConnected ? theme.colors.success : theme.colors.error }]}>
            Socket: {isConnected ? 'Connected' : 'Disconnected'}
          </Text>
        </View>
        <View style={styles.welcomeSection}>
          <Text style={[styles.welcomeText, { color: theme.colors.text }]}>
            {t('common.welcome')}, {user?.name || 'User'}!
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.secondaryText }]}>
            {t('common.today_status')}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.cardTitle, { color: theme.colors.secondaryText }]}>{t('common.tasks')}</Text>
            <Text style={[styles.cardValue, { color: theme.colors.text }]}>12</Text>
          </View>
          <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.cardTitle, { color: theme.colors.secondaryText }]}>{t('common.messages')}</Text>
            <Text style={[styles.cardValue, { color: theme.colors.text }]}>5</Text>
          </View>
        </View>

        <View style={[styles.mainCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.mainCardTitle, { color: theme.colors.text }]}>{t('common.recentActivity')}</Text>
          <View style={styles.activityItem}>
            <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
            <Text style={[styles.activityText, { color: theme.colors.text }]}>Logged in successfully</Text>
          </View>
          <View style={styles.activityItem}>
            <View style={[styles.dot, { backgroundColor: theme.colors.success }]} />
            <Text style={[styles.activityText, { color: theme.colors.text }]}>Profile updated</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  statusText: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.bold,
  },
  welcomeSection: {
    marginBottom: spacing.lg,
  },
  welcomeText: {
    fontSize: fonts.size.xxl,
    fontWeight: fonts.weight.bold,
  },
  subtitle: {
    fontSize: fonts.size.md,
    marginTop: spacing.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  card: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: spacing.xs,
  },
  cardTitle: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.medium,
  },
  cardValue: {
    fontSize: fonts.size.xl,
    fontWeight: fonts.weight.bold,
    marginTop: spacing.xs,
  },
  mainCard: {
    padding: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
  },
  mainCardTitle: {
    fontSize: fonts.size.lg,
    fontWeight: fonts.weight.bold,
    marginBottom: spacing.md,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  activityText: {
    fontSize: fonts.size.md,
  },
});

export default HomeScreen;
