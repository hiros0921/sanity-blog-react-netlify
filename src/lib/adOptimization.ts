// 広告配置最適化とA/Bテスト管理サービス
import type { AdPlacement, AdABTest, AdType, AdPosition } from '../types/advertising';

class AdOptimizationService {
  private static instance: AdOptimizationService;
  private placements: Map<string, AdPlacement> = new Map();
  private abTests: Map<string, AdABTest> = new Map();
  
  private constructor() {
    this.initializeMockData();
  }

  static getInstance(): AdOptimizationService {
    if (!AdOptimizationService.instance) {
      AdOptimizationService.instance = new AdOptimizationService();
    }
    return AdOptimizationService.instance;
  }

  // モックデータの初期化
  private initializeMockData() {
    // 広告配置設定
    const mockPlacements: AdPlacement[] = [
      {
        id: 'placement-001',
        pageType: 'blog-post',
        position: 'in-content',
        adType: 'sponsored',
        adIds: ['sp-001', 'sp-002'],
        priority: 1,
        conditions: {
          minScrollDepth: 30,
          delaySeconds: 5,
          maxPerSession: 2,
          deviceType: ['mobile', 'tablet', 'desktop']
        },
        isActive: true
      },
      {
        id: 'placement-002',
        pageType: 'blog-post',
        position: 'sidebar',
        adType: 'affiliate',
        adIds: ['aff-001', 'aff-003'],
        priority: 2,
        conditions: {
          deviceType: ['desktop']
        },
        isActive: true
      },
      {
        id: 'placement-003',
        pageType: 'home',
        position: 'header',
        adType: 'display',
        adIds: ['adsense-001'],
        priority: 1,
        conditions: {
          maxPerSession: 1
        },
        isActive: true
      }
    ];

    // A/Bテスト設定
    const mockABTests: AdABTest[] = [
      {
        id: 'test-001',
        name: 'サイドバー広告位置テスト',
        status: 'running',
        variants: [
          {
            id: 'variant-a',
            name: '上部配置',
            adPlacementId: 'placement-002',
            weight: 50,
            performance: {
              impressions: 5000,
              clicks: 250,
              revenue: 12500
            }
          },
          {
            id: 'variant-b',
            name: '中央配置',
            adPlacementId: 'placement-002-alt',
            weight: 50,
            performance: {
              impressions: 5000,
              clicks: 320,
              revenue: 15600
            }
          }
        ],
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-31')
      }
    ];

    mockPlacements.forEach(placement => {
      this.placements.set(placement.id, placement);
    });

    mockABTests.forEach(test => {
      this.abTests.set(test.id, test);
    });
  }

  // ページタイプに応じた広告配置を取得
  async getPlacementsForPage(
    pageType: AdPlacement['pageType'],
    userContext?: {
      deviceType: 'mobile' | 'tablet' | 'desktop';
      sessionAdCount: number;
      scrollDepth?: number;
    }
  ): Promise<AdPlacement[]> {
    const allPlacements = Array.from(this.placements.values())
      .filter(p => p.isActive && p.pageType === pageType)
      .sort((a, b) => a.priority - b.priority);

    if (!userContext) return allPlacements;

    // 条件に基づくフィルタリング
    return allPlacements.filter(placement => {
      const conditions = placement.conditions;
      if (!conditions) return true;

      // デバイスタイプチェック
      if (conditions.deviceType && !conditions.deviceType.includes(userContext.deviceType)) {
        return false;
      }

      // セッションあたりの最大表示回数チェック
      if (conditions.maxPerSession && userContext.sessionAdCount >= conditions.maxPerSession) {
        return false;
      }

      // スクロール深度チェック
      if (conditions.minScrollDepth && userContext.scrollDepth !== undefined) {
        return userContext.scrollDepth >= conditions.minScrollDepth;
      }

      return true;
    });
  }

  // A/Bテストのバリアントを決定
  async getABTestVariant(testId: string): Promise<string | null> {
    const test = this.abTests.get(testId);
    if (!test || test.status !== 'running') return null;

    const now = new Date();
    if (test.endDate && now > test.endDate) {
      // テスト終了
      await this.completeABTest(testId);
      return null;
    }

    // 重み付けに基づいてランダムにバリアントを選択
    const random = Math.random() * 100;
    let accumWeight = 0;

    for (const variant of test.variants) {
      accumWeight += variant.weight;
      if (random <= accumWeight) {
        return variant.id;
      }
    }

    return test.variants[0].id;
  }

  // A/Bテストの結果を記録
  async recordABTestImpression(testId: string, variantId: string): Promise<void> {
    const test = this.abTests.get(testId);
    if (!test) return;

    const variant = test.variants.find(v => v.id === variantId);
    if (variant && variant.performance) {
      variant.performance.impressions++;
      this.saveABTest(test);
    }
  }

  async recordABTestClick(testId: string, variantId: string): Promise<void> {
    const test = this.abTests.get(testId);
    if (!test) return;

    const variant = test.variants.find(v => v.id === variantId);
    if (variant && variant.performance) {
      variant.performance.clicks++;
      this.saveABTest(test);
    }
  }

