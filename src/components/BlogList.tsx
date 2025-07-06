import { useEffect, useState } from 'react'
import { client, urlFor } from '../lib/sanity'
import type { BlogPost } from '../types/blog'
import SEO from './SEO'
import ABTestBlogCard from './ABTestBlogCard'

const BLOG_QUERY = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  _createdAt,
  title,
  slug,
  author->{
    _id,
    name,
    image
  },
  mainImage,
  categories[]->{
    _id,
    title,
    slug
  },
  publishedAt,
  excerpt
}`

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log('Fetching posts...')
        const data = await client.fetch(BLOG_QUERY)
        console.log('Fetched data:', data)
        setPosts(data)
      } catch (error) {
        console.error('Error fetching posts:', error)
        // テスト用のモックデータ
        const mockData = [
          {
            _id: "1",
            _createdAt: "2025-01-01T00:00:00Z",
            title: "テスト記事1",
            slug: { current: "test-post-1" },
            author: { _id: "1", name: "テスト著者" },
            publishedAt: "2025-01-01T00:00:00Z",
            excerpt: "これはテスト記事です。Sanity APIに接続できない場合のデモ用データです。",
            mainImage: {
              asset: { _id: "image-1", url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80" },
              alt: "Blog post image"
            }
          },
          {
            _id: "2",
            _createdAt: "2025-01-02T00:00:00Z",
            title: "テスト記事2",
            slug: { current: "test-post-2" },
            author: { _id: "1", name: "テスト著者" },
            publishedAt: "2025-01-02T00:00:00Z",
            excerpt: "2つ目のテスト記事です。",
            categories: [{ _id: "1", title: "テスト", slug: { current: "test" } }],
            mainImage: {
              asset: { _id: "image-2", url: "https://images.unsplash.com/photo-1520085601670-ee14aa5fa3e8?w=800&q=80" },
              alt: "Blog post image"
            }
          }
        ]
        setPosts(mockData as any)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <>
      <SEO title="Blog Posts" description="Read our latest blog posts and articles" />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Blog Posts
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Discover our latest thoughts and insights
            </p>
          </div>
          
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-300 mb-4">No blog posts found.</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Check the browser console for any errors.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => {
                // A/Bテスト用のデータを整形
                const formattedPost = {
                  _id: post._id,
                  title: post.title,
                  slug: post.slug.current,
                  summary: post.excerpt || '',
                  publishedAt: post.publishedAt,
                  mainImage: post.mainImage ? {
                    url: urlFor(post.mainImage),
                    alt: post.mainImage.alt
                  } : undefined,
                  categories: post.categories?.map(cat => ({ title: cat.title })),
                  estimatedReadingTime: Math.ceil((post.excerpt?.length || 200) / 200) // 仮の読み時間計算
                }
                
                return (
                  <ABTestBlogCard
                    key={post._id}
                    post={formattedPost}
                    index={index}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}