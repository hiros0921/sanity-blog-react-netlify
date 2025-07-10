import { motion } from 'framer-motion'
import { BookOpen, Star, ShoppingCart, Award } from 'lucide-react'
import OptimizedImage from './OptimizedImage'

const books = [
  {
    id: 1,
    title: 'React実践入門',
    subtitle: 'モダンWeb開発の基礎から応用まで',
    cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
    price: '¥3,500',
    rating: 4.8,
    reviews: 124,
    badge: 'ベストセラー',
    description: 'React 18対応。フックからパフォーマンス最適化まで実践的に解説。',
    features: [
      '500ページの充実した内容',
      'サンプルコード100本以上',
      '動画解説付き',
      '読者限定コミュニティ'
    ]
  },
  {
    id: 2,
    title: 'TypeScript設計パターン',
    subtitle: '大規模アプリケーション開発の実践技法',
    cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&q=80',
    price: '¥4,200',
    rating: 4.9,
    reviews: 89,
    badge: '新刊',
    description: '型安全な設計パターンとアーキテクチャを徹底解説。',
    features: [
      '実務で使える設計パターン20選',
      'Clean Architecture実装例',
      'テスト戦略ガイド',
      'チーム開発のベストプラクティス'
    ]
  },
  {
    id: 3,
    title: 'フルスタック開発マスター',
    subtitle: 'Next.js + Node.js + AWSで作る本格Webサービス',
    cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80',
    price: '¥4,800',
    rating: 4.7,
    reviews: 156,
    badge: '重版決定',
    description: 'ゼロからWebサービスを立ち上げる完全ガイド。',
    features: [
      '実際のサービス開発を完全再現',
      'インフラ構築から運用まで',
      'セキュリティ対策の実装',
      'スケーリング戦略'
    ]
  }
]

export default function BooksSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-gray-900 to-black">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full mb-6">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black mb-6 text-white font-display">
            <span className="text-gradient">Published Books</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            実践的な技術書で、あなたのスキルを次のレベルへ
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {books.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                {/* バッジ */}
                <div className="relative">
                  <OptimizedImage
                    src={book.cover}
                    alt={book.title}
                    width={400}
                    height={320}
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-full">
                      {book.badge}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {book.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {book.subtitle}
                  </p>

                  {/* 評価 */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(book.rating)
                              ? 'text-yellow-500 fill-current'
                              : 'text-gray-600'
                          }`}
                        />
                      ))}
                      <span className="text-white ml-2">{book.rating}</span>
                    </div>
                    <span className="text-gray-500 text-sm">
                      ({book.reviews} reviews)
                    </span>
                  </div>

                  <p className="text-gray-300 mb-6 line-clamp-2">
                    {book.description}
                  </p>

                  {/* 特徴 */}
                  <ul className="space-y-2 mb-6">
                    {book.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                        <Award className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* 価格と購入ボタン */}
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-white">
                      {book.price}
                    </span>
                    <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                      <ShoppingCart className="w-5 h-5" />
                      購入する
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 執筆予定 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full">
            <BookOpen className="w-5 h-5 text-amber-500" />
            <span className="text-white font-semibold">
              新刊「AIとWeb開発の未来」2025年春発売予定
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}