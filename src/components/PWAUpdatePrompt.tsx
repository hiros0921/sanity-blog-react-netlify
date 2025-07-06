import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, X } from 'lucide-react'

export default function PWAUpdatePrompt() {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false)
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    // Service Workerの更新を監視
    const handleServiceWorkerUpdate = async () => {
      const registration = await navigator.serviceWorker.ready

      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (!newWorker) return

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // 新しいService Workerがインストールされ、待機中
            setWaitingWorker(newWorker)
            setShowUpdatePrompt(true)
          }
        })
      })
    }

    handleServiceWorkerUpdate()

    // ページ表示時にアップデートをチェック
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.update()
      })
    }

    // 定期的にアップデートをチェック（1時間ごと）
    const interval = setInterval(() => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
          registration.update()
        })
      }
    }, 60 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  const handleUpdate = () => {
    if (!waitingWorker) return

    // Service Workerにスキップ待機メッセージを送信
    waitingWorker.postMessage({ type: 'SKIP_WAITING' })

    // ページをリロード
    waitingWorker.addEventListener('statechange', () => {
      if (waitingWorker.state === 'activated') {
        window.location.reload()
      }
    })
  }

  const handleDismiss = () => {
    setShowUpdatePrompt(false)
  }

  return (
    <AnimatePresence>
      {showUpdatePrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-4 z-50"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                アップデートが利用可能です
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                新しい機能と改善が含まれています。今すぐアップデートしますか？
              </p>
              
              <div className="flex gap-2">
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  アップデート
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  後で
                </button>
              </div>
            </div>
            
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}