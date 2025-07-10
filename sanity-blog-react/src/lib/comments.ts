import { useState, useEffect, useCallback } from 'react'

// コメントの型定義
export interface Comment {
  id: string
  postId: string
  author: {
    name: string
    email: string
    avatar?: string
  }
  content: string
  createdAt: string
  updatedAt?: string
  status: 'pending' | 'approved' | 'spam' | 'deleted'
  parentId?: string // 返信の場合
  likes: number
  replies?: Comment[]
}

// コメント通知の型定義
export interface CommentNotification {
  id: string
  type: 'new_comment' | 'reply' | 'moderation'
  comment: Comment
  timestamp: string
  read: boolean
}

// コメント管理クラス
class CommentManager {
  private static instance: CommentManager
  private comments: Map<string, Comment[]> = new Map()
  private notifications: CommentNotification[] = []
  private subscribers: Set<(notification: CommentNotification) => void> = new Set()
  private ws: WebSocket | null = null

  private constructor() {
    this.loadFromStorage()
    this.initializeWebSocket()
  }

  static getInstance(): CommentManager {
    if (!CommentManager.instance) {
      CommentManager.instance = new CommentManager()
    }
    return CommentManager.instance
  }

  // WebSocketの初期化（実際の実装では実際のWebSocketサーバーに接続）
  private initializeWebSocket() {
    // モック実装 - 実際のWebSocketサーバーがある場合はここを変更
    if (typeof window !== 'undefined' && 'WebSocket' in window) {
      try {
        // 実際の実装では ws://your-server.com/comments に接続
        // this.ws = new WebSocket('ws://localhost:8080/comments')
        
        // モック: 5秒ごとにランダムなコメントを生成
        if (import.meta.env.DEV) {
          setInterval(() => {
            const mockComment = this.generateMockComment()
            if (mockComment) {
              this.handleNewComment(mockComment)
            }
          }, 30000) // 30秒ごと
        }
      } catch (error) {
        console.error('WebSocket connection failed:', error)
      }
    }
  }

