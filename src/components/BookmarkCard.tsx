import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Tag, 
  Edit, 
  Trash2,
  MoreVertical,
  Clock
} from 'lucide-react'
import { useBookmarks, type Bookmark } from '../lib/bookmarks'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'

interface BookmarkCardProps {
  bookmark: Bookmark
  view: 'grid' | 'list'
}

export default function BookmarkCard({ bookmark, view }: BookmarkCardProps) {
  const { updateReadingProgress, addTag, removeTag, updateNotes, toggleBookmark } = useBookmarks()
  const [showActions, setShowActions] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [notes, setNotes] = useState(bookmark.notes || '')
  const [newTag, setNewTag] = useState('')

  const handleDelete = async () => {
    if (confirm('このブックマークを削除してもよろしいですか？')) {
      await toggleBookmark({
        id: bookmark.postId,
        title: bookmark.postTitle,
        slug: bookmark.postSlug
      })
    }
  }

  const handleAddTag = () => {
    if (newTag.trim()) {
      addTag(bookmark.id, newTag.trim())
      setNewTag('')
    }
  }

  const handleSaveNotes = () => {
    updateNotes(bookmark.id, notes)
    setShowNotes(false)
  }

  if (view === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
      >
        <div className="flex items-start gap-4">
          {bookmark.postImage && (
            <div 
              className="w-24 h-16 bg-gray-200 dark:bg-gray-700 rounded flex-shrink-0"
              style={{
                backgroundImage: `url(${bookmark.postImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <Link 
                to={`/post/${bookmark.postSlug}`}
                className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 line-clamp-1"
              >
                {bookmark.postTitle}
              </Link>
              
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {bookmark.postExcerpt && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                {bookmark.postExcerpt}
              </p>
            )}

            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDistanceToNow(new Date(bookmark.createdAt), { addSuffix: true, locale: ja })}
              </span>
              
              {bookmark.lastReadAt && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  最終: {formatDistanceToNow(new Date(bookmark.lastReadAt), { addSuffix: true, locale: ja })}
                </span>
              )}
              
              <div className="flex-1">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div 
                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${bookmark.readingProgress || 0}%` }}
                  />
                </div>
              </div>
              
              <span className="font-medium">{bookmark.readingProgress || 0}%</span>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      {bookmark.postImage && (
        <div 
          className="h-48 bg-gray-200 dark:bg-gray-700"
          style={{
            backgroundImage: `url(${bookmark.postImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      )}
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <Link 
            to={`/post/${bookmark.postSlug}`}
            className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2"
          >
            {bookmark.postTitle}
          </Link>
          
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>
            
            {showActions && (
              <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                <button
                  onClick={() => {
                    setShowNotes(true)
                    setShowActions(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  メモを編集
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                  削除
                </button>
              </div>
            )}
          </div>
        </div>

        {bookmark.postExcerpt && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3">
            {bookmark.postExcerpt}
          </p>
        )}

        {/* タグ */}
        <div className="flex flex-wrap gap-1 mb-3">
          {bookmark.tags.map(tag => (
            <span 
              key={tag}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full text-gray-600 dark:text-gray-400 flex items-center gap-1"
            >
              <Tag className="w-3 h-3" />
              {tag}
              <button
                onClick={() => removeTag(bookmark.id, tag)}
                className="ml-1 hover:text-red-500"
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
            placeholder="+ タグ"
            className="px-2 py-1 bg-transparent text-xs outline-none w-16"
          />
        </div>

        {/* 進捗 */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
            <span>読書進捗</span>
            <span>{bookmark.readingProgress || 0}%</span>
          </div>
          <div className="relative">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${bookmark.readingProgress || 0}%` }}
              />
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={bookmark.readingProgress || 0}
              onChange={(e) => updateReadingProgress(bookmark.id, parseInt(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* 日付 */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDistanceToNow(new Date(bookmark.createdAt), { addSuffix: true, locale: ja })}
          </span>
          
          {bookmark.lastReadAt && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(bookmark.lastReadAt), { addSuffix: true, locale: ja })}
            </span>
          )}
        </div>
      </div>

      {/* メモ編集モーダル */}
      {showNotes && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowNotes(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-xl z-50 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              メモを編集
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white resize-none"
              placeholder="この記事についてのメモ..."
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowNotes(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400"
              >
                キャンセル
              </button>
              <button
                onClick={handleSaveNotes}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                保存
              </button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  )
}