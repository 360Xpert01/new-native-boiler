import React from 'react';

import { Text, StyleSheet, Animated, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { fonts } from '@constants/fonts';
import { spacing } from '@constants/spacing';
import { useTheme } from '@theme/ThemeContext';


export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  style?: ViewStyle;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'info', style }) => {
  const { theme } = useTheme();

  const getToastTheme = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: theme.colors.success,
          icon: 'check-circle',
        };
      case 'error':
        return {
          backgroundColor: theme.colors.error,
          icon: 'alert-circle',
        };
      case 'warning':
        return {
          backgroundColor: theme.colors.warning,
          icon: 'alert',
        };
      case 'info':
      default:
        return {
          backgroundColor: theme.colors.info,
          icon: 'information',
        };
    }
  };

  const toastTheme = getToastTheme();

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: toastTheme.backgroundColor },
        style,
      ]}
    >
      <Icon name={toastTheme.icon} size={20} color={theme.colors.primaryText} />
      <Text style={[styles.message, { color: theme.colors.primaryText }]}>
        {message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    marginHorizontal: spacing.md,
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
  message: {
    marginLeft: spacing.sm,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.medium,
    flex: 1,
  },
});

export default Toast;
