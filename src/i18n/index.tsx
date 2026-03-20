import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import en from './locales/en';
import zhCN from './locales/zh-CN';
import type { Locale, TranslateFn, TranslateParams, TranslationTree } from './types';
import { LOCALE_LABELS, SUPPORTED_LOCALES } from './types';

const MESSAGES: Record<Locale, TranslationTree> = {
  en,
  'zh-CN': zhCN,
};

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale?: string | null) => void;
  t: TranslateFn;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function isSupportedLocale(value: string): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

function detectLocale(): Locale {
  if (typeof navigator === 'undefined') {
    return 'en';
  }

  const language = navigator.language || 'en';
  return language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
}

export function normalizeLocale(locale?: string | null): Locale {
  if (!locale) {
    return detectLocale();
  }

  if (isSupportedLocale(locale)) {
    return locale;
  }

  if (locale.toLowerCase().startsWith('zh')) {
    return 'zh-CN';
  }

  return 'en';
}

function getMessage(tree: TranslationTree, key: string): string | undefined {
  const direct = tree[key];
  if (typeof direct === 'string') {
    return direct;
  }

  const result = key.split('.').reduce<string | TranslationTree | undefined>((current, segment) => {
    if (!current || typeof current === 'string') {
      return current;
    }

    return current[segment];
  }, tree);

  return typeof result === 'string' ? result : undefined;
}

function interpolate(message: string, params?: TranslateParams): string {
  if (!params) {
    return message;
  }

  return message.replace(/\{(\w+)\}/g, (_, token: string) => {
    const value = params[token];
    return value === undefined || value === null ? '' : String(value);
  });
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dataset.locale = locale;
  }, [locale]);

  const setLocale = (nextLocale?: string | null) => {
    setLocaleState(normalizeLocale(nextLocale));
  };

  const value = useMemo<I18nContextValue>(() => {
    const t: TranslateFn = (key, params) => {
      const localized = getMessage(MESSAGES[locale], key) ?? getMessage(MESSAGES.en, key) ?? key;
      return interpolate(localized, params);
    };

    return {
      locale,
      setLocale,
      t,
    };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }

  return context;
}

export { LOCALE_LABELS, SUPPORTED_LOCALES };
export type { Locale, TranslateFn, TranslateParams, TranslationTree };