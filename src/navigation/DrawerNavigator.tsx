import React from 'react';

import {
  createDrawerNavigator,
  DrawerToggleButton,
} from '@react-navigation/drawer';
import { useTranslation } from 'react-i18next';

import { useLanguage } from '@hooks/useLanguage';
import SettingsScreen from '@screens/Settings/SettingsScreen';
import { useTheme } from '@theme/ThemeContext';

import MainTabNavigator from './MainTabNavigator';
import { DrawerParamList } from './types';

const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerNavigator = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        drawerPosition: isRTL ? 'right' : 'left',
        // Leading edge: left in LTR, right in RTL (matches drawer side).
        headerLeft: (props) => (
          <DrawerToggleButton
            tintColor={props.tintColor}
            pressColor={props.pressColor}
            pressOpacity={props.pressOpacity}
          />
        ),
        headerRight: () => null,
        headerTitleAlign: 'center',
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
        options={{ title: t('common.dashboard') }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: t('common.settings') }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
