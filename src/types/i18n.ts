// 国際化（i18n）の型定義

export type Language = 'ja' | 'en';

export interface TranslationResource {
  // 共通
  common: {
    home: string;
    blog: string;
    videos: string;
    code: string;
    library: string;
    pricing: string;
    dashboard: string;
    profile: string;
    contact: string;
    search: string;
    loading: string;
    error: string;
    retry: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    create: string;
    close: string;
    back: string;
    next: string;
    previous: string;
    submit: string;
    confirm: string;
    yes: string;
    no: string;
  };

  // ナビゲーション
  navigation: {
    getStarted: string;
    login: string;
    logout: string;
    signup: string;
    menu: string;
    settings: string;
  };

  // ヒーローセクション
  hero: {
    title: string;
    subtitle: string;
    description: string;
    cta: string;
  };

  // ブログ
  blog: {
    readMore: string;
    minRead: string;
    publishedOn: string;
    author: string;
    category: string;
    tags: string;
    relatedPosts: string;
    noPostsFound: string;
    searchPosts: string;
    allCategories: string;
    bookmark: string;
    share: string;
    tableOfContents: string;
    backToTop: string;
  };

  // 料金プラン
  pricing: {
    title: string;
    subtitle: string;
    monthly: string;
    yearly: string;
    perMonth: string;
    perYear: string;
    currentPlan: string;
    upgrade: string;
    downgrade: string;
    features: string;
    unlimited: string;
    limited: string;
    getStarted: string;
    contactSales: string;
    freeTrial: string;
    plans: {
      free: {
        name: string;
        description: string;
        features: string[];
      };
      basic: {
        name: string;
        description: string;
        features: string[];
      };
      premium: {
        name: string;
        description: string;
        features: string[];
      };
      enterprise: {
        name: string;
        description: string;
        features: string[];
      };
    };
  };

  // ダッシュボード
  dashboard: {
    overview: string;
    billing: string;
    coupons: string;
    affiliate: string;
    notifications: string;
    accountSettings: string;
    subscription: string;
    paymentHistory: string;
    invoices: string;
    downloadCSV: string;
    totalRevenue: string;
    pendingBalance: string;
    accountStatus: string;
    memberSince: string;
    nextBillingDate: string;
    activitySummary: string;
    articlesRead: string;
    consecutiveDays: string;
    unreadNotifications: string;
  };

  // 広告
  advertising: {
    performance: string;
    impressions: string;
    clicks: string;
    conversions: string;
    revenue: string;
    ctr: string;
    cvr: string;
    ecpm: string;
    adBlockDetected: string;
    adBlockMessage: string;
    sponsoredContent: string;
    affiliateProduct: string;
    viewDetails: string;
    commission: string;
  };

  // メール通知
  emailNotifications: {
    settings: string;
    newContent: string;
    weeklyDigest: string;
    promotions: string;
    accountUpdates: string;
    commentReplies: string;
    subscriptionReminders: string;
    frequency: string;
    unsubscribe: string;
  };

  // エラーメッセージ
  errors: {
    genericError: string;
    networkError: string;
    notFound: string;
    unauthorized: string;
    forbidden: string;
    validationError: string;
    serverError: string;
  };

  // 成功メッセージ
  success: {
    saved: string;
    updated: string;
    deleted: string;
    subscribed: string;
    unsubscribed: string;
    paymentSuccessful: string;
    emailSent: string;
  };
}

// 自動翻訳API設定
export interface TranslationAPIConfig {
  provider: 'google' | 'deepl' | 'microsoft';
  apiKey: string;
  endpoint?: string;
  maxCharactersPerRequest?: number;
  rateLimit?: {
    requests: number;
    windowMs: number;
  };
}

// 翻訳キャッシュ
export interface TranslationCache {
  key: string;
  sourceLang: Language;
  targetLang: Language;
  sourceText: string;
  translatedText: string;
  timestamp: number;
}