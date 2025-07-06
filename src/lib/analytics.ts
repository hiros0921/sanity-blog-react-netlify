// Google Analytics 4 Configuration
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

// GA4 Measurement ID（環境変数から取得）
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX'

// Google Analytics の初期化
export function initializeGA() {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return

  // Google Analytics スクリプトの読み込み
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(script)

  // gtag関数の定義
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }
  
  window.gtag('js', new Date())
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false, // 手動でページビューを送信
    cookie_flags: 'SameSite=None;Secure'
  })
}

// ページビューの記録
export function trackPageView(path: string, title?: string) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href
  })
}

// カスタムイベントの記録
export function trackEvent(
  eventName: string,
  parameters?: {
    category?: string
    label?: string
    value?: number
    [key: string]: any
  }
) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', eventName, {
    event_category: parameters?.category,
    event_label: parameters?.label,
    value: parameters?.value,
    ...parameters
  })
}

// ユーザープロパティの設定
export function setUserProperties(properties: Record<string, any>) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('set', 'user_properties', properties)
}

// エラーの追跡
export function trackError(error: Error, fatal = false) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'exception', {
    description: error.message,
    fatal: fatal,
    error_name: error.name,
    error_stack: error.stack
  })
}

// 検索の追跡
export function trackSearch(searchTerm: string, resultsCount?: number) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'search', {
    search_term: searchTerm,
    results_count: resultsCount
  })
}

// シェアの追跡
export function trackShare(method: string, contentType: string, itemId?: string) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'share', {
    method: method,
    content_type: contentType,
    item_id: itemId
  })
}

// スクロール深度の追跡
export function trackScrollDepth(percentage: number) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'scroll', {
    percent_scrolled: percentage
  })
}

// 読了時間の追跡
export function trackReadingTime(seconds: number, articleId?: string) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'reading_time', {
    engagement_time_msec: seconds * 1000,
    article_id: articleId
  })
}

// コンバージョンの追跡
export function trackConversion(conversionType: string, value?: number, currency = 'JPY') {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'conversion', {
    conversion_type: conversionType,
    value: value,
    currency: currency
  })
}

// ユーザーエンゲージメントの追跡
export function trackEngagement(engagementType: string, engagementTime?: number) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'user_engagement', {
    engagement_type: engagementType,
    engagement_time_msec: engagementTime
  })
}

// Web Vitalsの送信
export function sendWebVitals({ name, delta, id }: { name: string; delta: number; id: string }) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', name, {
    event_category: 'Web Vitals',
    event_label: id,
    value: Math.round(name === 'CLS' ? delta * 1000 : delta),
    non_interaction: true
  })
}