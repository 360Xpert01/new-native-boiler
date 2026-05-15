import React from 'react';

import {
  View,
  ActivityIndicator,
  Modal,
} from 'react-native';

import { useTheme } from '@theme/ThemeContext';

interface LoadingProps {
  isVisible?: boolean;
  isFullScreen?: boolean;
  size?: 'small' | 'large';
  color?: string;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  isVisible = true,
  isFullScreen = false,
  size = 'large',
  color,
  className,
}) => {
  const { theme } = useTheme();
  const indicatorColor = color || theme.colors.primary;

  if (!isVisible) return null;

  if (isFullScreen) {
    return (
      <Modal transparent visible={isVisible} animationType="fade">
        <View className="flex-1 bg-black/30 justify-center items-center">
          <View className="p-lg rounded-xl bg-white dark:bg-gray-800 shadow-lg elevation-5">
            <ActivityIndicator size={size} color={indicatorColor} />
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <View className={`p-md justify-center items-center ${className}`}>
      <ActivityIndicator size={size} color={indicatorColor} />
    </View>
  );
};

export default Loading;
