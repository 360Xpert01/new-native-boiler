import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import EditProfileScreen from '@screens/Profile/EditProfileScreen';
import ProfileScreen from '@screens/Profile/ProfileScreen';

import { ProfileStackParamList } from './types';

const Stack = createStackNavigator<ProfileStackParamList>();

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
