// Microsoft Clarity Configuration
declare global {
  interface Window {
    clarity: (...args: any[]) => void
  }
}

// Clarity Project ID（環境変数から取得）
const CLARITY_PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID || ''

// Microsoft Clarity の初期化
export function initializeClarity() {
  if (typeof window === 'undefined' || !CLARITY_PROJECT_ID) return

  // Clarity スクリプトの挿入
  (function(c: any, l: any, a: string, _r: string, i: string) {
    c[a] = c[a] || function() {
      (c[a].q = c[a].q || []).push(arguments)
    }
    const t = l.createElement('script') as HTMLScriptElement
    t.async = true
    t.src = 'https://www.clarity.ms/tag/' + i
    const y = l.getElementsByTagName('script')[0]
    y.parentNode?.insertBefore(t, y)
  })(window, document, 'clarity', 'script', CLARITY_PROJECT_ID)
}

// カスタムタグの設定
export function setClarityCustomTag(key: string, value: string | number | boolean) {
  if (typeof window === 'undefined' || !window.clarity) return

  window.clarity('set', key, value)
}

// ユーザーIDの設定
export function setClarityUserId(userId: string) {
  if (typeof window === 'undefined' || !window.clarity) return

  window.clarity('identify', userId)
}

// セッション変数の設定
export function setClaritySessionTag(key: string, value: string | number | boolean) {
  if (typeof window === 'undefined' || !window.clarity) return

  window.clarity('set', key, value, 'session')
}

// ページ変数の設定
export function setClarityPageTag(key: string, value: string | number | boolean) {
  if (typeof window === 'undefined' || !window.clarity) return

  window.clarity('set', key, value, 'page')
}

// Clarityの有効化/無効化
export function toggleClarity(enable: boolean) {
  if (typeof window === 'undefined' || !window.clarity) return

  if (enable) {
    window.clarity('start')
  } else {
    window.clarity('stop')
  }
}

// プライバシー設定
export function updateClarityConsent(hasConsent: boolean) {
  if (typeof window === 'undefined' || !window.clarity) return

  window.clarity('consent', hasConsent)
}

// カスタムイベントの送信
export function trackClarityEvent(eventName: string) {
  if (typeof window === 'undefined' || !window.clarity) return

  window.clarity('event', eventName)
}