import React from 'react';

import { createDrawerNavigator } from '@react-navigation/drawer';

import SettingsScreen from '@screens/Settings/SettingsScreen';
import { useTheme } from '@theme/ThemeContext';

import MainTabNavigator from './MainTabNavigator';
import { DrawerParamList } from './types';


const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerNavigator = () => {
  const { theme } = useTheme();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.card,
        },
        headerTintColor: theme.colors.text,
        drawerStyle: {
          backgroundColor: theme.colors.card,
        },
        drawerActiveTintColor: theme.colors.primary,
        drawerInactiveTintColor: theme.colors.secondaryText,
      }}
    >
      <Drawer.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{ title: 'Dashboard' }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
