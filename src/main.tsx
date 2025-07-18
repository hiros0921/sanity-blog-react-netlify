// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Force rebuild - BrowserRouter fix
console.log('App version: 1.0.2 - Full React App restored')
import './index.css'
import App from './App.tsx'
import { reportWebVitals, addResourceHints } from './utils/performance'
// import { registerServiceWorker, initializeInstallPrompt, initializeOfflineDetection } from './utils/pwa'
import { initializeGA, sendWebVitals } from './lib/analytics'
import { initializeClarity } from './lib/clarity'
import { initializeSentry } from './lib/sentry'

// エラー監視を最初に初期化
initializeSentry()

// 分析ツールの初期化
initializeGA()
initializeClarity()

// リソースヒントを追加
addResourceHints()

// Web Vitalsの監視
if ('web-vital' in window) {
  reportWebVitals((metric: any) => {
    console.log(metric)
    // Google Analyticsに送信
    sendWebVitals(metric)
  })
}

// PWA初期化 - 一時的に無効化
// registerServiceWorker()
// initializeInstallPrompt()
// initializeOfflineDetection()

createRoot(document.getElementById('root')!).render(
  <App />
)