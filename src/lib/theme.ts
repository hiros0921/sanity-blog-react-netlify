// テーマ管理サービス
import type { ThemeSettings } from '../types/theme';

class ThemeService {
  private static instance: ThemeService;
  private readonly STORAGE_KEY = 'hirosuwablog_theme_settings';
  
  // デフォルトのカラーパレット
  private readonly DEFAULT_COLORS = {
    light: {
      primary: {
        50: '#f5f3ff',
        100: '#ede9fe',
        200: '#ddd6fe',
        300: '#c4b5fd',
        400: '#a78bfa',
        500: '#8b5cf6',
        600: '#7c3aed',
        700: '#6d28d9',
        800: '#5b21b6',
        900: '#4c1d95',
      },
      gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
      },
      background: {
        primary: '#ffffff',
        secondary: '#f9fafb',
        tertiary: '#f3f4f6',
      },
      text: {
        primary: '#111827',
        secondary: '#4b5563',
        tertiary: '#6b7280',
        inverse: '#ffffff',
      },
      border: {
        light: '#e5e7eb',
        medium: '#d1d5db',
        dark: '#9ca3af',
      },
      state: {
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
    },
    dark: {
      primary: {
        50: '#faf5ff',
        100: '#f3e8ff',
        200: '#e9d5ff',
        300: '#d8b4fe',
        400: '#c084fc',
        500: '#a855f7',
        600: '#9333ea',
        700: '#7e22ce',
        800: '#6b21a8',
        900: '#581c87',
      },
      gray: {
        50: '#fafafa',
        100: '#f4f4f5',
        200: '#e4e4e7',
        300: '#d4d4d8',
        400: '#a1a1aa',
        500: '#71717a',
        600: '#52525b',
        700: '#3f3f46',
        800: '#27272a',
        900: '#18181b',
      },
      background: {
        primary: '#0a0a0a',
        secondary: '#18181b',
        tertiary: '#27272a',
      },
      text: {
        primary: '#fafafa',
        secondary: '#d4d4d8',
        tertiary: '#a1a1aa',
        inverse: '#0a0a0a',
      },
      border: {
        light: '#27272a',
        medium: '#3f3f46',
        dark: '#52525b',
      },
      state: {
        success: '#22c55e',
        warning: '#fbbf24',
        error: '#f87171',
        info: '#60a5fa',
      },
    },
  };

