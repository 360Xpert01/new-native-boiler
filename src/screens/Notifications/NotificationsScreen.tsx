import React from 'react';

import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import EmptyState from '@components/EmptyState/EmptyState';
import Header from '@components/Header/Header';
import type { NotificationPayload } from '@services/notifications/notificationService';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
  selectNotifications,
  selectUnreadCount,
  markAllRead,
  markAsRead,
} from '@store/slices/notificationSlice';
import { useTheme } from '@theme/ThemeContext';

const NotificationsScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const notifications = useAppSelector(selectNotifications);
  const unreadCount = useAppSelector(selectUnreadCount);

  const handleMarkAllRead = () => {
    dispatch(markAllRead());
  };

  const handleNotificationPress = (id: string) => {
    dispatch(markAsRead(id));
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) {
      return t('common.justNow');
    }
    if (diffMins < 60) {
      return `${diffMins}${t('common.m_ago')}`;
    }
    if (diffHours < 24) {
      return `${diffHours}${t('common.h_ago')}`;
    }
    return `${diffDays}${t('common.d_ago')}`;
  };

  const renderItem = ({ item }: { item: NotificationPayload }) => (
    <TouchableOpacity
      onPress={() => handleNotificationPress(item.id)}
      activeOpacity={0.7}
      className={`p-md border-b border-gray-100 dark:border-gray-800 ${
        item.read ? 'bg-transparent' : 'bg-primary/10'
      }`}
    >
      <View className="flex-row items-start">
        {!item.read && (
          <View className="w-2 h-2 rounded-full mt-1.5 bg-primary me-sm" />
        )}
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text
              className={`flex-1 text-md text-start me-sm text-black dark:text-white ${
                item.read ? 'font-medium' : 'font-bold'
              }`}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              {formatTime(item.timestamp)}
            </Text>
          </View>
          <Text
            className="text-sm mt-xs text-gray-600 dark:text-gray-400 text-start"
            numberOfLines={2}
          >
            {item.body}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <Header
        title={t('common.notifications')}
        showBack={false}
        rightComponent={
          unreadCount > 0 ? (
            <TouchableOpacity onPress={handleMarkAllRead} className="p-xs">
              <Icon name="check-all" size={22} color={theme.colors.primary} />
            </TouchableOpacity>
          ) : undefined
        }
      />
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <EmptyState
            title={t('common.noNotifications')}
            message={t('common.noNotificationsMsg')}
            icon="bell-off-outline"
          />
        }
        contentContainerClassName="flex-grow"
      />
    </View>
  );
};

export default NotificationsScreen;
