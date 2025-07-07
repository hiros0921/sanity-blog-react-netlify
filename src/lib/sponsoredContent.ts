// スポンサード記事管理サービス
import type { SponsoredPost } from '../types/advertising';

class SponsoredContentService {
  private static instance: SponsoredContentService;
  private sponsoredPosts: Map<string, SponsoredPost> = new Map();

  private constructor() {
    this.initializeMockData();
  }

  static getInstance(): SponsoredContentService {
    if (!SponsoredContentService.instance) {
      SponsoredContentService.instance = new SponsoredContentService();
    }
    return SponsoredContentService.instance;
  }

  // モックデータの初期化
  private initializeMockData() {
    const mockPosts: SponsoredPost[] = [
      {
        id: 'sp-001',
        title: '【PR】最新のAI開発ツールで生産性を10倍に',
        content: `AIを活用した開発ツールが、エンジニアの生産性を劇的に向上させています。
        本記事では、実際の導入事例とともに、その効果を詳しく解説します。`,
        excerpt: 'AIツールで開発効率を大幅改善。導入企業の93%が生産性向上を実感。',
        sponsor: {
          name: 'TechCorp Solutions',
          logo: '/sponsors/techcorp-logo.png',
          url: 'https://example.com/techcorp'
        },
        cta: {
          text: '無料トライアルを始める',
          url: 'https://example.com/techcorp/trial'
        },
        publishedAt: new Date('2025-01-01'),
        expiresAt: new Date('2025-12-31'),
        impressions: 15420,
        clicks: 892,
        isActive: true,
        tags: ['AI', '開発ツール', 'プログラミング'],
        imageUrl: '/images/ai-tools-banner.jpg'
      },
      {
        id: 'sp-002',
        title: '【PR】クラウドセキュリティの新標準 - SecureCloud Pro',
        content: `企業のクラウド移行が加速する中、セキュリティの重要性はますます高まっています。
        SecureCloud Proは、最新の脅威に対応した包括的なセキュリティソリューションです。`,
        excerpt: '次世代クラウドセキュリティで、あなたのビジネスを守る。',
        sponsor: {
          name: 'SecureCloud Inc.',
          logo: '/sponsors/securecloud-logo.png',
          url: 'https://example.com/securecloud'
        },
        cta: {
          text: 'セキュリティ診断を受ける',
          url: 'https://example.com/securecloud/assessment'
        },
        publishedAt: new Date('2025-01-05'),
        impressions: 8234,
        clicks: 423,
        isActive: true,
        tags: ['セキュリティ', 'クラウド', 'エンタープライズ'],
        imageUrl: '/images/security-banner.jpg'
      }
    ];

    mockPosts.forEach(post => {
      this.sponsoredPosts.set(post.id, post);
    });
  }

  // アクティブなスポンサード記事を取得
  async getActiveSponsoredPosts(): Promise<SponsoredPost[]> {
    const now = new Date();
    return Array.from(this.sponsoredPosts.values()).filter(post => 
      post.isActive && 
      (!post.expiresAt || post.expiresAt > now)
    );
  }

  // 特定のタグに関連するスポンサード記事を取得
  async getSponsoredPostsByTags(tags: string[]): Promise<SponsoredPost[]> {
    const activePosts = await this.getActiveSponsoredPosts();
    return activePosts.filter(post =>
      post.tags.some(tag => tags.includes(tag))
    );
  }

  // インプレッションをトラッキング
  async trackImpression(postId: string): Promise<void> {
    const post = this.sponsoredPosts.get(postId);
    if (post) {
      post.impressions++;
      this.saveSponsoredPost(post);
      
      // 実際の実装では、バックエンドAPIに送信
      console.log(`Tracked impression for sponsored post: ${postId}`);
    }
  }

  // クリックをトラッキング
  async trackClick(postId: string): Promise<void> {
    const post = this.sponsoredPosts.get(postId);
    if (post) {
      post.clicks++;
      this.saveSponsoredPost(post);
      
      // 実際の実装では、バックエンドAPIに送信
      console.log(`Tracked click for sponsored post: ${postId}`);
    }
  }

  // スポンサード記事の保存
  private saveSponsoredPost(post: SponsoredPost): void {
    this.sponsoredPosts.set(post.id, post);
    // 実際の実装では、localStorage or API
  }

  // CTR（クリック率）の計算
  calculateCTR(post: SponsoredPost): number {
    if (post.impressions === 0) return 0;
    return (post.clicks / post.impressions) * 100;
  }

  // パフォーマンスレポートの生成
  async generatePerformanceReport(postId: string): Promise<{
    post: SponsoredPost;
    ctr: number;
    remainingDays?: number;
    performanceStatus: 'excellent' | 'good' | 'average' | 'poor';
  } | null> {
    const post = this.sponsoredPosts.get(postId);
    if (!post) return null;

    const ctr = this.calculateCTR(post);
    const remainingDays = post.expiresAt
      ? Math.ceil((post.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : undefined;

    // パフォーマンス評価
    let performanceStatus: 'excellent' | 'good' | 'average' | 'poor';
    if (ctr >= 10) performanceStatus = 'excellent';
    else if (ctr >= 5) performanceStatus = 'good';
    else if (ctr >= 2) performanceStatus = 'average';
    else performanceStatus = 'poor';

    return {
      post,
      ctr,
      remainingDays,
      performanceStatus
    };
  }

  // スポンサード記事の作成（管理者用）
  async createSponsoredPost(
    postData: Omit<SponsoredPost, 'id' | 'impressions' | 'clicks'>
  ): Promise<SponsoredPost> {
    const newPost: SponsoredPost = {
      ...postData,
      id: `sp-${Date.now()}`,
      impressions: 0,
      clicks: 0
    };

    this.sponsoredPosts.set(newPost.id, newPost);
    return newPost;
  }

  // スポンサード記事の更新（管理者用）
  async updateSponsoredPost(
    postId: string,
    updates: Partial<SponsoredPost>
  ): Promise<SponsoredPost | null> {
    const post = this.sponsoredPosts.get(postId);
    if (!post) return null;

    const updatedPost = { ...post, ...updates };
    this.sponsoredPosts.set(postId, updatedPost);
    return updatedPost;
  }
}

export const sponsoredContentService = SponsoredContentService.getInstance();