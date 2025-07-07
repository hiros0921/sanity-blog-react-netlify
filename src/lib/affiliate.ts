// アフィリエイト管理サービス
import type { AffiliateProgram } from '../types/membership';

class AffiliateService {
  private static instance: AffiliateService;
  private affiliatePrograms: Map<string, AffiliateProgram> = new Map();
  
  // デフォルトのコミッション率（%）
  private readonly DEFAULT_COMMISSION_RATE = 20;

  private constructor() {
    this.loadFromStorage();
  }

  static getInstance(): AffiliateService {
    if (!AffiliateService.instance) {
      AffiliateService.instance = new AffiliateService();
    }
    return AffiliateService.instance;
  }

  // ストレージから読み込み
  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('affiliatePrograms');
      if (stored) {
        const programs = JSON.parse(stored);
        Object.entries(programs).forEach(([userId, program]) => {
          this.affiliatePrograms.set(userId, {
            ...program as AffiliateProgram,
            createdAt: new Date((program as any).createdAt)
          });
        });
      }
    } catch (error) {
      console.error('Failed to load affiliate programs:', error);
    }
  }

  // ストレージに保存
  private saveToStorage() {
    try {
      const programs: Record<string, AffiliateProgram> = {};
      this.affiliatePrograms.forEach((program, userId) => {
        programs[userId] = program;
      });
      localStorage.setItem('affiliatePrograms', JSON.stringify(programs));
    } catch (error) {
      console.error('Failed to save affiliate programs:', error);
    }
  }

  // アフィリエイトプログラムの作成または取得
  async getOrCreateProgram(userId: string): Promise<AffiliateProgram> {
    let program = this.affiliatePrograms.get(userId);
    
    if (!program) {
      program = {
        userId,
        affiliateCode: this.generateAffiliateCode(userId),
        commissionRate: this.DEFAULT_COMMISSION_RATE,
        totalEarnings: 0,
        pendingEarnings: 0,
        paidEarnings: 0,
        referralCount: 0,
        conversionCount: 0,
        createdAt: new Date()
      };
      
      this.affiliatePrograms.set(userId, program);
      this.saveToStorage();
    }
    
    return program;
  }

  // アフィリエイトコードの生成
  private generateAffiliateCode(userId: string): string {
    const prefix = 'REF';
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${userId.substring(0, 4).toUpperCase()}-${random}`;
  }

  // リファラルの追跡
  async trackReferral(affiliateCode: string): Promise<boolean> {
    const program = Array.from(this.affiliatePrograms.values())
      .find(p => p.affiliateCode === affiliateCode);
    
    if (program) {
      program.referralCount++;
      this.saveToStorage();
      
      // 30日間のクッキーに保存
      document.cookie = `affiliate_code=${affiliateCode}; max-age=${30 * 24 * 60 * 60}; path=/`;
      
      return true;
    }
    
    return false;
  }

  // コンバージョンの記録
  async recordConversion(amount: number): Promise<void> {
    // クッキーからアフィリエイトコードを取得
    const cookies = document.cookie.split(';');
    const affiliateCookie = cookies.find(c => c.trim().startsWith('affiliate_code='));
    
    if (affiliateCookie) {
      const affiliateCode = affiliateCookie.split('=')[1];
      const program = Array.from(this.affiliatePrograms.values())
        .find(p => p.affiliateCode === affiliateCode);
      
      if (program) {
        program.conversionCount++;
        const commission = amount * (program.commissionRate / 100);
        program.totalEarnings += commission;
        program.pendingEarnings += commission;
        
        this.saveToStorage();
        
        // クッキーをクリア
        document.cookie = 'affiliate_code=; max-age=0; path=/';
      }
    }
  }

  // 支払いの処理
  async processPayout(userId: string, amount: number): Promise<boolean> {
    const program = this.affiliatePrograms.get(userId);
    
    if (program && program.pendingEarnings >= amount) {
      program.pendingEarnings -= amount;
      program.paidEarnings += amount;
      this.saveToStorage();
      return true;
    }
    
    return false;
  }

  // アフィリエイトリンクの生成
  generateAffiliateLink(affiliateCode: string, targetPath: string = '/'): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}${targetPath}?ref=${affiliateCode}`;
  }

  // 統計情報の取得
  async getAffiliateStats(userId: string): Promise<{
    totalReferrals: number;
    conversions: number;
    conversionRate: number;
    totalEarnings: number;
    pendingEarnings: number;
    paidEarnings: number;
    averageOrderValue: number;
  } | null> {
    const program = this.affiliatePrograms.get(userId);
    
    if (!program) return null;
    
    const conversionRate = program.referralCount > 0
      ? (program.conversionCount / program.referralCount) * 100
      : 0;
    
    const averageOrderValue = program.conversionCount > 0
      ? program.totalEarnings / program.conversionCount
      : 0;
    
    return {
      totalReferrals: program.referralCount,
      conversions: program.conversionCount,
      conversionRate,
      totalEarnings: program.totalEarnings,
      pendingEarnings: program.pendingEarnings,
      paidEarnings: program.paidEarnings,
      averageOrderValue
    };
  }

  // トップアフィリエイターの取得
  getTopAffiliates(limit: number = 10): AffiliateProgram[] {
    return Array.from(this.affiliatePrograms.values())
      .sort((a, b) => b.totalEarnings - a.totalEarnings)
      .slice(0, limit);
  }
}

export const affiliateService = AffiliateService.getInstance();