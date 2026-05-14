/**
 * appSlice — Manages app-wide state flags.
 *
 * Tracks whether it's the user's first launch, if the app is ready,
 * and the current network connectivity status.
 * This slice is persisted to AsyncStorage (see store.ts whitelist).
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '@store/store';

// ── Types ──────────────────────────────────────────────────────
interface AppState {
  /** True on the very first app launch — show onboarding */
  isFirstLaunch: boolean;
  /** True once splash/init logic completes */
  appReady: boolean;
  /** True when the device has internet connectivity */
  isOnline: boolean;
}

// ── Initial State ──────────────────────────────────────────────
const initialState: AppState = {
  isFirstLaunch: true,
  appReady: false,
  isOnline: true,
};

// ── Slice ──────────────────────────────────────────────────────
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    /** Mark first launch as complete (hides onboarding) */
    setFirstLaunch: (state, action: PayloadAction<boolean>) => {
      state.isFirstLaunch = action.payload;
    },

    /** Signal that splash/init is done and the app can render */
    setAppReady: (state, action: PayloadAction<boolean>) => {
      state.appReady = action.payload;
    },

    /** Update network connectivity status */
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
  },
});

// ── Actions ────────────────────────────────────────────────────
export const { setFirstLaunch, setAppReady, setOnlineStatus } =
  appSlice.actions;

// ── Selectors ──────────────────────────────────────────────────
// Use these in components:  const isOnline = useAppSelector(selectIsOnline);
export const selectIsFirstLaunch = (state: RootState) =>
  state.app.isFirstLaunch;
export const selectAppReady = (state: RootState) => state.app.appReady;
export const selectIsOnline = (state: RootState) => state.app.isOnline;

export default appSlice.reducer;
