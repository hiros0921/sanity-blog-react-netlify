import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Theme } from '../types/theme';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  systemTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// デフォルトテーマ設定
const DEFAULT_THEME: Theme = 'system';
const STORAGE_KEY = 'hirosuwablog_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');
  const [isLoading, setIsLoading] = useState(true);

  // システムのカラースキームを取得
  const getSystemTheme = useCallback((): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, []);

  // 実際に適用されるテーマを解決
  const resolvedTheme = theme === 'system' ? systemTheme : theme;

  // テーマをHTMLに適用
  const applyTheme = useCallback((themeToApply: 'light' | 'dark') => {
    const root = document.documentElement;
    
    // 以前のテーマクラスを削除
    root.classList.remove('light', 'dark');
    
    // 新しいテーマクラスを追加
    root.classList.add(themeToApply);
    
    // data属性も設定（CSSカスタムプロパティ用）
    root.setAttribute('data-theme', themeToApply);
    
    // メタテーマカラーを更新
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        themeToApply === 'dark' ? '#1a1a1a' : '#ffffff'
      );
    }
  }, []);

  // テーマを設定
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
    
    // システムテーマの場合は現在のシステム設定を適用
    const themeToApply = newTheme === 'system' ? systemTheme : newTheme;
    applyTheme(themeToApply);
  }, [systemTheme, applyTheme]);

  // テーマをトグル
  const toggleTheme = useCallback(() => {
    if (theme === 'system') {
      // システム → ライト
      setTheme('light');
    } else if (theme === 'light') {
      // ライト → ダーク
      setTheme('dark');
    } else {
      // ダーク → システム
      setTheme('system');
    }
  }, [theme, setTheme]);

  // 初期化
  useEffect(() => {
    // ローカルストレージから読み込み
    const savedTheme = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initialTheme = savedTheme || DEFAULT_THEME;
    
    // システムテーマを取得
    const currentSystemTheme = getSystemTheme();
    setSystemTheme(currentSystemTheme);
    
    // テーマを設定
    setThemeState(initialTheme);
    const themeToApply = initialTheme === 'system' ? currentSystemTheme : initialTheme;
    applyTheme(themeToApply);
    
    setIsLoading(false);
  }, [getSystemTheme, applyTheme]);

  // システムテーマの変更を監視
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      const newSystemTheme = e.matches ? 'dark' : 'light';
      setSystemTheme(newSystemTheme);
      
      // 現在のテーマがシステムの場合、新しいシステムテーマを適用
      if (theme === 'system') {
        applyTheme(newSystemTheme);
      }
    };

    // イベントリスナーを追加
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // 古いブラウザ用のフォールバック
      mediaQuery.addListener(handleChange);
    }

    // クリーンアップ
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [theme, applyTheme]);

  // トランジションの制御
  useEffect(() => {
    // テーマ変更時の一時的なトランジション無効化を防ぐ
    const disableTransitions = () => {
      document.documentElement.classList.add('theme-transition-disable');
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transition-disable');
      }, 100);
    };

    // テーマ変更時にトランジションを一時的に無効化
    if (!isLoading) {
      disableTransitions();
    }
  }, [theme, isLoading]);

  const value: ThemeContextValue = {
    theme,
    resolvedTheme,
    systemTheme,
    setTheme,
    toggleTheme,
    isLoading
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// カスタムフック
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};