  // モックコメントの生成
  private generateMockComment(): Comment | null {
    const posts = Array.from(this.comments.keys())
    if (posts.length === 0) return null

    const randomPost = posts[Math.floor(Math.random() * posts.length)]
    const names = ['田中太郎', '山田花子', '鈴木一郎', '佐藤美咲']
    const messages = [
      'とても参考になりました！',
      '素晴らしい記事ですね。',
      'もっと詳しく知りたいです。',
      'これは試してみます！'
    ]

    return {
      id: `comment-${Date.now()}-${Math.random()}`,
      postId: randomPost,
      author: {
        name: names[Math.floor(Math.random() * names.length)],
        email: 'mock@example.com',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`
      },
      content: messages[Math.floor(Math.random() * messages.length)],
      createdAt: new Date().toISOString(),
      status: 'pending',
      likes: 0
    }
  }

  // 新しいコメントの処理
  private handleNewComment(comment: Comment) {
    const postComments = this.comments.get(comment.postId) || []
    postComments.push(comment)
    this.comments.set(comment.postId, postComments)
    
    // 通知を作成
    const notification: CommentNotification = {
      id: `notif-${Date.now()}`,
      type: comment.parentId ? 'reply' : 'new_comment',
      comment,
      timestamp: new Date().toISOString(),
      read: false
    }
    
    this.notifications.unshift(notification)
    this.saveToStorage()
    
    // サブスクライバーに通知
    this.subscribers.forEach(callback => callback(notification))
  }

  // コメントの投稿
  async postComment(comment: Omit<Comment, 'id' | 'createdAt' | 'likes'>): Promise<Comment> {
    const newComment: Comment = {
      ...comment,
      id: `comment-${Date.now()}-${Math.random()}`,
      createdAt: new Date().toISOString(),
      likes: 0
    }

    const postComments = this.comments.get(comment.postId) || []
    
    if (comment.parentId) {
      // 返信の場合、親コメントを探して追加
      const parentIndex = postComments.findIndex(c => c.id === comment.parentId)
      if (parentIndex !== -1) {
        if (!postComments[parentIndex].replies) {
          postComments[parentIndex].replies = []
        }
        postComments[parentIndex].replies!.push(newComment)
      }
    } else {
      postComments.push(newComment)
    }
    
    this.comments.set(comment.postId, postComments)
    this.saveToStorage()
    
    // WebSocketで送信（実際の実装）
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'new_comment', comment: newComment }))
    }
    
    // 通知を作成
    this.handleNewComment(newComment)
    
    return newComment
  }

  // コメントの取得
  getComments(postId: string, includeDeleted = false): Comment[] {
    const comments = this.comments.get(postId) || []
    return comments.filter(comment => 
      includeDeleted || comment.status !== 'deleted'
    )
  }

  // コメントのモデレーション
  async moderateComment(commentId: string, action: 'approve' | 'spam' | 'delete'): Promise<void> {
    for (const [postId, comments] of this.comments) {
      const commentIndex = comments.findIndex(c => c.id === commentId)
      if (commentIndex !== -1) {
        comments[commentIndex].status = action === 'delete' ? 'deleted' : action === 'approve' ? 'approved' : 'spam'
        this.comments.set(postId, comments)
        this.saveToStorage()
        
        // モデレーション通知
        const notification: CommentNotification = {
          id: `notif-${Date.now()}`,
          type: 'moderation',
          comment: comments[commentIndex],
          timestamp: new Date().toISOString(),
          read: false
        }
        
        this.notifications.unshift(notification)
        this.subscribers.forEach(callback => callback(notification))
        break
      }
    }
  }

  // いいねの追加
  async likeComment(commentId: string): Promise<void> {
    for (const [postId, comments] of this.comments) {
      const comment = comments.find(c => c.id === commentId)
      if (comment) {
        comment.likes++
        this.comments.set(postId, comments)
        this.saveToStorage()
        break
      }
    }
  }

  // 通知の購読
  subscribe(callback: (notification: CommentNotification) => void): () => void {
    this.subscribers.add(callback)
    return () => this.subscribers.delete(callback)
  }

  // 通知の取得
  getNotifications(unreadOnly = false): CommentNotification[] {
    return unreadOnly 
      ? this.notifications.filter(n => !n.read)
      : this.notifications
  }

  // 通知を既読にする
  markNotificationAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
      this.saveToStorage()
    }
  }

  // 全ての通知を既読にする
  markAllNotificationsAsRead(): void {
    this.notifications.forEach(n => n.read = true)
    this.saveToStorage()
  }

  // ストレージから読み込み
  private loadFromStorage() {
    try {
      const savedComments = localStorage.getItem('blog_comments')
      if (savedComments) {
        const data = JSON.parse(savedComments)
        this.comments = new Map(Object.entries(data))
      }
      
      const savedNotifications = localStorage.getItem('comment_notifications')
      if (savedNotifications) {
        this.notifications = JSON.parse(savedNotifications)
      }
    } catch (error) {
      console.error('Failed to load comments from storage:', error)
    }
  }

  // ストレージに保存
  private saveToStorage() {
    try {
      const commentsData = Object.fromEntries(this.comments)
      localStorage.setItem('blog_comments', JSON.stringify(commentsData))
      localStorage.setItem('comment_notifications', JSON.stringify(this.notifications))
    } catch (error) {
      console.error('Failed to save comments to storage:', error)
    }
  }

  // クリーンアップ
  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}

// React Hooks
export function useComments(postId: string) {
  const manager = CommentManager.getInstance()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setComments(manager.getComments(postId))
    setLoading(false)
  }, [postId])

  const postComment = useCallback(async (comment: Omit<Comment, 'id' | 'createdAt' | 'likes' | 'postId'>) => {
    const newComment = await manager.postComment({ ...comment, postId })
    setComments(manager.getComments(postId))
    return newComment
  }, [postId])

  const likeComment = useCallback(async (commentId: string) => {
    await manager.likeComment(commentId)
    setComments(manager.getComments(postId))
  }, [postId])

  return {
    comments,
    loading,
    postComment,
    likeComment
  }
}

// 通知用Hook
export function useCommentNotifications() {
  const manager = CommentManager.getInstance()
  const [notifications, setNotifications] = useState<CommentNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const updateNotifications = () => {
      const allNotifications = manager.getNotifications()
      setNotifications(allNotifications)
      setUnreadCount(allNotifications.filter(n => !n.read).length)
    }

    updateNotifications()

    const unsubscribe = manager.subscribe(() => {
      updateNotifications()
    })

    return unsubscribe
  }, [])

  const markAsRead = useCallback((notificationId: string) => {
    manager.markNotificationAsRead(notificationId)
    setNotifications(manager.getNotifications())
    setUnreadCount(manager.getNotifications(true).length)
  }, [])

  const markAllAsRead = useCallback(() => {
    manager.markAllNotificationsAsRead()
    setNotifications(manager.getNotifications())
    setUnreadCount(0)
  }, [])

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead
  }
}

// モデレーション用Hook
export function useCommentModeration() {
  const manager = CommentManager.getInstance()

  const moderateComment = useCallback(async (commentId: string, action: 'approve' | 'spam' | 'delete') => {
    await manager.moderateComment(commentId, action)
  }, [])

  return {
    moderateComment
  }
}

// グローバルインスタンスをエクスポート
export const commentManager = CommentManager.getInstance()