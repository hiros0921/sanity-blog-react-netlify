import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  Clock, 
  Activity,
  Monitor,
  Smartphone,
  Globe,
  AlertCircle
} from 'lucide-react'

interface AnalyticsData {
  pageViews: number
  uniqueVisitors: number
  avgSessionDuration: number
  bounceRate: number
  topPages: Array<{ path: string; views: number }>
  deviceTypes: { desktop: number; mobile: number; tablet: number }
  topCountries: Array<{ country: string; visitors: number }>
  realtimeUsers: number
  errors: Array<{ message: string; count: number; lastSeen: string }>
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today')
  const [isLoading, setIsLoading] = useState(true)
  const [showDashboard, setShowDashboard] = useState(false)

  useEffect(() => {
    // 開発環境でのみ表示（Ctrl/Cmd+Shift+A）
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        setShowDashboard(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  useEffect(() => {
    if (showDashboard) {
      loadAnalytics()
    }
  }, [showDashboard, timeRange])

  const loadAnalytics = async () => {
    setIsLoading(true)
    
    // 実際の実装ではGoogle Analytics APIから取得
    // ここではモックデータを使用
    setTimeout(() => {
      setAnalytics({
        pageViews: 12543,
        uniqueVisitors: 3421,
        avgSessionDuration: 245, // 秒
        bounceRate: 42.3,
        topPages: [
          { path: '/', views: 4523 },
          { path: '/blog', views: 2341 },
          { path: '/profile', views: 1876 },
          { path: '/videos', views: 1543 },
          { path: '/contact', views: 987 }
        ],
        deviceTypes: {
          desktop: 58,
          mobile: 37,
          tablet: 5
        },
        topCountries: [
          { country: '日本', visitors: 2876 },
          { country: 'アメリカ', visitors: 234 },
          { country: 'イギリス', visitors: 123 },
          { country: 'カナダ', visitors: 98 },
          { country: 'オーストラリア', visitors: 90 }
        ],
        realtimeUsers: 42,
        errors: [
          { message: 'Failed to load image', count: 23, lastSeen: '5分前' },
          { message: 'Network timeout', count: 12, lastSeen: '12分前' },
          { message: 'Script error', count: 5, lastSeen: '1時間前' }
        ]
      })
      setIsLoading(false)
    }, 1000)
  }

  if (!showDashboard || !import.meta.env.DEV) {
    return null
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-4 bg-black/95 backdrop-blur-xl rounded-2xl shadow-2xl z-50 overflow-hidden"
    >
      <div className="h-full flex flex-col">
        {/* ヘッダー */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-blue-500" />
              <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-sm rounded-full flex items-center gap-1">
                <Activity className="w-3 h-3" />
                {analytics?.realtimeUsers || 0} active
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* 期間選択 */}
              <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
                {(['today', 'week', 'month'] as const).map(range => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      timeRange === range
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {range === 'today' ? '今日' : range === 'week' ? '今週' : '今月'}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowDashboard(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* コンテンツ */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-700 border-t-blue-500" />
            </div>
          ) : analytics ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* メトリクスカード */}
              <div className="space-y-4">
                <MetricCard
                  icon={Eye}
                  label="ページビュー"
                  value={analytics.pageViews.toLocaleString()}
                  change="+12.5%"
                  color="blue"
                />
                <MetricCard
                  icon={Users}
                  label="ユニークビジター"
                  value={analytics.uniqueVisitors.toLocaleString()}
                  change="+8.3%"
                  color="green"
                />
                <MetricCard
                  icon={Clock}
                  label="平均滞在時間"
                  value={formatDuration(analytics.avgSessionDuration)}
                  change="+2.1%"
                  color="purple"
                />
                <MetricCard
                  icon={TrendingUp}
                  label="直帰率"
                  value={`${analytics.bounceRate}%`}
                  change="-3.2%"
                  color="orange"
                  isNegativeGood
                />
              </div>

              {/* トップページ */}
              <div className="bg-gray-900/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">人気ページ</h3>
                <div className="space-y-3">
                  {analytics.topPages.map((page, index) => (
                    <div key={page.path} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500 text-sm w-6">{index + 1}</span>
                        <span className="text-gray-300">{page.path}</span>
                      </div>
                      <span className="text-blue-400">{page.views.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* デバイス分布 */}
              <div className="bg-gray-900/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">デバイス</h3>
                <div className="space-y-4">
                  <DeviceBar
                    icon={Monitor}
                    label="デスクトップ"
                    percentage={analytics.deviceTypes.desktop}
                  />
                  <DeviceBar
                    icon={Smartphone}
                    label="モバイル"
                    percentage={analytics.deviceTypes.mobile}
                  />
                  <DeviceBar
                    icon={Monitor}
                    label="タブレット"
                    percentage={analytics.deviceTypes.tablet}
                  />
                </div>
              </div>

              {/* 国別訪問者 */}
              <div className="bg-gray-900/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  国別訪問者
                </h3>
                <div className="space-y-3">
                  {analytics.topCountries.map((country) => (
                    <div key={country.country} className="flex items-center justify-between">
                      <span className="text-gray-300">{country.country}</span>
                      <span className="text-green-400">{country.visitors.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* エラー */}
              <div className="bg-gray-900/50 rounded-xl p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  最近のエラー
                </h3>
                <div className="space-y-3">
                  {analytics.errors.map((error, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg">
                      <div>
                        <p className="text-gray-300">{error.message}</p>
                        <p className="text-sm text-gray-500">{error.lastSeen}</p>
                      </div>
                      <span className="text-red-400 font-semibold">{error.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* フッター */}
        <div className="p-4 border-t border-gray-800 text-center text-sm text-gray-500">
          {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+Shift+A でダッシュボードを切り替え
        </div>
      </div>
    </motion.div>
  )
}

// メトリクスカードコンポーネント
function MetricCard({ 
  icon: Icon, 
  label, 
  value, 
  change, 
  color, 
  isNegativeGood = false 
}: {
  icon: any
  label: string
  value: string
  change: string
  color: string
  isNegativeGood?: boolean
}) {
  const isPositive = change.startsWith('+')
  const isGood = isNegativeGood ? !isPositive : isPositive

  return (
    <div className="bg-gray-900/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-2">
        <Icon className={`w-5 h-5 text-${color}-500`} />
        <span className={`text-sm ${isGood ? 'text-green-400' : 'text-red-400'}`}>
          {change}
        </span>
      </div>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  )
}

// デバイスバーコンポーネント
function DeviceBar({ icon: Icon, label, percentage }: { icon: any; label: string; percentage: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-300">{label}</span>
        </div>
        <span className="text-sm text-gray-400">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}