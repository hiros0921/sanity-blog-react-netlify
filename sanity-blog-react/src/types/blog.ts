export interface Author {
  _id: string
  name: string
  image?: {
    asset: {
      _ref: string
    }
  }
  bio?: string
}

export interface Category {
  _id: string
  title: string
  slug: {
    current: string
  }
}

import type { MembershipTier } from './membership'

export interface BlogPost {
  _id: string
  _createdAt: string
  title: string
  slug: {
    current: string
  }
  author: Author
  mainImage?: {
    asset: {
      _ref: string
    }
    alt?: string
  }
  categories?: Category[]
  publishedAt: string
  body: any[]
  excerpt?: string
  // プレミアムコンテンツ関連
  isPremium?: boolean
  requiredTier?: MembershipTier
  previewContent?: any[] // 無料ユーザー向けのプレビュー
}