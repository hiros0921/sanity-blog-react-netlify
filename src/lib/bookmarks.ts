import { useState, useEffect, useCallback } from 'react'

// ブックマークの型定義
export interface Bookmark {
  id: string
  postId: string
  postTitle: string
  postSlug: string
  postExcerpt?: string
  postImage?: string
  createdAt: string
  tags: string[]
  notes?: string
  readingProgress?: number // 0-100
  lastReadAt?: string
}

// 読書リストの型定義
export interface ReadingList {
  id: string
  name: string
  description?: string
  bookmarkIds: string[]
  isPublic: boolean
  createdAt: string
  updatedAt: string
  color?: string
  icon?: string
}

// いいねの型定義
export interface PostLike {
  postId: string
  likedAt: string
}

// 統計情報の型定義
export interface BookmarkStats {
  totalBookmarks: number
  totalLikes: number
  readingLists: number
  completedReading: number
  averageReadingProgress: number
}

// ブックマーク管理クラス
class BookmarkManager {
  private static instance: BookmarkManager
  private bookmarks: Map<string, Bookmark> = new Map()
  private readingLists: Map<string, ReadingList> = new Map()
  private likes: Set<string> = new Set()
  private subscribers: Set<() => void> = new Set()

  private constructor() {
    this.loadFromStorage()
  }

  static getInstance(): BookmarkManager {
    if (!BookmarkManager.instance) {
      BookmarkManager.instance = new BookmarkManager()
    }
    return BookmarkManager.instance
  }

  // ブックマークの追加/削除
  async toggleBookmark(post: {
    id: string
    title: string
    slug: string
    excerpt?: string
    mainImage?: string
  }): Promise<boolean> {
    const existingBookmark = this.getBookmarkByPostId(post.id)
    
    if (existingBookmark) {
      // 削除
      this.bookmarks.delete(existingBookmark.id)
      
      // 読書リストからも削除
      for (const list of this.readingLists.values()) {
        list.bookmarkIds = list.bookmarkIds.filter(id => id !== existingBookmark.id)
        list.updatedAt = new Date().toISOString()
      }
    } else {
      // 追加
      const bookmark: Bookmark = {
        id: `bookmark-${Date.now()}-${Math.random()}`,
        postId: post.id,
        postTitle: post.title,
        postSlug: post.slug,
        postExcerpt: post.excerpt,
        postImage: post.mainImage,
        createdAt: new Date().toISOString(),
        tags: [],
        readingProgress: 0
      }
      
      this.bookmarks.set(bookmark.id, bookmark)
    }
    
    this.saveToStorage()
    this.notifySubscribers()
    
    return !existingBookmark
  }

  // いいねの追加/削除
  async toggleLike(postId: string): Promise<boolean> {
    if (this.likes.has(postId)) {
      this.likes.delete(postId)
    } else {
      this.likes.add(postId)
    }
    
    this.saveToStorage()
    this.notifySubscribers()
    
    return this.likes.has(postId)
  }

  // ブックマークの取得
  getBookmarkByPostId(postId: string): Bookmark | undefined {
    return Array.from(this.bookmarks.values()).find(b => b.postId === postId)
  }

