import { lazy, Suspense } from 'react'
import SEO from './SEO'

// Critical components only for mobile
const MobileHeroSection = lazy(() => import('./MobileHeroSection'))
const StatsSection = lazy(() => import('./StatsSection'))
const PremiumBlogList = lazy(() => import('./PremiumBlogList'))

// Simple skeleton for mobile
const MobileSkeleton = () => (
  <div className="animate-pulse bg-gray-200 h-64 m-4 rounded-lg"></div>
)

export default function MobilePremiumHomePage() {
  return (
    <>
      <SEO 
        title="HiroSuwa - Premium Content Platform"
        description="Web開発とコンテンツ制作の最新情報をお届け"
      />
      
      {/* Minimal hero section for mobile */}
      <Suspense fallback={<div className="h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900" />}>
        <MobileHeroSection />
      </Suspense>
      
      {/* Only essential sections for mobile */}
      <Suspense fallback={<MobileSkeleton />}>
        <StatsSection />
      </Suspense>
      
      <Suspense fallback={<MobileSkeleton />}>
        <PremiumBlogList />
      </Suspense>
      
      {/* Lazy load other sections on scroll */}
      <div className="text-center py-8">
        <p className="text-gray-600">スクロールして続きを読む</p>
      </div>
    </>
  )
}