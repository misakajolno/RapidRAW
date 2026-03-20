export const SUPPORTED_LOCALES = ['en', 'zh-CN'] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];
export type TranslateParamValue = string | number | boolean | null | undefined;
export type TranslateParams = Record<string, TranslateParamValue>;
export type TranslateFn = (key: string, params?: TranslateParams) => string;

export interface TranslationTree {
  [key: string]: string | TranslationTree;
}

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  'zh-CN': '简体中文',
};