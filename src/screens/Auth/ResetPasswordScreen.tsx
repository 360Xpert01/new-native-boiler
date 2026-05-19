import React from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { StackScreenProps } from '@react-navigation/stack';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as yup from 'yup';

import Button from '@components/Button/Button';
import Header from '@components/Header/Header';
import Input from '@components/Input/Input';
import { useToast } from '@components/Toast/ToastContext';
import { AuthStackParamList } from '@navigation/types';
import { useAppDispatch } from '@store/hooks';
import { setLoading } from '@store/slices/authSlice';

type Props = StackScreenProps<AuthStackParamList, 'ResetPassword'>;

const schema = yup.object().shape({
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

const ResetPasswordScreen = ({ route, navigation }: Props) => {
  const { email } = route.params;
  const { t } = useTranslation();
  const { showToast } = useToast();
  const dispatch = useAppDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async () => {
    dispatch(setLoading(true));
    setTimeout(() => {
      dispatch(setLoading(false));
      showToast(t('auth.passwordResetSuccess'), 'success');
      navigation.navigate('Login');
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <Header title={t('auth.resetPassword')} showBack />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center p-lg"
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
        >
          <View className="mb-xxl items-start">
            <Text className="text-xxxl font-bold text-black dark:text-white text-start">
              {t('auth.resetPassword')}
            </Text>
            <Text className="text-md mt-xs text-gray-600 dark:text-gray-400 text-start">
              {t('auth.resetPasswordSubtitle', { email })}
            </Text>
          </View>

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('auth.newPassword')}
                placeholder={t('auth.enterNewPassword')}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.password?.message}
                secureTextEntry
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('auth.confirmPassword')}
                placeholder={t('auth.confirmNewPassword')}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.confirmPassword?.message}
                secureTextEntry
              />
            )}
          />

          <Button
            title={t('auth.updatePassword')}
            onPress={handleSubmit(onSubmit)}
            className="mt-lg"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ResetPasswordScreen;
