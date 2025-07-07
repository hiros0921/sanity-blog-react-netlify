// アフィリエイト広告管理サービス
import type { AffiliateAd, AdPosition } from '../types/advertising';

class AffiliateAdsService {
  private static instance: AffiliateAdsService;
  private affiliateAds: Map<string, AffiliateAd> = new Map();
  
  // アフィリエイトプログラムの設定
  private readonly AFFILIATE_PROGRAMS = {
    amazon: {
      name: 'Amazon アソシエイト',
      baseUrl: 'https://www.amazon.co.jp/dp/',
      tagId: 'hirosuwablog-22'
    },
    rakuten: {
      name: '楽天アフィリエイト',
      baseUrl: 'https://hb.afl.rakuten.co.jp/hgc/',
      affiliateId: 'your-rakuten-id'
    },
    yahoo: {
      name: 'Yahoo!ショッピング',
      baseUrl: 'https://ck.jp.ap.valuecommerce.com/',
      sid: 'your-yahoo-sid'
    }
  };

  private constructor() {
    this.initializeMockData();
  }

  static getInstance(): AffiliateAdsService {
    if (!AffiliateAdsService.instance) {
      AffiliateAdsService.instance = new AffiliateAdsService();
    }
    return AffiliateAdsService.instance;
  }

  // モックデータの初期化
  private initializeMockData() {
    const mockAds: AffiliateAd[] = [
      {
        id: 'aff-001',
        program: 'amazon',
        productId: 'B08N5WRWNW',
        productName: 'Echo Echo (エコー) 第4世代 - スマートスピーカー',
        productImage: '/images/echo-dot.jpg',
        price: 5980,
        commission: 3,
        trackingUrl: this.generateTrackingUrl('amazon', 'B08N5WRWNW'),
        impressions: 2456,
        clicks: 178,
        conversions: 23,
        revenue: 4131.6,
        isActive: true,
        category: 'スマートホーム',
        position: 'sidebar'
      },
      {
        id: 'aff-002',
        program: 'amazon',
        productId: 'B0B6GCSJ1S',
        productName: 'プログラミング言語Go',
        productImage: '/images/go-book.jpg',
        price: 3520,
        commission: 3,
        trackingUrl: this.generateTrackingUrl('amazon', 'B0B6GCSJ1S'),
        impressions: 1823,
        clicks: 92,
        conversions: 15,
        revenue: 1584,
        isActive: true,
        category: '書籍',
        position: 'in-content'
      },
      {
        id: 'aff-003',
        program: 'rakuten',
        productId: '1234567890',
        productName: 'エルゴノミクスチェア',
        productImage: '/images/chair.jpg',
        price: 29800,
        commission: 5,
        trackingUrl: this.generateTrackingUrl('rakuten', '1234567890'),
        impressions: 987,
        clicks: 45,
        conversions: 3,
        revenue: 4470,
        isActive: true,
        category: 'オフィス家具',
        position: 'sidebar'
      }
    ];

    mockAds.forEach(ad => {
      this.affiliateAds.set(ad.id, ad);
    });
  }

  // トラッキングURLの生成
  private generateTrackingUrl(program: string, productId: string): string {
    switch (program) {
      case 'amazon':
        return `${this.AFFILIATE_PROGRAMS.amazon.baseUrl}${productId}?tag=${this.AFFILIATE_PROGRAMS.amazon.tagId}`;
      case 'rakuten':
        return `${this.AFFILIATE_PROGRAMS.rakuten.baseUrl}${this.AFFILIATE_PROGRAMS.rakuten.affiliateId}/${productId}`;
      case 'yahoo':
        return `${this.AFFILIATE_PROGRAMS.yahoo.baseUrl}?sid=${this.AFFILIATE_PROGRAMS.yahoo.sid}&pid=${productId}`;
      default:
        return '#';
    }
  }

  // アクティブな広告を取得
  async getActiveAds(position?: AdPosition): Promise<AffiliateAd[]> {
    const ads = Array.from(this.affiliateAds.values()).filter(ad => ad.isActive);
    
    if (position) {
      return ads.filter(ad => ad.position === position);
    }
    
    return ads;
  }

  // カテゴリー別の広告を取得
  async getAdsByCategory(category: string): Promise<AffiliateAd[]> {
    return Array.from(this.affiliateAds.values()).filter(
      ad => ad.isActive && ad.category === category
    );
  }

