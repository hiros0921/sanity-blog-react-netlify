import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, CheckCircle, Users, Zap, Gift } from 'lucide-react'

export default function NewsletterAdvanced() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    // ここで実際のメルマガ登録処理を行う
    setTimeout(() => {
      setIsSubscribed(true)
      setIsLoading(false)
    }, 1500)
  }

  const benefits = [
    {
      icon: Zap,
      title: '最新技術情報',
      description: 'Web開発の最新トレンドをいち早くお届け'
    },
    {
      icon: Gift,
      title: '限定コンテンツ',
      description: 'メルマガ読者限定の特別なコンテンツ'
    },
    {
      icon: Users,
      title: 'コミュニティ',
      description: '5,000人以上の開発者コミュニティ'
    }
  ]

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-purple-900 via-black to-blue-900">
      {/* アニメーション背景 */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-block mb-6"
            >
              <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            <h2 className="text-5xl md:text-6xl font-black mb-6 text-white font-display">
              <span className="text-gradient-animation">Premium Newsletter</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              週刊で最新のWeb開発情報、限定チュートリアル、業界ニュースをお届けします
            </p>
          </div>

          {/* 特典 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </motion.div>
            ))}
          </div>

          {/* 登録フォーム */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            {!isSubscribed ? (
              <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
                <div className="mb-6">
                  <label htmlFor="newsletter-email" className="block text-white font-semibold mb-2">
                    メールアドレス
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full px-6 py-4 bg-white/20 backdrop-blur-md rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-4 rounded-lg font-semibold text-white transition-all duration-300 ${
                    isLoading 
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-xl hover:scale-[1.02]'
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                      登録中...
                    </span>
                  ) : (
                    '無料で購読する'
                  )}
                </button>

                <p className="text-center text-gray-400 text-sm mt-4">
                  いつでも解除可能 • スパムなし • 完全無料
                </p>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-green-500/20 backdrop-blur-md rounded-2xl p-8 text-center"
              >
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">登録完了！</h3>
                <p className="text-gray-300">
                  確認メールを送信しました。メールをご確認ください。
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* 購読者数 */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-gray-400">
              <span className="text-2xl font-bold text-white">5,234</span> 人の開発者が購読中
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}