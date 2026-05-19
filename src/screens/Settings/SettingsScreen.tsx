import React from 'react';

import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Header from '@components/Header/Header';
import LanguagePicker from '@components/LanguagePicker/LanguagePicker';
import { useTheme } from '@theme/ThemeContext';

const SettingsScreen = () => {
  const { themeMode, setThemeMode, isDark } = useTheme();
  const { t } = useTranslation();
  const themeOptions = [
    { label: t('common.light'), value: 'light', icon: 'white-balance-sunny' },
    { label: t('common.dark'), value: 'dark', icon: 'moon-waning-crescent' },
    { label: t('common.system'), value: 'system', icon: 'brightness-auto' },
  ];

  const iconColor = isDark ? '#FFFFFF' : '#000000';
  const activeColor = '#007AFF';

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      {/* <Header title={t('common.settings')} /> */}
      <ScrollView contentContainerClassName="p-lg">
        <View className="mb-xl">
          <Text className="text-sm font-bold uppercase mb-sm px-xs text-primary text-start">
            {t('common.appearance')}
          </Text>
          <View className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-800">
            {themeOptions.map((option, index) => (
              <TouchableOpacity
                key={option.value}
                className={`flex-row items-center justify-between p-md ${
                  index !== themeOptions.length - 1
                    ? 'border-b border-gray-200 dark:border-gray-800'
                    : ''
                }`}
                onPress={() => setThemeMode(option.value as 'light' | 'dark' | 'system')}
              >
                <View className="flex-row items-center">
                  <Icon name={option.icon as 'white-balance-sunny'} size={24} color={iconColor} />
                  <Text className="text-md text-black dark:text-white ms-md">{option.label}</Text>
                </View>
                {themeMode === option.value && (
                  <Icon name="check" size={24} color={activeColor} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="mb-xl">
          <Text className="text-sm font-bold uppercase mb-sm px-xs text-primary text-start">
            {t('common.language')}
          </Text>
          <LanguagePicker variant="list" />
        </View>

        <View className="mb-xl">
          <Text className="text-sm font-bold uppercase mb-sm px-xs text-primary text-start">
            {t('common.about')}
          </Text>
          <View className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-800">
            <View className="flex-row items-center justify-between p-md">
              <Text className="text-md text-black dark:text-white">{t('common.version')}</Text>
              <Text className="text-md text-gray-600 dark:text-gray-400">1.0.0</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;
