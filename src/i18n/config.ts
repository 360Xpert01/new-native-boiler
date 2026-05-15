export type AppLanguage = 'en' | 'ur';

export const SUPPORTED_LANGUAGES: readonly AppLanguage[] = ['en', 'ur'] as const;

export const RTL_LANGUAGES: readonly AppLanguage[] = ['ur'] as const;

export const DEFAULT_LANGUAGE: AppLanguage = 'en';

export const LANGUAGE_STORAGE_KEY = '@app_language';

export function normalizeLanguage(code?: string | null): AppLanguage {
  if (code?.toLowerCase().startsWith('ur')) {
    return 'ur';
  }
  return 'en';
}

export function isRTLLanguage(language: string): boolean {
  return RTL_LANGUAGES.includes(normalizeLanguage(language));
}
