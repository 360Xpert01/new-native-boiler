import React from 'react';

import { useTranslation } from 'react-i18next';
import { View, Text, ScrollView } from 'react-native';

import Header from '@components/Header/Header';
import Button from '@components/Button/Button';
import { useLocation } from '@hooks/useLocation';
import { useAppSelector } from '@store/hooks';
import { selectSocketConnected } from '@store/slices/socketSlice';
import { useTheme } from '@theme/ThemeContext';

const HomeScreen = () => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);
  const isConnected = useAppSelector(selectSocketConnected);
  const { latitude, longitude, loading, error, getCurrentLocation } = useLocation();

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <Header title={t('common.dashboard')} showBack={false} />
      <ScrollView contentContainerClassName="p-md">
        <View
          className={`flex-row items-center p-sm rounded-lg mb-md ${
            isConnected ? 'bg-success/20' : 'bg-error/20'
          }`}
        >
          <View
            className={`w-2 h-2 rounded-full me-sm ${
              isConnected ? 'bg-success' : 'bg-error'
            }`}
          />
          <Text
            className={`text-sm font-bold text-start ${
              isConnected ? 'text-success' : 'text-error'
            }`}
          >
            {t('auth.socketStatus')}:{' '}
            {isConnected ? t('auth.socketConnected') : t('auth.socketDisconnected')}
          </Text>
        </View>

        <View className="mb-lg items-start">
          <Text className="text-xxl font-bold text-black dark:text-white text-start">
            {t('common.welcome')}, {user?.name || 'User'}!
          </Text>
          <Text className="text-md mt-xs text-gray-600 dark:text-gray-400 text-start">
            {t('common.today_status')}
          </Text>
        </View>

        <View className="flex-row justify-between mb-lg">
          <View className="flex-1 p-md rounded-xl border border-gray-200 dark:border-gray-800 mx-xs bg-white dark:bg-gray-800 items-start">
            <Text className="text-sm font-medium text-gray-600 dark:text-gray-400 text-start">
              {t('common.tasks')}
            </Text>
            <Text className="text-xl font-bold mt-xs text-black dark:text-white text-start">
              12
            </Text>
          </View>
          <View className="flex-1 p-md rounded-xl border border-gray-200 dark:border-gray-800 mx-xs bg-white dark:bg-gray-800 items-start">
            <Text className="text-sm font-medium text-gray-600 dark:text-gray-400 text-start">
              {t('common.messages')}
            </Text>
            <Text className="text-xl font-bold mt-xs text-black dark:text-white text-start">
              5
            </Text>
          </View>
        </View>

        <View className="p-lg rounded-xl border border-gray-200 dark:border-gray-800 mb-lg bg-white dark:bg-gray-800 items-start">
          <Text className="text-lg font-bold mb-md text-black dark:text-white text-start">
            {t('common.location')}
          </Text>
          {latitude && longitude ? (
            <View className="mb-sm items-start">
              <Text className="text-md mb-xs text-black dark:text-white text-start">
                {t('common.latitude')}: {latitude.toFixed(6)}
              </Text>
              <Text className="text-md mb-xs text-black dark:text-white text-start">
                {t('common.longitude')}: {longitude.toFixed(6)}
              </Text>
            </View>
          ) : error ? (
            <Text className="text-sm italic text-error text-start">{error}</Text>
          ) : (
            <Text className="text-md text-gray-600 dark:text-gray-400 text-start">
              {t('common.noLocationData')}
            </Text>
          )}
          <Button
            title={t('common.getLocation')}
            onPress={getCurrentLocation}
            loading={loading}
            className="mt-md w-full"
          />
        </View>

        <View className="p-lg rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 items-start">
          <Text className="text-lg font-bold mb-md text-black dark:text-white text-start">
            {t('common.recentActivity')}
          </Text>
          <View className="flex-row items-center mb-sm">
            <View className="w-2 h-2 rounded-full me-sm bg-primary" />
            <Text className="text-md text-black dark:text-white text-start">
              {t('common.loginSuccess')}
            </Text>
          </View>
          <View className="flex-row items-center mb-sm">
            <View className="w-2 h-2 rounded-full me-sm bg-success" />
            <Text className="text-md text-black dark:text-white text-start">
              {t('common.profileUpdated')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
