import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bookmark, Heart, Plus, Check } from 'lucide-react'
import { useBookmarks, usePostBookmark } from '../lib/bookmarks'

interface BookmarkButtonProps {
  post: {
    id: string
    title: string
    slug: string
    excerpt?: string
    mainImage?: string
  }
  showLike?: boolean
  showAddToList?: boolean
  className?: string
}

export default function BookmarkButton({ 
  post, 
  showLike = true, 
  showAddToList = false,
  className = '' 
}: BookmarkButtonProps) {
  const { toggleBookmark, toggleLike, readingLists, addToReadingList } = useBookmarks()
  const { isBookmarked, isLiked, bookmark } = usePostBookmark(post.id)
  const [showListMenu, setShowListMenu] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleBookmark = async () => {
    setIsAnimating(true)
    await toggleBookmark(post)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const handleLike = async () => {
    await toggleLike(post.id)
  }

  const handleAddToList = (listId: string) => {
    if (bookmark) {
      addToReadingList(listId, bookmark.id)
      setShowListMenu(false)
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* ブックマークボタン */}
      <motion.button
        onClick={handleBookmark}
        whileTap={{ scale: 0.9 }}
        className={`relative p-2 rounded-lg transition-all ${
          isBookmarked 
            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
        }`}
      >
        <AnimatePresence mode="wait">
          {isAnimating ? (
            <motion.div
              key="animating"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Check className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="bookmark"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* いいねボタン */}
      {showLike && (
        <motion.button
          onClick={handleLike}
          whileTap={{ scale: 0.9 }}
          className={`p-2 rounded-lg transition-all ${
            isLiked 
              ? 'text-red-500' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
        </motion.button>
      )}

      {/* 読書リストに追加 */}
      {showAddToList && isBookmarked && (
        <div className="relative">
          <button
            onClick={() => setShowListMenu(!showListMenu)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400"
          >
            <Plus className="w-5 h-5" />
          </button>

          <AnimatePresence>
            {showListMenu && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowListMenu(false)}
                  className="fixed inset-0 z-40"
                />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 py-2"
                >
                  <p className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                    読書リストに追加
                  </p>
                  <div className="max-h-64 overflow-y-auto">
                    {readingLists.length === 0 ? (
                      <p className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        読書リストがありません
                      </p>
                    ) : (
                      readingLists.map(list => {
                        const isInList = bookmark && list.bookmarkIds.includes(bookmark.id)
                        return (
                          <button
                            key={list.id}
                            onClick={() => !isInList && handleAddToList(list.id)}
                            disabled={isInList}
                            className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-between ${
                              isInList ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {list.icon && <span>{list.icon}</span>}
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {list.name}
                              </span>
                            </div>
                            {isInList && <Check className="w-4 h-4 text-green-500" />}
                          </button>
                        )
                      })
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}