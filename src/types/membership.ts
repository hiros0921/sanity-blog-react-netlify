// 会員システムの型定義

export type MembershipTier = 'free' | 'basic' | 'premium' | 'enterprise';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  membershipTier: MembershipTier;
  stripeCustomerId?: string;
  subscriptionId?: string;
  subscriptionStatus?: 'active' | 'canceled' | 'past_due' | 'trialing';
  subscriptionEndDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MembershipPlan {
  id: string;
  tier: MembershipTier;
  name: string;
  description: string;
  price: number; // 円単位
  priceId?: string; // Stripe Price ID
  features: string[];
  highlighted?: boolean;
  currency: 'JPY' | 'USD';
  interval: 'month' | 'year';
}

export interface PaymentMethod {
  id: string;
  type: 'card';
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

export interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: 'paid' | 'open' | 'void';
  createdAt: Date;
  paidAt?: Date;
  invoiceUrl?: string;
}

export interface ContentAccess {
  tier: MembershipTier;
  requiresAuth: boolean;
  allowedTiers: MembershipTier[];
}

// プレミアムコンテンツの型
export interface PremiumContent {
  id: string;
  title: string;
  type: 'article' | 'video' | 'course' | 'resource';
  requiredTier: MembershipTier;
  previewContent?: string; // 無料ユーザー向けプレビュー
  fullContent: string;
  benefits: string[];
}

// クーポンの型
export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountAmount: number; // パーセンテージまたは固定金額
  validFrom: Date;
  validUntil: Date;
  usageLimit?: number;
  usageCount: number;
  applicableTiers: MembershipTier[];
  isActive: boolean;
}

// アフィリエイトの型
export interface AffiliateProgram {
  userId: string;
  affiliateCode: string;
  commissionRate: number; // パーセンテージ
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
  referralCount: number;
  conversionCount: number;
  createdAt: Date;
}

// メール通知設定の型
export interface EmailNotificationSettings {
  userId: string;
  newContent: boolean;
  weeklyDigest: boolean;
  promotions: boolean;
  accountUpdates: boolean;
  commentReplies: boolean;
  subscriptionReminders: boolean;
}