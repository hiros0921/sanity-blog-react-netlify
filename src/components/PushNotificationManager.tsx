import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, BellOff, Check, X, Loader } from 'lucide-react'

export default function PushNotificationManager() {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // 通知権限の状態を確認
    if ('Notification' in window) {
      setPermission(Notification.permission)
      
      // 購読状態を確認
      checkSubscription()
      
      // 初回訪問から1分後にバナーを表示
      const timer = setTimeout(() => {
        if (Notification.permission === 'default' && !localStorage.getItem('notification-banner-dismissed')) {
          setShowBanner(true)
        }
      }, 60000)
      
      return () => clearTimeout(timer)
    }
  }, [])

  const checkSubscription = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()
        setIsSubscribed(!!subscription)
      } catch (error) {
        console.error('Error checking subscription:', error)
      }
    }
  }

  const requestPermission = async () => {
    setIsLoading(true)
    
    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      
      if (result === 'granted') {
        await subscribeToNotifications()
      }
    } catch (error) {
      console.error('Error requesting permission:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const subscribeToNotifications = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.error('Push notifications not supported')
      return
    }

    try {
      const registration = await navigator.serviceWorker.ready
      
      // 公開鍵（実際の実装では環境変数から取得）
      const vapidPublicKey = 'YOUR_VAPID_PUBLIC_KEY'
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      })

      // サーバーに購読情報を送信
      await sendSubscriptionToServer(subscription)
      
      setIsSubscribed(true)
      
      // テスト通知を送信
      showTestNotification()
    } catch (error) {
      console.error('Error subscribing to notifications:', error)
    }
  }

  const unsubscribeFromNotifications = async () => {
    setIsLoading(true)
    
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      
      if (subscription) {
        await subscription.unsubscribe()
        await removeSubscriptionFromServer(subscription)
        setIsSubscribed(false)
      }
    } catch (error) {
      console.error('Error unsubscribing:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const sendSubscriptionToServer = async (subscription: PushSubscription) => {
    // 実際の実装ではAPIエンドポイントに送信
    console.log('Sending subscription to server:', subscription)
    localStorage.setItem('push-subscription', JSON.stringify(subscription))
  }

  const removeSubscriptionFromServer = async (subscription: PushSubscription) => {
    // 実際の実装ではAPIエンドポイントから削除
    console.log('Removing subscription from server:', subscription)
    localStorage.removeItem('push-subscription')
  }

  const showTestNotification = () => {
    if ('serviceWorker' in navigator && 'Notification' in window && Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification('HiroSuwa', {
          body: '通知が正常に設定されました！',
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
          }
        })
      })
    }
  }

  const handleDismissBanner = () => {
    setShowBanner(false)
    localStorage.setItem('notification-banner-dismissed', 'true')
  }

  // Base64 URL to Uint8Array converter
  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/')
    
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    
    return outputArray
  }

  if (!('Notification' in window)) {
    return null
  }

  return (
    <>
      {/* 通知許可バナー */}
      {showBanner && permission === 'default' && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg z-40"
        >
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5" />
              <p className="text-sm md:text-base">
                最新の記事やアップデートの通知を受け取りますか？
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={requestPermission}
                disabled={isLoading}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>許可する</span>
              </button>
              <button
                onClick={handleDismissBanner}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* 通知設定ボタン（設定ページなどで使用） */}
      <div className="inline-flex items-center gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            プッシュ通知
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {permission === 'granted' && isSubscribed
              ? '新しい記事の通知を受け取ります'
              : permission === 'granted'
              ? '通知は許可されていますが、購読していません'
              : permission === 'denied'
              ? '通知がブロックされています'
              : '通知を有効にして最新情報を受け取る'}
          </p>
        </div>
        
        <button
          onClick={isSubscribed ? unsubscribeFromNotifications : requestPermission}
          disabled={isLoading || permission === 'denied'}
          className={`p-3 rounded-lg transition-all ${
            isSubscribed
              ? 'bg-green-500 text-white hover:bg-green-600'
              : permission === 'denied'
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isLoading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : isSubscribed ? (
            <Bell className="w-5 h-5" />
          ) : (
            <BellOff className="w-5 h-5" />
          )}
        </button>
      </div>
    </>
  )
}