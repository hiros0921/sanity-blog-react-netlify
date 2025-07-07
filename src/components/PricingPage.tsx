import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Building2, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { stripeService, MEMBERSHIP_PLANS } from '../lib/stripe';
import { authService } from '../lib/auth';
import type { MembershipPlan } from '../types/membership';

const PricingPage: React.FC = () => {
  const { t } = useTranslation();
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  const [loading, setLoading] = useState<string | null>(null);
  const currentUser = authService.getCurrentUser();

  const handleSelectPlan = async (plan: MembershipPlan) => {
    if (plan.tier === 'free') {
      // フリープランの場合は何もしない
      return;
    }

    setLoading(plan.id);
    try {
      if (!currentUser) {
        // ログインが必要
        alert('プランを選択するにはログインが必要です');
        return;
      }

      // Stripeチェックアウトセッションを作成
      // const checkoutUrl = await stripeService.createCheckoutSession(plan.id);
      await stripeService.createCheckoutSession(plan.id);
      
      // デモ用: 実際の実装では、Stripeのチェックアウトページにリダイレクト
      // window.location.href = checkoutUrl;
      
      // デモ用: ローカルで会員ティアをアップグレード
      await authService.upgradeMembership(plan.tier);
      alert(`${plan.name}にアップグレードしました！`);
    } catch (error) {
      console.error('Failed to select plan:', error);
      alert('プランの選択に失敗しました');
    } finally {
      setLoading(null);
    }
  };

  const getIconForTier = (tier: string) => {
    switch (tier) {
      case 'basic':
        return <Sparkles className="w-8 h-8" />;
      case 'premium':
        return <Zap className="w-8 h-8" />;
      case 'enterprise':
        return <Building2 className="w-8 h-8" />;
      default:
        return null;
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            最適なプランを選択
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            あなたのニーズに合わせた柔軟な料金プラン
          </p>

          {/* 請求期間の切り替え */}
          <div className="inline-flex items-center bg-white rounded-full shadow-md p-1 mb-8">
            <button
              onClick={() => setBillingInterval('month')}
              className={`px-6 py-2 rounded-full transition-all duration-200 ${
                billingInterval === 'month'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              月額
            </button>
            <button
              onClick={() => setBillingInterval('year')}
              className={`px-6 py-2 rounded-full transition-all duration-200 ${
                billingInterval === 'year'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              年額（20%お得）
            </button>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {MEMBERSHIP_PLANS.map((plan) => {
            const price = billingInterval === 'year' 
              ? Math.floor(plan.price * 12 * 0.8) // 20%割引
              : plan.price;
            
            const isCurrentPlan = currentUser?.membershipTier === plan.tier;
            const isHighlighted = plan.highlighted;

            return (
              <motion.div
                key={plan.id}
                variants={itemVariants}
                className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  isHighlighted ? 'ring-2 ring-purple-600 scale-105' : ''
                }`}
              >
                {isHighlighted && (
                  <div className="absolute top-0 right-0 bg-purple-600 text-white px-4 py-1 rounded-bl-lg text-sm font-bold">
                    おすすめ
                  </div>
                )}

                <div className="p-8">
                  <div className="flex items-center justify-center mb-4 text-purple-600">
                    {getIconForTier(plan.tier)}
                  </div>

                  <h3 className="text-2xl font-bold text-center mb-2">
                    {plan.name}
                  </h3>
                  
                  <p className="text-gray-600 text-center mb-6">
                    {plan.description}
                  </p>

                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold">
                      ¥{price.toLocaleString()}
                    </span>
                    <span className="text-gray-600">
                      /{billingInterval === 'month' ? '月' : '年'}
                    </span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSelectPlan(plan)}
                    disabled={isCurrentPlan || loading !== null}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
                      isCurrentPlan
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : plan.tier === 'free'
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : isHighlighted
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    }`}
                  >
                    {loading === plan.id ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current" />
                    ) : isCurrentPlan ? (
                      '現在のプラン'
                    ) : plan.tier === 'free' ? (
                      '無料で始める'
                    ) : (
                      <>
                        このプランを選択
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* 追加情報 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-bold mb-8">よくある質問</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h3 className="font-semibold mb-2">いつでもキャンセルできますか？</h3>
              <p className="text-gray-600">
                はい、いつでもキャンセル可能です。キャンセル後も、請求期間の終了まではサービスをご利用いただけます。
              </p>
            </div>
            
            <div className="text-left">
              <h3 className="font-semibold mb-2">プランの変更は可能ですか？</h3>
              <p className="text-gray-600">
                はい、いつでもアップグレードまたはダウングレードが可能です。日割り計算で調整されます。
              </p>
            </div>
            
            <div className="text-left">
              <h3 className="font-semibold mb-2">支払い方法は？</h3>
              <p className="text-gray-600">
                クレジットカード（Visa、Mastercard、American Express、JCB）をご利用いただけます。
              </p>
            </div>
            
            <div className="text-left">
              <h3 className="font-semibold mb-2">請求書払いは可能ですか？</h3>
              <p className="text-gray-600">
                エンタープライズプランでは請求書払いに対応しています。詳しくはお問い合わせください。
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingPage;