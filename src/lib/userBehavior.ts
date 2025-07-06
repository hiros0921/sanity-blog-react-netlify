// ユーザー行動追跡と分析のためのライブラリ
interface UserInteraction {
  postId: string;
  action: 'view' | 'read' | 'bookmark' | 'like' | 'share' | 'comment';
  timestamp: Date;
  duration?: number; // 読書時間（秒）
  scrollDepth?: number; // スクロール深度（％）
  category?: string;
  tags?: string[];
}

interface UserProfile {
  interests: Map<string, number>; // カテゴリごとの興味スコア
  readingHistory: string[]; // 読んだ記事のID
  bookmarks: string[]; // ブックマークした記事のID
  likes: string[]; // いいねした記事のID
  averageReadingTime: number; // 平均読書時間
  preferredReadingTimes: number[]; // 好みの読書時間帯（0-23時）
  engagementScore: number; // エンゲージメントスコア
}

class UserBehaviorTracker {
  private static instance: UserBehaviorTracker;
  private interactions: UserInteraction[] = [];
  private userProfile: UserProfile;

  private constructor() {
    this.loadFromStorage();
    this.userProfile = this.calculateUserProfile();
  }

  static getInstance(): UserBehaviorTracker {
    if (!UserBehaviorTracker.instance) {
      UserBehaviorTracker.instance = new UserBehaviorTracker();
    }
    return UserBehaviorTracker.instance;
  }

  // ユーザーインタラクションを記録
  trackInteraction(interaction: Omit<UserInteraction, 'timestamp'>) {
    const fullInteraction: UserInteraction = {
      ...interaction,
      timestamp: new Date()
    };
    
    this.interactions.push(fullInteraction);
    this.saveToStorage();
    this.updateUserProfile(fullInteraction);
  }

  // 記事閲覧を追跡
  trackArticleView(postId: string, category: string, tags: string[] = []) {
    this.trackInteraction({
      postId,
      action: 'view',
      category,
      tags
    });
  }

  // 読書時間とスクロール深度を追跡
  trackReadingProgress(postId: string, duration: number, scrollDepth: number) {
    this.trackInteraction({
      postId,
      action: 'read',
      duration,
      scrollDepth
    });
  }

  // ユーザープロファイルを計算
  private calculateUserProfile(): UserProfile {
    const interests = new Map<string, number>();
    const readingHistory: string[] = [];
    const bookmarks: string[] = [];
    const likes: string[] = [];
    const readingTimes: number[] = [];
    let totalReadingTime = 0;
    let readingCount = 0;

    this.interactions.forEach(interaction => {
      // カテゴリごとの興味スコアを計算
      if (interaction.category) {
        const currentScore = interests.get(interaction.category) || 0;
        const scoreIncrement = this.getScoreIncrement(interaction.action);
        interests.set(interaction.category, currentScore + scoreIncrement);
      }

      // 各種履歴を更新
      if (interaction.action === 'view' && !readingHistory.includes(interaction.postId)) {
        readingHistory.push(interaction.postId);
      }
      if (interaction.action === 'bookmark' && !bookmarks.includes(interaction.postId)) {
        bookmarks.push(interaction.postId);
      }
      if (interaction.action === 'like' && !likes.includes(interaction.postId)) {
        likes.push(interaction.postId);
      }

      // 読書時間を計算
      if (interaction.action === 'read' && interaction.duration) {
        totalReadingTime += interaction.duration;
        readingCount++;
        readingTimes.push(new Date(interaction.timestamp).getHours());
      }
    });

    const averageReadingTime = readingCount > 0 ? totalReadingTime / readingCount : 0;
    const engagementScore = this.calculateEngagementScore(bookmarks.length, likes.length, readingHistory.length);

    return {
      interests,
      readingHistory,
      bookmarks,
      likes,
      averageReadingTime,
      preferredReadingTimes: this.calculatePreferredReadingTimes(readingTimes),
      engagementScore
    };
  }

  // アクションごとのスコア重み付け
  private getScoreIncrement(action: UserInteraction['action']): number {
    const scores = {
      view: 1,
      read: 3,
      bookmark: 5,
      like: 4,
      share: 6,
      comment: 7
    };
    return scores[action];
  }

  // エンゲージメントスコアを計算
  private calculateEngagementScore(bookmarksCount: number, likesCount: number, viewsCount: number): number {
    const score = (bookmarksCount * 5 + likesCount * 3 + viewsCount) / Math.max(viewsCount, 1);
    return Math.min(score * 10, 100); // 0-100のスコアに正規化
  }

  // 好みの読書時間帯を計算
  private calculatePreferredReadingTimes(times: number[]): number[] {
    const timeFrequency = new Map<number, number>();
    times.forEach(hour => {
      timeFrequency.set(hour, (timeFrequency.get(hour) || 0) + 1);
    });

    // 頻度の高い上位3時間帯を返す
    return Array.from(timeFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([hour]) => hour);
  }

  // ユーザープロファイルを更新
  private updateUserProfile(_interaction: UserInteraction) {
    this.userProfile = this.calculateUserProfile();
  }

  // ユーザープロファイルを取得
  getUserProfile(): UserProfile {
    return this.userProfile;
  }

  // ユーザーの興味カテゴリを取得（スコア順）
  getTopInterests(limit: number = 5): Array<[string, number]> {
    return Array.from(this.userProfile.interests.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);
  }

  // 特定のカテゴリへの興味スコアを取得
  getInterestScore(category: string): number {
    return this.userProfile.interests.get(category) || 0;
  }

  // ストレージに保存
  private saveToStorage() {
    try {
      localStorage.setItem('userBehavior', JSON.stringify(this.interactions));
    } catch (error) {
      console.error('Failed to save user behavior:', error);
    }
  }

  // ストレージから読み込み
  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('userBehavior');
      if (stored) {
        this.interactions = JSON.parse(stored).map((i: any) => ({
          ...i,
          timestamp: new Date(i.timestamp)
        }));
      }
    } catch (error) {
      console.error('Failed to load user behavior:', error);
      this.interactions = [];
    }
  }

  // データをクリア（プライバシー設定用）
  clearUserData() {
    this.interactions = [];
    this.userProfile = this.calculateUserProfile();
    localStorage.removeItem('userBehavior');
  }
}

export const userBehaviorTracker = UserBehaviorTracker.getInstance();
export type { UserProfile, UserInteraction };