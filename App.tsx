import React from 'react';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { useNotifications } from '@hooks/useNotifications';
import { useSocket } from '@hooks/useSocket';
import AppNavigator from '@navigation/AppNavigator';
import { ToastProvider } from '@components/Toast/ToastContext';
import { persistor, store } from '@store/store';
import { ThemeProvider } from '@theme/ThemeContext';

/**
 * AppContent — Inner component that lives inside the Redux Provider.
 * Hooks that depend on Redux (useNotifications, useSocket) must be
 * called here, NOT in the outer App component.
 */
const AppContent = () => {
  // Initialize Firebase push notifications
  useNotifications();
  // Initialize Socket.io connection
  useSocket();

  return (
    <ThemeProvider>
      <ToastProvider>
        <AppNavigator />
      </ToastProvider>
    </ThemeProvider>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppContent />
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
