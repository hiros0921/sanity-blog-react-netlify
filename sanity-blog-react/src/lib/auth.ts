// 認証と会員管理サービス
import type { User, MembershipTier } from '../types/membership';

class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;
  private authListeners: Set<(user: User | null) => void> = new Set();

  private constructor() {
    this.loadUserFromStorage();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // ユーザー情報をローカルストレージから読み込む
  private loadUserFromStorage() {
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      }
    } catch (error) {
      console.error('Failed to load user from storage:', error);
    }
  }

  // ユーザー情報をローカルストレージに保存
  private saveUserToStorage(user: User | null) {
    try {
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        localStorage.removeItem('currentUser');
      }
    } catch (error) {
      console.error('Failed to save user to storage:', error);
    }
  }

  // ログイン（デモ用）
  async login(email: string, _password: string): Promise<User> {
    // 実際の実装では、APIサーバーに認証リクエストを送信
    // ここではデモ用のモックデータを返す
    const mockUser: User = {
      id: 'user-1',
      email,
      name: email.split('@')[0],
      membershipTier: 'free',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.setCurrentUser(mockUser);
    return mockUser;
  }

  // ログアウト
  logout() {
    this.setCurrentUser(null);
  }

  // 現在のユーザーを取得
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // 現在のユーザーを設定
  private setCurrentUser(user: User | null) {
    this.currentUser = user;
    this.saveUserToStorage(user);
    
    // リスナーに通知
    this.authListeners.forEach(listener => listener(user));
  }

  // 認証状態の変更を監視
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    this.authListeners.add(callback);
    
    // 現在の状態を即座に通知
    callback(this.currentUser);
    
    // クリーンアップ関数を返す
    return () => {
      this.authListeners.delete(callback);
    };
  }

  // ユーザーが認証されているかチェック
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  // ユーザーが特定のティア以上かチェック
  hasMinimumTier(requiredTier: MembershipTier): boolean {
    if (!this.currentUser) return false;
    
    const tierOrder: Record<MembershipTier, number> = {
      free: 0,
      basic: 1,
      premium: 2,
      enterprise: 3
    };
    
    return tierOrder[this.currentUser.membershipTier] >= tierOrder[requiredTier];
  }

  // 会員ティアをアップグレード（デモ用）
  async upgradeMembership(tier: MembershipTier): Promise<User> {
    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }

    const updatedUser: User = {
      ...this.currentUser,
      membershipTier: tier,
      subscriptionStatus: 'active',
      subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30日後
      updatedAt: new Date()
    };

    this.setCurrentUser(updatedUser);
    return updatedUser;
  }

  // サブスクリプションのキャンセル
  async cancelSubscription(): Promise<void> {
    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }

    const updatedUser: User = {
      ...this.currentUser,
      subscriptionStatus: 'canceled',
      updatedAt: new Date()
    };

    this.setCurrentUser(updatedUser);
  }
}

export const authService = AuthService.getInstance();