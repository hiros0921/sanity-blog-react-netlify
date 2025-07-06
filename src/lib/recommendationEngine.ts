// AI駆動の記事推薦エンジン
import type { BlogPost } from '../types/blog';
import { userBehaviorTracker } from './userBehavior';

interface RecommendationScore {
  postId: string;
  score: number;
  reasons: string[];
}

interface RecommendationConfig {
  maxRecommendations: number;
  includeReasons: boolean;
  diversityFactor: number; // 0-1: 推薦の多様性
  personalizedWeight: number; // 0-1: パーソナライゼーションの重み
}

class RecommendationEngine {
  private static instance: RecommendationEngine;
  
  private readonly defaultConfig: RecommendationConfig = {
    maxRecommendations: 6,
    includeReasons: true,
    diversityFactor: 0.3,
    personalizedWeight: 0.7
  };

  private constructor() {}

  static getInstance(): RecommendationEngine {
    if (!RecommendationEngine.instance) {
      RecommendationEngine.instance = new RecommendationEngine();
    }
    return RecommendationEngine.instance;
  }

  // メイン推薦関数
  async getRecommendations(
    currentPost: BlogPost | null,
    allPosts: BlogPost[],
    config: Partial<RecommendationConfig> = {}
  ): Promise<BlogPost[]> {
    const finalConfig = { ...this.defaultConfig, ...config };
    const userProfile = userBehaviorTracker.getUserProfile();
    
    // 現在の記事を除外
    const candidatePosts = currentPost 
      ? allPosts.filter(post => post._id !== currentPost._id)
      : allPosts;

    // 各記事のスコアを計算
    const scores = candidatePosts.map(post => 
      this.calculateRecommendationScore(post, currentPost, userProfile, finalConfig)
    );

    // スコア順にソートし、多様性を考慮して選択
    const recommendations = this.selectDiverseRecommendations(
      scores,
      candidatePosts,
      finalConfig
    );

    return recommendations;
  }

  // 記事ごとの推薦スコアを計算
  private calculateRecommendationScore(
    post: BlogPost,
    currentPost: BlogPost | null,
    userProfile: ReturnType<typeof userBehaviorTracker.getUserProfile>,
    config: RecommendationConfig
  ): RecommendationScore {
    let score = 0;
    const reasons: string[] = [];

    // 1. カテゴリベースのスコア
    if (post.categories) {
      const categoryScore = this.calculateCategoryScore(post.categories, userProfile);
      score += categoryScore * 0.3;
      if (categoryScore > 0) {
        reasons.push('興味のあるカテゴリ');
      }
    }

    // 2. コンテンツの類似性スコア（現在の記事がある場合）
    if (currentPost) {
      const similarityScore = this.calculateContentSimilarity(post, currentPost);
      score += similarityScore * 0.25;
      if (similarityScore > 0.5) {
        reasons.push('関連するコンテンツ');
      }
    }

    // 3. 読書履歴に基づくスコア
    const historyScore = this.calculateHistoryBasedScore(post, userProfile);
    score += historyScore * 0.2;
    if (historyScore > 0.5) {
      reasons.push('読書履歴に基づく推薦');
    }

    // 4. 時間的関連性スコア
    const timeScore = this.calculateTimeRelevanceScore(post);
    score += timeScore * 0.15;
    if (timeScore > 0.7) {
      reasons.push('最新のコンテンツ');
    }

    // 5. エンゲージメントスコア
    const engagementScore = this.calculateEngagementScore(post, userProfile);
    score += engagementScore * 0.1;
    if (engagementScore > 0.6) {
      reasons.push('人気のコンテンツ');
    }

    // パーソナライゼーションの重み付けを適用
    score = score * config.personalizedWeight + Math.random() * (1 - config.personalizedWeight);

    return {
      postId: post._id,
      score,
      reasons
    };
  }

  // カテゴリベースのスコア計算
  private calculateCategoryScore(
    postCategories: Array<{ title: string }>,
    userProfile: ReturnType<typeof userBehaviorTracker.getUserProfile>
  ): number {
    if (!postCategories || postCategories.length === 0) return 0;

    let totalScore = 0;
    postCategories.forEach(category => {
      const interestScore = userBehaviorTracker.getInterestScore(category.title);
      totalScore += interestScore;
    });

    // 正規化（0-1の範囲に）
    const maxPossibleScore = Math.max(...Array.from(userProfile.interests.values())) || 1;
    return Math.min(totalScore / maxPossibleScore, 1);
  }

