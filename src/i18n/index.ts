import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { DEFAULT_LANGUAGE } from '@i18n/config';

import en from './translations/en.json';
import ur from './translations/ur.json';

const resources = {
  en: { translation: en },
  ur: { translation: ur },
};

i18n.use(initReactI18next).init({
  resources,
  lng: DEFAULT_LANGUAGE,
  fallbackLng: 'en',
  supportedLngs: ['en', 'ur'],
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v4',
});

export default i18n;
