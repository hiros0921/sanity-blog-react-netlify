// クーポン管理サービス
import type { Coupon, MembershipTier } from '../types/membership';

class CouponService {
  private static instance: CouponService;
  private coupons: Map<string, Coupon> = new Map();

  private constructor() {
    this.initializeMockCoupons();
  }

  static getInstance(): CouponService {
    if (!CouponService.instance) {
      CouponService.instance = new CouponService();
    }
    return CouponService.instance;
  }

  // モックデータの初期化
  private initializeMockCoupons() {
    const mockCoupons: Coupon[] = [
      {
        id: '1',
        code: 'WELCOME20',
        discountType: 'percentage',
        discountAmount: 20,
        validFrom: new Date('2025-01-01'),
        validUntil: new Date('2025-12-31'),
        usageLimit: 100,
        usageCount: 45,
        applicableTiers: ['basic', 'premium'],
        isActive: true
      },
      {
        id: '2',
        code: 'SAVE500',
        discountType: 'fixed',
        discountAmount: 500,
        validFrom: new Date('2025-01-01'),
        validUntil: new Date('2025-06-30'),
        usageLimit: 50,
        usageCount: 12,
        applicableTiers: ['premium', 'enterprise'],
        isActive: true
      },
      {
        id: '3',
        code: 'NEWYEAR2025',
        discountType: 'percentage',
        discountAmount: 30,
        validFrom: new Date('2025-01-01'),
        validUntil: new Date('2025-01-31'),
        usageCount: 78,
        applicableTiers: ['basic', 'premium', 'enterprise'],
        isActive: false
      }
    ];

    mockCoupons.forEach(coupon => {
      this.coupons.set(coupon.code, coupon);
    });
  }

  // クーポンコードの検証
  async validateCoupon(code: string, tier: MembershipTier): Promise<{
    valid: boolean;
    coupon?: Coupon;
    message?: string;
  }> {
    const coupon = this.coupons.get(code.toUpperCase());

    if (!coupon) {
      return {
        valid: false,
        message: '無効なクーポンコードです'
      };
    }

    if (!coupon.isActive) {
      return {
        valid: false,
        message: 'このクーポンは現在利用できません'
      };
    }

    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) {
      return {
        valid: false,
        message: 'このクーポンの有効期限が切れています'
      };
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return {
        valid: false,
        message: 'このクーポンの利用上限に達しています'
      };
    }

    if (!coupon.applicableTiers.includes(tier)) {
      return {
        valid: false,
        message: 'このクーポンは選択されたプランには適用できません'
      };
    }

    return {
      valid: true,
      coupon
    };
  }

  // 割引額の計算
  calculateDiscount(originalPrice: number, coupon: Coupon): number {
    if (coupon.discountType === 'percentage') {
      return Math.floor(originalPrice * (coupon.discountAmount / 100));
    } else {
      return Math.min(coupon.discountAmount, originalPrice);
    }
  }

  // クーポンの使用
  async useCoupon(code: string): Promise<boolean> {
    const coupon = this.coupons.get(code.toUpperCase());
    if (coupon) {
      coupon.usageCount++;
      return true;
    }
    return false;
  }

  // 利用可能なクーポンの取得
  getAvailableCoupons(): Coupon[] {
    const now = new Date();
    return Array.from(this.coupons.values()).filter(coupon => 
      coupon.isActive &&
      now >= coupon.validFrom &&
      now <= coupon.validUntil &&
      (!coupon.usageLimit || coupon.usageCount < coupon.usageLimit)
    );
  }

  // クーポンの作成（管理者用）
  async createCoupon(couponData: Omit<Coupon, 'id' | 'usageCount'>): Promise<Coupon> {
    const newCoupon: Coupon = {
      ...couponData,
      id: Date.now().toString(),
      usageCount: 0
    };

    this.coupons.set(newCoupon.code, newCoupon);
    return newCoupon;
  }
}

export const couponService = CouponService.getInstance();