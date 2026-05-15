import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { I18nManager } from 'react-native';
import * as RNLocalize from 'react-native-localize';

import {
  AppLanguage,
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  isRTLLanguage,
  normalizeLanguage,
} from '@i18n/config';

// Allow RTL layouts; direction is driven at runtime via LanguageProvider (no app restart).
I18nManager.allowRTL(true);

async function resolveInitialLanguage(): Promise<AppLanguage> {
  const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored) {
    return normalizeLanguage(stored);
  }

  const deviceCode = RNLocalize.getLocales()[0]?.languageCode;
  const language = normalizeLanguage(deviceCode ?? DEFAULT_LANGUAGE);
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  return language;
}

/** Load persisted language and apply translations — no restart. */
export async function bootstrapLanguage(): Promise<AppLanguage> {
  const language = await resolveInitialLanguage();

  if (i18n.language !== language) {
    await i18n.changeLanguage(language);
  }

  return language;
}

/** Switch language instantly (text + layout direction update in React). */
export async function setAppLanguage(language: AppLanguage): Promise<void> {
  const normalized = normalizeLanguage(language);
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, normalized);
  await i18n.changeLanguage(normalized);
}

export function getCurrentLanguage(): AppLanguage {
  return normalizeLanguage(i18n.language);
}

export function getIsRTL(): boolean {
  return isRTLLanguage(getCurrentLanguage());
}

/** @deprecated Use setAppLanguage via LanguageProvider */
export const languageManager = {
  init: bootstrapLanguage,
  setLanguage: setAppLanguage,
  getCurrentLanguage,
  isRTL: getIsRTL,
};
