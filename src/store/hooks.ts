/**
 * Typed Redux Hooks
 * =================
 * These are pre-typed versions of React-Redux's useDispatch and useSelector.
 * Using these instead of the plain hooks gives you full TypeScript
 * autocompletion for the entire store state and dispatch actions.
 *
 * Usage:
 *   import { useAppDispatch, useAppSelector } from '@store/hooks';
 *
 *   const dispatch = useAppDispatch();
 *   dispatch(setCredentials({ user, token }));   // ← fully typed
 *
 *   const user = useAppSelector(state => state.auth.user);  // ← fully typed
 */

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import type { RootState, AppDispatch } from './store';

/** Typed dispatch — knows about all action types including thunks */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/** Typed selector — autocompletes the full RootState tree */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
