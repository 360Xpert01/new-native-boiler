import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ActivityIndicator, LayoutAnimation, Platform, UIManager, View } from 'react-native';
import i18n from 'i18next';

import {
  AppLanguage,
  DEFAULT_LANGUAGE,
  isRTLLanguage,
  normalizeLanguage,
} from '@i18n/config';
import { bootstrapLanguage, setAppLanguage } from '@utils/language';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type LanguageContextValue = {
  language: AppLanguage;
  isRTL: boolean;
  direction: 'rtl' | 'ltr';
  isReady: boolean;
  setLanguage: (language: AppLanguage) => Promise<void>;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>(DEFAULT_LANGUAGE);
  const [isReady, setIsReady] = useState(false);

  const isRTL = isRTLLanguage(language);
  const direction = isRTL ? 'rtl' : 'ltr';

  useEffect(() => {
    let mounted = true;

    bootstrapLanguage().then((resolved) => {
      if (mounted) {
        setLanguageState(resolved);
        setIsReady(true);
      }
    });

    const onLanguageChanged = (lng: string) => {
      setLanguageState(normalizeLanguage(lng));
    };

    i18n.on('languageChanged', onLanguageChanged);

    return () => {
      mounted = false;
      i18n.off('languageChanged', onLanguageChanged);
    };
  }, []);

  const setLanguage = useCallback(async (next: AppLanguage) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    await setAppLanguage(next);
    setLanguageState(normalizeLanguage(next));
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      isRTL,
      direction,
      isReady,
      setLanguage,
    }),
    [language, isRTL, direction, isReady, setLanguage],
  );

  if (!isReady) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <LanguageContext.Provider value={value}>
      <View style={{ flex: 1, direction }}>{children}</View>
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
