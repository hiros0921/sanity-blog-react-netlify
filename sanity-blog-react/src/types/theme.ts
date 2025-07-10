// テーマ関連の型定義

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  // 現在のテーマ
  theme: Theme;
  
  // 実際に適用されているテーマ（systemの場合は解決後の値）
  resolvedTheme: 'light' | 'dark';
  
  // システムのカラースキーム
  systemTheme: 'light' | 'dark';
  
  // テーマの詳細設定
  settings: ThemeSettings;
}

export interface ThemeSettings {
  // トランジションの有効/無効
  enableTransitions: boolean;
  
  // トランジションの速度（ミリ秒）
  transitionDuration: number;
  
  // カラーパレット
  colors: ThemeColors;
  
  // フォント設定
  fonts: ThemeFonts;
  
  // その他のカスタマイズ
  custom: Record<string, any>;
}

export interface ThemeColors {
  // プライマリカラー
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  
  // グレースケール
  gray: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  
  // 背景色
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  
  // テキストカラー
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
  };
  
  // ボーダーカラー
  border: {
    light: string;
    medium: string;
    dark: string;
  };
  
  // 状態カラー
  state: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

export interface ThemeFonts {
  // フォントファミリー
  sans: string;
  serif: string;
  mono: string;
  display: string;
  
  // フォントサイズ
  sizes: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
  };
  
  // 行間
  lineHeights: {
    tight: string;
    normal: string;
    relaxed: string;
  };
  
  // フォントウェイト
  weights: {
    thin: number;
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
  };
}