import React from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as yup from 'yup';

import Button from '@components/Button/Button';
import Input from '@components/Input/Input';
import LanguagePicker from '@components/LanguagePicker/LanguagePicker';
import { useToast } from '@components/Toast/ToastContext';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setCredentials, setLoading, selectAuthLoading } from '@store/slices/authSlice';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const LoginScreen = ({ navigation }: { navigation: { navigate: (screen: string) => void } }) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    });
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const isLoading = useAppSelector(selectAuthLoading);

  const onLogin = async (data: { email: string; password: string }) => {
    dispatch(setLoading(true));
    setTimeout(() => {
      dispatch(
        setCredentials({
          user: { id: '1', email: data.email, name: 'Test User' },
          token: 'fake-jwt-token',
        }),
      );
      dispatch(setLoading(false));
      showToast(t('common.loginSuccess'), 'success');
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <View className="flex-row justify-end px-lg pt-xs pb-sm">
        <LanguagePicker variant="icon" />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center px-lg pb-xl"
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
        >
          <View className="w-full max-w-[400px] self-center">
            <View className="mb-xxl items-start">
              <Text className="text-xxxl font-bold text-black dark:text-white text-start">
                {t('auth.welcomeBack')}
              </Text>
              <Text className="text-md mt-xs text-gray-600 dark:text-gray-400 text-start">
                {t('auth.signInContinue')}
              </Text>
            </View>

            <View className="w-full">
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

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label={t('auth.password')}
                    placeholder={t('auth.password')}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.password?.message}
                    secureTextEntry
                  />
                )}
              />

              <TouchableOpacity
                className="mb-lg self-end"
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                <Text className="text-primary font-medium text-start">
                  {t('auth.forgotPassword')}
                </Text>
              </TouchableOpacity>

              <Button
                title={t('auth.login')}
                onPress={handleSubmit(onLogin)}
                loading={isLoading}
                className="mt-md"
              />

              <View className="flex-row justify-center mt-xl flex-wrap">
                <Text className="text-gray-600 dark:text-gray-400">
                  {t('auth.noAccount')}{' '}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                  <Text className="text-primary font-bold">{t('auth.signup')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
