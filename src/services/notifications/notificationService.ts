/**
 * NotificationService — Wraps @react-native-firebase/messaging (Modular API v22+).
 */

import {
  getMessaging,
  getToken,
  onMessage,
  getInitialNotification,
  onNotificationOpenedApp,
  onTokenRefresh,
  requestPermission as firebaseRequestPermission,
  AuthorizationStatus,
} from '@react-native-firebase/messaging';
import { Platform, PermissionsAndroid } from 'react-native';

// ── Types ──────────────────────────────────────────────────────
export interface NotificationPayload {
  id: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  timestamp: number;
  read: boolean;
}

type NotificationCallback = (notification: NotificationPayload) => void;
type UnsubscribeFn = () => void;

// ── Helper ──
const toPayload = (remoteMessage: any): NotificationPayload => ({
  id: remoteMessage.messageId ?? Date.now().toString(),
  title: remoteMessage.notification?.title ?? 'Notification',
  body: remoteMessage.notification?.body ?? '',
  data: remoteMessage.data as Record<string, string> | undefined,
  timestamp: Date.now(),
  read: false,
});

class NotificationService {
  /** Request notification permission */
  async requestPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        return result === PermissionsAndroid.RESULTS.GRANTED;
      }

      const messaging = getMessaging();
      const authStatus = await firebaseRequestPermission(messaging);
      return (
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL
      );
    } catch (error) {
      console.error('[NotificationService] Permission error:', error);
      return false;
    }
  }

  /** Get FCM token using Modular API */
  async getFCMToken(): Promise<string | null> {
    try {
      const messaging = getMessaging();
      const token = await getToken(messaging);
      console.log('[NotificationService] 🔑 FCM Token:', token);
      return token;
    } catch (error) {
      console.error('[NotificationService] Token error:', error);
      return null;
    }
  }

  /** Token refresh listener */
  onTokenRefresh(callback: (token: string) => void): UnsubscribeFn {
    return onTokenRefresh(getMessaging(), callback);
  }

  /** Foreground message listener */
  onForegroundMessage(callback: NotificationCallback): UnsubscribeFn {
    return onMessage(getMessaging(), (remoteMessage) => {
      console.log('[NotificationService] 📬 Foreground message:', remoteMessage);
      callback(toPayload(remoteMessage));
    });
  }

  /** App opened from QUIT state */
  async getInitialNotification(): Promise<NotificationPayload | null> {
    const remoteMessage = await getInitialNotification(getMessaging());
    return remoteMessage ? toPayload(remoteMessage) : null;
  }

  /** App opened from BACKGROUND */
  onNotificationOpenedApp(callback: NotificationCallback): UnsubscribeFn {
    return onNotificationOpenedApp(getMessaging(), (remoteMessage) => {
      console.log('[NotificationService] 👆 Opened from background:', remoteMessage);
      callback(toPayload(remoteMessage));
    });
  }
}

export const notificationService = new NotificationService();

/** Background handler */
export const backgroundMessageHandler = async (remoteMessage: any): Promise<void> => {
  console.log('[NotificationService] 🌙 Background message:', remoteMessage);
};
