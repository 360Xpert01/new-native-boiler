import React from 'react';

import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
} from 'react-native';

import { useTheme } from '@theme/ThemeContext';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  loading?: boolean;
  className?: string;
  textClassName?: string;
}


const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  loading = false,
  disabled,
  className,
  textClassName,
  ...props
}) => {
  const { isDark } = useTheme();
  const isButtonDisabled = disabled || loading;

  const variantClasses = {
    primary: 'bg-primary',
    secondary: 'bg-gray-100 dark:bg-gray-800',
    outline: 'bg-transparent border border-primary',
    ghost: 'bg-transparent',
    danger: 'bg-error',
  };

  const textVariantClasses = {
    primary: 'text-white',
    secondary: 'text-black dark:text-white',
    outline: 'text-primary',
    ghost: 'text-primary',
    danger: 'text-white',
  };

  const indicatorColor = variant === 'secondary' ? (isDark ? '#FFFFFF' : '#000000') : '#FFFFFF';

  return (
    <TouchableOpacity
      className={`h-[50px] rounded-lg justify-center items-center px-md ${
        variantClasses[variant]
      } ${isButtonDisabled ? 'opacity-50' : ''} ${className}`}
      disabled={isButtonDisabled}
      activeOpacity={0.7}
      accessibilityRole="button"
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={indicatorColor} />
      ) : (
        <Text 
          className={`text-md font-semibold ${
            textVariantClasses[variant]
          } ${textClassName}`}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};


export default Button;

