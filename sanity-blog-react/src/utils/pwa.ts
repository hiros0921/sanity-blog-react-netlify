// Service Worker登録
export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('Service Worker registered:', registration)

      // 更新があれば自動的にアップデート
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // 新しいコンテンツが利用可能
              console.log('New content available, please refresh')
              // ユーザーに通知
              if (confirm('新しいバージョンが利用可能です。リロードしますか？')) {
                window.location.reload()
              }
            }
          })
        }
      })

      return registration
    } catch (error) {
      console.error('Service Worker registration failed:', error)
    }
  }
}

// インストールプロンプト
let deferredPrompt: any

export function initializeInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
    // インストールボタンを表示
    showInstallButton()
  })
}

function showInstallButton() {
  // インストールボタンのロジックをここに実装
  const installButton = document.getElementById('install-button')
  if (installButton) {
    installButton.style.display = 'block'
    installButton.addEventListener('click', handleInstallClick)
  }
}

async function handleInstallClick() {
  if (!deferredPrompt) return

  deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice

  if (outcome === 'accepted') {
    console.log('User accepted the install prompt')
  } else {
    console.log('User dismissed the install prompt')
  }

  deferredPrompt = null
}

// オフライン検知
export function initializeOfflineDetection() {
  window.addEventListener('online', () => {
    console.log('Back online')
    document.body.classList.remove('offline')
  })

  window.addEventListener('offline', () => {
    console.log('Gone offline')
    document.body.classList.add('offline')
  })
}

// プッシュ通知の許可リクエスト
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  return false
}

// バックグラウンド同期の登録
export async function registerBackgroundSync() {
  const registration = await navigator.serviceWorker.ready

  if ('sync' in registration) {
    try {
      await (registration as any).sync.register('sync-posts')
      console.log('Background sync registered')
    } catch (error) {
      console.error('Background sync registration failed:', error)
    }
  }
}