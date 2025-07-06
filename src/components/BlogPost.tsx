import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PortableText } from '@portabletext/react'
import { client, urlFor } from '../lib/sanity'
import type { BlogPost as BlogPostType } from '../types/blog'
import EnhancedSEO from './EnhancedSEO'
import OptimizedImage from './OptimizedImage'
import CommentSection from './CommentSection'
import BookmarkButton from './BookmarkButton'
import RelatedPosts from './RelatedPosts'
import ReadingProgress from './ReadingProgress'
import TableOfContents from './TableOfContents'
import { userBehaviorTracker } from '../lib/userBehavior'
import { extractHeadingsFromPortableText, extractHeadingsFromDOM } from '../utils/extractHeadings'
import type { Heading } from '../utils/extractHeadings'

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  _createdAt,
  title,
  slug,
  author->{
    _id,
    name,
    image,
    bio
  },
  mainImage,
  categories[]->{
    _id,
    title,
    slug
  },
  publishedAt,
  body
}`

// 全記事を取得するクエリ
const ALL_POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  _createdAt,
  title,
  slug,
  author->{
    _id,
    name
  },
  mainImage,
  categories[]->{
    _id,
    title
  },
  publishedAt,
  excerpt
}`

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPostType | null>(null)
  const [allPosts, setAllPosts] = useState<BlogPostType[]>([])
  const [loading, setLoading] = useState(true)
  const [headings, setHeadings] = useState<Heading[]>([])
  const readingStartTime = useRef<number>(0)
  const scrollDepthRef = useRef<number>(0)
  const articleRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const [postData, allPostsData] = await Promise.all([
          client.fetch(POST_QUERY, { slug }),
          client.fetch(ALL_POSTS_QUERY)
        ])
        setPost(postData)
        setAllPosts(allPostsData)
      } catch (error) {
        console.error('Error fetching post:', error)
        // モックデータで記事詳細を表示
        console.log('BlogPost: API error, using mock data. Slug:', slug)
        const mockPosts: Record<string, any> = {
          'test-post-1': {
            _id: "1",
            _createdAt: "2025-01-01T00:00:00Z",
            title: "テスト記事1",
            slug: { current: "test-post-1" },
            author: { _id: "1", name: "テスト著者", bio: "これはテスト著者のプロフィールです。" },
            publishedAt: "2025-01-01T00:00:00Z",
            body: [
              {
                _type: "block",
                children: [
                  {
                    _type: "span",
                    text: "これはテスト記事の本文です。Sanity APIに接続できない場合のデモ用データですが、実際のブログと同じように表示されます。"
                  }
                ],
                style: "normal"
              },
              {
                _type: "block",
                children: [
                  {
                    _type: "span",
                    text: "複数の段落も表示できます。リッチテキストエディタで作成されたコンテンツを適切に表示します。"
                  }
                ],
                style: "normal"
              }
            ]
          },
          'test-post-2': {
            _id: "2",
            _createdAt: "2025-01-02T00:00:00Z",
            title: "テスト記事2",
            slug: { current: "test-post-2" },
            author: { _id: "1", name: "テスト著者", bio: "これはテスト著者のプロフィールです。" },
            publishedAt: "2025-01-02T00:00:00Z",
            categories: [{ _id: "1", title: "テスト", slug: { current: "test" } }],
            body: [
              {
                _type: "block",
                children: [
                  {
                    _type: "span",
                    text: "2つ目のテスト記事の本文です。カテゴリータグも表示されています。"
                  }
                ],
                style: "normal"
              }
            ]
          }
        }
        
        console.log('Available mock posts:', Object.keys(mockPosts))
        if (slug && mockPosts[slug]) {
          console.log('Found mock post for slug:', slug)
          setPost(mockPosts[slug])
        } else {
          console.log('No mock post found for slug:', slug)
        }
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchPost()
    }
  }, [slug])

  // ユーザー行動追跡
  useEffect(() => {
    if (!post) return

    // 記事閲覧を記録
    userBehaviorTracker.trackArticleView(
      post._id,
      post.categories?.[0]?.title || 'uncategorized',
      post.categories?.map(cat => cat.title) || []
    )
    
    // 読書開始時間を記録
    readingStartTime.current = Date.now()

    // スクロール深度の追跡
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPosition = window.scrollY
      const scrollPercentage = (scrollPosition / scrollHeight) * 100
      scrollDepthRef.current = Math.max(scrollDepthRef.current, scrollPercentage)
    }

    window.addEventListener('scroll', handleScroll)

    // クリーンアップ時に読書時間を記録
    return () => {
      window.removeEventListener('scroll', handleScroll)
      
      if (readingStartTime.current > 0) {
        const readingDuration = Math.floor((Date.now() - readingStartTime.current) / 1000)
        if (readingDuration > 5) { // 5秒以上読んでいた場合のみ記録
          userBehaviorTracker.trackReadingProgress(
            post._id,
            readingDuration,
            scrollDepthRef.current
          )
        }
      }
    }
  }, [post])

  // 見出しを抽出
  useEffect(() => {
    if (!post || !post.body) return;

    // Portable Textから見出しを抽出
    const portableTextHeadings = extractHeadingsFromPortableText(post.body);
    setHeadings(portableTextHeadings);

    // DOMが更新された後に見出し要素を取得してIDを設定
    setTimeout(() => {
      if (articleRef.current) {
        const domHeadings = extractHeadingsFromDOM(articleRef.current);
        if (domHeadings.length > 0) {
          setHeadings(domHeadings);
        }
      }
    }, 100);
  }, [post])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Link to="/" className="text-blue-600 hover:underline">
            Return to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* 読書プログレスバー */}
      <ReadingProgress />
      
      {/* フローティング目次 */}
      <TableOfContents headings={headings} variant="floating" />
      
      <EnhancedSEO 
        title={`${post.title} | HiroSuwa`}
        description={post.excerpt || `${post.title}についての詳細な解説記事です。プログラミングとWeb開発の最新情報をお届けします。`}
        image={post.mainImage ? urlFor(post.mainImage) : undefined}
        type="article"
        author={post.author?.name || 'HiroSuwa'}
        publishedTime={post.publishedAt}
        modifiedTime={post._createdAt}
        section="Technology"
        tags={post.categories?.map(cat => cat.title) || ['プログラミング', 'Web開発']}
      />
      <article ref={articleRef} className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to posts
      </Link>
      
      {/* インライン目次（見出しが3つ以上ある場合のみ表示） */}
      {headings.length >= 3 && (
        <TableOfContents headings={headings} variant="inline" />
      )}
      
      <header className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-4xl md:text-5xl font-bold">{post.title}</h1>
          <BookmarkButton 
            post={{
              id: post._id,
              title: post.title,
              slug: post.slug.current,
              excerpt: post.excerpt,
              mainImage: post.mainImage ? urlFor(post.mainImage) : undefined
            }}
            showAddToList
            className="ml-4"
          />
        </div>
        
        <div className="flex items-center gap-4 text-gray-600 mb-4">
          {post.author && (
            <div className="flex items-center gap-2">
              {post.author.image && (
                <OptimizedImage
                  src={urlFor(post.author.image)}
                  alt={post.author.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <span>By {post.author.name}</span>
            </div>
          )}
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString()}
          </time>
        </div>

        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.categories.map((category) => (
              <span
                key={category._id}
                className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded"
              >
                {category.title}
              </span>
            ))}
          </div>
        )}
      </header>

      {post.mainImage && (
        <OptimizedImage
          src={urlFor(post.mainImage)}
          alt={post.mainImage.alt || post.title}
          width={1200}
          height={675}
          className="w-full rounded-lg mb-8"
        />
      )}

      <div className="prose prose-lg max-w-none">
        <PortableText 
          value={post.body}
          components={{
            block: {
              h1: ({children, value}) => {
                const text = value?.children?.[0]?.text || '';
                const id = text.toLowerCase().trim().replace(/[^\w\s\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/g, '').replace(/\s+/g, '-');
                return <h1 id={id} className="text-3xl font-bold my-4">{children}</h1>
              },
              h2: ({children, value}) => {
                const text = value?.children?.[0]?.text || '';
                const id = text.toLowerCase().trim().replace(/[^\w\s\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/g, '').replace(/\s+/g, '-');
                return <h2 id={id} className="text-2xl font-bold my-4">{children}</h2>
              },
              h3: ({children, value}) => {
                const text = value?.children?.[0]?.text || '';
                const id = text.toLowerCase().trim().replace(/[^\w\s\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/g, '').replace(/\s+/g, '-');
                return <h3 id={id} className="text-xl font-bold my-3">{children}</h3>
              },
              normal: ({children}) => <p className="my-4">{children}</p>,
            },
            marks: {
              link: ({children, value}) => {
                const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined
                return (
                  <a href={value.href} rel={rel} className="text-blue-600 hover:underline">
                    {children}
                  </a>
                )
              },
            },
          }}
        />
      </div>

      {post.author?.bio && (
        <div className="mt-12 p-6 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">About the author</h3>
          <div className="flex items-start gap-4">
            {post.author.image && (
              <OptimizedImage
                src={urlFor(post.author.image)}
                alt={post.author.name}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <p className="font-semibold">{post.author.name}</p>
              <p className="text-gray-600">{post.author.bio}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* コメントセクション */}
      <CommentSection postId={post._id} postTitle={post.title} />
      
      {/* 関連記事セクション */}
      {allPosts.length > 0 && (
        <div className="mt-16">
          <RelatedPosts 
            currentPost={post} 
            allPosts={allPosts}
            variant="bottom"
          />
        </div>
      )}
    </article>
    </>
  )
}