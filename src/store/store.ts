/**
 * Redux Store Configuration
 * =========================
 * This is the central Redux store for the app. It uses:
 *   • Redux Toolkit   — simplifies reducer/action creation
 *   • Redux Persist   — saves selected slices to AsyncStorage so state
 *                        survives app restarts (e.g. auth token, theme)
 *   • RTK Query       — handles API caching & fetching (see apiEndpoints.ts)
 *
 * HOW IT WORKS:
 *   1. rootReducer combines all slices (auth, theme, app, socket, notification, api)
 *   2. persistReducer wraps rootReducer so whitelisted slices are saved to disk
 *   3. configureStore creates the store with the persisted reducer + RTK Query middleware
 *   4. persistStore triggers rehydration on app startup
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import { baseApi } from '@services/api/baseApi';

import rootReducer from './rootReducer';

// ── Persist Config ─────────────────────────────────────────────
const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  whitelist: ['auth', 'theme', 'app', 'notification'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// ── Store ──────────────────────────────────────────────────────
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

// ── Persistor ──────────────────────────────────────────────────
// Pass this to <PersistGate> in App.tsx so the UI waits for rehydration.
export const persistor = persistStore(store);

// ── Type Exports ───────────────────────────────────────────────
// Use these types throughout the app for type-safe dispatch & selectors.
//   • useAppDispatch()                → typed dispatch
//   • useAppSelector(state => ...)    → typed selector
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
