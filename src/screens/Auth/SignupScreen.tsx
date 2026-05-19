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
import { useSignupMutation } from '@services/api/authApi';
import { useAppDispatch } from '@store/hooks';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

const SignupScreen = ({
  navigation,
}: {
  navigation: { navigate: (screen: string, params?: object) => void };
}) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const dispatch = useAppDispatch();
  const [signup, { isLoading }] = useSignupMutation();

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
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSignup = async (data: { email: string; name: string }) => {
    showToast(t('auth.otpSentEmail'), 'success');
    navigation.navigate('OTP', { email: data.email, type: 'signup' });
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
          contentContainerClassName="flex-grow px-lg pb-xl justify-center"
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
        >
          <View className="w-full max-w-[400px] self-center">
            <View className="mb-xxl items-start">
              <Text className="text-xxxl font-bold text-black dark:text-white text-start">
                {t('auth.createAccount')}
              </Text>
              <Text className="text-md mt-xs text-gray-600 dark:text-gray-400 text-start">
                {t('auth.signUpGetStarted')}
              </Text>
            </View>

            <View className="w-full">
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label={t('auth.fullName')}
                    placeholder={t('auth.fullName')}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.name?.message}
                  />
                )}
              />

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

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label={t('auth.confirmPassword')}
                    placeholder={t('auth.confirmPassword')}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.confirmPassword?.message}
                    secureTextEntry
                  />
                )}
              />

              <Button
                title={t('auth.signup')}
                onPress={handleSubmit(onSignup)}
                loading={isLoading}
                className="mt-lg"
              />

              <View className="flex-row justify-center mt-xl flex-wrap">
                <Text className="text-gray-600 dark:text-gray-400">
                  {t('auth.hasAccount')}{' '}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text className="text-primary font-bold">{t('auth.login')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupScreen;
