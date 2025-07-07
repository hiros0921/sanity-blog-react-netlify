import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Copy, Check, TrendingUp, DollarSign, 
  BarChart3, Share2, ExternalLink, Award,
  Calendar, Target, Zap
} from 'lucide-react';
import { affiliateService } from '../lib/affiliate';
import type { AffiliateProgram } from '../types/membership';

interface AffiliatePanelProps {
  program: AffiliateProgram;
}

const AffiliatePanel: React.FC<AffiliatePanelProps> = ({ program }) => {
  const [stats, setStats] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedLinkType, setSelectedLinkType] = useState<'home' | 'pricing'>('home');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const affiliateStats = await affiliateService.getAffiliateStats(program.userId);
        setStats(affiliateStats);
      } catch (error) {
        console.error('Failed to load affiliate stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [program.userId]);

  const generateAffiliateLink = () => {
    const path = selectedLinkType === 'pricing' ? '/pricing' : '/';
    return affiliateService.generateAffiliateLink(program.affiliateCode, path);
  };

  const copyAffiliateLink = async () => {
    try {
      await navigator.clipboard.writeText(generateAffiliateLink());
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
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

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-100 rounded"></div>
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
      {/* 統計サマリー */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-blue-600" />
            <span className="text-xs text-gray-500">総リファラル</span>
          </div>
          <p className="text-2xl font-bold">{stats?.totalReferrals || 0}</p>
          <p className="text-sm text-gray-600">紹介者数</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-8 h-8 text-green-600" />
            <span className="text-xs text-gray-500">コンバージョン</span>
          </div>
          <p className="text-2xl font-bold">{stats?.conversions || 0}</p>
          <p className="text-sm text-gray-600">
            成約率 {stats?.conversionRate?.toFixed(1) || 0}%
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-purple-600" />
            <span className="text-xs text-gray-500">総収益</span>
          </div>
          <p className="text-2xl font-bold">
            ¥{program.totalEarnings.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">累計報酬</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-8 h-8 text-yellow-600" />
            <span className="text-xs text-gray-500">未払い残高</span>
          </div>
          <p className="text-2xl font-bold text-green-600">
            ¥{program.pendingEarnings.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">次回支払い予定</p>
        </div>
      </motion.div>

      {/* アフィリエイトリンク */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Share2 className="w-6 h-6 mr-2 text-purple-600" />
          あなたの専用アフィリエイトリンク
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              リンクタイプを選択
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedLinkType('home')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedLinkType === 'home'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                トップページ
              </button>
              <button
                onClick={() => setSelectedLinkType('pricing')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedLinkType === 'pricing'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                料金ページ
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={generateAffiliateLink()}
              readOnly
              className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono"
            />
            <button
              onClick={copyAffiliateLink}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {copiedLink ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5 text-gray-600" />
              )}
            </button>
            <a
              href={generateAffiliateLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ExternalLink className="w-5 h-5 text-gray-600" />
            </a>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-purple-700">
              <strong>アフィリエイトコード:</strong> {program.affiliateCode}
            </p>
            <p className="text-sm text-purple-700 mt-1">
              <strong>コミッション率:</strong> {program.commissionRate}%
            </p>
          </div>
        </div>
      </motion.div>

      {/* パフォーマンス詳細 */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <BarChart3 className="w-6 h-6 mr-2 text-purple-600" />
          パフォーマンス詳細
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3">収益内訳</h3>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">総収益</span>
                <span className="font-medium">¥{program.totalEarnings.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">支払い済み</span>
                <span className="font-medium">¥{program.paidEarnings.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">未払い残高</span>
                <span className="font-medium text-green-600">
                  ¥{program.pendingEarnings.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">成果指標</h3>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">平均注文額</span>
                <span className="font-medium">
                  ¥{stats?.averageOrderValue?.toFixed(0) || 0}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">成約率</span>
                <span className="font-medium">{stats?.conversionRate?.toFixed(1) || 0}%</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">登録日</span>
                <span className="font-medium">
                  {new Date(program.createdAt).toLocaleDateString('ja-JP')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* プロモーション素材 */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Award className="w-6 h-6 mr-2 text-purple-600" />
          プロモーション素材
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 text-center">
            <div className="w-full h-32 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg mb-3 flex items-center justify-center">
              <span className="text-2xl font-bold text-purple-700">300x250</span>
            </div>
            <p className="text-sm font-medium">バナー広告（中）</p>
            <button className="mt-2 text-sm text-purple-600 hover:text-purple-700">
              ダウンロード
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 text-center">
            <div className="w-full h-32 bg-gradient-to-r from-blue-100 to-green-100 rounded-lg mb-3 flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-700">728x90</span>
            </div>
            <p className="text-sm font-medium">バナー広告（横長）</p>
            <button className="mt-2 text-sm text-purple-600 hover:text-purple-700">
              ダウンロード
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 text-center">
            <div className="w-full h-32 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg mb-3 flex items-center justify-center">
              <span className="text-2xl font-bold text-orange-700">SNS</span>
            </div>
            <p className="text-sm font-medium">SNS投稿テンプレート</p>
            <button className="mt-2 text-sm text-purple-600 hover:text-purple-700">
              コピー
            </button>
          </div>
        </div>
      </motion.div>

      {/* ヒントとコツ */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6"
      >
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
          成果を上げるためのヒント
        </h3>
        
        <ul className="space-y-2 text-sm">
          <li className="flex items-start">
            <span className="text-purple-600 mr-2">•</span>
            <span>あなたの体験談を交えてサービスを紹介すると、信頼性が高まります</span>
          </li>
          <li className="flex items-start">
            <span className="text-purple-600 mr-2">•</span>
            <span>ターゲットに合わせて、適切なランディングページ（トップ or 料金）を選択しましょう</span>
          </li>
          <li className="flex items-start">
            <span className="text-purple-600 mr-2">•</span>
            <span>SNSでシェアする際は、ハッシュタグ #HiroSuwa を使用すると露出が増えます</span>
          </li>
          <li className="flex items-start">
            <span className="text-purple-600 mr-2">•</span>
            <span>月初めは新規登録が増える傾向があるため、積極的にプロモーションしましょう</span>
          </li>
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default AffiliatePanel;