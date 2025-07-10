import { lazy, Suspense } from 'react'
import PremiumHeroSection from './PremiumHeroSection'
import SEO from './SEO'

// 遅延読み込みコンポーネント
const StatsSection = lazy(() => import('./StatsSection'))
const PremiumBlogList = lazy(() => import('./PremiumBlogList'))
const PremiumVideoSection = lazy(() => import('./PremiumVideoSection'))
const SocialMediaFeeds = lazy(() => import('./SocialMediaFeeds'))
const BooksSection = lazy(() => import('./BooksSection'))
const TestimonialsSection = lazy(() => import('./TestimonialsSection'))
const NewsletterAdvanced = lazy(() => import('./NewsletterAdvanced'))

// スケルトンローダー
const SectionSkeleton = () => (
  <div className="py-16 px-4">
    <div className="max-w-7xl mx-auto">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-8 animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
        ))}
      </div>
    </div>
  </div>
)

export default function OptimizedPremiumHomePage() {
  return (
    <>
      <SEO 
        title="HiroSuwa - Premium Content Platform"
        description="Web開発とコンテンツ制作の最新情報をお届け"
      />
      
      {/* Critical: Hero section loads immediately */}
      <PremiumHeroSection />
      
      {/* Non-critical: Other sections load lazily */}
      <Suspense fallback={<SectionSkeleton />}>
        <StatsSection />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <SocialMediaFeeds />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <PremiumBlogList />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <PremiumVideoSection />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <BooksSection />
      </Suspense>
      
      <Suspense fallback={<div className="py-16" />}>
        <NewsletterAdvanced />
      </Suspense>
      
      <Suspense fallback={<div className="py-16" />}>
        <TestimonialsSection />
      </Suspense>
    </>
  )
}