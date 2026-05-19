import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import ChatScreen from '@screens/Chat/ChatScreen';
import NotificationsScreen from '@screens/Notifications/NotificationsScreen';
import { useAppSelector } from '@store/hooks';
import { selectUnreadCount } from '@store/slices/notificationSlice';
import { useTheme } from '@theme/ThemeContext';

import HomeStack from './HomeStack';
import ProfileStack from './ProfileStack';
import { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  const { theme } = useTheme();
  const unreadCount = useAppSelector(selectUnreadCount);
  const { t } = useTranslation();

  const tabs = [
    {
      name: 'HomeStack' as const,
      component: HomeStack,
      options: { title: t('common.home') },
      icon: 'home',
    },
    {
      name: 'Chat' as const,
      component: ChatScreen,
      options: { title: t('common.chat') },
      icon: 'chat-outline',
    },
    {
      name: 'Notifications' as const,
      component: NotificationsScreen,
      options: { title: t('common.notifications') },
      icon: 'bell',
    },
    {
      name: 'ProfileStack' as const,
      component: ProfileStack,
      options: { title: t('common.profile') },
      icon: 'account',
    },
  ];

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.secondaryText,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
        },
        tabBarIcon: ({ color, size }) => {
          const tab = tabs.find((item) => item.name === route.name);
          const iconName = tab ? tab.icon : 'home';

          return (
            <View>
              <Icon name={iconName} size={size} color={color} />
              {route.name === 'Notifications' && unreadCount > 0 && (
                <View className="absolute -top-1 -end-2 min-w-[18px] h-[18px] rounded-full items-center justify-center px-1 bg-primary">
                  <Text className="text-white text-[10px] font-bold">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Text>
                </View>
              )}
            </View>
          );
        },
      })}
    >
      {tabs.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={tab.options}
        />
      ))}
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