  // デフォルトのテーマ設定
  private readonly DEFAULT_SETTINGS: ThemeSettings = {
    enableTransitions: true,
    transitionDuration: 200,
    colors: this.DEFAULT_COLORS.light,
    fonts: {
      sans: 'Inter, system-ui, -apple-system, sans-serif',
      serif: 'Georgia, Cambria, serif',
      mono: 'JetBrains Mono, Consolas, monospace',
      display: 'Cal Sans, Inter, sans-serif',
      sizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
      },
      lineHeights: {
        tight: '1.25',
        normal: '1.5',
        relaxed: '1.75',
      },
      weights: {
        thin: 100,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
      },
    },
    custom: {},
  };

  private constructor() {}

  static getInstance(): ThemeService {
    if (!ThemeService.instance) {
      ThemeService.instance = new ThemeService();
    }
    return ThemeService.instance;
  }

  // テーマ設定を取得
  getSettings(theme: 'light' | 'dark'): ThemeSettings {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const settings = JSON.parse(stored);
        return {
          ...this.DEFAULT_SETTINGS,
          ...settings[theme],
          colors: theme === 'dark' ? this.DEFAULT_COLORS.dark : this.DEFAULT_COLORS.light,
        };
      }
    } catch (error) {
      console.error('Failed to load theme settings:', error);
    }

    return {
      ...this.DEFAULT_SETTINGS,
      colors: theme === 'dark' ? this.DEFAULT_COLORS.dark : this.DEFAULT_COLORS.light,
    };
  }

  // テーマ設定を保存
  saveSettings(theme: 'light' | 'dark', settings: Partial<ThemeSettings>): void {
    try {
      const current = this.getAllSettings();
      const updated = {
        ...current,
        [theme]: {
          ...this.DEFAULT_SETTINGS,
          ...settings,
        },
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save theme settings:', error);
    }
  }

  // すべてのテーマ設定を取得
  private getAllSettings(): Record<string, Partial<ThemeSettings>> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  // CSS変数を生成
  generateCSSVariables(theme: 'light' | 'dark'): string {
    const settings = this.getSettings(theme);
    const colors = settings.colors;
    
    const variables: string[] = [];

    // カラー変数
    Object.entries(colors.primary).forEach(([key, value]) => {
      variables.push(`--color-primary-${key}: ${value};`);
    });

    Object.entries(colors.gray).forEach(([key, value]) => {
      variables.push(`--color-gray-${key}: ${value};`);
    });

    Object.entries(colors.background).forEach(([key, value]) => {
      variables.push(`--bg-${key}: ${value};`);
    });

    Object.entries(colors.text).forEach(([key, value]) => {
      variables.push(`--text-${key}: ${value};`);
    });

    Object.entries(colors.border).forEach(([key, value]) => {
      variables.push(`--border-${key}: ${value};`);
    });

    Object.entries(colors.state).forEach(([key, value]) => {
      variables.push(`--color-${key}: ${value};`);
    });

    // フォント変数
    variables.push(`--font-sans: ${settings.fonts.sans};`);
    variables.push(`--font-serif: ${settings.fonts.serif};`);
    variables.push(`--font-mono: ${settings.fonts.mono};`);
    variables.push(`--font-display: ${settings.fonts.display};`);

    // トランジション変数
    if (settings.enableTransitions) {
      variables.push(`--transition-duration: ${settings.transitionDuration}ms;`);
    } else {
      variables.push(`--transition-duration: 0ms;`);
    }

    return `:root[data-theme="${theme}"] {\n  ${variables.join('\n  ')}\n}`;
  }

  // スタイルタグを挿入
  injectStyles(): void {
    const styleId = 'theme-variables';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    const lightStyles = this.generateCSSVariables('light');
    const darkStyles = this.generateCSSVariables('dark');
    
    styleElement.textContent = `${lightStyles}\n\n${darkStyles}`;
  }

  // カラーを調整（明度調整など）
  adjustColor(color: string, amount: number): string {
    // HEXカラーをRGBに変換
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // 明度を調整
    const adjustedR = Math.max(0, Math.min(255, r + amount));
    const adjustedG = Math.max(0, Math.min(255, g + amount));
    const adjustedB = Math.max(0, Math.min(255, b + amount));

    // RGBをHEXに変換
    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    return `#${toHex(adjustedR)}${toHex(adjustedG)}${toHex(adjustedB)}`;
  }

  // コントラスト比を計算
  getContrastRatio(color1: string, color2: string): number {
    // 簡易的な実装（実際にはWCAGのアルゴリズムを使用）
    const getLuminance = (color: string): number => {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;

      const adjust = (c: number) => {
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      };

      return 0.2126 * adjust(r) + 0.7152 * adjust(g) + 0.0722 * adjust(b);
    };

    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
  }

  // アクセシビリティチェック
  checkAccessibility(theme: 'light' | 'dark'): {
    passed: boolean;
    issues: string[];
  } {
    const settings = this.getSettings(theme);
    const colors = settings.colors;
    const issues: string[] = [];

    // テキストとバックグラウンドのコントラスト比をチェック
    const primaryTextContrast = this.getContrastRatio(
      colors.text.primary,
      colors.background.primary
    );

    if (primaryTextContrast < 4.5) {
      issues.push('Primary text contrast ratio is below WCAG AA standard (4.5:1)');
    }

    const secondaryTextContrast = this.getContrastRatio(
      colors.text.secondary,
      colors.background.primary
    );

    if (secondaryTextContrast < 3) {
      issues.push('Secondary text contrast ratio is below minimum standard (3:1)');
    }

    return {
      passed: issues.length === 0,
      issues,
    };
  }
}

export const themeService = ThemeService.getInstance();