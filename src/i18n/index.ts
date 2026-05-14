import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import en from './translations/en.json';
import ur from './translations/ur.json';

const resources = {
  en: { translation: en },
  ur: { translation: ur },
};

// Detect user language
const locales = RNLocalize.getLocales();
const languageCode = locales[0]?.languageCode || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: languageCode,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    compatibilityJSON: 'v4', // Required for React Native
  });

export default i18n;
