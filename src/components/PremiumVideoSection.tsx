import { motion } from 'framer-motion'
import { Play, Star, ThumbsUp, Share2 } from 'lucide-react'
import { useState } from 'react'
import OptimizedImage from './OptimizedImage'

const videos = [
  {
    id: 1,
    title: "AIで変わるクリエイティブの世界",
    thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
    duration: "25:30",
    views: "125K",
    rating: 4.9,
    category: "AI & Tech"
  },
  {
    id: 2,
    title: "Web3.0時代のビジネス戦略",
    thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
    duration: "32:15",
    views: "89K",
    rating: 4.8,
    category: "Business"
  },
  {
    id: 3,
    title: "次世代UIデザインの原則",
    thumbnail: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=800&q=80",
    duration: "18:45",
    views: "156K",
    rating: 5.0,
    category: "Design"
  }
]

export default function PremiumVideoSection() {
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null)

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-black"></div>
      
      {/* アニメーション背景 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
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
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Premium Videos
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            業界をリードする専門家による独占コンテンツ
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
              onMouseEnter={() => setHoveredVideo(video.id)}
              onMouseLeave={() => setHoveredVideo(null)}
            >
              <div className="relative overflow-hidden rounded-2xl premium-card cursor-pointer">
                <div className="aspect-w-16 aspect-h-9 relative h-64">
                  <OptimizedImage
                    src={video.thumbnail}
                    alt={video.title}
                    width={800}
                    height={450}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* オーバーレイ */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                  
                  {/* プレイボタン */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={hoveredVideo === video.id ? { scale: 1.1 } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-2xl group-hover:bg-red-500 transition-colors duration-300">
                      <Play className="w-10 h-10 text-white ml-1" fill="white" />
                    </div>
                  </motion.div>

                  {/* ビデオ情報オーバーレイ */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-sm font-semibold">
                      {video.category}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-sm">
                      {video.duration}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors duration-300">
                    {video.title}
                  </h3>

                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                        {video.rating}
                      </span>
                      <span>{video.views} views</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <ThumbsUp className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
                      <Share2 className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
                    </div>
                  </div>

                  {/* ホバー時のプログレスバー */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-red-600"
                    initial={{ scaleX: 0 }}
                    animate={hoveredVideo === video.id ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ duration: 3 }}
                    style={{ transformOrigin: 'left' }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a href="#" className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-white bg-gradient-to-r from-red-600 to-orange-600 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
            <Play className="w-5 h-5" />
            <span>すべての動画を見る</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}