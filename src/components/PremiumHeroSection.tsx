import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ArrowDown, Sparkles, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import ABTestButton from './ABTestButton'

export default function PremiumHeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { scrollY } = useScroll()
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })
  
  const y1 = useTransform(scrollY, [0, 300], [0, 50])
  const y2 = useTransform(scrollY, [0, 300], [0, -50])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden particle-bg">
      {/* アニメーション背景 */}
      <div className="absolute inset-0 animated-gradient opacity-30"></div>
      
      {/* 3Dエフェクト要素 */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"
      />
      <motion.div 
        style={{ y: y2 }}
        className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
      />
      
      {/* フローティング要素 */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            x: mousePosition.x * 0.02,
            y: mousePosition.y * 0.02,
          }}
          transition={{ type: "spring", stiffness: 50 }}
          className="absolute top-1/4 left-1/4 float-animation"
        >
          <Sparkles className="w-8 h-8 text-yellow-400" />
        </motion.div>
        <motion.div
          animate={{
            x: mousePosition.x * -0.03,
            y: mousePosition.y * -0.03,
          }}
          transition={{ type: "spring", stiffness: 50 }}
          className="absolute bottom-1/4 right-1/4 float-animation"
          style={{ animationDelay: '2s' }}
        >
          <Zap className="w-10 h-10 text-blue-400" />
        </motion.div>
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 font-display"
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-gradient-animation">Welcome to</span>
            <br />
            <span className="relative inline-block mt-4">
              <span className="text-gradient-animation">The Future</span>
              <motion.span
                className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 blur-2xl opacity-50"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </span>
          </motion.h1>

          <motion.p 
            className="text-xl md:text-3xl text-gray-300 mb-12 max-w-3xl mx-auto font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            次世代のコンテンツプラットフォームで、あなたの可能性を解き放つ
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <ABTestButton
              testId="hero_cta"
              testName="ヒーローセクションCTA"
              testDescription="CTAボタンのテキストとスタイルを最適化"
              variantA={{
                text: "探索を始める →",
                style: {
                  backgroundColor: "rgb(59, 130, 246)",
                  hoverBackgroundColor: "rgb(37, 99, 235)",
                  textColor: "white",
                  padding: "1rem 2rem",
                  borderRadius: "9999px",
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  animation: "pulse"
                }
              }}
              variantB={{
                text: "今すぐ始める",
                style: {
                  backgroundColor: "rgb(168, 85, 247)",
                  hoverBackgroundColor: "rgb(147, 51, 234)",
                  textColor: "white",
                  padding: "1.25rem 3rem",
                  borderRadius: "0.75rem",
                  fontSize: "1.25rem",
                  fontWeight: "700",
                  animation: "glow"
                }
              }}
              onClick={() => window.location.href = '/blog'}
              className="inline-block"
            />
            
            <Link 
              to="/videos" 
              className="px-8 py-4 rounded-full font-semibold gradient-border hover-lift backdrop-blur-md bg-white/10 text-white"
            >
              動画を見る
            </Link>
          </motion.div>

          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            style={{ opacity }}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowDown className="w-8 h-8 text-white/50" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}