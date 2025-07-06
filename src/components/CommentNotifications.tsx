import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, MessageCircle, Reply, Shield, X, Check } from 'lucide-react'
import { useCommentNotifications } from '../lib/comments'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'

export default function CommentNotifications() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useCommentNotifications()
  const [showNotifications, setShowNotifications] = useState(false)

  // 新しい通知があった時にブラウザ通知を表示
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const latestUnread = notifications.find(n => !n.read)
      if (latestUnread && unreadCount > 0) {
        const title = latestUnread.type === 'new_comment' ? '新しいコメント' : 
                      latestUnread.type === 'reply' ? '返信' : 'モデレーション'
        
        new Notification(title, {
          body: `${latestUnread.comment.author.name}: ${latestUnread.comment.content.slice(0, 50)}...`,
          icon: '/icon-192x192.png',
          tag: latestUnread.id
        })
      }
    }
  }, [unreadCount])


  return (
    <>
      {/* 通知ベルアイコン */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* 通知パネル */}
      <AnimatePresence>
        {showNotifications && (
          <>
            {/* オーバーレイ */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNotifications(false)}
              className="fixed inset-0 z-40"
            />

            {/* 通知リスト */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-[80vh] overflow-hidden"
            >
              {/* ヘッダー */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    通知
                  </h3>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <Check className="w-4 h-4" />
                        すべて既読
                      </button>
                    )}
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 通知リスト */}
              <div className="overflow-y-auto max-h-[60vh]">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    通知はありません
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {notifications.slice(0, 20).map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onRead={() => markAsRead(notification.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

interface NotificationItemProps {
  notification: any
  onRead: () => void
}

function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const handleClick = () => {
    if (!notification.read) {
      onRead()
    }
    // ここで該当する投稿にスクロールする処理を追加可能
  }

  return (
    <motion.div
      onClick={handleClick}
      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
        !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex gap-3">
        <div className={`p-2 rounded-full ${
          notification.type === 'new_comment' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
          notification.type === 'reply' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
          'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
        }`}>
          {getNotificationIcon(notification.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {getNotificationTitle(notification.type)}
            </p>
            <time className="text-xs text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true, locale: ja })}
            </time>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">{notification.comment.author.name}</span>
            {': '}
            <span className="truncate">
              {notification.comment.content.length > 50 
                ? notification.comment.content.slice(0, 50) + '...' 
                : notification.comment.content
              }
            </span>
          </p>
          
          {!notification.read && (
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2" />
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ヘッダーに埋め込むコンポーネント
function getNotificationIcon(type: string) {
  switch (type) {
    case 'new_comment':
      return <MessageCircle className="w-4 h-4" />
    case 'reply':
      return <Reply className="w-4 h-4" />
    case 'moderation':
      return <Shield className="w-4 h-4" />
    default:
      return <MessageCircle className="w-4 h-4" />
  }
}

function getNotificationTitle(type: string) {
  switch (type) {
    case 'new_comment':
      return '新しいコメント'
    case 'reply':
      return '返信'
    case 'moderation':
      return 'モデレーション'
    default:
      return 'お知らせ'
  }
}