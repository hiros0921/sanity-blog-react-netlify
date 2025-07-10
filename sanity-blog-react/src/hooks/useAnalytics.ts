import { useEffect, useRef } from 'react'
// import { useLocation } from 'react-router-dom'
import { trackEvent, trackScrollDepth, trackReadingTime } from '../lib/analytics'
// import { trackPageView } from '../lib/analytics'
// import { setClarityPageTag } from '../lib/clarity'
// import { addBreadcrumb } from '../lib/sentry'

// ページビュートラッキングフック
export function usePageTracking() {
  return // 一時的に無効化
  /* const location = useLocation()
  const prevPathRef = useRef<string>()

  useEffect(() => {
    if (location.pathname !== prevPathRef.current) {
      // Google Analytics
      trackPageView(location.pathname)
      
      // Clarity
      setClarityPageTag('path', location.pathname)
      
      // Sentry
      addBreadcrumb({
        message: `Navigated to ${location.pathname}`,
        category: 'navigation',
        level: 'info'
      })
      
      prevPathRef.current = location.pathname
    }
  }, [location]) */
}

// スクロール深度トラッキングフック
export function useScrollTracking() {
  const hasTracked = useRef<Set<number>>(new Set())

  useEffect(() => {
    let ticking = false
    const thresholds = [25, 50, 75, 90, 100]

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
          const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100)

          thresholds.forEach(threshold => {
            if (scrollPercent >= threshold && !hasTracked.current.has(threshold)) {
              trackScrollDepth(threshold)
              hasTracked.current.add(threshold)
            }
          })

          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
}

// 読了時間トラッキングフック
export function useReadingTimeTracking(articleId?: string) {
  const startTimeRef = useRef<number>(Date.now())
  const isActiveRef = useRef(true)
  const totalTimeRef = useRef(0)

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (isActiveRef.current) {
          totalTimeRef.current += Date.now() - startTimeRef.current
          isActiveRef.current = false
        }
      } else {
        if (!isActiveRef.current) {
          startTimeRef.current = Date.now()
          isActiveRef.current = true
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      
      // コンポーネントのアンマウント時に読了時間を送信
      if (isActiveRef.current) {
        totalTimeRef.current += Date.now() - startTimeRef.current
      }
      
      const readingTimeSeconds = Math.round(totalTimeRef.current / 1000)
      if (readingTimeSeconds > 5) { // 5秒以上読んだ場合のみ送信
        trackReadingTime(readingTimeSeconds, articleId)
      }
    }
  }, [articleId])
}

// クリックトラッキングフック
export function useClickTracking(category: string) {
  const handleClick = (label: string, value?: number) => {
    trackEvent('click', {
      category,
      label,
      value
    })
  }

  return handleClick
}

// エンゲージメントトラッキングフック
export function useEngagementTracking() {
  const engagementStartRef = useRef<number>(Date.now())
  const isEngagedRef = useRef(false)

  useEffect(() => {
    const events = ['click', 'scroll', 'keypress', 'touchstart']
    
    const handleEngagement = () => {
      if (!isEngagedRef.current) {
        isEngagedRef.current = true
        engagementStartRef.current = Date.now()
      }
    }

    events.forEach(event => {
      window.addEventListener(event, handleEngagement, { passive: true })
    })

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleEngagement)
      })
      
      // エンゲージメント時間を送信
      if (isEngagedRef.current) {
        const engagementTime = Date.now() - engagementStartRef.current
        trackEvent('user_engagement', {
          category: 'Engagement',
          value: Math.round(engagementTime / 1000)
        })
      }
    }
  }, [])
}

// ビデオトラッキングフック
export function useVideoTracking(videoId: string) {
  const handlePlay = () => {
    trackEvent('video_start', {
      category: 'Video',
      label: videoId
    })
  }

  const handlePause = () => {
    trackEvent('video_pause', {
      category: 'Video',
      label: videoId
    })
  }

  const handleComplete = () => {
    trackEvent('video_complete', {
      category: 'Video',
      label: videoId
    })
  }

  const handleProgress = (percentage: number) => {
    if (percentage === 25 || percentage === 50 || percentage === 75) {
      trackEvent('video_progress', {
        category: 'Video',
        label: videoId,
        value: percentage
      })
    }
  }

  return { handlePlay, handlePause, handleComplete, handleProgress }
}

// フォームトラッキングフック
export function useFormTracking(formName: string) {
  const fieldInteractionsRef = useRef<Set<string>>(new Set())

  const trackFieldInteraction = (fieldName: string) => {
    if (!fieldInteractionsRef.current.has(fieldName)) {
      fieldInteractionsRef.current.add(fieldName)
      trackEvent('form_field_interaction', {
        category: 'Form',
        label: `${formName} - ${fieldName}`
      })
    }
  }

  const trackFormSubmit = (success: boolean) => {
    trackEvent(success ? 'form_submit_success' : 'form_submit_error', {
      category: 'Form',
      label: formName
    })
  }

  const trackFormAbandon = () => {
    if (fieldInteractionsRef.current.size > 0) {
      trackEvent('form_abandon', {
        category: 'Form',
        label: formName,
        value: fieldInteractionsRef.current.size
      })
    }
  }

  return { trackFieldInteraction, trackFormSubmit, trackFormAbandon }
}