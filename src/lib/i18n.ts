import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import type { Language } from '../types/i18n';

// サポートする言語
export const supportedLanguages: Language[] = ['ja', 'en'];

// デフォルト言語
export const defaultLanguage: Language = 'ja';

// 言語の表示名
export const languageNames: Record<Language, string> = {
  ja: '日本語',
  en: 'English'
};

// i18n初期化
i18n
  .use(HttpApi) // 翻訳ファイルを非同期で読み込む
  .use(LanguageDetector) // ブラウザの言語を自動検出
  .use(initReactI18next) // React用のi18nバインディング
  .init({
    // デフォルト言語
    lng: defaultLanguage,
    
    // フォールバック言語
    fallbackLng: 'en',
    
    // サポートする言語
    supportedLngs: supportedLanguages,
    
    // デバッグモード（開発環境のみ）
    debug: process.env.NODE_ENV === 'development',
    
    // 翻訳ファイルの読み込み設定
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    
    // 言語検出の設定
    detection: {
      // 言語情報を保存する場所
      order: ['localStorage', 'navigator', 'htmlTag'],
      
      // localStorageのキー名
      lookupLocalStorage: 'hirosuwablog_language',
      
      // 言語情報をキャッシュする
      caches: ['localStorage'],
    },
    
    // React Suspenseを使用
    react: {
      useSuspense: true,
    },
    
    // 補間の設定
    interpolation: {
      // Reactはデフォルトでエスケープするので不要
      escapeValue: false,
    },
    
    // キーが見つからない場合の設定
    saveMissing: true,
    missingKeyHandler: (lng, ns, key, fallbackValue) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation: ${lng}/${ns}/${key}`);
      }
    },
  });

// 現在の言語を取得
export const getCurrentLanguage = (): Language => {
  return i18n.language as Language;
};

// 言語を変更
export const changeLanguage = async (language: Language): Promise<void> => {
  await i18n.changeLanguage(language);
  
  // HTMLのlang属性を更新
  document.documentElement.lang = language;
  
  // 言語変更をlocalStorageに保存
  localStorage.setItem('hirosuwablog_language', language);
};

// 日付のフォーマット
export const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const locale = i18n.language === 'ja' ? 'ja-JP' : 'en-US';
  
  return dateObj.toLocaleDateString(locale, options || {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// 数値のフォーマット
export const formatNumber = (number: number, options?: Intl.NumberFormatOptions): string => {
  const locale = i18n.language === 'ja' ? 'ja-JP' : 'en-US';
  return new Intl.NumberFormat(locale, options).format(number);
};

// 通貨のフォーマット
export const formatCurrency = (amount: number, currency: string = 'JPY'): string => {
  const locale = i18n.language === 'ja' ? 'ja-JP' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// 相対時間のフォーマット（例：3日前）
export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  const locale = i18n.language === 'ja' ? 'ja-JP' : 'en-US';
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  
  if (diffInMinutes < 60) {
    return rtf.format(-diffInMinutes, 'minute');
  } else if (diffInHours < 24) {
    return rtf.format(-diffInHours, 'hour');
  } else if (diffInDays < 30) {
    return rtf.format(-diffInDays, 'day');
  } else {
    return formatDate(dateObj);
  }
};

export default i18n;