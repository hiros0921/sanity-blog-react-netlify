import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, DollarSign, Eye, MousePointer,
  Target, Download, AlertCircle,
  ChevronUp, ChevronDown
} from 'lucide-react';
import type { AdType } from '../types/advertising';

const AdPerformanceDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedAdType, setSelectedAdType] = useState<AdType | 'all'>('all');
  const [performanceData, setPerformanceData] = useState<{
    totalRevenue: number;
    totalImpressions: number;
    totalClicks: number;
    totalConversions: number;
    averageCTR: number;
    averageECPM: number;
    topPerformingAds: any[];
  }>({
    totalRevenue: 0,
    totalImpressions: 0,
    totalClicks: 0,
    totalConversions: 0,
    averageCTR: 0,
    averageECPM: 0,
    topPerformingAds: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPerformanceData();
  }, [selectedPeriod, selectedAdType]);

  const loadPerformanceData = async () => {
    setLoading(true);
    try {
      // モックデータの生成
      const mockData = {
        totalRevenue: 156780,
        totalImpressions: 234567,
        totalClicks: 12345,
        totalConversions: 678,
        averageCTR: 5.26,
        averageECPM: 668.5,
        topPerformingAds: [
          {
            id: '1',
            name: '【PR】最新のAI開発ツール',
            type: 'sponsored',
            revenue: 45600,
            impressions: 15420,
            clicks: 892,
            ctr: 5.78,
            trend: 'up'
          },
          {
            id: '2',
            name: 'Echo スマートスピーカー',
            type: 'affiliate',
            revenue: 34200,
            impressions: 8234,
            clicks: 456,
            ctr: 5.54,
            trend: 'up'
          },
          {
            id: '3',
            name: 'プログラミング言語Go',
            type: 'affiliate',
            revenue: 28900,
            impressions: 6789,
            clicks: 234,
            ctr: 3.45,
            trend: 'down'
          }
        ]
      };

      setPerformanceData(mockData);
    } catch (error) {
      console.error('Failed to load performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    // CSVエクスポート機能
    const csvContent = `期間,広告タイプ,総収益,総表示回数,総クリック数,平均CTR,平均ECPM
${selectedPeriod},${selectedAdType},${performanceData.totalRevenue},${performanceData.totalImpressions},${performanceData.totalClicks},${performanceData.averageCTR},${performanceData.averageECPM}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ad-performance-${selectedPeriod}.csv`;
    a.click();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* ヘッダー */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900">広告パフォーマンス分析</h1>
              <p className="text-gray-600 mt-1">収益とエンゲージメントの詳細分析</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* 期間フィルター */}
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="7d">過去7日間</option>
                <option value="30d">過去30日間</option>
                <option value="90d">過去90日間</option>
              </select>

              {/* 広告タイプフィルター */}
              <select
                value={selectedAdType}
                onChange={(e) => setSelectedAdType(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">すべての広告</option>
                <option value="display">ディスプレイ広告</option>
                <option value="sponsored">スポンサード記事</option>
                <option value="affiliate">アフィリエイト</option>
              </select>

              {/* エクスポートボタン */}
              <button
                onClick={exportReport}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                レポート出力
              </button>
            </div>
          </motion.div>

          {/* KPIカード */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-10 h-10 text-green-600" />
                <span className="text-sm text-gray-500">総収益</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                ¥{performanceData.totalRevenue.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                前月比 +23.5%
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <Eye className="w-10 h-10 text-blue-600" />
                <span className="text-sm text-gray-500">総表示回数</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {performanceData.totalImpressions.toLocaleString()}
              </p>
              <p className="text-sm text-blue-600 mt-2">
                ECPM: ¥{performanceData.averageECPM}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <MousePointer className="w-10 h-10 text-purple-600" />
                <span className="text-sm text-gray-500">総クリック数</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {performanceData.totalClicks.toLocaleString()}
              </p>
              <p className="text-sm text-purple-600 mt-2">
                CTR: {performanceData.averageCTR}%
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <Target className="w-10 h-10 text-orange-600" />
                <span className="text-sm text-gray-500">総コンバージョン</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {performanceData.totalConversions.toLocaleString()}
              </p>
              <p className="text-sm text-orange-600 mt-2">
                CVR: {((performanceData.totalConversions / performanceData.totalClicks) * 100).toFixed(2)}%
              </p>
            </div>
          </motion.div>

          {/* パフォーマンスチャート */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
          >
            {/* 収益推移グラフ */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <BarChart3 className="w-6 h-6 mr-2 text-purple-600" />
                収益推移
              </h2>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                <p className="text-gray-500">グラフ表示エリア</p>
              </div>
            </div>

            {/* 広告タイプ別収益 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">広告タイプ別収益</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">スポンサード記事</span>
                    <span className="text-sm font-bold">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">アフィリエイト</span>
                    <span className="text-sm font-bold">35%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">ディスプレイ広告</span>
                    <span className="text-sm font-bold">20%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* トップパフォーマンス広告 */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-purple-600" />
              トップパフォーマンス広告
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">広告名</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">タイプ</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">収益</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">表示回数</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">CTR</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">トレンド</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceData.topPerformingAds.map((ad) => (
                    <tr key={ad.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <p className="font-medium text-gray-900">{ad.name}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          ad.type === 'sponsored' 
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {ad.type === 'sponsored' ? 'スポンサード' : 'アフィリエイト'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-medium">
                        ¥{ad.revenue.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right">
                        {ad.impressions.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right">
                        {ad.ctr}%
                      </td>
                      <td className="py-4 px-4 text-center">
                        {ad.trend === 'up' ? (
                          <ChevronUp className="w-5 h-5 text-green-600 inline" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-red-600 inline" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* 最適化の提案 */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mt-8"
          >
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-purple-600" />
              最適化の提案
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span>CTRが3%未満の広告は配置やデザインの見直しを検討してください</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span>モバイルユーザーの割合が高いため、レスポンシブ広告の導入を推奨します</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span>午後8時〜10時のアクセスが多いため、この時間帯の広告単価を上げることを検討してください</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdPerformanceDashboard;