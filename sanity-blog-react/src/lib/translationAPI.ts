// 自動翻訳APIサービス
import type { Language, TranslationCache } from '../types/i18n';

class TranslationAPIService {
  private static instance: TranslationAPIService;
  private cache: Map<string, TranslationCache> = new Map();
  private readonly CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7日間
  

  private constructor() {
    this.loadCacheFromStorage();
  }

  static getInstance(): TranslationAPIService {
    if (!TranslationAPIService.instance) {
      TranslationAPIService.instance = new TranslationAPIService();
    }
    return TranslationAPIService.instance;
  }

  // キャッシュをLocalStorageから読み込み
  private loadCacheFromStorage() {
    try {
      const stored = localStorage.getItem('translation_cache');
      if (stored) {
        const cacheData = JSON.parse(stored);
        Object.entries(cacheData).forEach(([key, value]) => {
          this.cache.set(key, value as TranslationCache);
        });
        this.cleanExpiredCache();
      }
    } catch (error) {
      console.error('Failed to load translation cache:', error);
    }
  }

  // キャッシュをLocalStorageに保存
  private saveCacheToStorage() {
    try {
      const cacheData: Record<string, TranslationCache> = {};
      this.cache.forEach((value, key) => {
        cacheData[key] = value;
      });
      localStorage.setItem('translation_cache', JSON.stringify(cacheData));
    } catch (error) {
      console.error('Failed to save translation cache:', error);
    }
  }

  // 期限切れのキャッシュを削除
  private cleanExpiredCache() {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((value, key) => {
      if (now - value.timestamp > this.CACHE_DURATION) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
    if (keysToDelete.length > 0) {
      this.saveCacheToStorage();
    }
  }

  // キャッシュキーの生成
  private getCacheKey(text: string, sourceLang: Language, targetLang: Language): string {
    return `${sourceLang}:${targetLang}:${text.substring(0, 50)}`;
  }

  // テキストの翻訳
  async translateText(
    text: string,
    targetLang: Language,
    sourceLang: Language = 'ja'
  ): Promise<string> {
    // 同じ言語の場合はそのまま返す
    if (sourceLang === targetLang) {
      return text;
    }

    // キャッシュをチェック
    const cacheKey = this.getCacheKey(text, sourceLang, targetLang);
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.translatedText;
    }

    try {
      // 実際のAPIコール（ここではモック実装）
      const translated = await this.mockTranslateAPI(text, sourceLang, targetLang);
      
      // キャッシュに保存
      const cacheEntry: TranslationCache = {
        key: cacheKey,
        sourceLang,
        targetLang,
        sourceText: text,
        translatedText: translated,
        timestamp: Date.now()
      };
      
      this.cache.set(cacheKey, cacheEntry);
      this.saveCacheToStorage();
      
      return translated;
    } catch (error) {
      console.error('Translation failed:', error);
      return text; // エラー時は元のテキストを返す
    }
  }

  // 複数のテキストを一括翻訳
  async translateBatch(
    texts: string[],
    targetLang: Language,
    sourceLang: Language = 'ja'
  ): Promise<string[]> {
    // 同じ言語の場合はそのまま返す
    if (sourceLang === targetLang) {
      return texts;
    }

    // キャッシュされているものと未キャッシュのものを分ける
    const results: (string | null)[] = new Array(texts.length).fill(null);
    const toTranslate: { index: number; text: string }[] = [];

    texts.forEach((text, index) => {
      const cacheKey = this.getCacheKey(text, sourceLang, targetLang);
      const cached = this.cache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        results[index] = cached.translatedText;
      } else {
        toTranslate.push({ index, text });
      }
    });

    // 未キャッシュのテキストを翻訳
    if (toTranslate.length > 0) {
      const translatedTexts = await Promise.all(
        toTranslate.map(item => this.translateText(item.text, targetLang, sourceLang))
      );

      toTranslate.forEach((item, i) => {
        results[item.index] = translatedTexts[i];
      });
    }

    return results as string[];
  }

  // モックAPI実装（実際の実装では本物のAPIを使用）
  private async mockTranslateAPI(
    text: string,
    sourceLang: Language,
    targetLang: Language
  ): Promise<string> {
    // 簡単な翻訳シミュレーション
    await new Promise(resolve => setTimeout(resolve, 300)); // API遅延のシミュレーション

    // 基本的な翻訳マッピング（デモ用）
    const translations: Record<string, Record<string, string>> = {
      'ja:en': {
        'こんにちは': 'Hello',
        'ありがとう': 'Thank you',
        '続きを読む': 'Read more',
        'ホーム': 'Home',
        'ブログ': 'Blog',
        '料金プラン': 'Pricing',
        'ダッシュボード': 'Dashboard',
        'プロフィール': 'Profile',
        'お問い合わせ': 'Contact',
      },
      'en:ja': {
        'Hello': 'こんにちは',
        'Thank you': 'ありがとう',
        'Read more': '続きを読む',
        'Home': 'ホーム',
        'Blog': 'ブログ',
        'Pricing': '料金プラン',
        'Dashboard': 'ダッシュボード',
        'Profile': 'プロフィール',
        'Contact': 'お問い合わせ',
      }
    };

    const langPair = `${sourceLang}:${targetLang}`;
    const exactTranslation = translations[langPair]?.[text];
    
    if (exactTranslation) {
      return exactTranslation;
    }

    // 簡単な変換ロジック（デモ用）
    if (targetLang === 'en') {
      return `[EN] ${text}`;
    } else {
      return `[JA] ${text}`;
    }
  }

  // Google翻訳APIを使用した実装例（コメントアウト）
  /*
  private async googleTranslateAPI(
    text: string,
    sourceLang: Language,
    targetLang: Language
  ): Promise<string> {
    const response = await fetch(`${this.GOOGLE_TRANSLATE_API}?key=${this.API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text'
      })
    });

    if (!response.ok) {
      throw new Error('Translation API request failed');
    }

    const data = await response.json();
    return data.data.translations[0].translatedText;
  }
  */

  // DeepL APIを使用した実装例（コメントアウト）
  /*
  private async deeplTranslateAPI(
    text: string,
    sourceLang: Language,
    targetLang: Language
  ): Promise<string> {
    const DEEPL_API_KEY = process.env.REACT_APP_DEEPL_API_KEY;
    const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';

    const formData = new URLSearchParams();
    formData.append('auth_key', DEEPL_API_KEY || '');
    formData.append('text', text);
    formData.append('source_lang', sourceLang.toUpperCase());
    formData.append('target_lang', targetLang.toUpperCase());

    const response = await fetch(DEEPL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('DeepL API request failed');
    }

    const data = await response.json();
    return data.translations[0].text;
  }
  */

  // 翻訳の品質チェック
  validateTranslation(original: string, translated: string): boolean {
    // 基本的な検証
    if (!translated || translated.trim().length === 0) {
      return false;
    }

    // 翻訳が元のテキストと同じ場合は失敗
    if (original === translated) {
      return false;
    }

    // プレースホルダーやタグが破損していないかチェック
    const placeholderRegex = /\{\{[^}]+\}\}/g;
    const originalPlaceholders = original.match(placeholderRegex) || [];
    const translatedPlaceholders = translated.match(placeholderRegex) || [];

    if (originalPlaceholders.length !== translatedPlaceholders.length) {
      return false;
    }

    return true;
  }

  // キャッシュのクリア
  clearCache() {
    this.cache.clear();
    localStorage.removeItem('translation_cache');
  }

  // 統計情報の取得
  getStats(): {
    cacheSize: number;
    cacheHitRate: number;
    totalTranslations: number;
  } {
    // 実装では実際の統計を追跡
    return {
      cacheSize: this.cache.size,
      cacheHitRate: 0.75, // 仮の値
      totalTranslations: this.cache.size * 2 // 仮の値
    };
  }
}

export const translationAPI = TranslationAPIService.getInstance();