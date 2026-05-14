/**
 * @format
 * App entry point — this file runs BEFORE any React component mounts.
 * Register global handlers here (e.g. Firebase background messaging).
 */

import { AppRegistry } from 'react-native';

import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';

import { backgroundMessageHandler } from './src/services/notifications/notificationService';

import './src/i18n';
import App from './App';
import { name as appName } from './app.json';

// ── Firebase Background Message Handler ────────────────────────
// This MUST be registered at the top level (not inside a component).
// It runs when a push notification arrives while the app is in the
// background or killed state.
setBackgroundMessageHandler(getMessaging(), backgroundMessageHandler);

AppRegistry.registerComponent(appName, () => App);
