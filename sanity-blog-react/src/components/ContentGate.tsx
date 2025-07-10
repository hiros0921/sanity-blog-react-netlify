import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Crown, Sparkles, ArrowRight } from 'lucide-react';
import { authService } from '../lib/auth';
import { stripeService } from '../lib/stripe';
import type { MembershipTier } from '../types/membership';
import PremiumBadge from './PremiumBadge';

interface ContentGateProps {
  requiredTier: MembershipTier;
  children: React.ReactNode;
  preview?: React.ReactNode;
  title?: string;
  description?: string;
}

const ContentGate: React.FC<ContentGateProps> = ({ 
  requiredTier, 
  children, 
  preview,
  title = 'プレミアムコンテンツ',
  description = 'このコンテンツを閲覧するには、プレミアムプランへのアップグレードが必要です。'
}) => {
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // 認証状態の変更を監視
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setHasAccess(authService.hasMinimumTier(requiredTier));
    });

    return unsubscribe;
  }, [requiredTier]);

  // アクセス権がある場合はコンテンツを表示
  if (hasAccess) {
    return <>{children}</>;
  }

  const plan = stripeService.getPlan(requiredTier);
  
  const getIcon = () => {
    switch (requiredTier) {
      case 'basic':
        return <Lock className="w-16 h-16 text-blue-500" />;
      case 'premium':
        return <Crown className="w-16 h-16 text-purple-500" />;
      case 'enterprise':
        return <Sparkles className="w-16 h-16 text-purple-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      {/* プレビューコンテンツ */}
      {preview && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent z-10 pointer-events-none" />
          <div className="blur-sm opacity-50">
            {preview}
          </div>
        </div>
      )}

      {/* ゲートオーバーレイ */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mx-auto max-w-2xl text-center"
        >
          <div className="flex justify-center mb-6">
            {getIcon()}
          </div>

          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          
          <p className="text-gray-600 mb-6">{description}</p>

          <div className="mb-8">
            <PremiumBadge requiredTier={requiredTier} size="large" />
          </div>

          {plan && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-lg mb-2">{plan.name}の特典:</h3>
              <ul className="text-left max-w-md mx-auto space-y-2">
                {plan.features.slice(0, 5).map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {currentUser ? (
            <Link
              to="/pricing"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              プランをアップグレード
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">
                アカウントを作成して、プレミアムコンテンツにアクセスしましょう
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/auth/signup"
                  className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                >
                  無料で登録
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link
                  to="/auth/login"
                  className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  ログイン
                </Link>
              </div>
            </div>
          )}

          {plan && (
            <p className="mt-6 text-sm text-gray-500">
              月額 ¥{plan.price.toLocaleString()} から利用可能
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ContentGate;