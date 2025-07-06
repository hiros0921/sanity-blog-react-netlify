// IndexedDBを使用したオフラインストレージ管理

interface OfflineData {
  id: string
  type: 'comment' | 'like' | 'bookmark' | 'analytics'
  data: any
  timestamp: number
  synced: boolean
}

class OfflineStorage {
  private dbName = 'HiroSuwaPWA'
  private version = 1
  private db: IDBDatabase | null = null

  async init() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // オフラインデータストア
        if (!db.objectStoreNames.contains('offlineData')) {
          const store = db.createObjectStore('offlineData', { keyPath: 'id' })
          store.createIndex('type', 'type', { unique: false })
          store.createIndex('synced', 'synced', { unique: false })
          store.createIndex('timestamp', 'timestamp', { unique: false })
        }

        // 記事キャッシュストア
        if (!db.objectStoreNames.contains('cachedPosts')) {
          const store = db.createObjectStore('cachedPosts', { keyPath: '_id' })
          store.createIndex('slug', 'slug.current', { unique: true })
          store.createIndex('cachedAt', 'cachedAt', { unique: false })
        }

        // 画像キャッシュメタデータ
        if (!db.objectStoreNames.contains('imageCache')) {
          const store = db.createObjectStore('imageCache', { keyPath: 'url' })
          store.createIndex('cachedAt', 'cachedAt', { unique: false })
          store.createIndex('size', 'size', { unique: false })
        }
      }
    })
  }

  // オフラインデータの保存
  async saveOfflineData(type: OfflineData['type'], data: any): Promise<string> {
    if (!this.db) await this.init()

    const id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const offlineData: OfflineData = {
      id,
      type,
      data,
      timestamp: Date.now(),
      synced: false
    }

    const transaction = this.db!.transaction(['offlineData'], 'readwrite')
    const store = transaction.objectStore('offlineData')
    
    return new Promise((resolve, reject) => {
      const request = store.add(offlineData)
      request.onsuccess = () => resolve(id)
      request.onerror = () => reject(request.error)
    })
  }

  // 未同期データの取得
  async getUnsyncedData(): Promise<OfflineData[]> {
    if (!this.db) await this.init()

    const transaction = this.db!.transaction(['offlineData'], 'readonly')
    const store = transaction.objectStore('offlineData')
    const index = store.index('synced')
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(IDBKeyRange.only(false))
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // データを同期済みとしてマーク
  async markAsSynced(id: string): Promise<void> {
    if (!this.db) await this.init()

    const transaction = this.db!.transaction(['offlineData'], 'readwrite')
    const store = transaction.objectStore('offlineData')
    
    return new Promise((resolve, reject) => {
      const getRequest = store.get(id)
      
      getRequest.onsuccess = () => {
        const data = getRequest.result
        if (data) {
          data.synced = true
          const updateRequest = store.put(data)
          updateRequest.onsuccess = () => resolve()
          updateRequest.onerror = () => reject(updateRequest.error)
        } else {
          resolve()
        }
      }
      
      getRequest.onerror = () => reject(getRequest.error)
    })
  }

  // 記事のキャッシュ
  async cachePost(post: any): Promise<void> {
    if (!this.db) await this.init()

    const cachedPost = {
      ...post,
      cachedAt: Date.now()
    }

    const transaction = this.db!.transaction(['cachedPosts'], 'readwrite')
    const store = transaction.objectStore('cachedPosts')
    
    return new Promise((resolve, reject) => {
      const request = store.put(cachedPost)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  // キャッシュされた記事の取得
  async getCachedPost(slug: string): Promise<any | null> {
    if (!this.db) await this.init()

    const transaction = this.db!.transaction(['cachedPosts'], 'readonly')
    const store = transaction.objectStore('cachedPosts')
    const index = store.index('slug')
    
    return new Promise((resolve, reject) => {
      const request = index.get(slug)
      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  }

  // すべてのキャッシュ記事を取得
  async getAllCachedPosts(): Promise<any[]> {
    if (!this.db) await this.init()

    const transaction = this.db!.transaction(['cachedPosts'], 'readonly')
    const store = transaction.objectStore('cachedPosts')
    
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // 画像キャッシュメタデータの保存
  async saveImageCacheMetadata(url: string, size: number): Promise<void> {
    if (!this.db) await this.init()

    const metadata = {
      url,
      size,
      cachedAt: Date.now()
    }

    const transaction = this.db!.transaction(['imageCache'], 'readwrite')
    const store = transaction.objectStore('imageCache')
    
    return new Promise((resolve, reject) => {
      const request = store.put(metadata)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  // キャッシュサイズの計算
  async calculateCacheSize(): Promise<{ posts: number; images: number; total: number }> {
    if (!this.db) await this.init()

    const transaction = this.db!.transaction(['cachedPosts', 'imageCache'], 'readonly')
    
    const postsStore = transaction.objectStore('cachedPosts')
    const imagesStore = transaction.objectStore('imageCache')
    
    const [posts, images] = await Promise.all([
      new Promise<any[]>((resolve, reject) => {
        const request = postsStore.getAll()
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      }),
      new Promise<any[]>((resolve, reject) => {
        const request = imagesStore.getAll()
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    ])

    // 概算サイズ計算
    const postsSize = JSON.stringify(posts).length
    const imagesSize = images.reduce((total, img) => total + (img.size || 0), 0)

    return {
      posts: postsSize,
      images: imagesSize,
      total: postsSize + imagesSize
    }
  }

  // 古いキャッシュのクリーンアップ
  async cleanupOldCache(maxAge: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
    if (!this.db) await this.init()

    const cutoffTime = Date.now() - maxAge

    // 古い記事の削除
    const postsTransaction = this.db!.transaction(['cachedPosts'], 'readwrite')
    const postsStore = postsTransaction.objectStore('cachedPosts')
    const postsIndex = postsStore.index('cachedAt')
    
    const range = IDBKeyRange.upperBound(cutoffTime)
    const request = postsIndex.openCursor(range)
    
    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result
      if (cursor) {
        cursor.delete()
        cursor.continue()
      }
    }
  }

  // データベースのクリア
  async clearAll(): Promise<void> {
    if (!this.db) await this.init()

    const transaction = this.db!.transaction(['offlineData', 'cachedPosts', 'imageCache'], 'readwrite')
    
    await Promise.all([
      transaction.objectStore('offlineData').clear(),
      transaction.objectStore('cachedPosts').clear(),
      transaction.objectStore('imageCache').clear()
    ])
  }
}

// シングルトンインスタンス
export const offlineStorage = new OfflineStorage()

// オフライン時のアクション保存
export async function saveOfflineAction(type: OfflineData['type'], data: any) {
  try {
    const id = await offlineStorage.saveOfflineData(type, data)
    
    // Service Workerに同期をリクエスト
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready
      await (registration as any).sync.register('sync-offline-data')
    }
    
    return id
  } catch (error) {
    console.error('Failed to save offline action:', error)
    throw error
  }
}

// オフラインデータの同期
export async function syncOfflineData() {
  try {
    const unsyncedData = await offlineStorage.getUnsyncedData()
    
    for (const item of unsyncedData) {
      try {
        // APIに送信（実際のエンドポイントに置き換え）
        const response = await fetch(`/api/${item.type}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.data)
        })
        
        if (response.ok) {
          await offlineStorage.markAsSynced(item.id)
        }
      } catch (error) {
        console.error(`Failed to sync item ${item.id}:`, error)
      }
    }
  } catch (error) {
    console.error('Failed to sync offline data:', error)
  }
}