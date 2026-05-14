/**
 * notificationSlice — Manages push notification state.
 *
 * Stores the FCM token, received notifications list, unread count,
 * and whether the user has granted notification permission.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { NotificationPayload } from '@services/notifications/notificationService';
import type { RootState } from '@store/store';

// ── Types ──────────────────────────────────────────────────────
interface NotificationState {
  /** Firebase Cloud Messaging device token */
  fcmToken: string | null;
  /** Whether the user granted notification permission */
  permissionGranted: boolean;
  /** List of received notifications (newest first) */
  notifications: NotificationPayload[];
  /** Number of unread notifications */
  unreadCount: number;
}

// ── Initial State ──────────────────────────────────────────────
const initialState: NotificationState = {
  fcmToken: null,
  permissionGranted: false,
  notifications: [],
  unreadCount: 0,
};

// ── Slice ──────────────────────────────────────────────────────
const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    /** Store the FCM device token */
    setFCMToken: (state, action: PayloadAction<string>) => {
      state.fcmToken = action.payload;
    },

    /** Store whether permission was granted */
    setPermission: (state, action: PayloadAction<boolean>) => {
      state.permissionGranted = action.payload;
    },

    /** Add a new notification to the top of the list */
    addNotification: (state, action: PayloadAction<NotificationPayload>) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },

    /** Mark all notifications as read */
    markAllRead: (state) => {
      state.notifications.forEach((n) => {
        n.read = true;
      });
      state.unreadCount = 0;
    },

    /** Mark a single notification as read by ID */
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },

    /** Clear all notifications */
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

// ── Actions ────────────────────────────────────────────────────
export const {
  setFCMToken,
  setPermission,
  addNotification,
  markAllRead,
  markAsRead,
  clearNotifications,
} = notificationSlice.actions;

// ── Selectors ──────────────────────────────────────────────────
// Use these in components:  const token = useAppSelector(selectFCMToken);
export const selectFCMToken = (state: RootState) =>
  state.notification.fcmToken;
export const selectNotifications = (state: RootState) =>
  state.notification.notifications;
export const selectUnreadCount = (state: RootState) =>
  state.notification.unreadCount;
export const selectPermissionGranted = (state: RootState) =>
  state.notification.permissionGranted;

export default notificationSlice.reducer;
