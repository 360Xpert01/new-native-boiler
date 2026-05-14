import React from 'react';

import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, I18nManager } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Header from '@components/Header/Header';
import { fonts } from '@constants/fonts';
import { spacing } from '@constants/spacing';
import { useTheme } from '@theme/ThemeContext';


const SettingsScreen = () => {
  const { theme, themeMode, setThemeMode } = useTheme();
  const { t, i18n } = useTranslation();

  const currentLanguage = i18n.language;

  const themeOptions = [
    { label: t('common.light'), value: 'light', icon: 'white-balance-sunny' },
    { label: t('common.dark'), value: 'dark', icon: 'moon-waning-crescent' },
    { label: t('common.system'), value: 'system', icon: 'brightness-auto' },
  ];

  const languageOptions = [
    { label: t('common.english'), value: 'en', icon: 'alphabetical' },
    { label: t('common.urdu'), value: 'ur', icon: 'alphabetical-variant' },
  ];

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title={t('common.settings')} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>{t('common.appearance')}</Text>
          <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            {themeOptions.map((option, index) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  index !== themeOptions.length - 1 && { borderBottomColor: theme.colors.border, borderBottomWidth: 1 },
                ]}
                onPress={() => setThemeMode(option.value as any)}
              >
                <View style={styles.optionLeft}>
                  <Icon name={option.icon as any} size={24} color={theme.colors.text} />
                  <Text style={[styles.optionLabel, { color: theme.colors.text }]}>{option.label}</Text>
                </View>
                {themeMode === option.value && (
                  <Icon name="check" size={24} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>{t('common.language')}</Text>
          <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            {languageOptions.map((option, index) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  index !== languageOptions.length - 1 && { borderBottomColor: theme.colors.border, borderBottomWidth: 1 },
                ]}
                onPress={() => changeLanguage(option.value)}
              >
                <View style={styles.optionLeft}>
                  <Icon name={option.icon as any} size={24} color={theme.colors.text} />
                  <Text style={[styles.optionLabel, { color: theme.colors.text }]}>{option.label}</Text>
                </View>
                {currentLanguage === option.value && (
                  <Icon name="check" size={24} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>{t('common.about')}</Text>
          <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.colors.text }]}>{t('common.version')}</Text>
              <Text style={[styles.infoValue, { color: theme.colors.secondaryText }]}>1..0</Text>
            </View>
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
  content: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.bold,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionLabel: {
    marginLeft: spacing.md,
    fontSize: fonts.size.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  infoLabel: {
    fontSize: fonts.size.md,
  },
  infoValue: {
    fontSize: fonts.size.md,
  },
});

export default SettingsScreen;
