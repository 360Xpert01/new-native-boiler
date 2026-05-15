import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '@theme/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, style, className }) => {
  const { isDark } = useTheme();

  return (
    <View
      className={`p-md rounded-xl border shadow-sm dark:shadow-none ${
        isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
      } ${className || ''}`}
      style={style}
    >
      {children}
    </View>
  );
};

export default Card;

