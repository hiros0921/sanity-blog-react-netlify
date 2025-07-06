import PremiumHeroSection from './PremiumHeroSection'
import StatsSection from './StatsSection'
import PremiumBlogList from './PremiumBlogList'
import PremiumVideoSection from './PremiumVideoSection'
import SocialMediaFeeds from './SocialMediaFeeds'
import BooksSection from './BooksSection'
import TestimonialsSection from './TestimonialsSection'
import NewsletterAdvanced from './NewsletterAdvanced'
import SEO from './SEO'
import { motion } from 'framer-motion'

export default function PremiumHomePage() {
  return (
    <>
      <SEO 
        title="HiroSuwa - Premium Content Platform"
        description="Web開発とコンテンツ制作の最新情報をお届け"
      />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <PremiumHeroSection />
        <StatsSection />
        <SocialMediaFeeds />
        <PremiumBlogList />
        <PremiumVideoSection />
        <BooksSection />
        <NewsletterAdvanced />
        <TestimonialsSection />
      </motion.div>
    </>
  )
}