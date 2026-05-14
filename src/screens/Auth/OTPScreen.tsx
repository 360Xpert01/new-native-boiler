import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';

import Button from '@components/Button/Button';
import { useToast } from '@components/Toast/ToastContext';
import { fonts } from '@constants/fonts';
import { spacing } from '@constants/spacing';
import { AuthStackParamList } from '@navigation/types';
import { useAppDispatch } from '@store/hooks';
import { setCredentials, setLoading } from '@store/slices/authSlice';
import { useTheme } from '@theme/ThemeContext';

type Props = StackScreenProps<AuthStackParamList, 'OTP'>;

const OTPScreen = ({ route, navigation }: Props) => {
  const { email, type } = route.params;
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const dispatch = useAppDispatch();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const inputs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Auto-submit when OTP is complete
  useEffect(() => {
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      onVerify();
    }
  }, [otp]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value !== '' && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const onVerify = async () => {
    const otpValue = otp.join('');
    if (otpValue.length < 6) {
      showToast('Please enter the full 6-digit code', 'error');
      return;
    }

    dispatch(setLoading(true));
    // Mock verification
    setTimeout(() => {
      dispatch(setLoading(false));
      if (otpValue === '123456') {
        if (type === 'signup') {
          dispatch(
            setCredentials({
              user: { id: '1', email, name: 'New User' },
              token: 'fake-jwt-token',
            })
          );
          showToast('Account verified successfully!', 'success');
        } else {
          showToast('OTP verified! You can now reset your password.', 'success');
          navigation.navigate('ResetPassword', { email });
        }
      } else {
        showToast('Invalid OTP. Try 123456', 'error');
      }
    }, 1500);
  };

  const onResend = () => {
    if (timer === 0) {
      setTimer(30);
      showToast('New OTP sent to your email', 'success');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Verify OTP</Text>
          <Text style={[styles.subtitle, { color: theme.colors.secondaryText }]}>
            Enter the 6-digit code sent to {email}
          </Text>
        </View>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputs.current[index] = ref;
              }}
              style={[
                styles.otpInput,
                {
                  color: theme.colors.text,
                  borderColor: digit ? theme.colors.primary : theme.colors.border,
                  backgroundColor: theme.colors.surface,
                },
              ]}
              maxLength={1}
              keyboardType="number-pad"
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
            />
          ))}
        </View>

        <View style={styles.timerContainer}>
          {timer > 0 ? (
            <Text style={{ color: theme.colors.secondaryText }}>
              Resend code in <Text style={{ color: theme.colors.primary }}>{timer}s</Text>
            </Text>
          ) : (
            <TouchableOpacity onPress={onResend}>
              <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>Resend Code</Text>
            </TouchableOpacity>
          )}
        </View>

        <Button title="Verify" onPress={onVerify} style={styles.verifyButton} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    marginBottom: spacing.xxl,
    alignItems: 'center',
  },
  title: {
    fontSize: fonts.size.xxxl,
    fontWeight: fonts.weight.bold,
  },
  subtitle: {
    fontSize: fonts.size.md,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderRadius: 12,
    fontSize: fonts.size.xl,
    fontWeight: fonts.weight.bold,
    textAlign: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  verifyButton: {
    marginTop: spacing.md,
  },
});

export default OTPScreen;
