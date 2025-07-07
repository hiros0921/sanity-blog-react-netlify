import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, CreditCard, Gift, Users, Mail, Settings, 
  TrendingUp, DollarSign, Calendar, Award, Bell,
  Copy, Check, ExternalLink
} from 'lucide-react';
import { authService } from '../lib/auth';
import { stripeService } from '../lib/stripe';
import { affiliateService } from '../lib/affiliate';
import { emailNotificationService } from '../lib/emailNotification';
import PaymentHistory from './PaymentHistory';
import CouponManager from './CouponManager';
import AffiliatePanel from './AffiliatePanel';
import EmailSettings from './EmailSettings';
import type { User as UserType, AffiliateProgram } from '../types/membership';

type TabType = 'overview' | 'billing' | 'coupons' | 'affiliate' | 'notifications' | 'settings';

const UserDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [affiliateProgram, setAffiliateProgram] = useState<AffiliateProgram | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      const user = authService.getCurrentUser();
      
      if (user) {
        setCurrentUser(user);
        
        // アフィリエイトプログラムの取得
        const program = await affiliateService.getOrCreateProgram(user.id);
        setAffiliateProgram(program);
      }
      
      setLoading(false);
    };

    loadUserData();

    // 認証状態の変更を監視
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  const tabs = [
    { id: 'overview', label: '概要', icon: User },
    { id: 'billing', label: '支払い', icon: CreditCard },
    { id: 'coupons', label: 'クーポン', icon: Gift },
    { id: 'affiliate', label: 'アフィリエイト', icon: Users },
    { id: 'notifications', label: '通知設定', icon: Mail },
    { id: 'settings', label: '設定', icon: Settings }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">ログインが必要です</h2>
        <p className="text-gray-600">ダッシュボードを表示するには、ログインしてください。</p>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">ダッシュボード</h1>
          <p className="text-gray-600">アカウントの管理と設定</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* サイドバー */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg">{currentUser.name}</h3>
                <p className="text-sm text-gray-600">{currentUser.email}</p>
                <div className="mt-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    currentUser.membershipTier === 'premium' 
                      ? 'bg-purple-100 text-purple-700' 
                      : currentUser.membershipTier === 'basic'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {currentUser.membershipTier.toUpperCase()}プラン
                  </span>
                </div>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'bg-purple-100 text-purple-700'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* クイック統計 */}
            {affiliateProgram && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="font-semibold mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-purple-600" />
                  アフィリエイト収益
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">総収益</p>
                    <p className="text-2xl font-bold">
                      ¥{affiliateProgram.totalEarnings.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">未払い残高</p>
                    <p className="text-xl font-semibold text-green-600">
                      ¥{affiliateProgram.pendingEarnings.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* メインコンテンツ */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-3"
          >
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <h2 className="text-xl font-bold mb-4">アカウント概要</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">サブスクリプション情報</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">プラン</span>
                          <span className="font-medium">
                            {stripeService.getPlan(currentUser.membershipTier)?.name || 'フリープラン'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">状態</span>
                          <span className={`font-medium ${
                            currentUser.subscriptionStatus === 'active' 
                              ? 'text-green-600' 
                              : 'text-gray-600'
                          }`}>
                            {currentUser.subscriptionStatus === 'active' ? '有効' : '無効'}
                          </span>
                        </div>
                        {currentUser.subscriptionEndDate && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">次回請求日</span>
                            <span className="font-medium">
                              {new Date(currentUser.subscriptionEndDate).toLocaleDateString('ja-JP')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">アカウント情報</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">登録日</span>
                          <span className="font-medium">
                            {new Date(currentUser.createdAt).toLocaleDateString('ja-JP')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">メンバーID</span>
                          <span className="font-medium">{currentUser.id}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <div className="flex flex-wrap gap-4">
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                        プランをアップグレード
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        請求先情報を更新
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* アクティビティサマリー */}
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <h2 className="text-xl font-bold mb-4">アクティビティサマリー</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <TrendingUp className="w-8 h-8 text-blue-600" />
                      </div>
                      <p className="text-2xl font-bold">24</p>
                      <p className="text-sm text-gray-600">記事を読んだ数</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Calendar className="w-8 h-8 text-green-600" />
                      </div>
                      <p className="text-2xl font-bold">15</p>
                      <p className="text-sm text-gray-600">連続ログイン日数</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Bell className="w-8 h-8 text-purple-600" />
                      </div>
                      <p className="text-2xl font-bold">7</p>
                      <p className="text-sm text-gray-600">未読通知</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === 'billing' && <PaymentHistory />}
            {activeTab === 'coupons' && <CouponManager />}
            {activeTab === 'affiliate' && affiliateProgram && (
              <AffiliatePanel program={affiliateProgram} />
            )}
            {activeTab === 'notifications' && <EmailSettings userId={currentUser.id} />}
            
            {activeTab === 'settings' && (
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h2 className="text-xl font-bold mb-4">アカウント設定</h2>
                <p className="text-gray-600">
                  アカウント設定機能は現在開発中です。
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;