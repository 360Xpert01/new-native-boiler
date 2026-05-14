import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Text } from 'react-native';
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
          let iconName = 'home';

          if (route.name === 'HomeStack') {
            iconName = 'home';
          } else if (route.name === 'Chat') {
            iconName = 'chat-outline';
          } else if (route.name === 'Notifications') {
            iconName = 'bell';
          } else if (route.name === 'ProfileStack') {
            iconName = 'account';
          }

          return (
            <View>
              <Icon name={iconName} size={size} color={color} />
              {/* Badge for unread notifications */}
              {route.name === 'Notifications' && unreadCount > 0 && (
                <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
                  <Text style={styles.badgeText}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Text>
                </View>
              )}
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -8,
    top: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default MainTabNavigator;
