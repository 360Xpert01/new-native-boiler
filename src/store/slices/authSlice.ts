/**
 * authSlice — Manages authentication state.
 *
 * Stores the logged-in user, JWT token, and loading flag.
 * This slice is persisted to AsyncStorage (see store.ts whitelist).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '@store/store';

// ── Types ──────────────────────────────────────────────────────
interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ── Initial State ──────────────────────────────────────────────
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// ── Slice ──────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** Save user + token after successful login/signup */
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      // Also save to AsyncStorage for legacy compatibility if needed
      AsyncStorage.setItem('userToken', action.payload.token);
    },

    /** Clear all auth state on logout */
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      AsyncStorage.removeItem('userToken');
    },

    /** Toggle loading state (useful for manual transitions) */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    /** Set error manually */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    /** Clear error */
    clearError: (state) => {
      state.error = null;
    },
  },
});

// ── Actions ────────────────────────────────────────────────────
export const { setCredentials, logout, setLoading, clearError } = authSlice.actions;

// ── Selectors ──────────────────────────────────────────────────
// Use these in components:  const user = useAppSelector(selectUser);
export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;

export default authSlice.reducer;
