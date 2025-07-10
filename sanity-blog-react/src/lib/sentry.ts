// Sentry Error Monitoring Configuration
import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

// Sentry DSN（環境変数から取得）
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN || ''

// Sentryの初期化
export function initializeSentry() {
  if (!SENTRY_DSN || import.meta.env.DEV) return

  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [
      new BrowserTracing({
        // トランザクションの設定
        tracingOrigins: ['localhost', /^\//],
      }) as any,
    ],
    // パフォーマンス監視
    tracesSampleRate: 0.1,
    // リリース情報
    release: import.meta.env.VITE_SENTRY_RELEASE || 'unknown',
    // 環境
    environment: import.meta.env.MODE,
    // エラーの前処理
    beforeSend(event, hint) {
      // 開発環境のエラーは送信しない
      if (window.location.hostname === 'localhost') {
        return null
      }
      
      // 特定のエラーをフィルタリング
      if (event.exception) {
        const error = hint.originalException as Error
        // ネットワークエラーは除外
        if (error?.message?.includes('Network')) {
          return null
        }
      }
      
      return event
    },
    // ブレッドクラムの設定
    beforeBreadcrumb(breadcrumb) {
      // コンソールログは除外
      if (breadcrumb.category === 'console') {
        return null
      }
      return breadcrumb
    },
    // 無視するエラー
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      /extension\//i,
      /^chrome:\/\//i,
      /^moz-extension:\/\//i
    ],
    // 無視するURL
    denyUrls: [
      /extensions\//i,
      /^chrome:\/\//i,
      /^moz-extension:\/\//i
    ]
  })
}

// ユーザー情報の設定
export function setSentryUser(user: {
  id?: string
  email?: string
  username?: string
  [key: string]: any
}) {
  Sentry.setUser(user)
}

// ユーザー情報のクリア
export function clearSentryUser() {
  Sentry.setUser(null)
}

// カスタムコンテキストの設定
export function setSentryContext(key: string, context: Record<string, any>) {
  Sentry.setContext(key, context)
}

// タグの設定
export function setSentryTag(key: string, value: string) {
  Sentry.setTag(key, value)
}

// 追加データの設定
export function setSentryExtra(key: string, extra: any) {
  Sentry.setExtra(key, extra)
}

// エラーの手動キャプチャ
export function captureError(error: Error | string, context?: Record<string, any>) {
  if (typeof error === 'string') {
    Sentry.captureMessage(error, 'error')
  } else {
    Sentry.captureException(error, {
      contexts: context
    })
  }
}

// メッセージのキャプチャ
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  Sentry.captureMessage(message, level)
}

// パフォーマンストランザクションの開始（削除）

// カスタムブレッドクラムの追加
export function addBreadcrumb(breadcrumb: {
  message: string
  category?: string
  level?: Sentry.SeverityLevel
  data?: Record<string, any>
}) {
  Sentry.addBreadcrumb(breadcrumb)
}

// プロファイリング
export const profiler = Sentry.withProfiler

// エラーバウンダリコンポーネント
export const ErrorBoundary = Sentry.ErrorBoundary

// エラーバウンダリのフォールバックコンポーネント用の型定義
export interface ErrorFallbackProps {
  error: Error
  resetError: () => void
}