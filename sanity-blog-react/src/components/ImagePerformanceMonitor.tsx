import { useEffect, useState } from 'react'
import { Info, Zap } from 'lucide-react'

interface ImageMetrics {
  totalImages: number
  loadedImages: number
  failedImages: number
  totalSize: number
  averageLoadTime: number
  formats: { [key: string]: number }
}

export default function ImagePerformanceMonitor() {
  const [metrics, setMetrics] = useState<ImageMetrics>({
    totalImages: 0,
    loadedImages: 0,
    failedImages: 0,
    totalSize: 0,
    averageLoadTime: 0,
    formats: {}
  })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const loadTimes: number[] = []
    let observer: PerformanceObserver | null = null

    // パフォーマンスオブザーバーを設定
    if ('PerformanceObserver' in window) {
      observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource' && entry.name.match(/\.(jpg|jpeg|png|webp|avif|gif|svg)/i)) {
            const resourceEntry = entry as PerformanceResourceTiming
            
            // 読み込み時間を記録
            if (resourceEntry.duration > 0) {
              loadTimes.push(resourceEntry.duration)
            }

            // フォーマットを記録
            const format = entry.name.split('.').pop()?.toLowerCase() || 'unknown'
            
            setMetrics(prev => ({
              ...prev,
              totalImages: prev.totalImages + 1,
              loadedImages: prev.loadedImages + 1,
              totalSize: prev.totalSize + (resourceEntry.transferSize || 0),
              averageLoadTime: loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length,
              formats: {
                ...prev.formats,
                [format]: (prev.formats[format] || 0) + 1
              }
            }))
          }
        }
      })

      observer.observe({ entryTypes: ['resource'] })
    }

    // 画像エラーの監視
    const handleImageError = () => {
      setMetrics(prev => ({
        ...prev,
        failedImages: prev.failedImages + 1
      }))
    }

    window.addEventListener('error', handleImageError, true)

    // 開発環境でのみ表示（Viteの環境変数を使用）
    if (import.meta.env.DEV) {
      const handleKeyPress = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
          setIsVisible(prev => !prev)
        }
      }
      window.addEventListener('keydown', handleKeyPress)
      
      return () => {
        window.removeEventListener('keydown', handleKeyPress)
        window.removeEventListener('error', handleImageError, true)
        observer?.disconnect()
      }
    }

    return () => {
      window.removeEventListener('error', handleImageError, true)
      observer?.disconnect()
    }
  }, [])

  if (!isVisible || !import.meta.env.DEV) {
    return null
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  }

  const successRate = metrics.totalImages > 0 
    ? ((metrics.loadedImages / metrics.totalImages) * 100).toFixed(1)
    : '0'

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-black/90 backdrop-blur-lg text-white p-4 rounded-lg shadow-2xl z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          画像パフォーマンス
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white text-sm"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-400">総画像数:</span>
          <span>{metrics.totalImages}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">読み込み成功:</span>
          <span className="text-green-400">{metrics.loadedImages}</span>
        </div>
        
        {metrics.failedImages > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-400">読み込み失敗:</span>
            <span className="text-red-400">{metrics.failedImages}</span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span className="text-gray-400">成功率:</span>
          <span className={Number(successRate) > 95 ? 'text-green-400' : 'text-yellow-400'}>
            {successRate}%
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">総サイズ:</span>
          <span>{formatBytes(metrics.totalSize)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">平均読み込み時間:</span>
          <span>{metrics.averageLoadTime.toFixed(0)}ms</span>
        </div>

        {Object.keys(metrics.formats).length > 0 && (
          <div className="border-t border-gray-700 pt-2 mt-2">
            <p className="text-gray-400 mb-1">フォーマット:</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(metrics.formats).map(([format, count]) => (
                <span 
                  key={format}
                  className="px-2 py-1 bg-gray-800 rounded text-xs"
                >
                  {format.toUpperCase()}: {count}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-700">
        <p className="text-xs text-gray-400 flex items-center gap-1">
          <Info className="w-3 h-3" />
          {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+Shift+P で切り替え
        </p>
      </div>
    </div>
  )
}