  // すべてのブックマークを取得
  getAllBookmarks(sortBy: 'date' | 'title' | 'progress' = 'date'): Bookmark[] {
    const bookmarks = Array.from(this.bookmarks.values())
    
    switch (sortBy) {
      case 'title':
        return bookmarks.sort((a, b) => a.postTitle.localeCompare(b.postTitle))
      case 'progress':
        return bookmarks.sort((a, b) => (b.readingProgress || 0) - (a.readingProgress || 0))
      default:
        return bookmarks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
  }

  // タグでフィルタリング
  getBookmarksByTag(tag: string): Bookmark[] {
    return Array.from(this.bookmarks.values()).filter(b => b.tags.includes(tag))
  }

  // 読書リストの作成
  createReadingList(data: {
    name: string
    description?: string
    isPublic?: boolean
    color?: string
    icon?: string
  }): ReadingList {
    const list: ReadingList = {
      id: `list-${Date.now()}-${Math.random()}`,
      name: data.name,
      description: data.description,
      bookmarkIds: [],
      isPublic: data.isPublic || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      color: data.color,
      icon: data.icon
    }
    
    this.readingLists.set(list.id, list)
    this.saveToStorage()
    this.notifySubscribers()
    
    return list
  }

  // 読書リストにブックマークを追加
  addToReadingList(listId: string, bookmarkId: string): void {
    const list = this.readingLists.get(listId)
    if (list && !list.bookmarkIds.includes(bookmarkId)) {
      list.bookmarkIds.push(bookmarkId)
      list.updatedAt = new Date().toISOString()
      this.saveToStorage()
      this.notifySubscribers()
    }
  }

  // 読書リストからブックマークを削除
  removeFromReadingList(listId: string, bookmarkId: string): void {
    const list = this.readingLists.get(listId)
    if (list) {
      list.bookmarkIds = list.bookmarkIds.filter(id => id !== bookmarkId)
      list.updatedAt = new Date().toISOString()
      this.saveToStorage()
      this.notifySubscribers()
    }
  }

  // 読書リストの更新
  updateReadingList(listId: string, updates: Partial<ReadingList>): void {
    const list = this.readingLists.get(listId)
    if (list) {
      Object.assign(list, updates)
      list.updatedAt = new Date().toISOString()
      this.saveToStorage()
      this.notifySubscribers()
    }
  }

  // 読書リストの削除
  deleteReadingList(listId: string): void {
    this.readingLists.delete(listId)
    this.saveToStorage()
    this.notifySubscribers()
  }

  // すべての読書リストを取得
  getAllReadingLists(): ReadingList[] {
    return Array.from(this.readingLists.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  }

  // 読書リストのブックマークを取得
  getBookmarksByList(listId: string): Bookmark[] {
    const list = this.readingLists.get(listId)
    if (!list) return []
    
    return list.bookmarkIds
      .map(id => this.bookmarks.get(id))
      .filter(Boolean) as Bookmark[]
  }

  // 読書の進捗を更新
  updateReadingProgress(bookmarkId: string, progress: number): void {
    const bookmark = this.bookmarks.get(bookmarkId)
    if (bookmark) {
      bookmark.readingProgress = Math.min(100, Math.max(0, progress))
      bookmark.lastReadAt = new Date().toISOString()
      this.saveToStorage()
      this.notifySubscribers()
    }
  }

  // タグの追加
  addTag(bookmarkId: string, tag: string): void {
    const bookmark = this.bookmarks.get(bookmarkId)
    if (bookmark && !bookmark.tags.includes(tag)) {
      bookmark.tags.push(tag)
      this.saveToStorage()
      this.notifySubscribers()
    }
  }

  // タグの削除
  removeTag(bookmarkId: string, tag: string): void {
    const bookmark = this.bookmarks.get(bookmarkId)
    if (bookmark) {
      bookmark.tags = bookmark.tags.filter(t => t !== tag)
      this.saveToStorage()
      this.notifySubscribers()
    }
  }

  // メモの更新
  updateNotes(bookmarkId: string, notes: string): void {
    const bookmark = this.bookmarks.get(bookmarkId)
    if (bookmark) {
      bookmark.notes = notes
      this.saveToStorage()
      this.notifySubscribers()
    }
  }

  // すべてのタグを取得
  getAllTags(): string[] {
    const tags = new Set<string>()
    this.bookmarks.forEach(bookmark => {
      bookmark.tags.forEach(tag => tags.add(tag))
    })
    return Array.from(tags).sort()
  }

  // 統計情報を取得
  getStats(): BookmarkStats {
    const bookmarks = Array.from(this.bookmarks.values())
    const totalProgress = bookmarks.reduce((sum, b) => sum + (b.readingProgress || 0), 0)
    
    return {
      totalBookmarks: bookmarks.length,
      totalLikes: this.likes.size,
      readingLists: this.readingLists.size,
      completedReading: bookmarks.filter(b => b.readingProgress === 100).length,
      averageReadingProgress: bookmarks.length > 0 ? totalProgress / bookmarks.length : 0
    }
  }

  // 記事がブックマークされているか確認
  isBookmarked(postId: string): boolean {
    return Array.from(this.bookmarks.values()).some(b => b.postId === postId)
  }

  // 記事がいいねされているか確認
  isLiked(postId: string): boolean {
    return this.likes.has(postId)
  }

  // 購読
  subscribe(callback: () => void): () => void {
    this.subscribers.add(callback)
    return () => this.subscribers.delete(callback)
  }

  // 通知
  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback())
  }

