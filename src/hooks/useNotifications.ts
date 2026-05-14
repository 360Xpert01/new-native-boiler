/**
 * useNotifications — Custom hook for Firebase push notifications.
 *
 * Drop this into a top-level component (inside Redux Provider) to:
 *   • Request notification permission on mount
 *   • Get & store the FCM token
 *   • Listen for foreground notifications → dispatch to Redux
 *   • Handle notification taps from background/quit state
 *
 * Usage:
 *   const { fcmToken, notifications, unreadCount } = useNotifications();
 */

import { useEffect } from 'react';

import { notificationService } from '@services/notifications/notificationService';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
  setFCMToken,
  setPermission,
  addNotification,
  selectFCMToken,
  selectNotifications,
  selectUnreadCount,
} from '@store/slices/notificationSlice';

export const useNotifications = () => {
  const dispatch = useAppDispatch();
  const fcmToken = useAppSelector(selectFCMToken);
  const notifications = useAppSelector(selectNotifications);
  const unreadCount = useAppSelector(selectUnreadCount);

  useEffect(() => {
    const setup = async () => {
      // 1️⃣ Request permission
      const granted = await notificationService.requestPermission();
      dispatch(setPermission(granted));

      if (!granted) {
        console.warn('[useNotifications] Permission not granted');
        return;
      }

      // 2️⃣ Get FCM token
      const token = await notificationService.getFCMToken();
      if (token) {
        dispatch(setFCMToken(token));
        // TODO: Send token to your backend server here
        // e.g. api.registerDeviceToken(token);
      }

      // 3️⃣ Check if app was opened from a killed-state notification
      const initialNotification =
        await notificationService.getInitialNotification();
      if (initialNotification) {
        dispatch(addNotification(initialNotification));
        // TODO: Navigate to relevant screen based on initialNotification.data
      }
    };

    setup();

    // 4️⃣ Listen for foreground messages
    const unsubForeground = notificationService.onForegroundMessage(
      (notification) => {
        dispatch(addNotification(notification));
      }
    );

    // 5️⃣ Listen for notification taps while app is in background
    const unsubOpened = notificationService.onNotificationOpenedApp(
      (notification) => {
        dispatch(addNotification(notification));
        // TODO: Navigate to relevant screen based on notification.data
      }
    );

    // 6️⃣ Listen for token refresh
    const unsubTokenRefresh = notificationService.onTokenRefresh((token) => {
      dispatch(setFCMToken(token));
      // TODO: Update token on your backend server
    });

    // Cleanup all listeners
    return () => {
      unsubForeground();
      unsubOpened();
      unsubTokenRefresh();
    };
  }, [dispatch]);

  return { fcmToken, notifications, unreadCount };
};
