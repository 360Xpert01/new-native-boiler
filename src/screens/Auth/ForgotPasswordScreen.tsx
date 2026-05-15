import React from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import * as yup from 'yup';

import Button from '@components/Button/Button';
import Header from '@components/Header/Header';
import Input from '@components/Input/Input';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
});

const ForgotPasswordScreen = ({
  navigation,
}: {
  navigation: { navigate: (screen: string, params?: object) => void };
}) => {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = (data: { email: string }) => {
    navigation.navigate('OTP', { email: data.email, type: 'forgotPassword' });
  };

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <Header title={t('auth.forgotPasswordTitle')} showBack />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center p-lg"
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
        >
          <Text className="text-md mb-xl text-gray-600 dark:text-gray-400 text-start">
            {t('auth.forgotPasswordDescription')}
          </Text>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('auth.email')}
                placeholder={t('auth.email')}
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
            title={t('auth.sendInstructions')}
            onPress={handleSubmit(onSubmit)}
            className="mt-lg"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ForgotPasswordScreen;