  // ストレージから読み込み
  private loadFromStorage(): void {
    try {
      const savedBookmarks = localStorage.getItem('blog_bookmarks')
      if (savedBookmarks) {
        const data = JSON.parse(savedBookmarks)
        this.bookmarks = new Map(Object.entries(data))
      }
      
      const savedLists = localStorage.getItem('reading_lists')
      if (savedLists) {
        const data = JSON.parse(savedLists)
        this.readingLists = new Map(Object.entries(data))
      }
      
      const savedLikes = localStorage.getItem('post_likes')
      if (savedLikes) {
        this.likes = new Set(JSON.parse(savedLikes))
      }
    } catch (error) {
      console.error('Failed to load bookmarks from storage:', error)
    }
  }

  // ストレージに保存
  private saveToStorage(): void {
    try {
      localStorage.setItem('blog_bookmarks', JSON.stringify(Object.fromEntries(this.bookmarks)))
      localStorage.setItem('reading_lists', JSON.stringify(Object.fromEntries(this.readingLists)))
      localStorage.setItem('post_likes', JSON.stringify(Array.from(this.likes)))
    } catch (error) {
      console.error('Failed to save bookmarks to storage:', error)
    }
  }
}

// React Hooks
export function useBookmarks() {
  const manager = BookmarkManager.getInstance()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [readingLists, setReadingLists] = useState<ReadingList[]>([])
  const [stats, setStats] = useState<BookmarkStats>(manager.getStats())

  useEffect(() => {
    const update = () => {
      setBookmarks(manager.getAllBookmarks())
      setReadingLists(manager.getAllReadingLists())
      setStats(manager.getStats())
    }

    update()
    return manager.subscribe(update)
  }, [])

  const toggleBookmark = useCallback(async (post: any) => {
    return await manager.toggleBookmark(post)
  }, [])

  const toggleLike = useCallback(async (postId: string) => {
    return await manager.toggleLike(postId)
  }, [])

  const createReadingList = useCallback((data: any) => {
    return manager.createReadingList(data)
  }, [])

  const addToReadingList = useCallback((listId: string, bookmarkId: string) => {
    manager.addToReadingList(listId, bookmarkId)
  }, [])

  const updateReadingProgress = useCallback((bookmarkId: string, progress: number) => {
    manager.updateReadingProgress(bookmarkId, progress)
  }, [])

  const isBookmarked = useCallback((postId: string) => {
    return manager.isBookmarked(postId)
  }, [])

  const isLiked = useCallback((postId: string) => {
    return manager.isLiked(postId)
  }, [])

  const updateReadingList = useCallback((listId: string, updates: Partial<ReadingList>) => {
    manager.updateReadingList(listId, updates)
  }, [])

  const deleteReadingList = useCallback((listId: string) => {
    manager.deleteReadingList(listId)
  }, [])

  const addTag = useCallback((bookmarkId: string, tag: string) => {
    manager.addTag(bookmarkId, tag)
  }, [])

  const removeTag = useCallback((bookmarkId: string, tag: string) => {
    manager.removeTag(bookmarkId, tag)
  }, [])

  const updateNotes = useCallback((bookmarkId: string, notes: string) => {
    manager.updateNotes(bookmarkId, notes)
  }, [])

  return {
    bookmarks,
    readingLists,
    stats,
    toggleBookmark,
    toggleLike,
    createReadingList,
    addToReadingList,
    updateReadingProgress,
    updateReadingList,
    deleteReadingList,
    addTag,
    removeTag,
    updateNotes,
    isBookmarked,
    isLiked
  }
}

// 特定の投稿用のHook
export function usePostBookmark(postId: string) {
  const manager = BookmarkManager.getInstance()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [bookmark, setBookmark] = useState<Bookmark | undefined>()

  useEffect(() => {
    const update = () => {
      setIsBookmarked(manager.isBookmarked(postId))
      setIsLiked(manager.isLiked(postId))
      setBookmark(manager.getBookmarkByPostId(postId))
    }

    update()
    return manager.subscribe(update)
  }, [postId])

  return {
    isBookmarked,
    isLiked,
    bookmark
  }
}

// グローバルインスタンスをエクスポート
export const bookmarkManager = BookmarkManager.getInstance()