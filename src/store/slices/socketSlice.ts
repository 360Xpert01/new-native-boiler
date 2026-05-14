/**
 * socketSlice — Tracks the real-time socket connection status.
 *
 * This slice does NOT hold socket messages — those should be handled
 * by the specific feature slices (e.g. chatSlice, notificationSlice).
 * It only tracks whether the socket is connected and any connection errors.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '@store/store';

// ── Types ──────────────────────────────────────────────────────
interface SocketState {
  /** Whether the socket is currently connected */
  isConnected: boolean;
  /** Last connection error message, if any */
  error: string | null;
}

// ── Initial State ──────────────────────────────────────────────
const initialState: SocketState = {
  isConnected: false,
  error: null,
};

// ── Slice ──────────────────────────────────────────────────────
const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    /** Call when socket connects successfully */
    setConnected: (state) => {
      state.isConnected = true;
      state.error = null;
    },

    /** Call when socket disconnects */
    setDisconnected: (state) => {
      state.isConnected = false;
    },

    /** Call when a socket connection error occurs */
    setSocketError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isConnected = false;
    },
  },
});

// ── Actions ────────────────────────────────────────────────────
export const { setConnected, setDisconnected, setSocketError } =
  socketSlice.actions;

// ── Selectors ──────────────────────────────────────────────────
// Use these in components:  const isConnected = useAppSelector(selectSocketConnected);
export const selectSocketConnected = (state: RootState) =>
  state.socket.isConnected;
export const selectSocketError = (state: RootState) => state.socket.error;

export default socketSlice.reducer;
