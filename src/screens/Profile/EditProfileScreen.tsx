import React from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import * as yup from 'yup';

import Button from '@components/Button/Button';
import Header from '@components/Header/Header';
import Input from '@components/Input/Input';
import { useToast } from '@components/Toast/ToastContext';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setCredentials } from '@store/slices/authSlice';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
});

const EditProfileScreen = ({
  navigation,
}: {
  navigation: { goBack: () => void };
}) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const onUpdate = (data: { name: string; email: string }) => {
    dispatch(
      setCredentials({
        user: { ...user!, ...data },
        token: token!,
      }),
    );
    showToast(t('common.profileUpdated'), 'success');
    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <Header title={t('common.editProfile')} showBack />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerClassName="p-lg">
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

          <Button
            title={t('auth.saveChanges')}
            onPress={handleSubmit(onUpdate)}
            className="mt-xl"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default EditProfileScreen;
