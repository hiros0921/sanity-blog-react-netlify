import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Check, 
  X, 
  Trash2, 
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react'
import { useCommentModeration, commentManager } from '../lib/comments'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

export default function CommentModeration() {
  const { moderateComment } = useCommentModeration()
  const [comments, setComments] = useState<any[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'spam'>('pending')
  const [showModeration, setShowModeration] = useState(false)

  useEffect(() => {
    // 開発環境でのみ表示（Ctrl/Cmd+Shift+M）
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'M') {
        setShowModeration(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  useEffect(() => {
    if (showModeration) {
      loadComments()
    }
  }, [showModeration, filter])

  const loadComments = () => {
    // すべての投稿からコメントを収集
    const allComments: any[] = []
    const commentsMap = (commentManager as any).comments
    
    for (const [postId, postComments] of commentsMap) {
      postComments.forEach((comment: any) => {
        if (filter === 'all' || comment.status === filter) {
          allComments.push({ ...comment, postId })
        }
      })
    }
    
    // 新しいものから順に並べ替え
    allComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    setComments(allComments)
  }

  const handleModerate = async (commentId: string, action: 'approve' | 'spam' | 'delete') => {
    await moderateComment(commentId, action)
    loadComments()
  }

  if (!showModeration || !import.meta.env.DEV) {
    return null
  }

  const stats = {
    pending: comments.filter(c => c.status === 'pending').length,
    approved: comments.filter(c => c.status === 'approved').length,
    spam: comments.filter(c => c.status === 'spam').length
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
              <Shield className="w-8 h-8 text-yellow-500" />
              <h2 className="text-2xl font-bold text-white">コメントモデレーション</h2>
            </div>
            <button
              onClick={() => setShowModeration(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* 統計 */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">承認待ち</span>
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              </div>
              <p className="text-2xl font-bold text-white mt-2">{stats.pending}</p>
            </div>
            
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">承認済み</span>
                <Check className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-white mt-2">{stats.approved}</p>
            </div>
            
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">スパム</span>
                <X className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-2xl font-bold text-white mt-2">{stats.spam}</p>
            </div>
          </div>
        </div>

        {/* フィルター */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex gap-2">
            {(['all', 'pending', 'approved', 'spam'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {status === 'all' ? 'すべて' :
                 status === 'pending' ? '承認待ち' :
                 status === 'approved' ? '承認済み' : 'スパム'}
              </button>
            ))}
          </div>
        </div>

        {/* コメントリスト */}
        <div className="flex-1 overflow-y-auto p-6">
          {comments.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              該当するコメントはありません
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map(comment => (
                <ModerationItem
                  key={comment.id}
                  comment={comment}
                  onModerate={handleModerate}
                />
              ))}
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="p-4 border-t border-gray-800 text-center text-sm text-gray-500">
          {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+Shift+M でモデレーションパネルを切り替え
        </div>
      </div>
    </motion.div>
  )
}

interface ModerationItemProps {
  comment: any
  onModerate: (commentId: string, action: 'approve' | 'spam' | 'delete') => void
}

function ModerationItem({ comment, onModerate }: ModerationItemProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleAction = async (action: 'approve' | 'spam' | 'delete') => {
    setIsProcessing(true)
    await onModerate(comment.id, action)
    setIsProcessing(false)
  }

  const statusColor = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    approved: 'bg-green-500/20 text-green-400',
    spam: 'bg-red-500/20 text-red-400',
    deleted: 'bg-gray-500/20 text-gray-400'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/50 rounded-xl p-6"
    >
      <div className="flex items-start gap-4">
        <img
          src={comment.author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author.email}`}
          alt={comment.author.name}
          className="w-12 h-12 rounded-full"
        />
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-semibold text-white">{comment.author.name}</h4>
              <p className="text-sm text-gray-400">{comment.author.email}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[comment.status as keyof typeof statusColor]}`}>
                {comment.status === 'pending' ? '承認待ち' :
                 comment.status === 'approved' ? '承認済み' :
                 comment.status === 'spam' ? 'スパム' : '削除済み'}
              </span>
              <time className="text-xs text-gray-500">
                {format(new Date(comment.createdAt), 'yyyy/MM/dd HH:mm', { locale: ja })}
              </time>
            </div>
          </div>
          
          <p className="text-gray-300 mb-4">{comment.content}</p>
          
          <div className="flex items-center gap-2">
            {comment.status === 'pending' && (
              <>
                <button
                  onClick={() => handleAction('approve')}
                  disabled={isProcessing}
                  className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-1 text-sm"
                >
                  <Check className="w-4 h-4" />
                  承認
                </button>
                <button
                  onClick={() => handleAction('spam')}
                  disabled={isProcessing}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-1 text-sm"
                >
                  <X className="w-4 h-4" />
                  スパム
                </button>
              </>
            )}
            
            {comment.status === 'approved' && (
              <button
                onClick={() => handleAction('spam')}
                disabled={isProcessing}
                className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center gap-1 text-sm"
              >
                <EyeOff className="w-4 h-4" />
                非表示
              </button>
            )}
            
            {comment.status === 'spam' && (
              <button
                onClick={() => handleAction('approve')}
                disabled={isProcessing}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1 text-sm"
              >
                <Eye className="w-4 h-4" />
                承認
              </button>
            )}
            
            <button
              onClick={() => handleAction('delete')}
              disabled={isProcessing}
              className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center gap-1 text-sm ml-auto"
            >
              <Trash2 className="w-4 h-4" />
              削除
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}