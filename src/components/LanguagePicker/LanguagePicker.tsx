import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useLanguage } from '@hooks/useLanguage';
import { AppLanguage } from '@i18n/config';
import { useTheme } from '@theme/ThemeContext';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type LanguagePickerProps = {
  variant?: 'compact' | 'list' | 'icon';
  className?: string;
};

const LANGUAGES: {
  value: AppLanguage;
  labelKey: 'common.english' | 'common.urdu';
  shortLabel: string;
}[] = [
  { value: 'en', labelKey: 'common.english', shortLabel: 'EN' },
  { value: 'ur', labelKey: 'common.urdu', shortLabel: 'UR' },
];

const LanguagePicker: React.FC<LanguagePickerProps> = ({
  variant = 'compact',
  className = '',
}) => {
  const { t } = useTranslation();
  const { language, setLanguage, isRTL } = useLanguage();
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);

  const iconColor = isDark ? '#FFFFFF' : '#000000';
  const activeColor = '#007AFF';

  const handleSelect = async (value: AppLanguage) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    await setLanguage(value);
    setOpen(false);
  };

  const toggleMenu = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((prev) => !prev);
  };

  if (variant === 'icon') {
    const menuTop = insets.top + 8;
    const menuEdge = isRTL ? { left: insets.left + 16 } : { right: insets.right + 16 };

    return (
      <View className={className}>
        <TouchableOpacity
          onPress={toggleMenu}
          className="w-10 h-10 rounded-full items-center justify-center bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          accessibilityRole="button"
          accessibilityLabel={t('common.language')}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="translate" size={20} color={activeColor} />
        </TouchableOpacity>

        <Modal
          visible={open}
          transparent
          animationType="fade"
          onRequestClose={() => setOpen(false)}
        >
          <View className="flex-1">
            <Pressable className="flex-1" onPress={() => setOpen(false)}>
              <View className="flex-1 bg-black/25" />
            </Pressable>

            <View
              className="absolute min-w-[152px] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden shadow-lg"
              style={{ top: menuTop, ...menuEdge }}
            >
            <View className="px-md py-sm border-b border-gray-100 dark:border-gray-700">
              <Text className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 text-start">
                {t('common.language')}
              </Text>
            </View>
            {LANGUAGES.map((option, index) => {
              const selected = language === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  className={`flex-row items-center justify-between px-md py-md ${
                    index !== LANGUAGES.length - 1
                      ? 'border-b border-gray-100 dark:border-gray-700'
                      : ''
                  } ${selected ? 'bg-primary/10' : ''}`}
                  onPress={() => handleSelect(option.value)}
                >
                  <View className="flex-row items-center">
                    <View
                      className={`w-8 h-8 rounded-full items-center justify-center ${
                        selected ? 'bg-primary' : 'bg-gray-100 dark:bg-gray-700'
                      }`}
                    >
                      <Text
                        className={`text-xs font-bold ${
                          selected ? 'text-white' : 'text-black dark:text-white'
                        }`}
                      >
                        {option.shortLabel}
                      </Text>
                    </View>
                    <Text
                      className={`text-md ms-sm ${
                        selected
                          ? 'text-primary font-semibold'
                          : 'text-black dark:text-white'
                      }`}
                    >
                      {t(option.labelKey)}
                    </Text>
                  </View>
                  {selected && <Icon name="check" size={20} color={activeColor} />}
                </TouchableOpacity>
              );
            })}
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  if (variant === 'compact') {
    return (
      <View
        className={`flex-row rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}
      >
        {LANGUAGES.map((option) => {
          const selected = language === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              className={`flex-1 flex-row items-center justify-center py-sm px-md ${
                selected ? 'bg-primary' : 'bg-white dark:bg-gray-800'
              }`}
              onPress={() => handleSelect(option.value)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
            >
              <Text
                className={`text-sm font-semibold ${
                  selected ? 'text-white' : 'text-black dark:text-white'
                }`}
              >
                {t(option.labelKey)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  return (
    <View
      className={`rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-800 ${className}`}
    >
      {LANGUAGES.map((option, index) => (
        <TouchableOpacity
          key={option.value}
          className={`flex-row items-center justify-between p-md ${
            index !== LANGUAGES.length - 1
              ? 'border-b border-gray-200 dark:border-gray-800'
              : ''
          }`}
          onPress={() => handleSelect(option.value)}
        >
          <View className="flex-row items-center">
            <Text className="text-md text-black dark:text-white">
              {t(option.labelKey)}
            </Text>
          </View>
          {language === option.value && (
            <Icon name="check" size={24} color={activeColor} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default LanguagePicker;
