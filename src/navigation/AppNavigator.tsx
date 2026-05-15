import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { useLanguage } from '@hooks/useLanguage';
import SplashScreen from '@screens/Splash/SplashScreen';
import { useAppSelector } from '@store/hooks';
import { useTheme } from '@theme/ThemeContext';

import AuthStack from './AuthStack';
import DrawerNavigator from './DrawerNavigator';
import { navigationRef } from './navigationRef';
import { RootStackParamList } from './types';


import { selectAppReady } from '@store/slices/appSlice';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const appReady = useAppSelector(selectAppReady);
  const { theme } = useTheme();
  const { direction } = useLanguage();

  return (
    <NavigationContainer ref={navigationRef} theme={theme} direction={direction}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!appReady ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : !isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : (
          <Stack.Screen name="Main" component={DrawerNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