  // コンテンツの類似性を計算
  private calculateContentSimilarity(post1: BlogPost, post2: BlogPost): number {
    let similarity = 0;

    // カテゴリの重複をチェック
    if (post1.categories && post2.categories) {
      const categories1 = new Set(post1.categories.map(c => c.title));
      const categories2 = new Set(post2.categories.map(c => c.title));
      const intersection = new Set([...categories1].filter(x => categories2.has(x)));
      
      if (categories1.size > 0 && categories2.size > 0) {
        similarity += (intersection.size / Math.min(categories1.size, categories2.size)) * 0.5;
      }
    }

    // タイトルの類似性（簡易的なキーワードマッチング）
    const titleSimilarity = this.calculateTextSimilarity(post1.title, post2.title);
    similarity += titleSimilarity * 0.3;

    // 著者の一致
    if (post1.author && post2.author && post1.author._id === post2.author._id) {
      similarity += 0.2;
    }

    return Math.min(similarity, 1);
  }

  // テキストの類似性を計算（簡易版）
  private calculateTextSimilarity(text1: string, text2: string): number {
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return union.size > 0 ? intersection.size / union.size : 0;
  }

  // 読書履歴に基づくスコア
  private calculateHistoryBasedScore(
    post: BlogPost,
    userProfile: ReturnType<typeof userBehaviorTracker.getUserProfile>
  ): number {
    // すでに読んだ記事は除外
    if (userProfile.readingHistory.includes(post._id)) {
      return -1;
    }

    // ブックマークや「いいね」した記事と類似しているかチェック
    let score = 0;
    const interactedPosts = [...userProfile.bookmarks, ...userProfile.likes];
    
    if (interactedPosts.length === 0) return 0;

    // ここでは簡易的にカテゴリの一致度を見る
    // 実際のアプリケーションでは、より高度な類似性計算を行う
    return score;
  }

  // 時間的関連性スコア
  private calculateTimeRelevanceScore(post: BlogPost): number {
    const now = new Date();
    const publishDate = new Date(post._createdAt);
    const daysSincePublish = (now.getTime() - publishDate.getTime()) / (1000 * 60 * 60 * 24);
    
    // 新しい記事ほど高スコア（指数関数的減衰）
    return Math.exp(-daysSincePublish / 30); // 30日で約37%に減衰
  }

  // エンゲージメントスコア（仮想的な人気度）
  private calculateEngagementScore(
    _post: BlogPost,
    _userProfile: ReturnType<typeof userBehaviorTracker.getUserProfile>
  ): number {
    // 実際のアプリケーションでは、実際の閲覧数、いいね数などを使用
    // ここではランダムな値を返す（デモ用）
    return Math.random() * 0.5 + 0.3;
  }

  // 多様性を考慮した推薦選択
  private selectDiverseRecommendations(
    scores: RecommendationScore[],
    posts: BlogPost[],
    config: RecommendationConfig
  ): BlogPost[] {
    // スコア順にソート
    const sortedScores = scores
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score);

    const selected: BlogPost[] = [];
    const selectedCategories = new Set<string>();

    for (const scoreItem of sortedScores) {
      if (selected.length >= config.maxRecommendations) break;

      const post = posts.find(p => p._id === scoreItem.postId);
      if (!post) continue;

      // 多様性チェック
      const postCategories = post.categories?.map(c => c.title) || [];
      const hasNewCategory = postCategories.some(cat => !selectedCategories.has(cat));
      
      // 多様性を考慮して選択
      const diversityThreshold = Math.random() < config.diversityFactor;
      if (hasNewCategory || diversityThreshold || selected.length === 0) {
        selected.push(post);
        postCategories.forEach(cat => selectedCategories.add(cat));
      }
    }

    // 足りない場合は、スコア順に追加
    if (selected.length < config.maxRecommendations) {
      for (const scoreItem of sortedScores) {
        if (selected.length >= config.maxRecommendations) break;
        
        const post = posts.find(p => p._id === scoreItem.postId);
        if (post && !selected.some(p => p._id === post._id)) {
          selected.push(post);
        }
      }
    }

    return selected;
  }

  // パーソナライズされたフィードを生成
  async getPersonalizedFeed(
    allPosts: BlogPost[],
    limit: number = 10
  ): Promise<BlogPost[]> {
    const userProfile = userBehaviorTracker.getUserProfile();
    const topInterests = userBehaviorTracker.getTopInterests();

    // ユーザーの興味に基づいて記事をスコアリング
    const scoredPosts = allPosts.map(post => {
      let score = 0;
      
      // カテゴリマッチング
      if (post.categories) {
        post.categories.forEach(category => {
          const interest = topInterests.find(([cat]) => cat === category.title);
          if (interest) {
            score += interest[1] * 0.5;
          }
        });
      }

      // 新しさも考慮
      score += this.calculateTimeRelevanceScore(post) * 0.3;

      // 読んでいない記事を優先
      if (!userProfile.readingHistory.includes(post._id)) {
        score += 0.2;
      }

      return { post, score };
    });

    // スコア順にソートして返す
    return scoredPosts
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.post);
  }
}

export const recommendationEngine = RecommendationEngine.getInstance();
export type { RecommendationScore, RecommendationConfig };