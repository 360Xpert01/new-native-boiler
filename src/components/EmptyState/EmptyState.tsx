import React from 'react';

import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Button from '@components/Button/Button';
import { useTheme } from '@theme/ThemeContext';


interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
  onAction?: () => void;
  actionTitle?: string;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'information-outline',
  title,
  message,
  onAction,
  actionTitle,
  className,
}) => {
  const { isDark } = useTheme();

  return (
    <View className={`flex-1 justify-center items-center p-xl ${className}`}>
      <Icon name={icon} size={80} color={isDark ? '#48484A' : '#C7C7CC'} />
      <Text className="text-xl font-bold mt-md text-center text-black dark:text-white">{title}</Text>
      {message && (
        <Text className="text-md text-center mt-sm mb-lg text-gray-600 dark:text-gray-400">
          {message}
        </Text>
      )}
      {onAction && actionTitle && (
        <Button
          title={actionTitle}
          onPress={onAction}
          className="min-w-[150px]"
        />
      )}
    </View>
  );
};

export default EmptyState;
