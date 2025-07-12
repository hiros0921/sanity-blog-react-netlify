// Service Worker - Advanced PWA Features
const CACHE_NAME = 'hirosuwa-v3';
const STATIC_CACHE = 'hirosuwa-static-v3';
const DYNAMIC_CACHE = 'hirosuwa-dynamic-v3';
const IMAGE_CACHE = 'hirosuwa-images-v3';

// 静的リソースのキャッシュリスト
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html'
];

// キャッシュ戦略の設定
const CACHE_STRATEGIES = {
  static: {
    cacheName: STATIC_CACHE,
    maxAge: 60 * 60 * 24 * 30, // 30日
  },
  dynamic: {
    cacheName: DYNAMIC_CACHE,
    maxAge: 60 * 60 * 24 * 7, // 7日
    maxItems: 50
  },
  images: {
    cacheName: IMAGE_CACHE,
    maxAge: 60 * 60 * 24 * 30, // 30日
    maxItems: 100
  }
};

// インストール時にキャッシュ
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        // オフラインページを作成
        return createOfflinePage();
      })
  );
  
  self.skipWaiting();
});

// アクティベート時に古いキャッシュを削除
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!Object.values(CACHE_STRATEGIES).some(strategy => strategy.cacheName === cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  self.clients.claim();
});

// フェッチイベントの処理
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 同一オリジンのリクエストのみ処理
  if (url.origin !== location.origin) {
    return;
  }

  // リクエストタイプに応じた処理
  if (request.method === 'GET') {
    // 画像の処理
    if (request.destination === 'image' || /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(url.pathname)) {
      event.respondWith(handleImageRequest(request));
      return;
    }

    // APIリクエストの処理
    if (url.pathname.includes('/api/') || url.hostname.includes('sanity.io')) {
      event.respondWith(handleApiRequest(request));
      return;
    }

    // HTMLページの処理
    if (request.headers.get('accept')?.includes('text/html')) {
      event.respondWith(handlePageRequest(request));
      return;
    }

    // その他の静的リソース
    event.respondWith(handleStaticRequest(request));
  }
});

// 画像リクエストの処理（キャッシュファースト）
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    // バックグラウンドで更新
    fetchAndCache(request, IMAGE_CACHE);
    return cachedResponse;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // プレースホルダー画像を返す
    return new Response(
      `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af">画像を読み込めません</text>
      </svg>`,
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
}

// APIリクエストの処理（ネットワークファースト）
async function handleApiRequest(request) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // キャッシュから返す
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // エラーレスポンス
    return new Response(
      JSON.stringify({ error: 'オフラインです' }),
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// ページリクエストの処理（ネットワークファースト）
async function handlePageRequest(request) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // キャッシュから返す
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // オフラインページを返す
    return caches.match('/offline.html');
  }
}

// 静的リソースの処理（キャッシュファースト）
async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    return new Response('リソースを読み込めません', { status: 404 });
  }
}

// バックグラウンドでフェッチしてキャッシュ
async function fetchAndCache(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response);
    }
  } catch (error) {
    console.error('Background fetch failed:', error);
  }
}

// オフラインページの作成
async function createOfflinePage() {
  const offlineHTML = `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>オフライン - HiroSuwa</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          background: #f3f4f6;
        }
        .container {
          text-align: center;
          padding: 2rem;
          max-width: 400px;
        }
        h1 {
          color: #1f2937;
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        p {
          color: #6b7280;
          margin-bottom: 2rem;
        }
        button {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 0.5rem;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        button:hover {
          background: #2563eb;
        }
        .icon {
          width: 100px;
          height: 100px;
          margin: 0 auto 2rem;
          opacity: 0.5;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"/>
        </svg>
        <h1>オフラインです</h1>
        <p>インターネット接続がありません。接続が回復したら、もう一度お試しください。</p>
        <button onclick="window.location.reload()">再試行</button>
      </div>
    </body>
    </html>
  `;
  
  const cache = await caches.open(STATIC_CACHE);
  const response = new Response(offlineHTML, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
  
  await cache.put('/offline.html', response);
}

// バックグラウンド同期
self.addEventListener('sync', async (event) => {
  console.log('Background sync:', event.tag);
  
  if (event.tag === 'sync-posts') {
    event.waitUntil(syncPosts());
  } else if (event.tag === 'sync-analytics') {
    event.waitUntil(syncAnalytics());
  }
});

async function syncPosts() {
  try {
    // オフライン中に保存されたデータを同期
    const pendingPosts = await getPendingPosts();
    
    for (const post of pendingPosts) {
      await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
      });
    }
    
    await clearPendingPosts();
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

async function syncAnalytics() {
  // アナリティクスデータの同期
  console.log('Syncing analytics data...');
}

// プッシュ通知
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  
  const options = {
    body: data.body || '新しいコンテンツがあります',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    image: data.image,
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: data.id || 1,
      url: data.url || '/'
    },
    actions: [
      {
        action: 'view',
        title: '見る',
        icon: '/icon-view.png'
      },
      {
        action: 'close',
        title: '閉じる',
        icon: '/icon-close.png'
      }
    ],
    tag: data.tag || 'default',
    requireInteraction: true
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'HiroSuwa', options)
  );
});

// 通知クリックの処理
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view' || !event.action) {
    const url = event.notification.data.url || '/';
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // 既存のウィンドウがあればフォーカス
          for (const client of clientList) {
            if (client.url === url && 'focus' in client) {
              return client.focus();
            }
          }
          
          // なければ新しいウィンドウを開く
          if (clients.openWindow) {
            return clients.openWindow(url);
          }
        })
    );
  }
});

// メッセージ処理
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ユーティリティ関数
async function getPendingPosts() {
  // IndexedDBから保留中の投稿を取得
  return [];
}

async function clearPendingPosts() {
  // IndexedDBから保留中の投稿をクリア
}