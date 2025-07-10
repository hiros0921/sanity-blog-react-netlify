import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Copy, Check, Plus, Tag, Calendar, Percent, DollarSign } from 'lucide-react';
import { couponService } from '../lib/coupon';
import type { Coupon } from '../types/membership';

const CouponManager: React.FC = () => {
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCoupons = async () => {
      setLoading(true);
      try {
        const coupons = couponService.getAvailableCoupons();
        setAvailableCoupons(coupons);
      } catch (error) {
        console.error('Failed to load coupons:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCoupons();
  }, []);

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const formatDiscountText = (coupon: Coupon) => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountAmount}%OFF`;
    } else {
      return `¥${coupon.discountAmount}OFF`;
    }
  };

  const formatValidPeriod = (coupon: Coupon) => {
    const start = new Date(coupon.validFrom).toLocaleDateString('ja-JP');
    const end = new Date(coupon.validUntil).toLocaleDateString('ja-JP');
    return `${start} ~ ${end}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center">
            <Gift className="w-6 h-6 mr-2 text-purple-600" />
            利用可能なクーポン
          </h2>
          <span className="text-sm text-gray-600">
            {availableCoupons.length}件のクーポン
          </span>
        </div>

        {availableCoupons.length === 0 ? (
          <div className="text-center py-12">
            <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">現在利用可能なクーポンはありません</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {availableCoupons.map((coupon) => (
              <motion.div
                key={coupon.id}
                variants={itemVariants}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Tag className="w-5 h-5 text-purple-600 mr-2" />
                      <h3 className="font-bold text-lg">{formatDiscountText(coupon)}</h3>
                    </div>
                    
                    <div className="flex items-center mb-4">
                      <code className="bg-gray-100 px-3 py-1 rounded text-lg font-mono">
                        {coupon.code}
                      </code>
                      <button
                        onClick={() => copyToClipboard(coupon.code)}
                        className="ml-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {copiedCode === coupon.code ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <Copy className="w-5 h-5 text-gray-600" />
                        )}
                      </button>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>有効期間: {formatValidPeriod(coupon)}</span>
                      </div>
                      
                      {coupon.usageLimit && (
                        <div className="flex items-center">
                          <span className="mr-2">残り使用可能回数:</span>
                          <span className="font-medium text-purple-600">
                            {coupon.usageLimit - coupon.usageCount}回
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center">
                        <span className="mr-2">対象プラン:</span>
                        <div className="flex gap-1">
                          {coupon.applicableTiers.map((tier) => (
                            <span
                              key={tier}
                              className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium"
                            >
                              {tier.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="ml-6">
                    {coupon.discountType === 'percentage' ? (
                      <Percent className="w-12 h-12 text-purple-200" />
                    ) : (
                      <DollarSign className="w-12 h-12 text-purple-200" />
                    )}
                  </div>
                </div>

                {/* 使用状況バー */}
                {coupon.usageLimit && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${(coupon.usageCount / coupon.usageLimit) * 100}%`
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {coupon.usageCount}/{coupon.usageLimit} 使用済み
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* クーポン入力フォーム */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h3 className="text-lg font-bold mb-4">クーポンコードを入力</h3>
        
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="クーポンコードを入力"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
            適用
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mt-2">
          プラン購入時にクーポンコードを入力すると割引が適用されます
        </p>
      </motion.div>

      {/* クーポン獲得方法 */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6"
      >
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <Plus className="w-5 h-5 mr-2 text-purple-600" />
          クーポンを獲得する方法
        </h3>
        
        <ul className="space-y-2 text-sm">
          <li className="flex items-start">
            <span className="text-purple-600 mr-2">•</span>
            <span>メールマガジンに登録して限定クーポンを受け取る</span>
          </li>
          <li className="flex items-start">
            <span className="text-purple-600 mr-2">•</span>
            <span>友達を紹介してボーナスクーポンを獲得</span>
          </li>
          <li className="flex items-start">
            <span className="text-purple-600 mr-2">•</span>
            <span>季節のキャンペーンやイベントに参加</span>
          </li>
          <li className="flex items-start">
            <span className="text-purple-600 mr-2">•</span>
            <span>長期利用者向けの特別オファーをチェック</span>
          </li>
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default CouponManager;