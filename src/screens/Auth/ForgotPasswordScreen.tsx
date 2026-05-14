import React, { useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import * as yup from 'yup';

import Button from '@components/Button/Button';
import Header from '@components/Header/Header';
import Input from '@components/Input/Input';
import { fonts } from '@constants/fonts';
import { spacing } from '@constants/spacing';
import { useTheme } from '@theme/ThemeContext';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
});

const ForgotPasswordScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: any) => {
    console.log('Reset password for:', data.email);
    navigation.navigate('OTP', { email: data.email, type: 'forgotPassword' });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Forgot Password" showBack />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {!isSubmitted ? (
            <>
              <Text style={[styles.description, { color: theme.colors.secondaryText }]}>
                Enter your email address and we'll send you instructions to reset your password.
              </Text>

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Email"
                    placeholder="Enter your email"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.email?.message}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                )}
              />

              <Button
                title="Send Instructions"
                onPress={handleSubmit(onSubmit)}
                style={styles.button}
              />
            </>
          ) : (
            <View style={styles.successContainer}>
              <Text style={[styles.successTitle, { color: theme.colors.text }]}>Check your email</Text>
              <Text style={[styles.successDescription, { color: theme.colors.secondaryText }]}>
                We've sent password reset instructions to your email address.
              </Text>
              <Button
                title="Back to Login"
                onPress={() => navigation.navigate('Login')}
                style={styles.button}
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  description: {
    fontSize: fonts.size.md,
    marginBottom: spacing.xl,
  },
  button: {
    marginTop: spacing.lg,
  },
  successContainer: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
  },
  successTitle: {
    fontSize: fonts.size.xl,
    fontWeight: fonts.weight.bold,
    marginBottom: spacing.md,
  },
  successDescription: {
    fontSize: fonts.size.md,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
});

export default ForgotPasswordScreen;
