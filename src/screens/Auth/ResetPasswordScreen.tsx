import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { StackScreenProps } from '@react-navigation/stack';

import Button from '@components/Button/Button';
import Input from '@components/Input/Input';
import { useToast } from '@components/Toast/ToastContext';
import { fonts } from '@constants/fonts';
import { spacing } from '@constants/spacing';
import { AuthStackParamList } from '@navigation/types';
import { useTheme } from '@theme/ThemeContext';
import { useAppDispatch } from '@store/hooks';
import { setLoading } from '@store/slices/authSlice';

type Props = StackScreenProps<AuthStackParamList, 'ResetPassword'>;

const schema = yup.object().shape({
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

const ResetPasswordScreen = ({ route, navigation }: Props) => {
  const { email } = route.params;
  const { theme } = useTheme();
  const { showToast } = useToast();
  const dispatch = useAppDispatch();

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: any) => {
    dispatch(setLoading(true));
    // Mock password reset
    setTimeout(() => {
      dispatch(setLoading(false));
      showToast('Password reset successful! Please login.', 'success');
      navigation.navigate('Login');
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Reset Password</Text>
          <Text style={[styles.subtitle, { color: theme.colors.secondaryText }]}>
            Enter a new password for {email}
          </Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="New Password"
                placeholder="Enter new password"
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
                label="Confirm Password"
                placeholder="Confirm new password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.confirmPassword?.message}
                secureTextEntry
              />
            )}
          />

          <Button
            title="Update Password"
            onPress={handleSubmit(onSubmit)}
            style={styles.button}
          />
        </View>
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
  },
  title: {
    fontSize: fonts.size.xxxl,
    fontWeight: fonts.weight.bold,
  },
  subtitle: {
    fontSize: fonts.size.md,
    marginTop: spacing.xs,
  },
  form: {
    width: '100%',
  },
  button: {
    marginTop: spacing.lg,
  },
});

export default ResetPasswordScreen;
