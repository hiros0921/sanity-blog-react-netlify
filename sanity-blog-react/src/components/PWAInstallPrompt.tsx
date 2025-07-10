import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, Smartphone, Monitor } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [deviceType, setDeviceType] = useState<'mobile' | 'desktop'>('desktop')

  useEffect(() => {
    // インストール済みかチェック
    const checkInstallStatus = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isInWebApp = (window.navigator as any).standalone === true
      setIsInstalled(isStandalone || isInWebApp)
    }
    
    checkInstallStatus()

    // デバイスタイプの判定
    const checkDeviceType = () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      setDeviceType(isMobile ? 'mobile' : 'desktop')
    }
    
    checkDeviceType()

    // インストールプロンプトのイベントリスナー
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const promptEvent = e as BeforeInstallPromptEvent
      setDeferredPrompt(promptEvent)
      
      // 初回訪問から30秒後に表示
      setTimeout(() => {
        const hasSeenPrompt = localStorage.getItem('pwa-prompt-seen')
        if (!hasSeenPrompt) {
          setShowPrompt(true)
        }
      }, 30000)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // インストール成功時の処理
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed')
      setIsInstalled(true)
      setShowPrompt(false)
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt')
        setShowPrompt(false)
      } else {
        console.log('User dismissed the install prompt')
      }
      
      setDeferredPrompt(null)
    } catch (error) {
      console.error('Error installing PWA:', error)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa-prompt-seen', 'true')
  }

  // インストール済みまたはプロンプトがない場合は表示しない
  if (isInstalled || !deferredPrompt) {
    return null
  }

  return (
    <>
      {/* フローティングインストールボタン */}
      {!showPrompt && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowPrompt(true)}
          className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg flex items-center justify-center z-40"
        >
          <Download className="w-6 h-6 text-white" />
        </motion.button>
      )}

      {/* インストールプロンプト */}
      <AnimatePresence>
        {showPrompt && (
          <>
            {/* オーバーレイ */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleDismiss}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* プロンプトモーダル */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed inset-x-4 bottom-20 max-w-md mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-6">
                {/* ヘッダー */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                      {deviceType === 'mobile' ? (
                        <Smartphone className="w-6 h-6 text-white" />
                      ) : (
                        <Monitor className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        アプリをインストール
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        より快適な体験を
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleDismiss}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* 特典リスト */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      オフラインでも閲覧可能
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      ホーム画面から素早くアクセス
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      プッシュ通知で最新情報をお届け
                    </span>
                  </div>
                </div>

                {/* インストール手順（iOS用） */}
                {deviceType === 'mobile' && /iPhone|iPad|iPod/i.test(navigator.userAgent) && (
                  <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-900 dark:text-blue-300 mb-2">
                      <strong>インストール方法:</strong>
                    </p>
                    <ol className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
                      <li>1. 共有ボタン をタップ</li>
                      <li>2. 「ホーム画面に追加」を選択</li>
                      <li>3. 「追加」をタップ</li>
                    </ol>
                  </div>
                )}

                {/* アクションボタン */}
                <div className="flex gap-3">
                  <button
                    onClick={handleDismiss}
                    className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    後で
                  </button>
                  <button
                    onClick={handleInstall}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    インストール
                  </button>
                </div>
              </div>

              {/* アニメーション背景 */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}