import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  Heart, 
  Reply, 
  Send, 
  MoreVertical,
  Flag
} from 'lucide-react'
import { useComments } from '../lib/comments'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'

interface CommentSectionProps {
  postId: string
  postTitle: string
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const { comments, postComment, likeComment } = useComments(postId)
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    content: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent, parentId?: string) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.content) return

    setIsSubmitting(true)
    try {
      await postComment({
        author: {
          name: formData.name,
          email: formData.email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`
        },
        content: formData.content,
        status: 'pending',
        parentId
      })

      // フォームをリセット
      setFormData({ name: '', email: '', content: '' })
      setShowCommentForm(false)
      setReplyingTo(null)
    } catch (error) {
      console.error('Failed to post comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const approvedComments = comments.filter(c => c.status === 'approved')
  const pendingComments = comments.filter(c => c.status === 'pending')

  return (
    <div className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <MessageCircle className="w-6 h-6" />
          コメント ({approvedComments.length})
        </h2>
        
        <button
          onClick={() => setShowCommentForm(!showCommentForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          コメントを書く
        </button>
      </div>

      {/* コメントフォーム */}
      <AnimatePresence>
        {showCommentForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <form onSubmit={(e) => handleSubmit(e)} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    お名前 *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    メールアドレス *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  コメント *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                  placeholder="コメントを入力してください..."
                  required
                />
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  * 必須項目。メールアドレスは公開されません。
                </p>
                
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCommentForm(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {isSubmitting ? '送信中...' : '送信'}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ペンディング通知 */}
      {pendingComments.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            あなたのコメントは承認待ちです。承認後に表示されます。
          </p>
        </div>
      )}

      {/* コメントリスト */}
      <div className="space-y-6">
        {approvedComments.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            まだコメントがありません。最初のコメントを投稿してみましょう！
          </p>
        ) : (
          approvedComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={(parentId) => setReplyingTo(parentId)}
              onLike={likeComment}
              replyingTo={replyingTo}
              onSubmitReply={(e) => handleSubmit(e, comment.id)}
              formData={formData}
              setFormData={setFormData}
              setReplyingTo={setReplyingTo}
              isSubmitting={isSubmitting}
            />
          ))
        )}
      </div>
    </div>
  )
}

interface CommentItemProps {
  comment: any
  onReply: (parentId: string) => void
  onLike: (commentId: string) => void
  replyingTo: string | null
  onSubmitReply: (e: React.FormEvent) => void
  formData: any
  setFormData: any
  setReplyingTo: any
  isSubmitting: boolean
  isReply?: boolean
}

function CommentItem({ 
  comment, 
  onReply, 
  onLike, 
  replyingTo,
  onSubmitReply,
  formData,
  setFormData,
  setReplyingTo,
  isSubmitting,
  isReply = false
}: CommentItemProps) {
  const [showActions, setShowActions] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${isReply ? 'ml-12' : ''}`}
    >
      <div className="flex gap-4">
        <img
          src={comment.author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author.email}`}
          alt={comment.author.name}
          className="w-12 h-12 rounded-full"
        />
        
        <div className="flex-1">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {comment.author.name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: ja })}
                </p>
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                >
                  <MoreVertical className="w-4 h-4 text-gray-500" />
                </button>
                
                {showActions && (
                  <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                      <Flag className="w-4 h-4" />
                      報告
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {comment.content}
            </p>
          </div>
          
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => onLike(comment.id)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
              <Heart className={`w-4 h-4 ${comment.likes > 0 ? 'fill-current text-red-500' : ''}`} />
              {comment.likes > 0 && comment.likes}
            </button>
            
            {!isReply && (
              <button
                onClick={() => onReply(comment.id)}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500 transition-colors"
              >
                <Reply className="w-4 h-4" />
                返信
              </button>
            )}
          </div>

          {/* 返信フォーム */}
          <AnimatePresence>
            {replyingTo === comment.id && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={onSubmitReply}
                className="mt-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    placeholder="お名前"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white"
                    required
                  />
                  <input
                    type="email"
                    placeholder="メールアドレス"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <textarea
                  placeholder="返信を入力..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white resize-none mb-3"
                  required
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    返信
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* 返信 */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply: any) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  onLike={onLike}
                  replyingTo={replyingTo}
                  onSubmitReply={onSubmitReply}
                  formData={formData}
                  setFormData={setFormData}
                  setReplyingTo={setReplyingTo}
                  isSubmitting={isSubmitting}
                  isReply
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}