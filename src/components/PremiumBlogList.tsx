import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { Calendar, Clock, Eye, TrendingUp } from 'lucide-react'
import { urlFor } from '../lib/sanity'
import OptimizedImage from './OptimizedImage'

interface BlogPost {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  mainImage?: any
  author?: { name: string }
  publishedAt: string
  categories?: Array<{ title: string }>
}

const mockPosts: BlogPost[] = [
  {
    _id: "1",
    title: "AIとWeb開発の未来",
    slug: { current: "test-post-1" },
    excerpt: "人工知能がWeb開発にもたらす革命的な変化について探ります。",
    publishedAt: "2025-01-03T00:00:00Z",
    author: { name: "Tech Writer" },
    mainImage: {
      asset: { _id: "1", url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80" }
    },
    categories: [{ title: "AI" }, { title: "Web開発" }]
  },
  {
    _id: "2",
    title: "Next.js 14の新機能完全ガイド",
    slug: { current: "test-post-2" },
    excerpt: "最新版Next.jsの革新的な機能を詳しく解説します。",
    publishedAt: "2025-01-02T00:00:00Z",
    author: { name: "Dev Expert" },
    mainImage: {
      asset: { _id: "2", url: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&q=80" }
    },
    categories: [{ title: "Next.js" }, { title: "React" }]
  }
]

export default function PremiumBlogList({ posts = mockPosts }: { posts?: BlogPost[] }) {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black"></div>
      
      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-6 text-white font-display">
            <span className="text-gradient">Latest Articles</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            最新のテクノロジートレンドと実践的な知識を共有
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {posts.map((post, index) => (
            <motion.article
              key={post._id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link to={`/post/${post.slug.current}`} className="block">
                <div className="relative overflow-hidden rounded-2xl premium-card hover-lift">
                  <div className="aspect-w-16 aspect-h-9 relative h-64 overflow-hidden">
                    {post.mainImage ? (
                      <OptimizedImage
                        src={urlFor(post.mainImage)}
                        alt={post.title}
                        width={800}
                        height={450}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600"></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    
                    {/* トレンディングバッジ */}
                    <div className="absolute top-4 left-4">
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/90 backdrop-blur-md">
                        <TrendingUp className="w-4 h-4 text-white" />
                        <span className="text-white text-sm font-semibold">Trending</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    {/* カテゴリー */}
                    {post.categories && post.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.categories.map((cat, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          >
                            {cat.title}
                          </span>
                        ))}
                      </div>
                    )}

                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-gradient transition-colors duration-300">
                      {post.title}
                    </h3>
                    
                    {post.excerpt && (
                      <p className="text-gray-400 mb-6 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(post.publishedAt).toLocaleDateString('ja-JP')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          5 min read
                        </span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        2.5K views
                      </span>
                    </div>

                    {/* ホバー時の矢印 */}
                    <motion.div
                      className="absolute bottom-8 right-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <span className="text-2xl">→</span>
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/blog" className="btn-premium inline-flex items-center gap-2">
            <span>すべての記事を見る</span>
            <span className="text-xl">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}