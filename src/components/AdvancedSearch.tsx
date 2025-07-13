import { useState, useEffect, useRef } from 'react'
import { Search, X, Clock, TrendingUp, Filter } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router'

interface SearchResult {
  id: string
  title: string
  excerpt: string
  type: 'post' | 'video' | 'code'
  url: string
  publishedAt: string
  highlights?: string[]
  category?: string
}

export default function AdvancedSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [popularSearches] = useState(['React', 'TypeScript', 'Next.js', 'Tailwind CSS'])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const searchInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  // キーボードショートカット
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // 検索モーダルが開いたときにフォーカス
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  // 最近の検索履歴を読み込み
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // 検索の実行
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)

    try {
      // 実際のAlgolia実装の代わりにモックデータを使用
      // 本番環境では以下をAlgolia APIに置き換え
      const mockResults: SearchResult[] = [
        {
          id: '1',
          title: 'React 18の新機能完全ガイド',
          excerpt: 'React 18で追加された新機能について詳しく解説します。Concurrent Features、Automatic Batching、新しいHooksなど...',
          type: 'post',
          url: '/post/react-18-guide',
          publishedAt: '2025-01-15',
          highlights: [searchQuery],
          category: 'React'
        },
        {
          id: '2',
          title: 'TypeScript 5.0の型システム解説',
          excerpt: 'TypeScript 5.0で強化された型システムの新機能を実例とともに解説。より安全で表現力豊かなコードを...',
          type: 'post',
          url: '/post/typescript-5-types',
          publishedAt: '2025-01-10',
          highlights: [searchQuery],
          category: 'TypeScript'
        },
        {
          id: '3',
          title: 'Next.js 14でフルスタックアプリを構築',
          excerpt: 'Next.js 14の新機能を活用して、モダンなフルスタックアプリケーションを構築する方法を解説...',
          type: 'video',
          url: '/videos',
          publishedAt: '2025-01-05',
          category: 'Next.js'
        }
      ]

      // フィルターの適用
      const filteredResults = mockResults.filter(result => {
        if (selectedFilters.length === 0) return true
        return selectedFilters.includes(result.type)
      })

      setResults(filteredResults)

      // 検索履歴に追加
      const newRecentSearches = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5)
      setRecentSearches(newRecentSearches)
      localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches))
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  // デバウンスされた検索
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, selectedFilters])

  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false)
    navigate(result.url)
  }

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    )
  }

  return (
    <>
      {/* 検索ボタン */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <Search className="w-4 h-4" />
        <span className="text-sm text-gray-600 dark:text-gray-400">検索...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs bg-white dark:bg-gray-900 rounded border border-gray-300 dark:border-gray-600">
          <span className="text-xs">{navigator.platform.includes('Mac') ? '⌘' : 'Ctrl+'}</span>K
        </kbd>
      </button>

      {/* 検索モーダル */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* オーバーレイ */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* モーダル本体 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl z-50 max-h-[80vh] overflow-hidden"
            >
              {/* 検索ヘッダー */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="記事、動画、コードを検索..."
                    className="flex-1 bg-transparent outline-none text-lg"
                  />
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* フィルター */}
                <div className="flex items-center gap-2 mt-3">
                  <Filter className="w-4 h-4 text-gray-400" />
                  {['post', 'video', 'code'].map(filter => (
                    <button
                      key={filter}
                      onClick={() => toggleFilter(filter)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        selectedFilters.includes(filter)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {filter === 'post' ? '記事' : filter === 'video' ? '動画' : 'コード'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 検索結果 */}
              <div className="overflow-y-auto max-h-[60vh]">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-500" />
                  </div>
                ) : results.length > 0 ? (
                  <div className="p-2">
                    {results.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        className="w-full p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
                            {result.type === 'post' ? '📝' : result.type === 'video' ? '🎥' : '💻'}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{result.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                              {result.excerpt}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                              {result.category && (
                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                                  {result.category}
                                </span>
                              )}
                              <time>{new Date(result.publishedAt).toLocaleDateString('ja-JP')}</time>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : query ? (
                  <div className="p-8 text-center text-gray-500">
                    「{query}」に一致する結果が見つかりませんでした
                  </div>
                ) : (
                  <div className="p-4">
                    {/* 最近の検索 */}
                    {recentSearches.length > 0 && (
                      <div className="mb-6">
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                          <Clock className="w-4 h-4" />
                          最近の検索
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {recentSearches.map((search) => (
                            <button
                              key={search}
                              onClick={() => setQuery(search)}
                              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                              {search}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 人気の検索 */}
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <TrendingUp className="w-4 h-4" />
                        人気の検索
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {popularSearches.map((search) => (
                          <button
                            key={search}
                            onClick={() => setQuery(search)}
                            className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
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