  // おすすめ商品を取得（パフォーマンス順）
  async getTopPerformingAds(limit: number = 5): Promise<AffiliateAd[]> {
    const activeAds = await this.getActiveAds();
    
    return activeAds
      .sort((a, b) => {
        const aScore = this.calculatePerformanceScore(a);
        const bScore = this.calculatePerformanceScore(b);
        return bScore - aScore;
      })
      .slice(0, limit);
  }

  // パフォーマンススコアの計算
  private calculatePerformanceScore(ad: AffiliateAd): number {
    const ctr = ad.impressions > 0 ? (ad.clicks / ad.impressions) * 100 : 0;
    const conversionRate = ad.clicks > 0 ? (ad.conversions / ad.clicks) * 100 : 0;
    const revenuePerImpression = ad.impressions > 0 ? ad.revenue / ad.impressions : 0;
    
    // 重み付けスコア
    return (ctr * 0.3) + (conversionRate * 0.4) + (revenuePerImpression * 0.3);
  }

  // インプレッションのトラッキング
  async trackImpression(adId: string): Promise<void> {
    const ad = this.affiliateAds.get(adId);
    if (ad) {
      ad.impressions++;
      this.saveAffiliateAd(ad);
      
      // 実際の実装では、バックエンドAPIに送信
      console.log(`Tracked impression for affiliate ad: ${adId}`);
    }
  }

  // クリックのトラッキング
  async trackClick(adId: string): Promise<void> {
    const ad = this.affiliateAds.get(adId);
    if (ad) {
      ad.clicks++;
      this.saveAffiliateAd(ad);
      
      // 実際の実装では、バックエンドAPIに送信
      console.log(`Tracked click for affiliate ad: ${adId}`);
    }
  }

  // コンバージョンのトラッキング
  async trackConversion(adId: string, amount: number): Promise<void> {
    const ad = this.affiliateAds.get(adId);
    if (ad) {
      ad.conversions++;
      ad.revenue += amount * (ad.commission / 100);
      this.saveAffiliateAd(ad);
      
      // 実際の実装では、バックエンドAPIに送信
      console.log(`Tracked conversion for affiliate ad: ${adId}, amount: ${amount}`);
    }
  }

  // 広告の保存
  private saveAffiliateAd(ad: AffiliateAd): void {
    this.affiliateAds.set(ad.id, ad);
    // 実際の実装では、localStorage or API
  }

  // 広告パフォーマンスレポートの生成
  async generateAdReport(adId: string): Promise<{
    ad: AffiliateAd;
    ctr: number;
    conversionRate: number;
    ecpm: number;
    averageOrderValue: number;
  } | null> {
    const ad = this.affiliateAds.get(adId);
    if (!ad) return null;

    const ctr = ad.impressions > 0 ? (ad.clicks / ad.impressions) * 100 : 0;
    const conversionRate = ad.clicks > 0 ? (ad.conversions / ad.clicks) * 100 : 0;
    const ecpm = ad.impressions > 0 ? (ad.revenue / ad.impressions) * 1000 : 0;
    const averageOrderValue = ad.conversions > 0 ? ad.revenue / ad.conversions : 0;

    return {
      ad,
      ctr,
      conversionRate,
      ecpm,
      averageOrderValue
    };
  }

  // アフィリエイト広告の作成（管理者用）
  async createAffiliateAd(
    adData: Omit<AffiliateAd, 'id' | 'impressions' | 'clicks' | 'conversions' | 'revenue'>
  ): Promise<AffiliateAd> {
    const newAd: AffiliateAd = {
      ...adData,
      id: `aff-${Date.now()}`,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      trackingUrl: this.generateTrackingUrl(adData.program, adData.productId)
    };

    this.affiliateAds.set(newAd.id, newAd);
    return newAd;
  }

  // プログラム別の統計を取得
  async getProgramStats(): Promise<Map<string, {
    totalAds: number;
    totalRevenue: number;
    totalConversions: number;
    averageCommission: number;
  }>> {
    const stats = new Map();

    for (const program of Object.keys(this.AFFILIATE_PROGRAMS)) {
      const programAds = Array.from(this.affiliateAds.values()).filter(
        ad => ad.program === program
      );

      const totalRevenue = programAds.reduce((sum, ad) => sum + ad.revenue, 0);
      const totalConversions = programAds.reduce((sum, ad) => sum + ad.conversions, 0);
      const averageCommission = programAds.length > 0
        ? programAds.reduce((sum, ad) => sum + ad.commission, 0) / programAds.length
        : 0;

      stats.set(program, {
        totalAds: programAds.length,
        totalRevenue,
        totalConversions,
        averageCommission
      });
    }

    return stats;
  }
}

export const affiliateAdsService = AffiliateAdsService.getInstance();