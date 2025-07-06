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
}