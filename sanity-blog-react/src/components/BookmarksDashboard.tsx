import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Bookmark, 
  Heart, 
  BookOpen, 
  Clock, 
  TrendingUp,
  Grid,
  List
} from 'lucide-react'
import { useBookmarks } from '../lib/bookmarks'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import ReadingListManager from './ReadingListManager'
import BookmarkCard from './BookmarkCard'

export default function BookmarksDashboard() {
  const { bookmarks, stats } = useBookmarks()
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [filter, setFilter] = useState<'all' | 'unread' | 'reading' | 'completed'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'progress'>('date')
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'lists' | 'stats'>('bookmarks')

  // フィルタリング
  const filteredBookmarks = bookmarks.filter(bookmark => {
    switch (filter) {
      case 'unread':
        return !bookmark.readingProgress || bookmark.readingProgress === 0
      case 'reading':
        return bookmark.readingProgress && bookmark.readingProgress > 0 && bookmark.readingProgress < 100
      case 'completed':
        return bookmark.readingProgress === 100
      default:
        return true
    }
  })

  // ソート
  const sortedBookmarks = [...filteredBookmarks].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.postTitle.localeCompare(b.postTitle)
      case 'progress':
        return (b.readingProgress || 0) - (a.readingProgress || 0)
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            マイライブラリ
          </h1>
          
          {/* 統計サマリー */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Bookmark className="w-5 h-5 text-blue-500" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalBookmarks}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">ブックマーク</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalLikes}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">いいね</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <BookOpen className="w-5 h-5 text-green-500" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.readingLists}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">読書リスト</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(stats.averageReadingProgress)}%
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">平均進捗</p>
            </div>
          </div>

          {/* タブ */}
          <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
            {(['bookmarks', 'lists', 'stats'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-1 font-medium transition-colors relative ${
                  activeTab === tab
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tab === 'bookmarks' ? 'ブックマーク' : tab === 'lists' ? '読書リスト' : '統計'}
                {activeTab === tab && (
                  <motion.div
                    layoutId="tabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* コンテンツ */}
        {activeTab === 'bookmarks' && (
          <>
            {/* ツールバー */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex flex-wrap gap-2">
                {/* フィルター */}
                <div className="flex gap-1 bg-white dark:bg-gray-800 rounded-lg p-1">
                  {(['all', 'unread', 'reading', 'completed'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        filter === f
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      {f === 'all' ? 'すべて' :
                       f === 'unread' ? '未読' :
                       f === 'reading' ? '読書中' : '完了'}
                    </button>
                  ))}
                </div>

                {/* ソート */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                >
                  <option value="date">追加日順</option>
                  <option value="title">タイトル順</option>
                  <option value="progress">進捗順</option>
                </select>
              </div>

              {/* ビュー切り替え */}
              <div className="flex gap-1 bg-white dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setView('grid')}
                  className={`p-2 rounded transition-colors ${
                    view === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-2 rounded transition-colors ${
                    view === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ブックマーク一覧 */}
            {sortedBookmarks.length === 0 ? (
              <div className="text-center py-12">
                <Bookmark className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  {filter === 'all' 
                    ? 'まだブックマークがありません' 
                    : 'このカテゴリーにブックマークがありません'}
                </p>
              </div>
            ) : (
              <div className={view === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'
              }>
                {sortedBookmarks.map(bookmark => (
                  <BookmarkCard
                    key={bookmark.id}
                    bookmark={bookmark}
                    view={view}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'lists' && <ReadingListManager />}

        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 読書進捗チャート */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                読書進捗
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">未読</span>
                    <span className="font-medium">{bookmarks.filter(b => !b.readingProgress || b.readingProgress === 0).length}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gray-500 h-2 rounded-full"
                      style={{ width: `${(bookmarks.filter(b => !b.readingProgress || b.readingProgress === 0).length / bookmarks.length) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">読書中</span>
                    <span className="font-medium">{bookmarks.filter(b => b.readingProgress && b.readingProgress > 0 && b.readingProgress < 100).length}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(bookmarks.filter(b => b.readingProgress && b.readingProgress > 0 && b.readingProgress < 100).length / bookmarks.length) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">完了</span>
                    <span className="font-medium">{stats.completedReading}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(stats.completedReading / bookmarks.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 最近の活動 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                最近の活動
              </h3>
              <div className="space-y-3">
                {bookmarks.slice(0, 5).map(bookmark => (
                  <div key={bookmark.id} className="flex items-center justify-between">
                    <p className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">
                      {bookmark.postTitle}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(new Date(bookmark.createdAt), { 
                        addSuffix: true, 
                        locale: ja 
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}