import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Youtube, Twitter, FileText, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react'
import OptimizedImage from './OptimizedImage'
import TwitterEmbed from './TwitterEmbed'
import { fetchNoteArticles, fetchYouTubeVideos } from '../lib/socialMediaConfig'

// モックデータ（実際のAPIが利用できない場合のデモ用）
const mockNoteArticles = [
  {
    id: "1",
    title: "最新のテクノロジートレンドについて",
    url: "https://note.com/ready_bison5376/n/xxxxx",
    publishedAt: "2025-01-04",
    excerpt: "AIとWeb3.0が変える未来のビジネス..."
  },
  {
    id: "2",
    title: "プログラミング学習の効率的な方法",
    url: "https://note.com/ready_bison5376/n/xxxxx",
    publishedAt: "2025-01-03",
    excerpt: "初心者からプロフェッショナルへの道のり..."
  }
]

const mockYoutubeVideos = [
  {
    id: "video1",
    title: "【最新】React開発のベストプラクティス",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80",
    url: "https://www.youtube.com/@すわひろゆき",
    views: "1.2K",
    publishedAt: "2025-01-04"
  },
  {
    id: "video2",
    title: "Next.js 14完全ガイド",
    thumbnail: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&q=80",
    url: "https://www.youtube.com/@すわひろゆき",
    views: "856",
    publishedAt: "2025-01-03"
  }
]


export default function SocialMediaFeeds() {
  const [refreshing, setRefreshing] = useState(false)
  const [noteArticles, setNoteArticles] = useState(mockNoteArticles)
  const [youtubeVideos, setYoutubeVideos] = useState(mockYoutubeVideos)
  const [loadingStates, setLoadingStates] = useState({
    note: false,
    youtube: false,
    twitter: false
  })
  const [errors, setErrors] = useState({
    note: null as string | null,
    youtube: null as string | null,
    twitter: null as string | null
  })

  // 初回ロード時にデータを取得
  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    await Promise.all([
      loadNoteArticles(),
      loadYouTubeVideos()
    ])
  }

  const loadNoteArticles = async () => {
    setLoadingStates(prev => ({ ...prev, note: true }))
    setErrors(prev => ({ ...prev, note: null }))
    try {
      const articles = await fetchNoteArticles()
      if (articles.length > 0) {
        setNoteArticles(articles)
      }
    } catch (error) {
      console.error('Failed to load note articles:', error)
      setErrors(prev => ({ ...prev, note: 'Note記事の取得に失敗しました' }))
    } finally {
      setLoadingStates(prev => ({ ...prev, note: false }))
    }
  }

  const loadYouTubeVideos = async () => {
    setLoadingStates(prev => ({ ...prev, youtube: true }))
    setErrors(prev => ({ ...prev, youtube: null }))
    try {
      const videos = await fetchYouTubeVideos()
      if (videos.length > 0) {
        setYoutubeVideos(videos)
      }
    } catch (error) {
      console.error('Failed to load YouTube videos:', error)
      setErrors(prev => ({ ...prev, youtube: 'YouTube動画の取得に失敗しました' }))
    } finally {
      setLoadingStates(prev => ({ ...prev, youtube: false }))
    }
  }

  // Twitter埋め込みウィジェットを使用するため、API呼び出しは不要

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadAllData()
    setRefreshing(false)
  }

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-gray-900 to-black">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-6 text-white font-display">
            <span className="text-gradient">Social Media Hub</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            すべてのコンテンツを一箇所で
          </p>
          
          <button
            onClick={handleRefresh}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-all duration-300 ${
              refreshing ? 'animate-pulse' : ''
            }`}
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            更新
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Note記事 */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-8 h-8 text-green-500" />
              <h3 className="text-2xl font-bold text-white">note記事</h3>
            </div>
            
            {errors.note && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm">{errors.note}</span>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              {loadingStates.note && !noteArticles.length ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
                </div>
              ) : (
                noteArticles.map((article) => (
                  <motion.a
                    key={article.id}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block premium-card p-6 hover-lift group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-green-400 transition-colors">
                      {article.title}
                    </h4>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{new Date(article.publishedAt).toLocaleDateString('ja-JP')}</span>
                      <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </motion.a>
                ))
              )}
            </div>
            
            <a
              href="https://note.com/ready_bison5376"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
            >
              すべて見る
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>

          {/* YouTube動画 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Youtube className="w-8 h-8 text-red-500" />
              <h3 className="text-2xl font-bold text-white">YouTube動画</h3>
            </div>
            
            {errors.youtube && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm">{errors.youtube}</span>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              {loadingStates.youtube && !youtubeVideos.length ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
                </div>
              ) : (
                youtubeVideos.map((video) => (
                  <motion.a
                    key={video.id}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block premium-card overflow-hidden hover-lift group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex gap-4">
                      <div className="w-32 h-20 flex-shrink-0 overflow-hidden">
                        <OptimizedImage
                          src={video.thumbnail}
                          alt={video.title}
                          width={128}
                          height={80}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 p-4">
                        <h4 className="text-sm font-semibold text-white mb-1 line-clamp-2 group-hover:text-red-400 transition-colors">
                          {video.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{video.views} views</span>
                          <span>{new Date(video.publishedAt).toLocaleDateString('ja-JP')}</span>
                        </div>
                      </div>
                    </div>
                  </motion.a>
                ))
              )}
            </div>
            
            <a
              href="https://www.youtube.com/@すわひろゆき"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
            >
              チャンネルを見る
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>

          {/* X (Twitter) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Twitter className="w-8 h-8 text-blue-400" />
              <h3 className="text-2xl font-bold text-white">X (Twitter)</h3>
            </div>
            
            <div className="premium-card overflow-hidden">
              <TwitterEmbed username="hiros0921" theme="dark" height={500} />
            </div>
            
            <a
              href="https://x.com/hiros0921"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              プロフィールを見る
              <ExternalLink className="w-4 h-4" />
            </a>
            
          </motion.div>
        </div>
      </div>
    </section>
  )
}