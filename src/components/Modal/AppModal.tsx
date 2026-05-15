import React from 'react';

import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme } from '@theme/ThemeContext';


interface AppModalProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  closeOnBackdropPress?: boolean;
}

const AppModal: React.FC<AppModalProps> = ({
  isVisible,
  onClose,
  title,
  children,
  className,
  closeOnBackdropPress = true,
}) => {
  const { isDark } = useTheme();

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={closeOnBackdropPress ? onClose : undefined}>
        <View className="flex-1 bg-black/50 justify-center items-center p-lg">
          <TouchableWithoutFeedback>
            <View
              className={`w-full rounded-2xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-800 shadow-lg elevation-5 overflow-hidden ${className}`}
            >
              <View className="flex-row justify-between items-center p-md border-b border-gray-100 dark:border-gray-700">
                {title ? (
                  <Text className="text-lg font-bold text-black dark:text-white">
                    {title}
                  </Text>
                ) : (
                  <View />
                )}
                <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Icon name="close" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
                </TouchableOpacity>
              </View>
              <View className="p-md">{children}</View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AppModal;
