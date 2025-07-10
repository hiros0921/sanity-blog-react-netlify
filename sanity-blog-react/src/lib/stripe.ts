// Stripe統合サービス
import type { MembershipPlan, MembershipTier } from '../types/membership';
import { authService } from './auth';

// 料金プランの定義
export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'free',
    tier: 'free',
    name: 'フリープラン',
    description: '基本的な機能を無料でご利用いただけます',
    price: 0,
    currency: 'JPY',
    interval: 'month',
    features: [
      '月5記事まで閲覧可能',
      '基本的な検索機能',
      'ブックマーク機能（10件まで）',
      'コメント機能'
    ]
  },
  {
    id: 'basic',
    tier: 'basic',
    name: 'ベーシックプラン',
    description: 'より多くのコンテンツにアクセス',
    price: 980,
    priceId: 'price_basic_monthly', // 実際のStripe Price ID
    currency: 'JPY',
    interval: 'month',
    features: [
      '無制限の記事閲覧',
      '高度な検索機能',
      '無制限のブックマーク',
      '読書履歴の保存',
      'AIによる記事推薦',
      '広告非表示'
    ]
  },
  {
    id: 'premium',
    tier: 'premium',
    name: 'プレミアムプラン',
    description: 'すべての機能とプレミアムコンテンツ',
    price: 2980,
    priceId: 'price_premium_monthly',
    currency: 'JPY',
    interval: 'month',
    highlighted: true,
    features: [
      'ベーシックプランのすべての機能',
      'プレミアム限定記事',
      '動画コンテンツへのアクセス',
      'ソースコードのダウンロード',
      '月1回のオンラインQ&Aセッション',
      '優先サポート',
      '新機能への早期アクセス'
    ]
  },
  {
    id: 'enterprise',
    tier: 'enterprise',
    name: 'エンタープライズプラン',
    description: 'チーム向けの特別プラン',
    price: 9800,
    priceId: 'price_enterprise_monthly',
    currency: 'JPY',
    interval: 'month',
    features: [
      'プレミアムプランのすべての機能',
      'チームメンバー管理（5名まで）',
      '専用のSlackチャンネル',
      'カスタムトレーニング',
      'APIアクセス',
      'SLA保証',
      '請求書払い対応'
    ]
  }
];

class StripeService {
  private static instance: StripeService;
  
  // 注意: 実際の実装では、Stripeの公開可能キーを環境変数から取得
  // private readonly publishableKey = 'pk_test_YOUR_STRIPE_PUBLISHABLE_KEY';
  
  private constructor() {}

  static getInstance(): StripeService {
    if (!StripeService.instance) {
      StripeService.instance = new StripeService();
    }
    return StripeService.instance;
  }

  // プランを取得
  getPlans(): MembershipPlan[] {
    return MEMBERSHIP_PLANS;
  }

  // 特定のプランを取得
  getPlan(tier: MembershipTier): MembershipPlan | undefined {
    return MEMBERSHIP_PLANS.find(plan => plan.tier === tier);
  }

  // チェックアウトセッションを作成（実際のStripe統合では、バックエンドAPIを経由）
  async createCheckoutSession(planId: string): Promise<string> {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('User must be authenticated to subscribe');
    }

    // 実際の実装では、バックエンドAPIにリクエストを送信して
    // Stripe Checkout Sessionを作成し、URLを返す
    console.log('Creating checkout session for plan:', planId);
    
    // デモ用: 仮のチェックアウトURLを返す
    return `https://checkout.stripe.com/demo/${planId}`;
  }

  // カスタマーポータルのURLを取得
  async getCustomerPortalUrl(): Promise<string> {
    const user = authService.getCurrentUser();
    if (!user || !user.stripeCustomerId) {
      throw new Error('User must have a Stripe customer ID');
    }

    // 実際の実装では、バックエンドAPIにリクエストを送信
    console.log('Getting customer portal URL for:', user.stripeCustomerId);
    
    // デモ用: 仮のポータルURLを返す
    return `https://billing.stripe.com/demo/portal/${user.stripeCustomerId}`;
  }

  // サブスクリプションのキャンセル
  async cancelSubscription(): Promise<void> {
    const user = authService.getCurrentUser();
    if (!user || !user.subscriptionId) {
      throw new Error('No active subscription found');
    }

    // 実際の実装では、バックエンドAPIにリクエストを送信
    console.log('Canceling subscription:', user.subscriptionId);
    
    // authServiceを通じてローカルの状態を更新
    await authService.cancelSubscription();
  }

  // 支払い方法の更新
  async updatePaymentMethod(paymentMethodId: string): Promise<void> {
    const user = authService.getCurrentUser();
    if (!user || !user.stripeCustomerId) {
      throw new Error('User must have a Stripe customer ID');
    }

    // 実際の実装では、バックエンドAPIにリクエストを送信
    console.log('Updating payment method:', paymentMethodId);
  }

  // 請求履歴を取得
  async getInvoices(): Promise<any[]> {
    const user = authService.getCurrentUser();
    if (!user || !user.stripeCustomerId) {
      return [];
    }

    // 実際の実装では、バックエンドAPIから請求履歴を取得
    console.log('Fetching invoices for:', user.stripeCustomerId);
    
    // デモ用: モックデータを返す
    return [
      {
        id: 'inv_1',
        amount: 2980,
        currency: 'JPY',
        status: 'paid',
        createdAt: new Date('2025-01-01'),
        paidAt: new Date('2025-01-01')
      }
    ];
  }
}

export const stripeService = StripeService.getInstance();