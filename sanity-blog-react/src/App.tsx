import { lazy, Suspense } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './lib/i18n' // i18n初期化
import { ThemeProvider } from './contexts/ThemeContext'
import PremiumHeader from './components/PremiumHeader'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'
import OfflineIndicator from './components/OfflineIndicator'
import ImagePerformanceMonitor from './components/ImagePerformanceMonitor'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import PWAUpdatePrompt from './components/PWAUpdatePrompt'
import PushNotificationManager from './components/PushNotificationManager'
import AnalyticsDashboard from './components/AnalyticsDashboard'
import ABTestDashboard from './components/ABTestDashboard'
import CommentModeration from './components/CommentModeration'
import { usePageTracking } from './hooks/useAnalytics'

// 遅延読み込みコンポーネント
const PremiumHomePage = lazy(() => import('./components/PremiumHomePage'))
const BlogList = lazy(() => import('./components/BlogList'))
const BlogPost = lazy(() => import('./components/BlogPost'))
const VideosPage = lazy(() => import('./components/VideosPage'))
const UpdatedProfilePage = lazy(() => import('./components/UpdatedProfilePage'))
const ContactPage = lazy(() => import('./components/ContactPage'))
const CodeDemoPage = lazy(() => import('./components/CodeDemoPage'))
const BookmarksDashboard = lazy(() => import('./components/BookmarksDashboard'))
const PricingPage = lazy(() => import('./components/PricingPage'))
const UserDashboard = lazy(() => import('./components/UserDashboard'))

// ローディングコンポーネント
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
        <div className="w-16 h-16 border-4 border-blue-500 rounded-full absolute top-0 left-0 animate-spin border-t-transparent"></div>
      </div>
    </div>
  )
}

function App() {
  // ページトラッキングを有効化
  usePageTracking()
  
  return (
    <HelmetProvider>
      <ThemeProvider>
        <Router>
        <CustomCursor />
        <OfflineIndicator />
        <ImagePerformanceMonitor />
        <PWAInstallPrompt />
        <PWAUpdatePrompt />
        <PushNotificationManager />
        <AnalyticsDashboard />
        <ABTestDashboard />
        <CommentModeration />
        <div className="min-h-screen flex flex-col">
          <PremiumHeader />
          <main className="flex-1">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<PremiumHomePage />} />
                <Route path="/blog" element={<BlogList />} />
                <Route path="/post/:slug" element={<BlogPost />} />
                <Route path="/videos" element={<VideosPage />} />
                <Route path="/profile" element={<UpdatedProfilePage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/code-samples" element={<CodeDemoPage />} />
                <Route path="/library" element={<BookmarksDashboard />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/dashboard" element={<UserDashboard />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  )
}

export default App