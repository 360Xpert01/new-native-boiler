import React from 'react';

import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Button from '@components/Button/Button';
import Header from '@components/Header/Header';
import { useLanguage } from '@hooks/useLanguage';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { logout } from '@store/slices/authSlice';
import { useTheme } from '@theme/ThemeContext';
import { forwardChevronIcon } from '@utils/rtl';

const ProfileScreen = ({ navigation }: { navigation: { navigate: (screen: string) => void } }) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    Alert.alert(t('common.logout'), t('common.logoutConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.logout'),
        onPress: () => dispatch(logout()),
        style: 'destructive',
      },
    ]);
  };

  const primaryColor = '#007AFF';
  const secondaryTextColor = isDark ? '#8E8E93' : '#AEAEB2';

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <Header title={t('common.profile')} showBack={false} />
      <View className="flex-1 p-lg">
        <View className="flex-row items-center pb-xl border-b border-gray-100 dark:border-gray-800 mb-xl">
          <View className="w-20 h-20 rounded-full justify-center items-center bg-primary">
            <Text className="text-[32px] font-bold text-white">
              {user?.name?.charAt(0) || 'U'}
            </Text>
          </View>
          <View className="ms-lg items-start flex-1">
            <Text className="text-xl font-bold text-black dark:text-white text-start">
              {user?.name || 'User'}
            </Text>
            <Text className="text-md mt-xs text-gray-600 dark:text-gray-400 text-start">
              {user?.email || 'email@example.com'}
            </Text>
          </View>
        </View>

        <View className="mb-xxl">
          <TouchableOpacity
            className="flex-row items-center py-md border-b border-gray-100 dark:border-gray-800"
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Icon name="account-edit" size={24} color={primaryColor} />
            <Text className="flex-1 text-md text-black dark:text-white ms-md text-start">
              {t('common.editProfile')}
            </Text>
            <Icon
              name={forwardChevronIcon(isRTL)}
              size={24}
              color={secondaryTextColor}
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center py-md border-b border-gray-100 dark:border-gray-800"
            onPress={() => navigation.navigate('Settings')}
          >
            <Icon name="cog" size={24} color={primaryColor} />
            <Text className="flex-1 text-md text-black dark:text-white ms-md text-start">
              {t('common.settings')}
            </Text>
            <Icon
              name={forwardChevronIcon(isRTL)}
              size={24}
              color={secondaryTextColor}
            />
          </TouchableOpacity>
        </View>

        <Button
          title={t('common.logout')}
          variant="danger"
          onPress={handleLogout}
          className="mt-auto"
        />
      </View>
    </View>
  );
};

export default ProfileScreen;
