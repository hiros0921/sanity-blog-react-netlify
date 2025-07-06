import { Github, Twitter, Youtube, FileText, Mail } from 'lucide-react'
import { motion } from 'framer-motion'
import SEO from './SEO'
import OptimizedImage from './OptimizedImage'

export default function UpdatedProfilePage() {
  const socialLinks = [
    {
      name: 'X (Twitter)',
      icon: Twitter,
      url: 'https://x.com/hiros0921',
      color: 'hover:text-blue-400',
      bgColor: 'hover:bg-blue-400/10'
    },
    {
      name: 'YouTube',
      icon: Youtube,
      url: 'https://www.youtube.com/@HiroSuwa',
      color: 'hover:text-red-500',
      bgColor: 'hover:bg-red-500/10'
    },
    {
      name: 'note',
      icon: FileText,
      url: 'https://note.com/ready_bison5376',
      color: 'hover:text-green-500',
      bgColor: 'hover:bg-green-500/10'
    },
    {
      name: 'GitHub',
      icon: Github,
      url: '#',
      color: 'hover:text-gray-400',
      bgColor: 'hover:bg-gray-400/10'
    }
  ]

  return (
    <>
      <SEO 
        title="HiroSuwa - Profile"
        description="Web開発者・コンテンツクリエイター"
      />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            {/* ヘッダーセクション */}
            <div className="text-center mb-16">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative inline-block mb-8"
              >
                <div className="w-40 h-40 mx-auto rounded-full overflow-hidden ring-4 ring-purple-500/50">
                  <OptimizedImage
                    src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?w=400&q=80"
                    alt="HiroSuwa"
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center border-4 border-gray-900">
                  <span className="text-white text-sm">✓</span>
                </div>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-black mb-4 font-display">
                <span className="text-gradient-animation">HiroSuwa</span>
              </h1>
              <p className="text-2xl text-gray-300 mb-8">
                Web Developer & Content Creator
              </p>

              {/* ソーシャルリンク */}
              <div className="flex justify-center gap-4 mb-12">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`p-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 ${link.bgColor} ${link.color} transition-all duration-300 hover:scale-110`}
                  >
                    <link.icon className="w-6 h-6" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* 自己紹介 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="premium-card p-8 mb-12"
            >
              <h2 className="text-3xl font-bold text-white mb-6 font-display">About Me</h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  Webテクノロジーとコンテンツ制作に情熱を注ぐクリエイターです。
                  最新の技術トレンドを追いかけながら、実践的な知識を共有することを大切にしています。
                </p>
                <p>
                  React、Next.js、TypeScriptを中心としたモダンなWeb開発を専門とし、
                  YouTube、note、X (Twitter) を通じて技術情報を発信しています。
                </p>
                <p>
                  「技術で世界をもっと面白く」をモットーに、日々新しいチャレンジを続けています。
                </p>
              </div>
            </motion.div>

            {/* 活動統計 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            >
              <div className="premium-card p-6 text-center hover-lift">
                <Youtube className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">50+</div>
                <p className="text-gray-400">YouTube Videos</p>
              </div>
              
              <div className="premium-card p-6 text-center hover-lift">
                <FileText className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">100+</div>
                <p className="text-gray-400">note Articles</p>
              </div>
              
              <div className="premium-card p-6 text-center hover-lift">
                <Twitter className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">1K+</div>
                <p className="text-gray-400">Followers</p>
              </div>
            </motion.div>

            {/* コンタクト */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold text-white mb-6 font-display">Get in Touch</h2>
              <p className="text-gray-300 mb-8">
                コラボレーションやお仕事のご相談はお気軽にどうぞ
              </p>
              <a
                href="/contact"
                className="btn-premium inline-flex items-center gap-2"
              >
                <Mail className="w-5 h-5" />
                <span>Contact Me</span>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  )
}