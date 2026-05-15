import React, { useState, useEffect, useRef } from 'react';

import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  LayoutAnimation,
  Keyboard,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '@components/Button/Button';
import Header from '@components/Header/Header';
import { useToast } from '@components/Toast/ToastContext';
import { AuthStackParamList } from '@navigation/types';
import { useAppDispatch } from '@store/hooks';
import { setCredentials, setLoading } from '@store/slices/authSlice';
import { useTheme } from '@theme/ThemeContext';

type Props = StackScreenProps<AuthStackParamList, 'OTP'>;

const OTPScreen = ({ route, navigation }: Props) => {
  const { email, type } = route.params;
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const dispatch = useAppDispatch();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const inputs = useRef<Array<TextInput | null>>([]);

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

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      onVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: { nativeEvent: { key: string } }, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const onVerify = async () => {
    const otpValue = otp.join('');
    if (otpValue.length < 6) {
      showToast(t('auth.otpRequired'), 'error');
      return;
    }

    dispatch(setLoading(true));
    setTimeout(() => {
      dispatch(setLoading(false));
      if (otpValue === '123456') {
        if (type === 'signup') {
          dispatch(
            setCredentials({
              user: { id: '1', email, name: 'New User' },
              token: 'fake-jwt-token',
            }),
          );
          showToast(t('auth.accountVerified'), 'success');
        } else {
          showToast(t('auth.otpVerifiedReset'), 'success');
          navigation.navigate('ResetPassword', { email });
        }
      } else {
        showToast(t('auth.invalidOtp'), 'error');
      }
    }, 1500);
  };

  const onResend = () => {
    if (timer === 0) {
      setTimer(30);
      showToast(t('auth.newOtpSent'), 'success');
    }
  };

  const borderColor = isDark ? '#48484A' : '#E5E5EA';
  const surfaceColor = isDark ? '#2C2C2E' : '#FFFFFF';

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <Header title={t('auth.verifyOtp')} showBack />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center p-lg"
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
        >
          <View className="mb-xxl items-center">
            <Text className="text-xxxl font-bold text-black dark:text-white text-center">
              {t('auth.verifyOtp')}
            </Text>
            <Text className="text-md mt-xs text-gray-600 dark:text-gray-400 text-center">
              {t('auth.otpSubtitle', { email })}
            </Text>
          </View>

          <View className="flex-row justify-between mb-xl">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputs.current[index] = ref;
                }}
                className="w-[45px] h-[55px] border-2 rounded-xl text-xl font-bold text-center text-black dark:text-white"
                style={{
                  borderColor: digit ? '#007AFF' : borderColor,
                  backgroundColor: surfaceColor,
                }}
                maxLength={1}
                keyboardType="number-pad"
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
              />
            ))}
          </View>

          <View className="items-center mb-xxl">
            {timer > 0 ? (
              <Text className="text-gray-600 dark:text-gray-400">
                {t('auth.resendCodeIn')}{' '}
                <Text className="text-primary font-bold">{timer}s</Text>
              </Text>
            ) : (
              <TouchableOpacity onPress={onResend}>
                <Text className="text-primary font-bold">{t('auth.resendCode')}</Text>
              </TouchableOpacity>
            )}
          </View>

          <Button title={t('auth.verify')} onPress={onVerify} className="mt-md" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OTPScreen;
