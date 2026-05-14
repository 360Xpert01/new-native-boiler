/**
 * themeSlice — Manages the user's theme preference.
 *
 * Supports 'light', 'dark', or 'system' (follows device setting).
 * This slice is persisted to AsyncStorage (see store.ts whitelist).
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '@store/store';

// ── Types ──────────────────────────────────────────────────────
type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
}

// ── Initial State ──────────────────────────────────────────────
const initialState: ThemeState = {
  mode: 'system',
};

// ── Slice ──────────────────────────────────────────────────────
const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    /** Switch between 'light', 'dark', or 'system' theme */
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
    },
  },
});

// ── Actions ────────────────────────────────────────────────────
export const { setThemeMode } = themeSlice.actions;

// ── Selectors ──────────────────────────────────────────────────
// Use in components:  const mode = useAppSelector(selectThemeMode);
export const selectThemeMode = (state: RootState) => state.theme.mode;

export default themeSlice.reducer;
