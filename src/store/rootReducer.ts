/**
 * Root Reducer
 * ============
 * Combines all Redux slices into a single root reducer.
 * When you create a new slice, import it here and add it to combineReducers.
 *
 * Slice overview:
 *   • auth          — user credentials, token, login state
 *   • theme         — light/dark/system theme preference
 *   • app           — app-wide flags (first launch, online status, etc.)
 *   • socket        — real-time socket connection status
 *   • notification  — FCM token, push notifications list, unread count
 *   • chat          — real-time messages and chat history
 *   • api           — RTK Query cache (auto-managed, do not modify manually)
 */

import { combineReducers } from '@reduxjs/toolkit';

import { baseApi } from '@services/api/baseApi';

import appReducer from './slices/appSlice';
import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import notificationReducer from './slices/notificationSlice';
import socketReducer from './slices/socketSlice';
import themeReducer from './slices/themeSlice';

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authReducer,
  theme: themeReducer,
  app: appReducer,
  chat: chatReducer,
  socket: socketReducer,
  notification: notificationReducer,
});

export default rootReducer;
