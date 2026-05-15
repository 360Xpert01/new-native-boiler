import React from 'react';

import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useLanguage } from '@hooks/useLanguage';
import { useTheme } from '@theme/ThemeContext';
import { backChevronIcon } from '@utils/rtl';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  style?: ViewStyle;
  titleStyle?: TextStyle;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBack,
  onBackPress,
  rightComponent,
  className,
  titleClassName,
  style,
  titleStyle,
}) => {
  const { isDark } = useTheme();
  const { isRTL } = useLanguage();
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const canGoBack = showBack !== undefined ? showBack : navigation.canGoBack();

  return (
    <View
      className={`h-[56px] flex-row items-center justify-between px-sm border-b-[0.5px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 ${className}`}
      style={style}
    >
      <View className="flex-1 justify-center items-start">
        {canGoBack && (
          <TouchableOpacity
            onPress={handleBackPress}
            className="p-xs"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon
              name={backChevronIcon(isRTL)}
              size={30}
              color={isDark ? '#FFFFFF' : '#000000'}
            />
          </TouchableOpacity>
        )}
      </View>

      <View className="flex-[3] justify-center items-center">
        {title && (
          <Text
            numberOfLines={1}
            className={`text-lg font-bold text-black dark:text-white text-center ${titleClassName}`}
            style={titleStyle}
          >
            {title}
          </Text>
        )}
      </View>

      <View className="flex-1 justify-center items-end">{rightComponent}</View>
    </View>
  );
};

export default Header;
