/**
 * useSocket — Custom hook for managing the socket connection lifecycle.
 *
 * Drop this into any top-level component (e.g. App) to auto-connect
 * when the user is authenticated and auto-disconnect on logout.
 *
 * Usage:
 *   const { isConnected, emit, on, off } = useSocket();
 */

import { useCallback, useEffect } from 'react';

import { socketService } from '@services/socket/socketService';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
  setConnected,
  setDisconnected,
  setSocketError,
  selectSocketConnected,
} from '@store/slices/socketSlice';

export const useSocket = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const isConnected = useAppSelector(selectSocketConnected);

  // ── Connect on mount / when token changes ─────────────────
  useEffect(() => {
    // Connect with auth token (or without if null)
    socketService.connect(token);

    // Sync socket events → Redux state
    socketService.on('connect', () => {
      dispatch(setConnected());
    });

    socketService.on('disconnect', () => {
      dispatch(setDisconnected());
    });

    socketService.on('connect_error', (err: Error) => {
      dispatch(setSocketError(err.message));
    });

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
      dispatch(setDisconnected());
    };
  }, [token, dispatch]);

  // ── Stable helpers exposed to components ──────────────────
  const emit = useCallback(
    (event: string, data?: any) => socketService.emit(event, data),
    []
  );

  const on = useCallback(
    (event: string, callback: (...args: any[]) => void) =>
      socketService.on(event, callback),
    []
  );

  const off = useCallback(
    (event: string, callback?: (...args: any[]) => void) =>
      socketService.off(event, callback),
    []
  );

  return { isConnected, emit, on, off };
};
