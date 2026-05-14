import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import ForgotPasswordScreen from '@screens/Auth/ForgotPasswordScreen';
import LoginScreen from '@screens/Auth/LoginScreen';
import OTPScreen from '@screens/Auth/OTPScreen';
import ResetPasswordScreen from '@screens/Auth/ResetPasswordScreen';
import SignupScreen from '@screens/Auth/SignupScreen';

import { AuthStackParamList } from './types';

const Stack = createStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="OTP" component={OTPScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
