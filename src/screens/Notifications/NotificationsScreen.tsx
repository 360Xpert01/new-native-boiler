import React from 'react';

import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import EmptyState from '@components/EmptyState/EmptyState';
import Header from '@components/Header/Header';
import { fonts } from '@constants/fonts';
import { spacing } from '@constants/spacing';
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
  const dispatch = useAppDispatch();

  // Real notifications from Redux (populated by Firebase push notifications)
  const notifications = useAppSelector(selectNotifications);
  const unreadCount = useAppSelector(selectUnreadCount);

  const handleMarkAllRead = () => {
    dispatch(markAllRead());
  };

  const handleNotificationPress = (id: string) => {
    dispatch(markAsRead(id));
    // TODO: Navigate to relevant screen based on notification data
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) {return 'Just now';}
    if (diffMins < 60) {return `${diffMins}m ago`;}
    if (diffHours < 24) {return `${diffHours}h ago`;}
    return `${diffDays}d ago`;
  };

  const renderItem = ({ item }: { item: NotificationPayload }) => (
    <TouchableOpacity
      onPress={() => handleNotificationPress(item.id)}
      activeOpacity={0.7}
      style={[
        styles.item,
        {
          borderBottomColor: theme.colors.border,
          backgroundColor: item.read
            ? 'transparent'
            : theme.colors.primary + '10', // subtle unread highlight
        },
      ]}
    >
      <View style={styles.itemRow}>
        {/* Unread dot indicator */}
        {!item.read && (
          <View
            style={[styles.unreadDot, { backgroundColor: theme.colors.primary }]}
          />
        )}
        <View style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <Text
              style={[
                styles.itemTitle,
                {
                  color: theme.colors.text,
                  fontWeight: item.read ? fonts.weight.medium : fonts.weight.bold,
                },
              ]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text style={[styles.itemTime, { color: theme.colors.secondaryText }]}>
              {formatTime(item.timestamp)}
            </Text>
          </View>
          <Text
            style={[styles.itemBody, { color: theme.colors.secondaryText }]}
            numberOfLines={2}
          >
            {item.body}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header
        title="Notifications"
        rightComponent={
          unreadCount > 0 ? (
            <TouchableOpacity onPress={handleMarkAllRead} style={styles.markAllBtn}>
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
            title="No Notifications"
            message="You don't have any notifications at the moment."
            icon="bell-off-outline"
          />
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
  },
  item: {
    padding: spacing.md,
    borderBottomWidth: 1,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: spacing.sm,
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: fonts.size.md,
    flex: 1,
    marginRight: spacing.sm,
  },
  itemTime: {
    fontSize: fonts.size.xs,
  },
  itemBody: {
    fontSize: fonts.size.sm,
    marginTop: spacing.xs,
  },
  markAllBtn: {
    padding: spacing.xs,
  },
});

export default NotificationsScreen;
