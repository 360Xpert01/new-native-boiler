import React from 'react';

import {
  View,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme } from '@theme/ThemeContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  containerClassName?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  rightIcon,
  onRightIconPress,
  containerClassName,
  className,
  ...props
}) => {
  const { isDark } = useTheme();
  const iconColor = isDark ? '#8E8E93' : '#AEAEB2';

  return (
    <View className={`mb-md ${containerClassName || ''}`}>
      {label && (
        <Text className="text-sm font-medium mb-xs text-black dark:text-white text-start">
          {label}
        </Text>
      )}
      <View
        className={`flex-row items-center h-[50px] rounded-lg border px-md bg-white dark:bg-gray-900 ${
          error ? 'border-error' : 'border-gray-200 dark:border-gray-700'
        } ${className || ''}`}
      >
        <TextInput
          className="flex-1 h-full text-md text-black dark:text-white text-start"
          placeholderTextColor={iconColor}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} className="ms-sm">
            <Icon name={rightIcon} size={22} color={iconColor} />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text className="text-xs mt-xs text-error text-start">{error}</Text>
      )}
    </View>
  );
};

export default Input;
