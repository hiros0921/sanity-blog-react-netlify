// 広告管理の型定義

export type AdType = 'display' | 'native' | 'video' | 'sponsored' | 'affiliate';
export type AdPosition = 'header' | 'sidebar' | 'in-content' | 'footer' | 'floating';
export type AdSize = '728x90' | '300x250' | '336x280' | '160x600' | 'responsive';

// Google AdSense広告
export interface AdSenseAd {
  id: string;
  adSlot: string;
  adClient: string;
  type: 'display' | 'in-feed' | 'in-article';
  size: AdSize;
  position: AdPosition;
  isActive: boolean;
  testMode?: boolean;
}

// スポンサード記事
export interface SponsoredPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  sponsor: {
    name: string;
    logo?: string;
    url?: string;
  };
  cta?: {
    text: string;
    url: string;
  };
  publishedAt: Date;
  expiresAt?: Date;
  impressions: number;
  clicks: number;
  isActive: boolean;
  tags: string[];
  imageUrl?: string;
}

// アフィリエイト広告
export interface AffiliateAd {
  id: string;
  program: string; // Amazon, 楽天など
  productId: string;
  productName: string;
  productImage?: string;
  price?: number;
  commission: number; // パーセンテージ
  trackingUrl: string;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  isActive: boolean;
  category: string;
  position: AdPosition;
}

// 広告パフォーマンス
export interface AdPerformance {
  adId: string;
  adType: AdType;
  date: Date;
  impressions: number;
  clicks: number;
  ctr: number; // Click Through Rate
  revenue: number;
  ecpm: number; // Effective Cost Per Mille
  conversions?: number;
  conversionRate?: number;
}

// 広告配置設定
export interface AdPlacement {
  id: string;
  pageType: 'home' | 'blog-list' | 'blog-post' | 'video' | 'profile';
  position: AdPosition;
  adType: AdType;
  adIds: string[];
  priority: number;
  conditions?: {
    minScrollDepth?: number;
    delaySeconds?: number;
    maxPerSession?: number;
    deviceType?: ('mobile' | 'tablet' | 'desktop')[];
  };
  isActive: boolean;
}

// A/Bテスト設定
export interface AdABTest {
  id: string;
  name: string;
  status: 'draft' | 'running' | 'completed';
  variants: {
    id: string;
    name: string;
    adPlacementId: string;
    weight: number; // 0-100
    performance?: {
      impressions: number;
      clicks: number;
      revenue: number;
    };
  }[];
  startDate: Date;
  endDate?: Date;
  winner?: string;
}

// 広告ブロック検出
export interface AdBlockDetection {
  isEnabled: boolean;
  message?: string;
  fallbackContent?: string;
  trackingEnabled: boolean;
}