  async recordABTestRevenue(testId: string, variantId: string, revenue: number): Promise<void> {
    const test = this.abTests.get(testId);
    if (!test) return;

    const variant = test.variants.find(v => v.id === variantId);
    if (variant && variant.performance) {
      variant.performance.revenue += revenue;
      this.saveABTest(test);
    }
  }

  // A/Bテストを完了
  private async completeABTest(testId: string): Promise<void> {
    const test = this.abTests.get(testId);
    if (!test) return;

    // 勝者を決定
    let winner = test.variants[0];
    let bestScore = 0;

    test.variants.forEach(variant => {
      if (variant.performance) {
        const ctr = variant.performance.impressions > 0
          ? (variant.performance.clicks / variant.performance.impressions) * 100
          : 0;
        const rpm = variant.performance.impressions > 0
          ? (variant.performance.revenue / variant.performance.impressions) * 1000
          : 0;
        
        // スコア = CTR × 0.3 + RPM × 0.7
        const score = (ctr * 0.3) + (rpm * 0.7);
        
        if (score > bestScore) {
          bestScore = score;
          winner = variant;
        }
      }
    });

    test.status = 'completed';
    test.winner = winner.id;
    this.saveABTest(test);
  }

  // 広告配置の保存
  private savePlacement(placement: AdPlacement): void {
    this.placements.set(placement.id, placement);
    // 実際の実装では、localStorage or API
  }

  // A/Bテストの保存
  private saveABTest(test: AdABTest): void {
    this.abTests.set(test.id, test);
    // 実際の実装では、localStorage or API
  }

  // 最適な広告サイズを推奨
  getRecommendedAdSize(
    position: AdPosition,
    deviceType: 'mobile' | 'tablet' | 'desktop'
  ): string {
    const recommendations = {
      header: {
        mobile: '320x50',
        tablet: '728x90',
        desktop: '728x90'
      },
      sidebar: {
        mobile: '300x250',
        tablet: '300x250',
        desktop: '336x280'
      },
      'in-content': {
        mobile: 'responsive',
        tablet: 'responsive',
        desktop: 'responsive'
      },
      footer: {
        mobile: '320x50',
        tablet: '728x90',
        desktop: '728x90'
      },
      floating: {
        mobile: '320x50',
        tablet: '300x250',
        desktop: '300x250'
      }
    };

    return recommendations[position]?.[deviceType] || 'responsive';
  }

  // パフォーマンスに基づく自動最適化
  async optimizePlacements(): Promise<{
    recommendations: string[];
    automatedChanges: string[];
  }> {
    const recommendations: string[] = [];
    const automatedChanges: string[] = [];

    // すべての配置を分析
    for (const placement of this.placements.values()) {
      // パフォーマンスが低い配置を特定
      // 実際の実装では、パフォーマンスデータを分析
      
      // 推奨事項の生成
      if (placement.position === 'floating' && !placement.conditions?.delaySeconds) {
        recommendations.push(
          `配置 ${placement.id}: フローティング広告に遅延表示を設定することを推奨します`
        );
      }

      if (!placement.conditions?.maxPerSession) {
        recommendations.push(
          `配置 ${placement.id}: セッションあたりの最大表示回数を設定することを推奨します`
        );
      }
    }

    // A/Bテストの自動開始
    const placementsWithoutTests = Array.from(this.placements.values())
      .filter(p => p.isActive && !this.hasActiveABTest(p.id));

    if (placementsWithoutTests.length > 0) {
      recommendations.push(
        `${placementsWithoutTests.length}個の配置でA/Bテストを開始することを推奨します`
      );
    }

    return { recommendations, automatedChanges };
  }

  // アクティブなA/Bテストがあるかチェック
  private hasActiveABTest(placementId: string): boolean {
    return Array.from(this.abTests.values()).some(
      test => test.status === 'running' && 
      test.variants.some(v => v.adPlacementId === placementId)
    );
  }

  // A/Bテストの作成
  async createABTest(
    name: string,
    placementId: string,
    variants: Array<{
      name: string;
      changes: Partial<AdPlacement>;
      weight: number;
    }>
  ): Promise<AdABTest> {
    const newTest: AdABTest = {
      id: `test-${Date.now()}`,
      name,
      status: 'draft',
      variants: variants.map((v, index) => ({
        id: `variant-${index}`,
        name: v.name,
        adPlacementId: placementId,
        weight: v.weight
      })),
      startDate: new Date()
    };

    this.abTests.set(newTest.id, newTest);
    return newTest;
  }

  // パフォーマンスレポートの取得
  async getOptimizationReport(): Promise<{
    totalPlacements: number;
    activePlacements: number;
    runningTests: number;
    completedTests: number;
    topPerformingPlacements: AdPlacement[];
    lowPerformingPlacements: AdPlacement[];
  }> {
    const allPlacements = Array.from(this.placements.values());
    const allTests = Array.from(this.abTests.values());

    return {
      totalPlacements: allPlacements.length,
      activePlacements: allPlacements.filter(p => p.isActive).length,
      runningTests: allTests.filter(t => t.status === 'running').length,
      completedTests: allTests.filter(t => t.status === 'completed').length,
      topPerformingPlacements: allPlacements.slice(0, 3), // モック
      lowPerformingPlacements: allPlacements.slice(-2) // モック
    };
  }
}

export const adOptimizationService = AdOptimizationService.getInstance();