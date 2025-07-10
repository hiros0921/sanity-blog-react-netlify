import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Beaker, 
  TrendingUp, 
  Users, 
  MousePointer,
  RotateCcw,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useABTestResults, abTestManager } from '../lib/abTesting'

interface TestInfo {
  id: string
  name: string
  description: string
  status: 'running' | 'completed' | 'paused'
}

export default function ABTestDashboard() {
  const [showDashboard, setShowDashboard] = useState(false)
  const [activeTests] = useState<TestInfo[]>([
    {
      id: 'hero_cta',
      name: 'ヒーローセクションCTA',
      description: 'CTAボタンのテキストとスタイルを最適化',
      status: 'running'
    },
    {
      id: 'blog_card_layout',
      name: 'ブログカードレイアウト',
      description: 'カードのレイアウトとコンテンツ表示を最適化',
      status: 'running'
    },
    {
      id: 'contact_form',
      name: 'お問い合わせフォーム',
      description: 'フォームのレイアウトとCTAを最適化',
      status: 'running'
    }
  ])

  useEffect(() => {
    // 開発環境でのみ表示（Ctrl/Cmd+Shift+T）
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        setShowDashboard(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  if (!showDashboard || !import.meta.env.DEV) {
    return null
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
              <Beaker className="w-8 h-8 text-purple-500" />
              <h2 className="text-2xl font-bold text-white">A/Bテストダッシュボード</h2>
            </div>
            <button
              onClick={() => setShowDashboard(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>

        {/* コンテンツ */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid gap-6">
            {activeTests.map(test => (
              <TestResultCard key={test.id} test={test} />
            ))}
          </div>
        </div>

        {/* フッター */}
        <div className="p-4 border-t border-gray-800 text-center text-sm text-gray-500">
          {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+Shift+T でダッシュボードを切り替え
        </div>
      </div>
    </motion.div>
  )
}

function TestResultCard({ test }: { test: TestInfo }) {
  const results = useABTestResults(test.id)
  const [isResetting, setIsResetting] = useState(false)

  const handleReset = async () => {
    setIsResetting(true)
    abTestManager.resetTest(test.id)
    setTimeout(() => setIsResetting(false), 500)
  }

  const totalImpressions = results.A.impressions + results.B.impressions
  const hasEnoughData = totalImpressions >= 100

  return (
    <div className="bg-gray-900/50 rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{test.name}</h3>
          <p className="text-sm text-gray-400 mt-1">{test.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 text-xs rounded-full ${
            test.status === 'running' 
              ? 'bg-green-500/20 text-green-400' 
              : test.status === 'completed'
              ? 'bg-blue-500/20 text-blue-400'
              : 'bg-gray-500/20 text-gray-400'
          }`}>
            {test.status === 'running' ? '実行中' : test.status === 'completed' ? '完了' : '一時停止'}
          </span>
          <button
            onClick={handleReset}
            disabled={isResetting}
            className="p-2 hover:bg-gray-800 rounded transition-colors"
            title="テストをリセット"
          >
            <RotateCcw className={`w-4 h-4 text-gray-400 ${isResetting ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 統計情報 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <VariantStats
          variant="A"
          impressions={results.A.impressions}
          conversions={results.A.conversions}
          conversionRate={results.A.conversionRate}
          isWinner={results.winner === 'A'}
        />
        <VariantStats
          variant="B"
          impressions={results.B.impressions}
          conversions={results.B.conversions}
          conversionRate={results.B.conversionRate}
          isWinner={results.winner === 'B'}
        />
      </div>

      {/* 信頼度 */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-400">統計的信頼度</span>
          <span className="text-sm text-white">{results.confidence}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              results.confidence >= 95 
                ? 'bg-green-500' 
                : results.confidence >= 90 
                ? 'bg-yellow-500' 
                : 'bg-gray-500'
            }`}
            style={{ width: `${results.confidence}%` }}
          />
        </div>
        {!hasEnoughData && (
          <p className="text-xs text-yellow-400 mt-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            より多くのデータが必要です（現在: {totalImpressions}件）
          </p>
        )}
        {hasEnoughData && results.confidence >= 95 && results.winner && (
          <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            バリアント{results.winner}が統計的に有意です
          </p>
        )}
      </div>
    </div>
  )
}

function VariantStats({ 
  variant, 
  impressions, 
  conversions, 
  conversionRate,
  isWinner
}: {
  variant: string
  impressions: number
  conversions: number
  conversionRate: number
  isWinner: boolean
}) {
  return (
    <div className={`p-4 rounded-lg border-2 transition-colors ${
      isWinner 
        ? 'bg-green-500/10 border-green-500' 
        : 'bg-gray-800/50 border-gray-700'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-white">バリアント {variant}</h4>
        {isWinner && <TrendingUp className="w-4 h-4 text-green-400" />}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400 flex items-center gap-1">
            <Users className="w-3 h-3" />
            表示回数
          </span>
          <span className="text-white">{impressions.toLocaleString()}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400 flex items-center gap-1">
            <MousePointer className="w-3 h-3" />
            コンバージョン
          </span>
          <span className="text-white">{conversions.toLocaleString()}</span>
        </div>
        
        <div className="pt-2 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">CVR</span>
            <span className={`text-lg font-bold ${
              isWinner ? 'text-green-400' : 'text-white'
            }`}>
              {(conversionRate * 100).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}